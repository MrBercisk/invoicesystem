export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white/70 backdrop-blur-xs py-4 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />

          <span className="font-bold text-zinc-900">
             Version
          </span>

          <span className="text-zinc-500 ext-[11px] sm:inline">
            v1.2.0
          </span>
        </div>

      </div>
    </footer>
  );
}