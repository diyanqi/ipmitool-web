import { Link } from "@heroui/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <div className="flex items-center gap-1 text-current">
          <span className="text-default-600">IPMI Web Tool</span>
          <span className="text-default-600">•</span>
          <span className="text-default-600">Powered by</span>
          <Link
            isExternal
            className="text-primary"
            href="https://www.heroui.com"
            title="heroui.com homepage"
          >
            HeroUI
          </Link>
        </div>
      </footer>
    </div>
  );
}
