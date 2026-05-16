"use client"
import { Brain, Home, Menu, Settings, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useOrganization, UserButton, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export default function Header() {
    const pathname = usePathname();
    const { user } = useUser();
    const { organization } = useOrganization();

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getNavItems = () => {
        const baseItems = [
            { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
            { href: "#testimonials", label: "Testimonials", icon: <Users className="w-4 h-4" /> },
            { href: "#features", label: "Features", icon: <Star className="w-4 h-4" /> },
            { href: "#how-it-works", label: "How It Works", icon: <Settings className="w-4 h-4" /> },
            { href: "#cta", label: "Call To Action", icon: <Zap className="w-4 h-4" /> },
        ];
        return [...baseItems];
    };

    const navItems = getNavItems();

    return (
        <div className="fixed top-4 w-full z-50 px-4 transition-all duration-300">
            <header
                className={`
            container max-w-7xl mx-auto flex items-center justify-between px-6 py-3
            transition-all duration-300
            ${scrolled
                        ? "bg-white/80 backdrop-blur-xl border shadow-lg rounded-full"
                        : "bg-transparent rounded-2xl"
                    }`}>
                {/* Logo */}
                <Link href='/' className='flex items-center gap-2 font-bold text-lg'>
                    <div className="bg-amber-500 p-1.5 rounded-lg">
                        <Brain className='h-5 w-5 text-white' />
                    </div>

                    <span className="tracking-tight text-slate-900">
                        Docinate AI
                    </span>
                </Link>

                {/* Navigation - Desktop */}
                <nav className='hidden md:flex items-center gap-1'>
                    {navItems.map((item) => {
                        const isDashboardPath = item.href === `/${organization?.slug}`;
                        const isActive = isDashboardPath
                            ? pathname === item.href
                            : pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                role="menuitem"
                                aria-label={`Navigate to ${item.href}`}
                                className="rounded-full px-4 py-2 text-slate-600 text-md font-medium transition-all duration-300 ease-in-out 
                                hover:text-amber-600 hover:font-semibold focus:outline-none active:scale-95">
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className='hidden sm:inline text-sm font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-full'>
                                {organization ? organization.name : user?.firstName}
                            </span>

                            <UserButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/sign-in" className="hidden sm:block">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full cursor-pointer"
                                >
                                    Sign In
                                </Button>
                            </Link>

                            <Link href="/sign-up">
                                <Button
                                    size="sm"
                                    className='rounded-full bg-slate-900 text-white hover:bg-slate-800 px-6 cursor-pointer'
                                >
                                    Create Account
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-slate-100 transition"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-[90%] sm:w-100 border-l bg-white/95 backdrop-blur-2xl px-6 py-8"
                            >
                                {/* Top */}
                                <div className="flex items-center justify-between mb-10">
                                    <Link
                                        href="/"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 font-bold text-lg"
                                    >
                                        <div className="bg-amber-500 p-1.5 rounded-lg">
                                            <Brain className="h-5 w-5 text-white" />
                                        </div>

                                        <span className="tracking-tight text-slate-900">
                                            Docinate AI
                                        </span>
                                    </Link>
                                </div>

                                {/* Navigation */}
                                <nav className="flex flex-col gap-2">
                                    {navItems.map((item) => {
                                        const isDashboardPath = item.href === `/${organization?.slug}`;

                                        const isActive = isDashboardPath
                                            ? pathname === item.href
                                            : pathname === item.href ||
                                            (item.href !== "/" &&
                                                pathname?.startsWith(item.href));

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300
                                                    ${isActive
                                                        ? "bg-amber-50 text-amber-600"
                                                        : "text-slate-700 hover:bg-slate-100"
                                                    }`}>
                                                <span className="font-medium text-base">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Divider */}
                                <div className="my-8 border-t border-slate-200" />

                                {/* User/Auth Section */}
                                {user ? (
                                    <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-4">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Signed in as
                                            </p>

                                            <h3 className="font-semibold text-slate-800">
                                                {organization
                                                    ? organization.name
                                                    : user?.firstName}
                                            </h3>
                                        </div>

                                        <UserButton />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/sign-in"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full rounded-xl h-11"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>

                                        <Link
                                            href="/sign-up"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Button className="w-full rounded-xl h-11 bg-slate-900 hover:bg-slate-800">
                                                Create Account
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 p-px">
                                        <div className="rounded-2xl bg-white px-4 py-3">
                                            <p className="text-sm font-medium text-slate-800">
                                                AI-powered documentation platform
                                            </p>

                                            <p className="text-xs text-slate-500 mt-1">
                                                Build smarter workflows with Docinate AI
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </div>
    )
}