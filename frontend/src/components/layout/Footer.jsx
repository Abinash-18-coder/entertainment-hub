export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-dark/50 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-subtle">
        <p>&copy; {new Date().getFullYear()} CineVerse Hub &bull; Powered by FastAPI & TMDb/OMDb</p>
        <div className="flex space-x-6">
          <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-400 transition-colors cursor-pointer">API Status</span>
        </div>
      </div>
    </footer>
  );
}