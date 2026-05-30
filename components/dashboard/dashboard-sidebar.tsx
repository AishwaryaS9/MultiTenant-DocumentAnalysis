"use client";

import { Brain, Building, FileText, Home, Menu, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useOrganization, UserButton, useUser } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const { organization } = useOrganization();

    const activeSlug = organization?.slug || user?.organizationMemberships?.[0]?.organization?.slug;

    const navItems = [
        { href: "/", label: "Home", icon: <Home className='w-5 h-5' aria-hidden="true" /> },
        ...(activeSlug
            ? [
                {
                    href: `/${activeSlug}`,
                    label: "Dashboard",
                    icon: <Building className='w-5 h-5' aria-hidden="true" />
                },
                {
                    href: `/${activeSlug}/documents`,
                    label: "Documents",
                    icon: <FileText className='w-5 h-5' aria-hidden="true" />
                }
            ]
            : []),
        {
            href: "/select-org",
            label: "Switch Organizations",
            icon: <Users className="h-5 w-5" aria-hidden="true" />
        }
    ];

    const NavContent = () => (
        <div className="flex flex-col h-full py-6 px-4">
            {/* Logo */}
            <Link
                href="/"
                aria-label="Go to homepage"
                className="flex items-center gap-3 px-2 mb-10 rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-amber-200 w-fit"
            >
                <div className="bg-orange-500 p-2 rounded-xl shadow-sm shadow-orange-100">
                    <Brain className='h-6 w-6 text-white' aria-hidden="true" />
                </div>

                <span className="font-black text-xl tracking-tight text-slate-900">
                    Docinate AI
                </span>
            </Link>


            {/* Navigation Links */}
            <nav aria-label="Dashboard navigation" className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isDashboardPath = item.href === `/${organization?.slug}`;

                    const isDocumentsTab =
                        item.href === `/${activeSlug}/documents`;

                    const isActive = isDashboardPath
                        ? pathname === item.href
                        : isDocumentsTab
                            ? pathname.startsWith(`/${activeSlug}/documents`) ||
                            pathname.startsWith(`/${activeSlug}/search`)
                            : pathname === item.href ||
                            (item.href !== "/" &&
                                pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-label={`Navigate to ${item.label}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-4 rounded-xl py-6 mb-1 transition-all motion-reduce:transition-none 
                                    min-h-12 focus-visible:ring-1 focus-visible:ring-offset-1 
                                    ${isActive ? "bg-orange-50/50 text-orange-600 font-bold border-r-4 border-orange-500 hover:bg-orange-50 hover:text-orange-600 rounded-r-none focus-visible:ring-orange-200"
                                        : "text-slate-500 hover:bg-slate-50 focus-visible:ring-slate-300"}`}
                            >
                                {item.icon}
                                {item.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            <div className="md:hidden mb-6 px-2">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <UserButton />

                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                            Logged in as
                        </span>

                        <span className="text-sm font-bold text-slate-800 truncate">
                            {user?.firstName} {user?.lastName}
                        </span>
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between px-2">
                <div className="flex items-center gap-3 min-w-0">
                    <UserButton />

                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-900 truncate max-w-30">
                            {organization?.name || user?.firstName}
                        </span>

                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                            {organization ? "Organization" : "Personal"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 inset-x-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-4 py-3 flex items-center justify-between gap-3">
                <Link
                    href="/"
                    aria-label="Go to homepage"
                    className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-amber-200 min-w-0"
                >
                    <Brain className="h-6 w-6 text-amber-500 shrink-0" aria-hidden="true" />

                    <span className="font-bold text-slate-900 truncate">
                        Docinate AI
                    </span>
                </Link>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open sidebar navigation"
                            className="shrink-0 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300"
                        >
                            <Menu aria-hidden="true" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="p-0 w-72 max-w-[85vw]">
                        <SheetHeader className="sr-only">
                            <SheetTitle>
                                Mobile Sidebar Navigation
                            </SheetTitle>

                            <SheetDescription>
                                Sidebar navigation links and workspace controls
                            </SheetDescription>
                        </SheetHeader>

                        <NavContent />
                    </SheetContent>
                </Sheet>
            </header>

            {/* Desktop Sidebar */}
            <aside
                aria-label="Dashboard sidebar"
                className="hidden md:flex flex-col w-72 h-screen sticky top-0 border-r border-slate-200 bg-white shrink-0">
                <NavContent />
            </aside>
        </>
    );
}




