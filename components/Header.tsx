// components/Header.tsx
import { Plus, Search, X } from "lucide-react";

interface HeaderProps {
    onNewIdeaClick: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function Header({
    onNewIdeaClick,
    searchQuery,
    onSearchChange,
}: HeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8 shrink-0">
            <h1 className="text-3xl font-bold tracking-tight text-vault-text">
                My Ideas
            </h1>

            <div className="flex items-center gap-4">
                <button
                    onClick={onNewIdeaClick}
                    className="cursor-pointer bg-vault-accent hover:bg-vault-accent-hover text-vault-text px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> New Idea
                </button>

                <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-vault-gray absolute left-3 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search ideas, platforms, competitors..."
                        className="bg-vault-card-bg border border-vault-border text-vault-text pl-10 pr-10 py-2 rounded-xl text-sm w-80 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all"
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 text-vault-gray hover:text-vault-text p-0.5 rounded-md hover:bg-vault-hover cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <kbd className="absolute right-3 bg-vault-canvas border border-vault-border text-vault-gray text-[10px] px-1.5 py-0.5 rounded-md shadow-sm pointer-events-none font-mono">
                            /
                        </kbd>
                    )}
                </div>
            </div>
        </div>
    );
}
