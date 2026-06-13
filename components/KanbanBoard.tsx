// components/KanbanBoard.tsx
import {IdeaCard, IdeaCardProps } from "./IdeaCard";
import { ColumnData } from "@/app/page";

interface KanbanBoardProps {
    data: ColumnData[];
    onCardClick: (card: IdeaCardProps) => void; // New explicit prop
}

export default function KanbanBoard({ data, onCardClick }: KanbanBoardProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-y-auto pb-4">
            {data.map((col) => (
                <div key={col.id} className="flex flex-col gap-3 min-w-62.5">
                    <div
                        className={`w-full py-2 px-4 rounded-xl font-medium text-sm text-center text-vault-text ${col.headerBg}`}
                    >
                        {col.title}
                    </div>

                    <div className="space-y-3">
                        {col.cards?.map(
                            (card: IdeaCardProps, index: number) => (
                                <div
                                    key={index}
                                    onClick={() => onCardClick(card)}
                                >
                                    <IdeaCard card={card} />
                                </div>
                            ),
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
