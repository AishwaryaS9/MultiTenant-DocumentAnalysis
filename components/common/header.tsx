"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { useOrganization, UserButton, useUser, useOrganizationList } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "../ui/sheet"
import { DesktopWorkspaceSwitcher } from "./desktop-workspace-switcher"
import { MobileWorkspaceSwitcher } from "./mobile-workspace-switcher"
import Image from "next/image"
import { images } from "@/assets"
import { navLinks } from "@/app/data/data"
import { useActiveSection } from "@/app/hooks/useActiveSection"

export default function Header() {
    const { user } = useUser()
    const { organization } = useOrganization()
    const { activeHash, pathname } = useActiveSection();

    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const { userMemberships, setActive } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    })

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])


    return (
        <>
            <a href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-md">
                Skip to content
            </a>

            <div className="fixed top-4 w-full z-50 px-3 sm:px-4 transition-all duration-300 motion-reduce:transition-none">
                <header role="banner"
                    className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 py-3 transition-all duration-300 motion-reduce:transition-none 
                        border border-transparent ${scrolled ? "bg-white/80 backdrop-blur-xl border-slate-200/80 shadow-md rounded-full" : "bg-transparent rounded-2xl"}`}>
                    <h1 className="sr-only">
                        Docinate AI
                    </h1>

                    {/* Logo */}
                    <Link href="/" prefetch
                        aria-label="Docinate AI homepage"
                        className="flex items-center gap-2 font-bold text-lg min-w-0 rounded-md focus:outline-none 
                        focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:ring-offset-1">
                        <div className="p-1.5 shrink-0">
                            <Image
                                src={images.logo_full}
                                alt="logo"
                                width={110}
                                height={110}
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav
                        aria-label="Primary navigation"
                        className="hidden md:flex items-center gap-1"
                    >
                        {navLinks.map((item) => {
                            const isActive =
                                item.href === "/"
                                    ? pathname === "/" && activeHash === ""
                                    : pathname === "/" &&
                                    activeHash === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={
                                        isActive ? "location" : undefined
                                    }
                                    aria-label={`Navigate to ${item.label}`}
                                    className={`rounded-full px-4 py-2 min-h-11 inline-flex items-center justify-center text-sm font-medium transition-all duration-200
                                         motion-reduce:transition-none ease-in-out focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 
                                         focus-visible:ring-offset-1 active:opacity-80 
                                         ${isActive ? "text-orange-700 font-semibold" : "text-slate-600 hover:text-orange-600"}`}>
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {user ? (
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    href="/sign-in"
                                    aria-label="Sign in to your account"
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full cursor-pointer font-medium text-slate-600 hover:text-slate-900 min-h-11 focus-visible:ring-1
                                       focus-visible:ring-gray-100 focus-visible:ring-offset-1">
                                        Sign In
                                    </Button>
                                </Link>

                                <Link
                                    href="/sign-up"
                                    aria-label="Create a new account">
                                    <Button
                                        size="sm"
                                        className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-5 font-medium shadow-xs transition 
                                       motion-reduce:transition-none cursor-pointer min-h-11 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900">
                                        Create Account
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Sheet
                                open={isOpen}
                                onOpenChange={setIsOpen}
                            >
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={
                                            isOpen
                                                ? "Close navigation menu"
                                                : "Open navigation menu"
                                        }
                                        aria-expanded={isOpen}
                                        aria-controls="mobile-navigation"
                                        className="rounded-full hover:bg-slate-100/80 transition motion-reduce:transition-none focus-visible:ring-1 
                                        focus-visible:ring-orange-500 focus-visible:ring-offset-1">
                                        <Menu
                                            className="h-5 w-5 text-slate-700"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </SheetTrigger>

                                <SheetContent
                                    side="right"
                                    aria-modal="true"
                                    className="w-[90%] sm:max-w-md border-l border-slate-100 bg-white/95 backdrop-blur-2xl px-6 py-8 flex flex-col justify-between">
                                    <SheetHeader className="sr-only">
                                        <SheetTitle>
                                            Mobile Navigation Menu
                                        </SheetTitle>

                                        <SheetDescription>
                                            Navigation links and workspace
                                            management
                                        </SheetDescription>
                                    </SheetHeader>

                                    <div className="space-y-6 overflow-y-auto max-h-[80vh] pr-1">
                                        {/* Brand */}
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href="/"
                                                onClick={() => setIsOpen(false)}
                                                aria-label="Docinate AI homepage"
                                                className="flex items-center gap-2 font-bold text-lg rounded-md focus:outline-none focus-visible:ring-1 
                                                focus-visible:ring-orange-500 focus-visible:ring-offset-1">
                                                <div className="p-1.5">
                                                    {/* <Brain
                                                        className="h-5 w-5 text-white"
                                                        aria-hidden="true"
                                                    /> */}
                                                    <div className="p-1.5 shrink-0">
                                                        <Image
                                                            src={images.logo_full}
                                                            alt="logo"
                                                            width={110}
                                                            height={110}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Mobile Navigation */}
                                        <nav
                                            id="mobile-navigation"
                                            aria-label="Mobile navigation"
                                            className="flex flex-col gap-1"
                                        >
                                            {navLinks.map((item) => {
                                                const isActive =
                                                    item.href === "/"
                                                        ? pathname === "/" &&
                                                        activeHash === ""
                                                        : pathname === "/" &&
                                                        activeHash ===
                                                        item.href

                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        aria-current={isActive ? "location" : undefined}
                                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 min-h-11 transition-all duration-200 motion-reduce:transition-none 
                                                            focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:ring-offset-1
                                                             ${isActive ? "text-orange-700 font-semibold" : "text-slate-600 hover:text-orange-600"}`}
                                                    >
                                                        <span className="text-sm font-medium">
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                )
                                            })}
                                        </nav>

                                        {/* Workspace Switcher */}
                                        {user && (
                                            <MobileWorkspaceSwitcher
                                                organization={organization}
                                                user={user}
                                                memberships={
                                                    userMemberships?.data || []
                                                }
                                                setActive={setActive}
                                                onSwitch={() =>
                                                    setIsOpen(false)
                                                }
                                            />
                                        )}
                                    </div>

                                    {/* Bottom Section */}
                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        {user ? (
                                            <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 p-3.5 gap-3 min-w-0">
                                                <div className="min-w-0 pr-2">
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                                                        User Profile
                                                    </p>

                                                    <h2 className="font-semibold text-sm text-slate-800 mt-0.5 truncate">
                                                        {user?.fullName ||
                                                            user?.firstName ||
                                                            "Logged In User"}
                                                    </h2>
                                                </div>

                                                <UserButton />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2.5">
                                                <Link href="/sign-in"
                                                    onClick={() => setIsOpen(false)}
                                                    aria-label="Sign in to your account">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full rounded-xl h-11 border-slate-200 text-slate-700 font-medium focus-visible:ring-1
                                                         focus-visible:ring-gray-100 focus-visible:ring-offset-1">
                                                        Sign In
                                                    </Button>
                                                </Link>

                                                <Link
                                                    href="/sign-up"
                                                    onClick={() =>
                                                        setIsOpen(false)
                                                    }
                                                    aria-label="Create a new account"
                                                >
                                                    <Button
                                                        className="w-full rounded-xl h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs 
                                                        focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900"
                                                    >
                                                        Create Account
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}

                                        {/* Banner */}
                                        <div className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 p-px shadow-xs">
                                            <div className="rounded-xl bg-white px-4 py-3">
                                                <p className="text-xs font-semibold text-slate-800">
                                                    AI-powered documentation
                                                    platform
                                                </p>

                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    Build smarter workflows
                                                    with Docinate AI
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
        </>
    )
}

