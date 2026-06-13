"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Cloud,
    LayoutDashboard,
    KanbanSquare,
    BarChart3,
    FolderArchive,
    Settings,
} from "lucide-react";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Ideas", href: "/", icon: KanbanSquare },
        { name: "SEO Matrix", href: "/seo", icon: BarChart3 },
        { name: "Archives", href: "/archives", icon: FolderArchive },
    ];

    return (
        <aside
            className={`h-full flex flex-col justify-between p-6 select-none shrink-0 transition-all duration-300 ease-in-out ${
                isCollapsed ? "w-24 items-center" : "w-64"
            }`}
        >
            <div>
                {/* Top Header Logo */}
                <div
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`flex items-center gap-3 mb-10 h-10 cursor-pointer p-2 rounded-xl transition-all duration-200 hover:bg-vault-hover group ${
                        isCollapsed ? "justify-center w-12" : "w-full"
                    }`}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <Cloud className="w-7 h-7 text-vault-text shrink-0 transition-transform duration-200 group-hover:scale-105" />
                    {!isCollapsed && (
                        <span className="text-xl font-semibold tracking-tight text-vault-text overflow-hidden whitespace-nowrap">
                            IdeaVault
                        </span>
                    )}
                </div>

                {/* Dynamic Navigation Links */}
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center rounded-xl transition-all duration-200 ${
                                    isCollapsed
                                        ? "justify-center w-12 h-12 p-0"
                                        : "gap-4 px-4 py-2.5 w-full"
                                } ${
                                    isActive
                                        ? "bg-vault-canvas shadow-sm text-vault-text font-medium"
                                        : "text-vault-gray hover:bg-vault-hover hover:text-vault-text"
                                }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium transition-opacity duration-200">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Settings Link (FIXED: Now perfectly mimics the uniform collapse states) */}
            <div>
                <Link
                    href="/settings"
                    className={`flex items-center rounded-xl transition-all duration-200 ${
                        isCollapsed
                            ? "justify-center w-12 h-12 p-0"
                            : "gap-4 px-4 py-2.5 w-full"
                    } ${
                        pathname === "/settings"
                            ? "bg-vault-canvas shadow-sm text-vault-text font-medium"
                            : "text-vault-gray hover:bg-vault-hover hover:text-vault-text"
                    }`}
                >
                    <Settings className="w-5 h-5 shrink-0" />
                    {!isCollapsed && (
                        <span className="text-sm font-medium transition-opacity duration-200">
                            Settings
                        </span>
                    )}
                </Link>
            </div>
        </aside>
    );
}