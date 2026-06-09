import MembersToolbar from "@/components/org-members/members-toolbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notFound } from "next/navigation";
import { Users, ShieldCheck, User, Sparkles } from "lucide-react";
import { OrganizationMember, OrganizationMembersProps } from "@/types";

export default async function OrganizationMembers({ params, searchParams }: OrganizationMembersProps) {
  const { orgSlug } = await params;

  const { search = "", role = "", sort = "newest" } = await searchParams;

  const query = new URLSearchParams({ search, role, sort });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/organizations/${orgSlug}/members?${query.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch organization members");
  }

  const data = await response.json();
  const organization = data.organization;
  const members = data.members;
  const totalCount = data.totalCount;

  return (
    <main aria-labelledby="team-directory-heading" className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div tabIndex={0}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 px-3.5 py-1.5 text-xs font-semibold 
            shadow-xs transition-all hover:border-orange-200 focus:outline-none focus:ring-1 focus:ring-orange-300 focus:ring-offset-1"
            role="status"
            aria-label="AI powered badge"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Workspace Dashboard
          </div>
          <h1
            id="team-directory-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Team Directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage system access roles and profiles for <span className="font-medium text-orange-600">{organization.name}</span>.
          </p>
        </div>

        <Card className="w-full rounded-xl border-slate-200/80 bg-white/80 px-5 py-4 shadow-xs sm:w-60">
          <CardContent className="inline-flex w-full items-center gap-4 p-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div className="min-w-0 flex flex-col">
              <span id="search-results-heading" className="text-xs font-medium text-slate-500">
                Total Users
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {totalCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MembersToolbar />

      <Card className="overflow-hidden shadow-xs border border-slate-200/80 rounded-xl bg-white">
        <div className="overflow-x-auto">
          <Table
            aria-label="Organization members directory"
            className="w-full border-collapse text-left"
          >
            <caption className="sr-only">
              Directory of organization members including role and access date.
            </caption>
            <TableHeader className="border-b border-slate-200/60 bg-slate-50/75">
              <TableRow>
                <TableHead scope="col" className="table-head pl-6 py-3.5 w-[25%] text-slate-800">Member ID</TableHead>
                <TableHead scope="col" className="table-head py-3.5 w-[45%] text-slate-800">Member Info</TableHead>
                <TableHead scope="col" className="table-head py-3.5 w-[20%] text-slate-800">System Role</TableHead>
                <TableHead scope="col" className="table-head pr-6 py-3.5 w-[20%] text-slate-800">Date Access Granted</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100">
              {members.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    role="status"
                    className="h-36 text-center text-sm text-muted-foreground">
                    No directory records match your active query filters.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member: OrganizationMember) => (
                  <TableRow
                    key={member.id}
                    className="group transition-colors hover:bg-slate-50/50 focus-within:bg-slate-50">

                    <TableCell className="max-w-30 truncate py-4 pl-6 font-mono text-sm font-medium text-slate-600">
                      {member.id}
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-linear-to-br 
                          from-slate-50 to-slate-100 text-xs font-semibold uppercase text-slate-600 shadow-xs"
                        >
                          {member.user.name ? member.user.name.charAt(0) : <User className="h-4 w-4" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-slate-600 text-sm tracking-tight truncate">
                            {member.user.name || "Pending User"}
                          </span>
                          <span className="max-w-55 truncate text-xs font-normal text-slate-500 sm:max-w-none">
                            {member.user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      {member.role === "admin" ? (
                        <Badge variant="outline" className="inline-flex items-center gap-1.5 bg-orange-50/60 text-orange-700 border-orange-200/80 font-medium px-2.5 py-0.5 rounded-md text-xs">
                          <ShieldCheck className="h-3.5 w-3.5 text-orange-600" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="inline-flex items-center bg-emerald-50/60 text-emerald-700 border border-emerald-200/60 font-medium px-2.5 py-0.5 rounded-md text-xs">
                          Member
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="pr-6 py-4 text-sm text-slate-600 font-normal">

                      <time dateTime={
                        member.user.createdAt instanceof Date
                          ? member.user.createdAt.toISOString()
                          : member.user.createdAt
                      }>
                        {new Date(member.user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </main>
  );
}