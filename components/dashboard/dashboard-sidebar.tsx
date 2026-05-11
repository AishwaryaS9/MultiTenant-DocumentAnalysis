"use client"
import { Brain, Building, FileText, Home, Menu, Users } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useOrganization, UserButton, useUser } from '@clerk/nextjs'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const { organization } = useOrganization();

    const navItems = [
        { href: "/", label: "Home", icon: <Home className='w-5 h-5' /> },
        ...(organization ? [
            { href: `/${organization.slug}`, label: "Dashboard", icon: <Building className='w-5 h-5' /> },
            { href: `/${organization.slug}/documents`, label: "Documents", icon: <FileText className='w-5 h-5' /> },
        ] : []),
        { href: "/select-org", label: "Switch Organizations", icon: <Users className="h-5 w-5" /> }
    ];

    const NavContent = () => (
        <div className="flex flex-col h-full py-6 px-4">
            {/* Logo */}
            <Link href='/' className='flex items-center gap-3 px-2 mb-10'>
                <div className="bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-200">
                    <Brain className='h-6 w-6 text-white' />
                </div>
                <span className="font-black text-xl tracking-tight text-slate-900">Docinate AI</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isDashboardPath = item.href === `/${organization?.slug}`;
                    const isActive = isDashboardPath
                        ? pathname === item.href
                        : pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-4 rounded-xl py-6 mb-1 transition-all ${isActive
                                    ? "bg-amber-50 text-amber-600 font-bold border-r-4 border-amber-500 rounded-r-none"
                                    : "text-slate-500 hover:bg-slate-50"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <UserButton />
                    <div className="flex flex-col">
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
            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className='h-6 w-6 text-amber-500' />
                    <span className="font-bold">Docinate</span>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon"><Menu /></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 border-r bg-white">
                <NavContent />
            </aside>
        </>
    )
}