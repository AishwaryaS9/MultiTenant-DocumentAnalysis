import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentItem from "./document-item";
import { RecentDocumentsProps } from "@/types";

export default function RecentDocuments({ documents, orgSlug }: RecentDocumentsProps) {
    return (
        <Card className="lg:col-span-2 rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between px-8 py-6">
                <div>
                    <CardTitle className="text-xl font-bold">
                        Recent Documents
                    </CardTitle>

                    <p className="text-sm text-slate-500 mt-0.5">
                        Knowledge base activity
                    </p>
                </div>

                <Link href={`/${orgSlug}/documents`}>
                    <Button variant="outline" size="sm">
                        View All
                    </Button>
                </Link>
            </CardHeader>

            <CardContent className="p-4">
                <div className="space-y-1">
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