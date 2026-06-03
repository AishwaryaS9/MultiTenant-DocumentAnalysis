import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentItem from "./document-item";
import { RecentDocumentsProps } from "@/types";

export default function RecentDocuments({ documents, orgSlug }: RecentDocumentsProps) {
    return (
        <Card className="lg:col-span-2 rounded-3xl overflow-hidden"
            role="region"
            aria-label="Recent documents section">
            <CardHeader className="flex flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-5 sm:py-6 gap-4">
                <div className="min-w-0">
                    <CardTitle className="text-lg sm:text-xl font-semibold truncate">
                        Recent Documents
                    </CardTitle>

                    <p className="text-sm text-slate-500 mt-0.5">
                        Knowledge base activity
                    </p>
                </div>

                <Link href={`/${orgSlug}/documents`}
                    aria-label="View all organization documents">
                    <Button variant="outline"
                        size="sm"
                        className="shrink-0 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900">
                        View All
                    </Button>
                </Link>
            </CardHeader>

            <CardContent className="p-3 sm:p-4">
                <div className="space-y-1"
                    role="list"
                    aria-label="Recent documents list">
                    {documents.map((doc) => (
                        <DocumentItem
                            key={doc.id}
                            doc={doc}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}