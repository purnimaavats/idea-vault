// components/IdeaCard.tsx
import {
    MessageSquare,
    TrendingUp,
    DollarSign,
    Layers,
    Zap,
} from "lucide-react";

export interface IdeaCardProps {
    title: string;
    platform: string;
    platformBg: string;
    tag: string;
    tagBg: string;
    tagText: string;
    topSiteTraffic: string;
    estRevenue: string;
    buildSpeed: string;
    ask: string;
    competitors?: string[];
    // Deep Research Optional Fields
    competitorNotes?: string;
    aiNotes?: string;
    techNotes?: string;
}

export function IdeaCard({ card }: { card: IdeaCardProps }) {
    return (
        <div className="bg-vault-canvas border border-vault-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-85 w-full select-none group">
            {/* SECTION 1: Top Group (Title and Badges tightly stacked directly underneath) */}
            <div className="block space-y-1.5">
                <h3 className="font-bold text-[16px] text-vault-text tracking-tight leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                    {card.title}
                </h3>

                {/* Tags Row positioned right below title */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${card.platformBg}`}
                    >
                        {card.platform}
                    </span>
                    <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${card.tagBg} ${card.tagText}`}
                    >
                        {card.tag}
                    </span>
                </div>
            </div>

            {/* SECTION 2: Core Metrics (Single column layout with tight, clean spacing & crisp neutral text) */}
            <div className="flex flex-col gap-2.5 border-t border-b border-dashed border-vault-border py-2.5 my-1">
                {/* Top Traffic Row */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[11px] text-vault-gray font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />{" "}
                        Top Traffic
                    </span>
                    <span className="font-semibold text-vault-text text-right">
                        {card.topSiteTraffic}
                    </span>
                </div>

                {/* Estimated Revenue Row */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[11px] text-vault-gray font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-amber-600" />{" "}
                        Est. Revenue
                    </span>
                    <span className="font-bold text-vault-text text-right">
                        {card.estRevenue}
                    </span>
                </div>

                {/* Build Speed Row */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[11px] text-vault-gray font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Build
                        Speed
                    </span>
                    <span className="font-semibold text-vault-text text-right">
                        {card.buildSpeed}
                    </span>
                </div>

                {/* Competitors Row */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[11px] text-vault-gray font-medium uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />{" "}
                        Competitors
                    </span>
                    <div className="flex gap-1 max-w-35 overflow-hidden truncate justify-end">
                        {card.competitors?.map((comp, i) => (
                            <span
                                key={i}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border shrink-0 ${
                                    i % 2 === 0
                                        ? "bg-amber-50 text-amber-800 border-amber-100"
                                        : "bg-blue-50 text-blue-800 border-blue-100"
                                }`}
                            >
                                {comp}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 3: People Also Ask (Clean, anchored component footer) */}
            <div className="text-[11px] min-h-11">
                <div className="text-vault-gray font-medium flex items-center gap-1 mb-0.5">
                    <MessageSquare className="w-3 h-3 text-vault-gray" /> People
                    Also Ask
                </div>
                <p
                    className="text-vault-text font-medium leading-relaxed italic pl-3 relative before:content-['“'] before:absolute before:left-0 before:text-amber-400 before:text-sm before:-top-0.5 line-clamp-2"
                    title={card.ask}
                >
                    {card.ask}
                </p>
            </div>
        </div>
    );
}
