// components/DeleteConfirmationModal.tsx
"use client";

import { AlertTriangle, X, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    cardTitle: string;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({
    isOpen,
    cardTitle,
    isDeleting,
    onClose,
    onConfirm,
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-vault-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 space-y-6">
                {/* Header Block Icon Hub */}
                <div className="flex items-start justify-between">
                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-rose-600 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="text-vault-gray hover:text-vault-text transition-colors p-1.5 rounded-lg hover:bg-vault-hover cursor-pointer disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Explanatory Context Content */}
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-vault-text tracking-tight">
                        Purge Project Record?
                    </h3>
                    <p className="text-sm text-vault-gray leading-relaxed">
                        You are about to permanently delete{" "}
                        <span className="font-semibold text-vault-text font-mono">
                            &quot;{cardTitle}&quot;
                        </span>{" "}
                        along with all associated competitor teardowns, stack
                        specs, and AI visibility matrices. This file system
                        write cannot be reversed.
                    </p>
                </div>

                {/* Structured CTA Action Triggers */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={onClose}
                        className="flex-1 cursor-pointer px-4 py-2.5 border border-vault-border text-vault-gray font-semibold text-sm rounded-xl hover:bg-vault-hover transition-colors text-center disabled:opacity-50"
                    >
                        Keep File
                    </button>
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={onConfirm}
                        className="flex-1 cursor-pointer px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                Purging...
                            </>
                        ) : (
                            "Yes, Delete Record"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
