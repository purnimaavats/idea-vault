import Sidebar from "@/components/Sidebar";
import "./globals.css"

export const metadata = {
  title: 'IdeaVault',
  description: "Minimal validation engine dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-vault-bg text-vault-text h-screen overflow-hidden flex">
        {/* Collapsible Sidebar Icon */}
        <Sidebar />

        {/* Main Canvas Shell */}
        <main className="flex-1 h-full p-4 pl-0">
          <div className="bg-white w-full h-full rounded-3xl border border-vault-border/60 shadow-sm overflow-y-auto p-8">
            {children} 
          </div>
        </main>
      </body>
    </html>
  );
}
