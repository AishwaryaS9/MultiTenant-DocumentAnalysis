import MembersToolbar from "@/components/org-members/members-toolbar";
import { Card } from "@/components/ui/card";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Plus, Users } from "lucide-react";
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
      <header className="flex w-full flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
        {/* Page Info */}
        <div className="flex min-w-0 flex-col gap-1">
          <span
            className="truncate text-xs font-bold uppercase tracking-wider text-orange-600"
            aria-label={`Workspace ${organization.name}`}>
            {organization.name}
          </span>

          <h1
            id="team-directory-heading"
            className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Team Directory
          </h1>

          <p className="text-sm text-slate-500">
            Manage system access roles and profiles for your organization&apos;s members.
          </p>
        </div>

        {orgRole === "org:admin" && (
          <div className="flex shrink-0 items-center gap-3">
            <InviteTeamModal>
              <Button
                aria-label="Upload document"
                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 flex items-center gap-2 font-medium text-sm cursor-pointer min-h-10 shadow-sm focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900">
                <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Invite Team</span>
              </Button>
            </InviteTeamModal>
          </div>
        )}
      </header>

      <MembersToolbar />

      <Card className="gap-0 overflow-hidden card-outline p-0 ">
        {/* Card header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 px-6 py-5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              {totalCount} {totalCount === 1 ? "member" : "members"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              People with access to {organization.name}
            </p>
          </div>
          <div
            aria-hidden="true"
            className="hidden h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 sm:flex">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Member rows */}
        {members.length === 0 ? (
          <div
            role="status"
            className="flex h-44 flex-col items-center justify-center gap-2 text-sm text-slate-500">
            <Users className="h-8 w-8 text-slate-300" aria-hidden="true" />
            No directory records match your active query filters.
          </div>
        ) : (
          <ul aria-label="Organization members directory" className="divide-y divide-slate-200/80">
            {members.map((member: OrganizationMember) => {
              const isOwner = member.role === "owner";

              return (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-4 px-6 py-3 transition-colors hover:bg-slate-50/70 focus-within:bg-slate-50/70">
                  {/* Avatar + info */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      aria-hidden="true"
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white ${isOwner ? "bg-slate-900 text-white" : "bg-orange-50 text-orange-600"
                        }`}>
                      {getInitials(member.user.name, member.user.email)}
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[15px] font-semibold text-slate-900">
                        {member.user.name || "Pending User"}
                      </span>
                      <span className="truncate text-xs font-base text-slate-500">
                        {member.user.email}
                      </span>
                    </div>
                  </div>

                  {/* Role + actions */}
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${isOwner
                        ? "bg-slate-900 text-white"
                        : "bg-stone-100 text-stone-600"
                        }`}>
                      {member.role}
                    </span>

                    {/* <button
                      type="button"
                      aria-label={`More actions for ${member.user.name || member.user.email}`}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button> */}
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