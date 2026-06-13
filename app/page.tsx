// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import KanbanBoard from "@/components/KanbanBoard";
import NewIdeaModal from "@/components/NewIdeaModal";
import ExpandedWorkspace from "@/components/ExpandedWorkspace";
import initialData from "@/data/pipeline.json";
import { IdeaCardProps } from "@/components/IdeaCard";
import { saveIdeaToJSON } from "./actions";

export interface ColumnData {
  id: string;
  title: string;
  headerBg: string;
  badgeBg: string;
  textColor: string;
  cards: IdeaCardProps[];
}

export default function MyIdeasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardData, setBoardData] = useState<ColumnData[]>(initialData as ColumnData[]);
  const [activeIdea, setActiveIdea] = useState<IdeaCardProps | null>(null);
  
  // Search State Tracker
  const [searchQuery, setSearchQuery] = useState("");

  // Key-listener shortcut handler: Pressing '/' focuses the search field instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSaveIdea = async (newCard: IdeaCardProps) => {
    // 1. Optimistically update the UI tracking state instantly
    const localOptimisticUpdate = boardData.map((column: ColumnData) => {
      if (
        column.id.toLowerCase() === newCard.tag.toLowerCase() ||
        (column.id === "selected" && newCard.tag === "Selected") ||
        (column.id === "done" && newCard.tag === "Done") ||
        (column.id === "later" && newCard.tag === "Later") ||
        (column.id === "rejected" && newCard.tag === "Rejected")
      ) {
        return { ...column, cards: [newCard, ...column.cards] };
      }
      return column;
    });
    setBoardData(localOptimisticUpdate);

    // 2. Overwrite the backup data matrix inside data/pipeline.json via Node backend
    const response = await saveIdeaToJSON(newCard);
    if (response.success && response.updatedData) {
      setBoardData(response.updatedData);
    } else {
      alert("Error saving data directly into system configurations.");
    }
  };

  // MULTI-FIELD GLOBAL FILTER ENGINE
  // Crawls across EVERY single text parameter and deep research log inside a card object
  const filteredBoardData = boardData.map((column) => {
    const cleanQuery = searchQuery.toLowerCase().trim();
    if (!cleanQuery) return column;

    return {
      ...column,
      cards: column.cards.filter((card) => {
        const matchTitle = card.title.toLowerCase().includes(cleanQuery);
        const matchPlatform = card.platform.toLowerCase().includes(cleanQuery);
        const matchAsk = card.ask.toLowerCase().includes(cleanQuery);
        const matchBuildSpeed = card.buildSpeed.toLowerCase().includes(cleanQuery);
        const matchTraffic = card.topSiteTraffic.toLowerCase().includes(cleanQuery);
        const matchRevenue = card.estRevenue.toLowerCase().includes(cleanQuery);
        
        // Search across competitor array tokens safely
        const matchCompetitors = card.competitors?.some((comp) => comp.toLowerCase().includes(cleanQuery)) || false;
        
        // Deep Workspace Research Logs Text Checks
        const matchCompetitorNotes = card.competitorNotes?.toLowerCase().includes(cleanQuery) || false;
        const matchAiNotes = card.aiNotes?.toLowerCase().includes(cleanQuery) || false;
        const matchTechNotes = card.techNotes?.toLowerCase().includes(cleanQuery) || false;
        
        // Combine absolute checks to map structural keywords anywhere inside the object payload
        return (
          matchTitle || 
          matchPlatform || 
          matchAsk || 
          matchBuildSpeed || 
          matchTraffic || 
          matchRevenue || 
          matchCompetitors || 
          matchCompetitorNotes || 
          matchAiNotes || 
          matchTechNotes
        );
      }),
    };
  });

  return (
    <div className="h-full flex flex-col">
      {/* Top Search & Actions Header Block strictly locked in position */}
      <Header 
        onNewIdeaClick={() => setIsModalOpen(true)} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Dynamic Main Workspace Canvas Viewport */}
      {activeIdea ? (
        <ExpandedWorkspace 
          card={activeIdea} 
          onBack={() => {
            setActiveIdea(null);
            setSearchQuery(""); // Clear search filter when bouncing back out to board view
          }} 
          onBoardDataUpdate={(updatedData) => setBoardData(updatedData)}
        />
      ) : (
        <>
          <h2 className="text-xl font-bold text-vault-text mb-4 shrink-0">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Product Pipeline"}
          </h2>
          {/* Renders calculated layout states directly */}
          <KanbanBoard data={filteredBoardData} onCardClick={(card) => setActiveIdea(card)} />
        </>
      )}

      {/* Pop-up creation layout sheet */}
      <NewIdeaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveIdea} 
      />
    </div>
  );
}