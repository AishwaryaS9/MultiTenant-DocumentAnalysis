"use client"
import { Brain, Building, FileText, Home, LogIn, UserPlus, Users } from 'lucide-react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { SignInButton, SignOutButton, useOrganization, UserButton, useUser } from '@clerk/nextjs'

export default function Header() {

    const pathname = usePathname();
    const { user } = useUser();
    const { organization } = useOrganization();

    const getNavItems = () => {
        const baseItems = [
            {
                href: "/",
                label: "Home",
                icon: <Home className='w-4 h-4' />
            }
        ];

        if (organization) {
            return [
                {
                    href: `/${organization.slug}`,
                    label: "Organization Dashboard",
                    icon: <Building className='w-4 h-4' />
                },
                {
                    href: `/${organization.slug}/documents`,
                    label: "Organization Documents",
                    icon: <FileText className='w-4 h-4' />
                },
                {
                    href: "/select-org",
                    label: "Switch Organization",
                    icon: <Users className='w-4 h-4' />
                }
            ]
        }
        return [...baseItems];
    }

    const navItems = getNavItems();

    return (
        <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur 
        supports-backdrop-filter:bg-white/60'>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href='/' className='flex items-center gap-2 font-bold text-xl' >
                    <Brain className='h-6 w-6 text-blue-600' />
                    DocuAI
                </Link>
                {/* Navigation */}
                <nav className='md:flex items-center gap-1'>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button variant={isActive ? "secondary" : "ghost"}
                                    size="sm" className='gap-2'>
                                    {item.icon}
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth */}
                <div className="flex items-center gap-4">
                    <SignInButton>
                        <div className="md:flex items-center gap-2">
                            <span className='text-sm text-gray-600'>
                                {organization ? `In ${organization.name}` : user?.firstName || user?.username}
                            </span>
                            <UserButton />
                        </div>
                    </SignInButton>
                    <SignOutButton>
                        <div className="md:flex items-center gap-2">
                            <Link href="/sign-in">
                                <Button variant="ghost" size="sm">
                                    <LogIn className='h-4 w-4 mr-1' />
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button size="sm">
                                    <UserPlus className='h-4 w-4 mr-1' />
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </SignOutButton>
                </div>
            </div>
        </header>
    )
}
