const Footer = () => (
  <footer className="border-t border-[var(--color-border)]/60 bg-[var(--color-surface)]/70 backdrop-blur-md">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-node-bg)] text-[var(--color-amber)] font-bold text-[10px]">Z</span>
        <span className="text-xs text-[var(--color-text-secondary)]">&copy; {new Date().getFullYear()} Zenith Open Source</span>
      </div>
      <div className="flex items-center gap-5">
        <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-amber)] transition-colors">GitHub</a>
        <a href="https://github.com/roshhellwett/zenithpages/issues" target="_blank" rel="noreferrer" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-amber)] transition-colors">Issues</a>
        <a href="mailto:zenithprojects@icloud.com" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-amber)] transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
