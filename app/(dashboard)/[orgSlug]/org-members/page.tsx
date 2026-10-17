import MembersToolbar from "@/components/org-members/members-toolbar";
import { Card } from "@/components/ui/card";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { MoreHorizontal } from "lucide-react";
import { OrganizationMember, OrganizationMembersProps } from "@/types";
import InviteTeamModal from "@/components/dashboard/invite-team-modal";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { getInitials } from "@/lib/utils";

export default async function OrganizationMembers({ params, searchParams }: OrganizationMembersProps) {
  const { orgSlug } = await params;

  const { search = "", role = "", sort = "newest" } = await searchParams;

  const { orgRole } = await auth();

  const query = new URLSearchParams({ search, role, sort });

  const cookieStore = await cookies();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/organizations/${orgSlug}/members?${query.toString()}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (response.status === 404) notFound();
  if (response.status === 401) redirect("/sign-in");
  if (response.status === 403) redirect("/select-org");

  if (!response.ok) {
    throw new Error("Failed to fetch organization members");
  }

  const data = await response.json();
  const organization = data.organization;
  const members = data.members;
  const totalCount = data.totalCount;


  return (
    <main aria-labelledby="team-directory-heading" className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 w-full"
        aria-labelledby="team-directory-heading">
        {/* Page Info */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider text-orange-600 truncate"
              aria-label={`Workspace ${organization.name}`}>
              {organization.name}
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1
              id="team-directory-heading"
              className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
              Team Directory
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            Manage system access roles and profiles for your organization's members.
          </p>
        </div>

        {orgRole === "org:admin" && (
          <div
            className="flex items-center gap-3 shrink-0 "
            role="status"
            aria-label={`Total users: ${totalCount}`}>
            <InviteTeamModal>
              <Button
                variant="outline"
                aria-label="Invite team members"
                className="rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border-slate-200 shadow-sm cursor-pointer min-h-10 px-4 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-600"
              >
                Invite Team
              </Button>
            </InviteTeamModal>

          </div>
        )}
      </header>

      <MembersToolbar />

      <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-0 gap-0 shadow-xs">
        {/* Card header */}
        <div className="border-b border-slate-200/80 px-6 py-5">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {totalCount} {totalCount === 1 ? "member" : "members"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            People with access to {organization.name}
          </p>
        </div>

        {/* Member rows */}
        {members.length === 0 ? (
          <div role="status" className="flex h-36 items-center justify-center text-sm text-muted-foreground">
            No directory records match your active query filters.
          </div>
        ) : (
          <ul aria-label="Organization members directory" className="divide-y divide-slate-200/80">
            {members.map((member: OrganizationMember) => {
              const isOwner = member.role === "owner";

              return (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-4 px-6 py-2 transition-colors hover:bg-slate-50/50 focus-within:bg-slate-50/50">
                  {/* Avatar + info */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      aria-hidden="true"
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isOwner ? "bg-slate-900 text-white" : "bg-orange-50 text-orange-600"
                        }`}>
                      {getInitials(member.user.name, member.user.email)}
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[15px] font-semibold text-slate-900">
                        {member.user.name || "Pending User"}
                      </span>
                      <span className="truncate text-sm text-slate-500">
                        {member.user.email}
                      </span>
                    </div>
                  </div>

                  {/* Role + actions */}
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-semibold capitalize text-stone-600">
                      {member.role}
                    </span>

                    <button
                      type="button"
                      aria-label={`More actions for ${member.user.name || member.user.email}`}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400">
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </main>
  );
}