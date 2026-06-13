// components/ExpandedWorkspace.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    Globe,
    Cpu,
    MessageSquare,
    TrendingUp,
    DollarSign,
    Zap,
    CloudLightning,
    Loader2,
    Trash2,
} from "lucide-react";
import { IdeaCardProps } from "./IdeaCard";
import { updateIdeaNotesToJSON, deleteIdeaFromJSON } from "@/app/actions";
import { ColumnData } from "@/app/page";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Imported custom modular layout

interface ExpandedWorkspaceProps {
    card: IdeaCardProps;
    onBack: () => void;
    onBoardDataUpdate: (updatedData: ColumnData[]) => void;
}

export default function ExpandedWorkspace({
    card,
    onBack,
    onBoardDataUpdate,
}: ExpandedWorkspaceProps) {
    const [activeTab, setActiveTab] = useState("competitors");

    // Controlled states for deep research text areas
    const [competitorNotes, setCompetitorNotes] = useState(
        card.competitorNotes || "",
    );
    const [aiNotes, setAiNotes] = useState(card.aiNotes || "");
    const [techNotes, setTechNotes] = useState(card.techNotes || "");

    // Auto-saving feedback status tracker
    const [saveStatus, setSaveStatus] = useState<
        "idle" | "typing" | "saving" | "saved"
    >("idle");
    const [isDeleting, setIsDeleting] = useState(false);

    // Custom Confirmation Modal Toggle State
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Keep an immutable reference to the card's entry data to prevent layout cycles
    const originalNotes = useRef({
        competitor: card.competitorNotes || "",
        ai: card.aiNotes || "",
        tech: card.techNotes || "",
    });

    useEffect(() => {
        const hasChanged =
            competitorNotes !== originalNotes.current.competitor ||
            aiNotes !== originalNotes.current.ai ||
            techNotes !== originalNotes.current.tech;

        if (!hasChanged) {
            setSaveStatus("idle");
            return;
        }

        setSaveStatus("typing");

        const delayDebounceFn = setTimeout(async () => {
            setSaveStatus("saving");

            const response = await updateIdeaNotesToJSON(card.title, {
                competitorNotes,
                aiNotes,
                techNotes,
            });

            if (response.success && response.updatedData) {
                setSaveStatus("saved");
                originalNotes.current = {
                    competitor: competitorNotes,
                    ai: aiNotes,
                    tech: techNotes,
                };
                onBoardDataUpdate(response.updatedData as ColumnData[]);
                setTimeout(() => setSaveStatus("idle"), 2000);
            } else {
                setSaveStatus("idle");
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [competitorNotes, aiNotes, techNotes, card.title, onBoardDataUpdate]);

    // Handle destructive card purge run loop
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        const response = await deleteIdeaFromJSON(card.title);

        if (response.success && response.updatedData) {
            setShowDeleteModal(false);
            onBoardDataUpdate(response.updatedData as ColumnData[]);
            onBack(); // Instantly snap back out to the main pipeline board grid layout
        } else {
            setIsDeleting(false);
            alert("Error processing deletion request.");
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-vault-canvas border border-vault-border rounded-3xl p-6 min-h-0 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Top Meta Hub Action Bar */}
            <div className="flex items-center justify-between border-b border-vault-border pb-4 mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="cursor-pointer p-2 hover:bg-vault-hover text-vault-gray hover:text-vault-text rounded-xl border border-vault-border transition-all flex items-center justify-center bg-vault-canvas"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <div className="text-xs text-vault-gray font-mono mb-0.5">
                            Active Workspace / Pipeline Node
                        </div>
                        <h2 className="text-2xl font-bold text-vault-text tracking-tight">
                            {card.title}
                        </h2>
                    </div>
                </div>

                {/* Dynamic Save Status Badge Widget */}
                <div className="text-xs font-medium px-3 py-1.5 rounded-xl border border-vault-border flex items-center gap-2 select-none transition-all duration-200 bg-vault-card-bg">
                    {saveStatus === "idle" && (
                        <span className="text-vault-gray flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-vault-gray inline-block"></span>{" "}
                            Local Sync Idle
                        </span>
                    )}
                    {saveStatus === "typing" && (
                        <span className="text-amber-600 flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>{" "}
                            Typing...
                        </span>
                    )}
                    {saveStatus === "saving" && (
                        <span className="text-indigo-600 flex items-center gap-1.5 font-semibold">
                            <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />{" "}
                            Auto-Saving to Disk...
                        </span>
                    )}
                    {saveStatus === "saved" && (
                        <span className="text-emerald-600 flex items-center gap-1.5 font-bold animate-in zoom-in-95">
                            <CloudLightning className="w-3.5 h-3.5 text-emerald-500" />{" "}
                            Saved to JSON File!
                        </span>
                    )}
                </div>
            </div>

            {/* Split Workspace Column Setup */}
            <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                {/* LEFT COMPONENT: Large Fluid Text Area Workspace */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Tab Selection Row */}
                    <div className="flex gap-2 border-b border-vault-border pb-3 mb-4 shrink-0 text-sm font-medium">
                        <button
                            type="button"
                            onClick={() => setActiveTab("competitors")}
                            className={`cursor-pointer px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                                activeTab === "competitors"
                                    ? "bg-vault-text text-white border-vault-text shadow-sm"
                                    : "bg-vault-canvas text-vault-gray border-vault-border hover:bg-vault-hover hover:text-vault-text"
                            }`}
                        >
                            <Globe className="w-4 h-4" /> Competitor Audit
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("seo")}
                            className={`cursor-pointer px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                                activeTab === "seo"
                                    ? "bg-vault-text text-white border-vault-text shadow-sm"
                                    : "bg-vault-canvas text-vault-gray border-vault-border hover:bg-vault-hover hover:text-vault-text"
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" /> AI Visibility
                            & SEO
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("stack")}
                            className={`cursor-pointer px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                                activeTab === "stack"
                                    ? "bg-vault-text text-white border-vault-text shadow-sm"
                                    : "bg-vault-canvas text-vault-gray border-vault-border hover:bg-vault-hover hover:text-vault-text"
                            }`}
                        >
                            <Cpu className="w-4 h-4" /> Technical Stack
                            Architecture
                        </button>
                    </div>

                    {/* Dynamic Tab Panel Content */}
                    <div className="flex-1 overflow-y-auto pr-2 text-sm text-vault-text">
                        {activeTab === "competitors" && (
                            <div className="space-y-4 animate-in fade-in duration-100">
                                <div className="bg-vault-card-bg p-5 rounded-2xl border border-vault-border">
                                    <h4 className="font-bold mb-2 text-vault-text flex items-center gap-1.5 text-base">
                                        Rival Moat Teardown
                                    </h4>
                                    <p className="text-vault-gray leading-relaxed mb-4">
                                        Analyzing existing options:{" "}
                                        <span className="font-mono text-vault-text font-bold uppercase">
                                            {card.competitors?.join(", ") ||
                                                "none listed"}
                                        </span>
                                        . Log vulnerabilities or business model
                                        adjustments here.
                                    </p>
                                    <textarea
                                        rows={12}
                                        value={competitorNotes}
                                        onChange={(e) =>
                                            setCompetitorNotes(e.target.value)
                                        }
                                        placeholder="Deconstruct competitor weak spots or unique hooks you plan to deploy..."
                                        className="w-full bg-white border border-vault-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-vault-ring resize-none font-medium text-vault-text leading-relaxed"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "seo" && (
                            <div className="space-y-4 animate-in fade-in duration-100">
                                <div className="bg-vault-card-bg p-5 rounded-2xl border border-vault-border">
                                    <h4 className="font-bold mb-2 text-vault-text flex items-center gap-1.5 text-base">
                                        LLM Search Optimization Engine
                                    </h4>
                                    <div className="mb-4">
                                        <span className="text-xs font-mono font-bold uppercase text-vault-gray block mb-1">
                                            Core Problem Question
                                        </span>
                                        <p className="font-medium text-vault-text border-l-2 border-amber-400 pl-3 italic">
                                            &ldquo;{card.ask}&rdquo;
                                        </p>
                                    </div>
                                    <textarea
                                        rows={12}
                                        value={aiNotes}
                                        onChange={(e) =>
                                            setAiNotes(e.target.value)
                                        }
                                        placeholder="Log user prompt triggers or long-tail keyword structures that will drive AI citations to your site..."
                                        className="w-full bg-white border border-vault-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-vault-ring resize-none font-medium text-vault-text leading-relaxed"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "stack" && (
                            <div className="space-y-4 animate-in fade-in duration-100">
                                <div className="bg-vault-card-bg p-5 rounded-2xl border border-vault-border">
                                    <h4 className="font-bold mb-2 text-vault-text flex items-center gap-1.5 text-base">
                                        MVP Blueprint Specs
                                    </h4>
                                    <p className="text-vault-gray leading-relaxed mb-4">
                                        Detail implementation tasks or database
                                        schemas to achieve delivery within your
                                        target{" "}
                                        <span className="font-bold text-vault-text">
                                            {card.buildSpeed}
                                        </span>{" "}
                                        track window.
                                    </p>
                                    <textarea
                                        rows={12}
                                        value={techNotes}
                                        onChange={(e) =>
                                            setTechNotes(e.target.value)
                                        }
                                        placeholder="e.g., Schema architecture logic, local storage pipelines, dependencies, api route tracking..."
                                        className="w-full bg-white border border-vault-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-vault-ring font-mono text-xs leading-relaxed text-vault-text resize-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COMPONENT: Summary Panel Side-Widget */}
                <div className="w-80 border-l border-vault-border pl-6 flex flex-col justify-between shrink-0 select-none">
                    <div className="flex flex-col gap-4">
                        <div className="text-xs font-bold font-mono text-vault-gray uppercase tracking-wider">
                            Metrics Snapshot
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${card.platformBg}`}
                            >
                                {card.platform}
                            </span>
                            <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-md ${card.tagBg} ${card.tagText}`}
                            >
                                {card.tag}
                            </span>
                        </div>

                        <div className="bg-vault-card-bg border border-vault-border rounded-2xl p-4 space-y-4 mt-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-xs text-vault-gray font-medium uppercase tracking-wider flex items-center gap-1.5">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />{" "}
                                    Top Traffic
                                </span>
                                <span className="font-bold text-vault-text">
                                    {card.topSiteTraffic}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm border-t border-vault-border/60 pt-4">
                                <span className="text-xs text-vault-gray font-medium uppercase tracking-wider flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-amber-600" />{" "}
                                    Est. Revenue
                                </span>
                                <span className="font-extrabold text-vault-text">
                                    {card.estRevenue}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm border-t border-vault-border/60 pt-4">
                                <span className="text-xs text-vault-gray font-medium uppercase tracking-wider flex items-center gap-1.5">
                                    <Zap className="w-4 h-4 text-amber-500" />{" "}
                                    Build Speed
                                </span>
                                <span className="font-semibold text-vault-text">
                                    {card.buildSpeed}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Trigger for Modular Pop-up */}
                    <div className="pt-4 border-t border-vault-border">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full cursor-pointer px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm group"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500 group-hover:scale-105 transition-transform" />
                            Delete Idea From Vault
                        </button>
                    </div>
                </div>
            </div>

            {/* Render the extracted, type-safe confirmation modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                cardTitle={card.title}
                isDeleting={isDeleting}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
