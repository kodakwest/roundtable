import { Search } from "lucide-react";
import { useRoundtableStore } from "../../store/useRoundtableStore";

export default function SearchBar() {
  const searchQuery = useRoundtableStore((s) => s.searchQuery);
  const setSearchQuery = useRoundtableStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-tertiary)]" aria-hidden="true" />
      <input
        type="text"
        placeholder="Search guides..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-panel)] py-2.5 pl-10 pr-4 text-sm text-[var(--ink-primary)] placeholder-[var(--ink-tertiary)] transition-all focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)]"
      />
    </div>
  );
}
