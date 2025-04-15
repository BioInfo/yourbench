import React from 'react';
import { cn } from '../../lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <a
    href={href}
    className={cn(
      "transition-colors hover:text-foreground/80 text-foreground",
      "text-sm font-medium"
    )}
  >
    {children}
  </a>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold inline-block">YourBench</span>
            </a>
          </div>
          <nav className="flex items-center space-x-6">
            <NavLink href="/configurations">Configurations</NavLink>
            <NavLink href="/documents">Documents</NavLink>
            <NavLink href="/tasks">Tasks</NavLink>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1">
        {children}
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with YourBench
          </p>
        </div>
      </footer>
    </div>
  );
};