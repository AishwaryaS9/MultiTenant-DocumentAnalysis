"use client"
import { Brain, Building, FileText, Home, Menu, Users } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useOrganization, UserButton, useUser } from '@clerk/nextjs'
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export default function Header() {
    const pathname = usePathname();
    const { user } = useUser();
    const { organization } = useOrganization();
    const [isOpen, setIsOpen] = useState(false);

    const getNavItems = () => {
        const baseItems = [{ href: "/", label: "Home", icon: <Home className='w-4 h-4' /> }];
        if (organization) {
            return [
                ...baseItems,
                { href: `/${organization.slug}`, label: "Dashboard", icon: <Building className='w-4 h-4' /> },
                { href: `/${organization.slug}/documents`, label: "Documents", icon: <FileText className='w-4 h-4' /> },
                { href: "/select-org", label: "Switch Org", icon: <Users className='w-4 h-4' /> }
            ]
        }
        return [...baseItems, { href: "/select-org", label: "Switch Organization", icon: <Users className="h-4 w-4" /> }];
    }

    const navItems = getNavItems();

    return (
        <div className="fixed top-6 w-full z-50 px-4">
            <header className='max-w-6xl mx-auto border bg-white/80 backdrop-blur-md rounded-full px-6 py-2 flex items-center justify-between shadow-sm'>
                {/* Logo */}
                <Link href='/' className='flex items-center gap-2 font-bold text-lg' >
                    <div className="bg-amber-400 p-1.5 rounded-lg">
                        <Brain className='h-5 w-5 text-white' />
                    </div>
                    <span className="tracking-tight text-slate-900">Docinate AI</span>
                </Link>

                {/* Navigation - Desktop */}
                <nav className='hidden md:flex items-center gap-1'>
                    {navItems.map((item) => {
                        const isDashboardPath = item.href === `/${organization?.slug}`;
                        const isActive = isDashboardPath
                            ? pathname === item.href
                            : pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button variant="ghost" size="sm" className={`rounded-full px-4 ${isActive ? "text-amber-600 font-semibold" : "text-slate-600"}`}>
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className='hidden sm:inline text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full'>
                                {organization ? organization.name : user?.firstName}
                            </span>
                            <UserButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/sign-in" className="hidden sm:block">
                                <Button variant="ghost" size="sm" className="rounded-full cursor-pointer">Sign In</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button size="sm" className='rounded-full bg-slate-900 text-white hover:bg-slate-800 px-6 cursor-pointer'>
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full">
                                <div className="flex flex-col gap-4 mt-8">
                                    {navItems.map((item) => (
                                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-lg">{item.label}</Button>
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </div>
    )
}