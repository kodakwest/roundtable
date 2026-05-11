import { Search } from "lucide-react";
import { useRoundtableStore } from "../../store/useRoundtableStore";

export default function SearchBar() {
  const searchQuery = useRoundtableStore((s) => s.searchQuery);
  const setSearchQuery = useRoundtableStore((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
      <input
        type="text"
        placeholder="Search guides..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg border border-slate-800 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-slate-300 placeholder-slate-600 transition-all focus:border-cyan-300/50 focus:outline-none"
      />
    </div>
  );
}
