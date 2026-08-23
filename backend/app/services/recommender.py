from typing import List, Dict, Set
from collections import Counter
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.models.content import Content
from app.models.cast_credit import CastCredit

class RecommendationEngine:
    @staticmethod
    async def get_user_recommendations(
        user_id: int,
        db: AsyncSession,
        limit: int = 15
    ) -> List[Content]:
        """
        Calculates rule-based recommendations by analyzing genre and actor overlap 
        with the user's bookmarked and watched titles, applying diversity constraints.
        """
        # 1. Fetch user with all saved and watched content
        stmt = (
            select(User)
            .options(
                selectinload(User.bookmarked_contents)
                .selectinload(Content.genres),
                selectinload(User.bookmarked_contents)
                .selectinload(Content.cast_credits)
                .selectinload(CastCredit.person),
                selectinload(User.watched_contents)
                .selectinload(Content.genres),
                selectinload(User.watched_contents)
                .selectinload(Content.cast_credits)
                .selectinload(CastCredit.person),
            )
            .where(User.id == user_id)
        )
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            return []

        # Combine user's saved items to create preference profile
        user_history = list({*user.bookmarked_contents, *user.watched_contents})
        interacted_ids: Set[int] = {c.id for c in user_history}

        # 2. Cold-Start Fallback: If user has no history, return top IMDb rated titles
        if not user_history:
            fallback_stmt = (
                select(Content)
                .options(selectinload(Content.genres))
                .order_by(Content.imdb_rating.desc().nullslast())
                .limit(limit)
            )
            res = await db.execute(fallback_stmt)
            return list(res.scalars().all())

        # 3. Extract preferred genres and preferred actors
        preferred_genre_ids = Counter()
        preferred_person_ids = Counter()

        for content in user_history:
            for g in content.genres:
                preferred_genre_ids[g.id] += 1
            for cc in content.cast_credits:
                preferred_person_ids[cc.person_id] += 1

        # 4. Fetch candidate items that the user has not yet interacted with
        candidate_stmt = (
            select(Content)
            .options(
                selectinload(Content.genres),
                selectinload(Content.cast_credits).selectinload(CastCredit.person)
            )
            .where(Content.id.not_in(interacted_ids))
        )
        candidate_res = await db.execute(candidate_stmt)
        candidates = candidate_res.scalars().all()

        # 5. Score candidates
        scored_candidates: List[tuple[Content, float]] = []

        for candidate in candidates:
            score = 0.0

            # Base score from IMDb rating
            if candidate.imdb_rating:
                score += candidate.imdb_rating

            # Genre overlap score (+3 points per frequency weight)
            for g in candidate.genres:
                if g.id in preferred_genre_ids:
                    score += preferred_genre_ids[g.id] * 3.0

            # Actor overlap score (+5 points per frequency weight)
            for cc in candidate.cast_credits:
                if cc.person_id in preferred_person_ids:
                    score += preferred_person_ids[cc.person_id] * 5.0

            if score > 0:
                scored_candidates.append((candidate, score))

        # Sort by total score descending
        scored_candidates.sort(key=lambda x: x[1], reverse=True)

        # 6. Apply Diversity Rule: Max 40% of suggestions can belong to the same dominant genre
        final_recommendations: List[Content] = []
        genre_distribution = Counter()
        max_per_genre = max(2, int(limit * 0.40))

        for candidate, _ in scored_candidates:
            if len(final_recommendations) >= limit:
                break

            # Check if any genre of this item exceeds the cap
            can_add = True
            for g in candidate.genres:
                if genre_distribution[g.id] >= max_per_genre:
                    can_add = False
                    break

            if can_add:
                final_recommendations.append(candidate)
                for g in candidate.genres:
                    genre_distribution[g.id] += 1

        # If diversity filtering restricted the count below limit, backfill with top scored remaining
        if len(final_recommendations) < limit:
            for candidate, _ in scored_candidates:
                if len(final_recommendations) >= limit:
                    break
                if candidate not in final_recommendations:
                    final_recommendations.append(candidate)

        return final_recommendations

recommender = RecommendationEngine()