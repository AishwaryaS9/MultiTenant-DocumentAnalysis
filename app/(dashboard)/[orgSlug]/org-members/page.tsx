import MembersToolbar from "@/components/org-members/members-toolbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notFound } from "next/navigation";
import { Users, ShieldCheck, User } from "lucide-react";
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
  console.log("members", members)
  const totalCount = data.totalCount;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium border border-orange-100">
              Workspace Dashboard
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Team Directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage system access roles and profiles for <span className="font-medium text-slate-700">{organization.name}</span>.
          </p>
        </div>

        {/* Dynamic Metric Display */}
        <Card className="sm:w-60 rounded-xl bg-white/80 px-5 py-4 shadow-xs">
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

      {/* Main Table Segment */}
      <Card className="overflow-hidden shadow-xs border border-slate-200/80 rounded-xl bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse text-left">
            <TableHeader className="bg-slate-50/75 border-b border-slate-200/60">
              <TableRow>
                <TableHead className="table-head pl-6 py-3.5 w-[25%] text-slate-800">Member ID</TableHead>
                <TableHead className="table-head py-3.5 w-[45%] text-slate-800">Member Info</TableHead>
                <TableHead className="table-head py-3.5 w-[20%] text-slate-800">System Role</TableHead>
                <TableHead className="table-head pr-6 py-3.5 w-[20%] text-slate-800">Date Access Granted</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100">
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-36 text-center text-sm text-muted-foreground">
                    No directory records match your active query filters.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member: OrganizationMember) => (
                  <TableRow key={member.id} className="group hover:bg-slate-50/50 transition-colors">

                    {/* Member ID (Monospaced, clean and truncated if too long) */}
                    <TableCell className="pl-6 py-4 font-mono text-sm text-slate-600 font-medium max-w-30 ">
                      {member.id}
                    </TableCell>

                    {/* User profile details */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-50 to-slate-100 text-slate-600 font-semibold text-xs uppercase border border-slate-200 shadow-xs">
                          {member.user.name ? member.user.name.charAt(0) : <User className="h-4 w-4" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-slate-600 text-sm tracking-tight truncate">
                            {member.user.name || "Pending User"}
                          </span>
                          <span className="text-xs text-slate-500 font-normal truncate">
                            {member.user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* System Roles */}
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

                    {/* Date Access Granted */}
                    <TableCell className="pr-6 py-4 text-sm text-slate-600 font-normal">
                      {new Date(member.user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}