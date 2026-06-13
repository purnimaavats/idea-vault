// components/NewIdeaModal.tsx
"use client";

import { useState } from "react";
import {
    X,
    Plus,
    TrendingUp,
    DollarSign,
    Zap,
    Layers,
    MessageSquare,
} from "lucide-react";
import { IdeaCardProps } from "./IdeaCard";

interface NewIdeaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newCard: IdeaCardProps) => void;
}

export default function NewIdeaModal({
    isOpen,
    onClose,
    onSave,
}: NewIdeaModalProps) {
    // Controlled form states
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("Web App");
    const [tag, setTag] = useState("Later");
    const [topSiteTraffic, setTopSiteTraffic] = useState("");
    const [estRevenue, setEstRevenue] = useState("");
    const [buildSpeed, setBuildSpeed] = useState("Weekend Build");
    const [ask, setAsk] = useState("");
    const [competitorInput, setCompetitorInput] = useState("");

    if (!isOpen) return null;

    const getPlatformBg = (type: string) => {
        if (type === "Web App")
            return "bg-indigo-50 text-indigo-700 border-indigo-100";
        if (type === "iOS App")
            return "bg-rose-50 text-rose-700 border-rose-100";
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
    };

    const getTagStyles = (status: string) => {
        if (status === "Selected")
            return {
                bg: "bg-badge-selected-bg",
                text: "text-badge-selected-text",
            };
        if (status === "Done")
            return { bg: "bg-badge-done-bg", text: "text-badge-done-text" };
        if (status === "Rejected")
            return {
                bg: "bg-badge-rejected-bg",
                text: "text-badge-rejected-text",
            };
        return { bg: "bg-badge-later-bg", text: "text-badge-later-text" };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const tagStyles = getTagStyles(tag);
        const competitorsArray = competitorInput
            ? competitorInput
                  .split(",")
                  .map((c) => c.trim().toLowerCase())
                  .filter(Boolean)
            : [];

        const newCard: IdeaCardProps = {
            title,
            platform,
            platformBg: getPlatformBg(platform),
            tag,
            tagBg: tagStyles.bg,
            tagText: tagStyles.text,
            topSiteTraffic: topSiteTraffic ? `${topSiteTraffic}/mo` : "0/mo",
            estRevenue: estRevenue ? `$${estRevenue}/mo` : "$0/mo",
            buildSpeed,
            ask: ask || "No target query added yet.",
            competitors: competitorsArray,
        };

        onSave(newCard);

        // Clear and reset form tracking
        setTitle("");
        setPlatform("Web App");
        setTag("Later");
        setTopSiteTraffic("");
        setEstRevenue("");
        setBuildSpeed("Weekend Build");
        setAsk("");
        setCompetitorInput("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-xl border border-vault-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header Area */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-vault-border bg-vault-card-bg">
                    <h2 className="text-xl font-bold text-vault-text flex items-center gap-2">
                        <Plus className="w-5 h-5 text-amber-500" /> Vault a New
                        Idea
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-vault-gray hover:text-vault-text transition-colors p-1 rounded-lg hover:bg-vault-hover cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body Area */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm"
                >
                    {/* Project Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="font-semibold text-vault-text">
                            Project Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Local Markdown Editor"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-vault-card-bg border border-vault-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all text-vault-text"
                        />
                    </div>

                    {/* Platform Distribution & Column Status Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-vault-text">
                                Platform Distribution
                            </label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full bg-vault-card-bg border border-vault-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all text-vault-text cursor-pointer"
                            >
                                <option value="Web App">🌐 Web App</option>
                                <option value="iOS App">🍎 iOS App</option>
                                <option value="Android App">
                                    🤖 Android App
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-vault-text">
                                Pipeline Status
                            </label>
                            <select
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="w-full bg-vault-card-bg border border-vault-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all text-vault-text cursor-pointer"
                            >
                                <option value="Later">Later (Backlog)</option>
                                <option value="Selected">
                                    Selected (Active)
                                </option>
                                <option value="Done">Done (Shipped)</option>
                                <option value="Rejected">
                                    Rejected (Archived)
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Competitor Validation Stack */}
                    <div className="grid grid-cols-2 gap-4 border-t border-dashed border-vault-border pt-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-vault-gray flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />{" "}
                                Top Player Traffic
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 120K (Omit /mo)"
                                value={topSiteTraffic}
                                onChange={(e) =>
                                    setTopSiteTraffic(e.target.value)
                                }
                                className="w-full bg-vault-card-bg border border-vault-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all text-vault-text"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-vault-gray flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-amber-600" />{" "}
                                Est. Monthly Revenue
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 4,500 (Omit $)"
                                value={estRevenue}
                                onChange={(e) => setEstRevenue(e.target.value)}
                                className="w-full bg-vault-card-bg border border-vault-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all text-vault-text"
                            />
                        </div>
                    </div>

                    {/* Build Speed & Competitors Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-vault-gray flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />{" "}
                                Build Velocity Target
                            </label>
                            <select
                                value={buildSpeed}
                                onChange={(e) => setBuildSpeed(e.target.value)}
                                className="w-full bg-vault-card-bg border border-vault-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all text-vault-text cursor-pointer"
                            >
                                <option value="Weekend Build">
                                    ⚡ Weekend Build
                                </option>
                                <option value="2 Days Build">
                                    ⏳ 2 Days Build
                                </option>
                                <option value="1 Week Build">
                                    📅 1 Week Build
                                </option>
                                <option value="2 Weeks Build">
                                    🛠️ 2 Weeks Build
                                </option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-vault-gray flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-indigo-600" />{" "}
                                Competitors
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., figma, aws (comma separated)"
                                value={competitorInput}
                                onChange={(e) =>
                                    setCompetitorInput(e.target.value)
                                }
                                className="w-full bg-vault-card-bg border border-vault-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all text-vault-text"
                            />
                        </div>
                    </div>

                    {/* People Also Ask Intent Query */}
                    <div className="flex flex-col gap-1.5 border-t border-dashed border-vault-border pt-3">
                        <label className="font-semibold text-vault-gray flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-vault-text" />{" "}
                            People Also Ask (Core Problem Question)
                        </label>
                        <textarea
                            rows={2}
                            placeholder="What is the biggest frustration people type into search panels regarding this tool?"
                            value={ask}
                            onChange={(e) => setAsk(e.target.value)}
                            className="w-full bg-vault-card-bg border border-vault-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vault-ring transition-all text-vault-text resize-none"
                        />
                    </div>

                    {/* Form Actions Footer Block */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-vault-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 border border-vault-border text-vault-gray font-medium rounded-xl hover:bg-vault-hover transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 bg-vault-accent hover:bg-vault-accent-hover text-vault-text font-bold rounded-xl shadow-sm transition-colors"
                        >
                            Vault Idea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
