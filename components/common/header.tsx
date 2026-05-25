"use client"
import { Brain, Home, Menu, Settings, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import {
    useOrganization,
    UserButton,
    useUser,
    useOrganizationList,
    useClerk
} from '@clerk/nextjs'
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "../ui/sheet";
import { DesktopWorkspaceSwitcher } from './desktop-workspace-switcher';
import { MobileWorkspaceSwitcher } from './mobile-workspace-switcher';

export default function Header() {
    const pathname = usePathname();
    const { user } = useUser();
    const { organization } = useOrganization();
    const { openSignIn, openSignUp } = useClerk();

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeHash, setActiveHash] = useState("");

    const { userMemberships, setActive } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    const orgSlug = organization?.slug || user?.organizationMemberships?.[0]?.organization?.slug;

    const dashboardUrl = orgSlug ? `/${orgSlug}` : "/select-org";




    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (pathname !== "/") return;

        const hashes = ["#testimonials", "#features", "#how-it-works", "#cta"];
        const elements = hashes.map(hash => document.querySelector(hash)).filter(Boolean);

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveHash(`#${entry.target.id}`);
                }
            });
        }, observerOptions);

        elements.forEach(el => el && observer.observe(el));

        const checkTop = () => {
            if (window.scrollY < 100) {
                setActiveHash("");
            }
        };
        window.addEventListener("scroll", checkTop);

        return () => {
            elements.forEach(el => el && observer.unobserve(el));
            window.removeEventListener("scroll", checkTop);
        };
    }, [pathname]);

    const getNavItems = () => {
        return [
            { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
            { href: "#testimonials", label: "Testimonials", icon: <Users className="w-4 h-4" /> },
            { href: "#features", label: "Features", icon: <Star className="w-4 h-4" /> },
            { href: "#how-it-works", label: "How It Works", icon: <Settings className="w-4 h-4" /> },
            { href: "#cta", label: "Call To Action", icon: <Zap className="w-4 h-4" /> },
        ];
    };

    const navItems = getNavItems();

    return (
        <div className="fixed top-4 w-full z-50 px-4 transition-all duration-300">
            <header
                className={`
                    container max-w-7xl mx-auto flex items-center justify-between px-6 py-3
                    transition-all duration-300 border border-transparent
                    ${scrolled
                        ? "bg-white/80 backdrop-blur-xl border-slate-200/80 shadow-md rounded-full"
                        : "bg-transparent rounded-2xl"
                    }
                `}
            >
                {/* Logo */}
                <Link href='/' className='flex items-center gap-2 font-bold text-lg focus:outline-none'>
                    <div className="bg-amber-500 p-1.5 rounded-lg">
                        <Brain className='h-5 w-5 text-white' />
                    </div>
                    <span className="tracking-tight text-slate-900">
                        Docinate AI
                    </span>
                </Link>

                {/* Navigation - Desktop */}
                <nav className='hidden md:flex items-center gap-1' role="menu">
                    {navItems.map((item) => {
                        const isActive = item.href === "/"
                            ? (pathname === "/" && activeHash === "")
                            : (pathname === "/" && activeHash === item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                role="menuitem"
                                aria-current={isActive ? "page" : undefined}
                                aria-label={`Navigate to ${item.label}`}
                                className={`
                                    rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out 
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 active:scale-95
                                    ${isActive
                                        ? "bg-amber-50 text-amber-700 shadow-xs shadow-amber-100/50 font-semibold"
                                        : "text-slate-600 hover:text-amber-600 hover:bg-slate-50/80"
                                    }
                                `}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth - Desktop */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <DesktopWorkspaceSwitcher
                                organization={organization}
                                user={user}
                                memberships={userMemberships?.data || []}
                                setActive={setActive}
                                onSwitch={() => setIsOpen(false)}
                            />
                            <UserButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* <Link href="/sign-in" className="hidden sm:block"> */}
                            <Button onClick={() => openSignIn({ forceRedirectUrl: dashboardUrl })}
                                variant="ghost"
                                size="sm"
                                className="rounded-full cursor-pointer font-medium text-slate-600 hover:text-slate-900"
                            >
                                Sign In
                            </Button>
                            {/* </Link> */}

                            {/* <Link href="/sign-up"> */}
                            <Button onClick={() => openSignUp({ forceRedirectUrl: dashboardUrl })}
                                size="sm"
                                className='rounded-full bg-slate-900 text-white hover:bg-slate-800 px-5 font-medium shadow-xs transition cursor-pointer'
                            >
                                Create Account
                            </Button>
                            {/* </Link> */}
                        </div>
                    )}

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-slate-100/80 transition"
                                >
                                    <Menu className="h-5 w-5 text-slate-700" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-[90%] sm:w-100 border-l border-slate-100 bg-white/95 backdrop-blur-2xl px-6 py-8 flex flex-col justify-between">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>Mobile Navigation Menu</SheetTitle>
                                    <SheetDescription>
                                        Navigation links and workspace management
                                    </SheetDescription>
                                </SheetHeader>
                                
                                <div className="space-y-6 overflow-y-auto max-h-[80vh] pr-1">
                                    {/* Brand Header */}
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href="/"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 font-bold text-lg focus:outline-none"
                                        >
                                            <div className="bg-amber-500 p-1.5 rounded-lg">
                                                <Brain className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="tracking-tight text-slate-900">
                                                Docinate AI
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Anchored Navigation Links */}
                                    <nav className="flex flex-col gap-1">
                                        {navItems.map((item) => {
                                            const isActive = item.href === "/"
                                                ? (pathname === "/" && activeHash === "")
                                                : (pathname === "/" && activeHash === item.href);

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
                                                        ${isActive
                                                            ? "bg-amber-50 text-amber-700 font-semibold"
                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium">
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </nav>

                                    {/* Native Mobile Workspace Dropdown Accordion */}
                                    {user && (
                                        <MobileWorkspaceSwitcher
                                            organization={organization}
                                            user={user}
                                            memberships={userMemberships?.data || []}
                                            setActive={setActive}
                                            onSwitch={() => setIsOpen(false)}
                                        />
                                    )}

                                </div>

                                {/* Bottom Auth & Footer Context Block */}
                                <div className="space-y-4 pt-4 border-t border-slate-100 ">
                                    {user ? (
                                        <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                                            <div className="min-w-0 pr-2">
                                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                                    User Profile
                                                </p>
                                                <h3 className="font-semibold text-sm text-slate-800 mt-0.5 truncate">
                                                    {user?.fullName || user?.firstName || "Logged In User"}
                                                </h3>
                                            </div>
                                            <UserButton />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2.5">
                                            {/* <Link href="/sign-in" onClick={() => setIsOpen(false)}> */}
                                            <Button onClick={() => openSignIn()}
                                                variant="outline" className="w-full rounded-xl h-11 border-slate-200 text-slate-700 font-medium">
                                                Sign In
                                            </Button>
                                            {/* </Link> */}
                                            {/* <Link href="/sign-up" onClick={() => setIsOpen(false)}> */}
                                            <Button onClick={() => openSignUp()}
                                                className="w-full rounded-xl h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs">
                                                Create Account
                                            </Button>
                                            {/* </Link> */}
                                        </div>
                                    )}

                                    {/* Context Banner */}
                                    <div className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 p-px shadow-xs">
                                        <div className="rounded-xl bg-white px-4 py-3">
                                            <p className="text-xs font-semibold text-slate-800">
                                                AI-powered documentation platform
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
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