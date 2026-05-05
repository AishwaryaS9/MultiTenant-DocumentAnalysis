interface OrgLayoutProps {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
  
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="py-8">
                <div className="container mx-auto px-4">{children}</div>
            </main>
        </div>
    )
}