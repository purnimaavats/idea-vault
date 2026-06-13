// app/actions.ts
"use server";

import fs from "fs";
import path from "path";
import { IdeaCardProps } from "@/components/IdeaCard";

// Define what a column object looks like structurally
interface ColumnData {
    id: string;
    title: string;
    headerBg: string;
    badgeBg: string;
    textColor: string;
    cards: IdeaCardProps[];
}

const filePath = path.join(process.cwd(), "data", "pipeline.json");

export async function saveIdeaToJSON(newCard: IdeaCardProps) {
    try {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const boardData: ColumnData[] = JSON.parse(fileContents);

        const updatedBoard = boardData.map((column: ColumnData) => {
            if (
                column.id.toLowerCase() === newCard.tag.toLowerCase() ||
                (column.id === "selected" && newCard.tag === "Selected") ||
                (column.id === "done" && newCard.tag === "Done") ||
                (column.id === "later" && newCard.tag === "Later") ||
                (column.id === "rejected" && newCard.tag === "Rejected")
            ) {
                return {
                    ...column,
                    cards: [newCard, ...column.cards],
                };
            }
            return column;
        });

        fs.writeFileSync(filePath, JSON.stringify(updatedBoard, null, 2), "utf8");

        return { success: true, updatedData: updatedBoard };
    } catch (error) {
        console.error("Failed to write data safely to pipeline.json:", error);
        return { success: false, error: "Internal file tracking write error" };
    }
}

export async function updateIdeaNotesToJSON(
    cardTitle: string,
    fields: { competitorNotes: string; aiNotes: string; techNotes: string }
) {
    try {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const boardData: ColumnData[] = JSON.parse(fileContents);

        // Deep scan through columns and cards to locate and modify the matching item
        const updatedBoard = boardData.map((column) => ({
            ...column,
            cards: column.cards.map((card) => {
                if (card.title === cardTitle) {
                    return {
                        ...card,
                        competitorNotes: fields.competitorNotes,
                        aiNotes: fields.aiNotes,
                        techNotes: fields.techNotes,
                    };
                }
                return card;
            }),
        }));

        fs.writeFileSync(filePath, JSON.stringify(updatedBoard, null, 2), "utf8");
        return { success: true, updatedData: updatedBoard };
    } catch (error) {
        console.error("Failed to auto-save notes to file system:", error);
        return { success: false, error: "Disk IO write failure" };
    }
}

export async function deleteIdeaFromJSON(cardTitle: string) {
    try {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const boardData: ColumnData[] = JSON.parse(fileContents);

        // Filter out the matching card from every column array
        const updatedBoard = boardData.map((column) => ({
            ...column,
            cards: column.cards.filter((card) => card.title !== cardTitle),
        }));

        fs.writeFileSync(filePath, JSON.stringify(updatedBoard, null, 2), "utf8");
        return { success: true, updatedData: updatedBoard };
    } catch (error) {
        console.error("Failed to delete card asset from file system:", error);
        return { success: false, error: "Disk write failure during deletion execution" };
    }
}