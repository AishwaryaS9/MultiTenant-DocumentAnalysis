"use client";

import { Check, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MobileWorkspaceSwitcherProps, Organization } from "@/types";

export function MobileWorkspaceSwitcher({ organization, user, memberships, setActive, onSwitch }: MobileWorkspaceSwitcherProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const handleSwitchOrganization = async (org: Organization) => {
        try {
            if (setActive) {
                await setActive({
                    organization: org.id,
                });
            }

            toast.success(`Switched to ${org.name}`);

            onSwitch?.();
        } catch (error) {
            toast.error("Failed to switch workspace");
        }
    };

    return (
        <div className="border border-slate-200/80 rounded-xl bg-white p-1 shadow-xs">
            <button
                type="button"
                aria-expanded={open}
                aria-controls="mobile-workspace-list"
                aria-label={`Current workspace ${organization ? organization.name : user?.firstName}. Toggle workspace switcher`}
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 active:bg-slate-100
                 transition-colors motion-reduce:transition-none min-h-11 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300"
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div aria-hidden="true" className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                        {(organization ? organization.name : user?.firstName)?.charAt(0)}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            Active Space
                        </span>

                        <span className="truncate text-slate-800 font-semibold">
                            {organization
                                ? organization.name
                                : `${user?.firstName}'s Space`}
                        </span>
                    </div>
                </div>

                <ChevronDown
                    aria-hidden="true"
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div
                    id="mobile-workspace-list"
                    role="menu"
                    aria-label="Workspace switcher"
                    className="relative z-0 mt-1 border-t border-slate-100 pt-1 px-1 pb-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200 
                    motion-reduce:animate-none"
                >
                    {memberships?.map((membership) => {
                        const org = membership.organization;
                        const isActive = organization?.id === org.id;

                        return (
                            <button
                                key={org.id}
                                type="button"
                                role="menuitem"
                                aria-label={`Switch to workspace ${org.name}`}
                                aria-current={isActive ? "true" : undefined}
                                onClick={() => handleSwitchOrganization(org)}
                                className={`w-full text-left rounded-lg px-2 py-2 flex items-center justify-between outline-none transition-colors motion-reduce:transition-none
                                     min-h-11 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300 
                                     ${isActive ? "bg-slate-50 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50"}`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                        aria-hidden="true"
                                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-semibold shrink-0
                                             ${isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                                    >
                                        {org.name.charAt(0)}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm truncate font-medium text-slate-700">
                                            {org.name}
                                        </span>

                                        <span className="text-[10px] text-slate-400 capitalize">
                                            {membership.role.replace("org:", "")}
                                        </span>
                                    </div>
                                </div>

                                {isActive && (
                                    <Check aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                )}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        role="menuitem"
                        aria-label="Create a new workspace"
                        onClick={() => {
                            onSwitch?.();
                            router.push("/select-org");
                        }}
                        className="w-full text-left rounded-lg px-2 py-2 text-slate-500 hover:bg-slate-50 flex items-center gap-2.5 transition-colors 
                        motion-reduce:transition-none min-h-11 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300"
                    >
                        <div aria-hidden="true"
                            className="w-6 h-6 rounded-md border border-dashed border-slate-300 flex items-center justify-center shrink-0 text-slate-400">
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </div>

                        <span className="text-xs font-medium">
                            Create Workspace
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}