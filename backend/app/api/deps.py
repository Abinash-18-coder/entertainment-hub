from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import jwt

from app.core.config import settings
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import TokenPayload

# OAuth2 scheme points to the login URL for Swagger UI authorization button
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/swagger-login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Validates JWT access token from Authorization header and retrieves the current authenticated user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token, settings.JWT_SECRET_KEY)
    if payload is None:
        raise credentials_exception
    
    token_type: str = payload.get("type")
    user_id: str = payload.get("sub")
    
    # Ensure token is an access token, not a refresh token
    if token_type != "access" or user_id is None:
        raise credentials_exception
    
    try:
        user_id_int = int(user_id)
    except ValueError:
        raise credentials_exception

    # Query user from PostgreSQL
    stmt = select(User).where(User.id == user_id_int)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensures the authenticated user account is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    return current_user