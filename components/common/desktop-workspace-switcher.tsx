"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DesktopWorkspaceSwitcherProps } from "@/types";

export function DesktopWorkspaceSwitcher({ organization, user, memberships, setActive, onSwitch }: DesktopWorkspaceSwitcherProps) {
    const router = useRouter();

    const handleSwitchOrganization = async (org: any) => {
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="hidden sm:flex items-center gap-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200/80
          hover:bg-slate-50 hover:text-slate-900 px-3 py-1.5 rounded-xl shadow-xs transition-all duration-200 cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                >
                    <div className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {(organization ? organization.name : user?.firstName)?.charAt(0)}
                    </div>

                    <span className="truncate max-w-30">
                        {organization ? organization.name : user?.firstName}
                    </span>

                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-68 rounded-xl p-1.5 border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-lg shadow-slate-100/50"
            >
                <DropdownMenuLabel className="px-2.5 py-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Workspaces
                </DropdownMenuLabel>

                <div className="max-h-70 overflow-y-auto space-y-0.5 pr-0.5">
                    {memberships?.map((membership) => {
                        const org = membership.organization;
                        const isActive = organization?.id === org.id;

                        return (
                            <DropdownMenuItem
                                key={org.id}
                                onClick={() => handleSwitchOrganization(org)}
                                className={`rounded-lg px-2.5 py-2 cursor-pointer flex items-center justify-between outline-none transition-colors 
                                    ${isActive
                                        ? "bg-slate-50 text-slate-900 font-medium"
                                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                                    }`}>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold shrink-0
                                     ${isActive
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-700"
                                        }`}>
                                        {org.name.charAt(0)}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm truncate">
                                            {org.name}
                                        </span>

                                        <span className="text-[11px] text-slate-400 capitalize">
                                            {membership.role.replace("org:", "")}
                                        </span>
                                    </div>
                                </div>

                                {isActive && (
                                    <div className="bg-emerald-50 p-0.5 rounded-md border border-emerald-100">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    </div>
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </div>

                <DropdownMenuSeparator className="my-1.5 bg-slate-100" />

                <DropdownMenuItem
                    onClick={() => router.push("/select-org")}
                    className="rounded-lg px-2.5 py-2 cursor-pointer text-sm font-normal text-slate-500 hover:bg-slate-50 hover:text-slate-800 flex items-center gap-2.5 transition-colors"
                >
                    <div className="w-7 h-7 rounded-md border border-dashed border-slate-300 flex items-center justify-center shrink-0 text-slate-400">
                        <Plus className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-medium">
                        Create Workspace
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}