"use client";

import { ArrowRightLeft, Bell, ChartNoAxesCombined, FileText, LayoutDashboard, Menu, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuth, useOrganization, UserButton, useUser } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import Image from 'next/image';
import { images } from '@/assets';
import { useGetNotificationsQuery } from '@/app/store/services/notificationsApi';

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const { organization } = useOrganization();
    const { isSignedIn } = useAuth();

    const { data: notificationsData } = useGetNotificationsQuery(undefined, { skip: !isSignedIn });
    const unreadCount = notificationsData?.unreadCount ?? 0;

    const activeSlug = organization?.slug || user?.organizationMemberships?.[0]?.organization?.slug;

    const navItems: { href: string; label: string; icon: React.ReactNode; badge?: number }[] = [
        ...(activeSlug
            ? [
                {
                    href: `/${activeSlug}`,
                    label: "Dashboard",
                    icon: <LayoutDashboard className='w-5 h-5' aria-hidden="true" />
                },
                {
                    href: `/${activeSlug}/documents`,
                    label: "Documents",
                    icon: <FileText className='w-5 h-5' aria-hidden="true" />
                },
                {
                    href: `/${activeSlug}/org-members`,
                    label: "Organization Members",
                    icon: <Users className='w-5 h-5' aria-hidden="true" />
                },
                {
                    href: `/${activeSlug}/analytics`,
                    label: "Analytics",
                    icon: <ChartNoAxesCombined className='w-5 h-5' aria-hidden="true" />
                }
            ]
            : []),

        {
            href: "/select-org",
            label: "Switch Organizations",
            icon: <ArrowRightLeft className="h-5 w-5" aria-hidden="true" />
        },
        {
            href: "/notifications",
            label: "Notifications",
            icon: <Bell className="h-5 w-5" aria-hidden="true" />,
            badge: unreadCount
        },
    ];

    const NavContent = () => (
        <div className="flex flex-col h-full py-6 px-4">
            {/* Logo */}
            <Link
                href="/"
                aria-label="Go to homepage"
                className="flex items-center gap-3 px-2 mb-10 rounded-xl focus:outline-none focus-visible:ring-1 
                focus-visible:ring-offset-1 focus-visible:ring-lightOrange w-fit">
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
                                    ${isActive ? "bg-lightPeach/10 text-primary font-bold border-r-4 border-primary hover:bg-lightPeach/20 hover:text-primary rounded-r-none focus-visible:ring-lightOrange"
                                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground focus-visible:ring-ring"}`}
                            >
                                {item.icon}
                                {item.label}
                                {(item.badge ?? 0) > 0 && (
                                    <span
                                        aria-label={`${item.badge ?? 0} unread`}
                                        className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center"
                                    >
                                        {(item.badge ?? 0) > 9 ? "9+" : item.badge}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            <div className="md:hidden mb-6 px-2">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary p-3">
                    <UserButton />

                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            Logged in as
                        </span>

                        <span className="text-sm font-bold text-secondary-foreground truncate">
                            {user?.firstName} {user?.lastName}
                        </span>
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="pt-6 border-t border-border flex items-center justify-between px-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div aria-hidden="true" className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold shrink-0">
                        {(organization ? organization.name : user?.firstName)?.charAt(0)}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-secondary-foreground truncate max-w-30">
                            {organization?.name || user?.firstName}
                        </span>

                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
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
            <header className="md:hidden fixed top-0 inset-x-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 px-4 py-3 flex items-center justify-between gap-3">
                <Link
                    href="/"
                    aria-label="Go to homepage"
                    className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-1 
                    focus-visible:ring-offset-1 focus-visible:ring-lightOrange min-w-0">
                    <div className="shrink-0">
                        <Image
                            src={images.logo_full}
                            alt="logo"
                            width={110}
                            height={110}
                            className="object-contain"
                        />
                    </div>
                </Link>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open sidebar navigation"
                            className="shrink-0 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-ring"
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
                className="hidden md:flex flex-col w-72 h-screen sticky top-0 border-r border-border bg-background shrink-0">
                <NavContent />
            </aside>
        </>
    );
}


