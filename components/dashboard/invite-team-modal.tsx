"use client";
import { ReactNode, useState } from "react";
import { Loader2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InviteTeamModalProps {
    children: ReactNode;
}

export default function InviteTeamModal({
    children,
}: InviteTeamModalProps) {
    const [open, setOpen] = useState(false);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("org:member");

    const [loading, setLoading] = useState(false);

    const handleInvite = async () => {
        if (!email.trim()) {
            toast.error("Please enter an email address");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "/api/organizations/invite",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        role,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to send invitation"
                );
            }

            toast.success("Invitation sent successfully");

            setEmail("");
            setRole("org:member");

            setOpen(false);
        } catch (error: any) {
            console.error(error);

            toast.error(
                error.message || "Failed to send invitation"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-3xl border border-slate-200/70 bg-white p-0 overflow-hidden shadow-2xl">

                {/* Close Button */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200
                     bg-white text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900">
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="border-b border-slate-100 bg-slate-50/70 px-8 py-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 shadow-sm">
                            <UserPlus className="w-5 h-5 text-white" />
                        </div>

                        <DialogHeader className="space-y-2 text-left">
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                                Invite Team Member
                            </DialogTitle>

                            <DialogDescription className="text-sm leading-relaxed text-slate-500">
                                Invite teammates to collaborate inside your workspace.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-6">

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Email Address
                        </label>

                        <Input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="
                                h-12 rounded-2xl border-slate-200
                                focus-visible:ring-1 focus-visible:ring-slate-900/10
                            "
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Role
                        </label>

                        <div className="flex items-center gap-2">
                            <span
                                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                                Member
                            </span>

                            <span className="text-xs text-slate-400">
                                Default role
                            </span>
                        </div>
                    </div>
                    {/* Info Box */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-xs leading-relaxed text-slate-600">
                            Invited members will receive an email invitation
                            to join your organization workspace.
                        </p>
                    </div>

                    {/* Submit */}
                    <Button
                        onClick={handleInvite}
                        disabled={loading}
                        className="h-12 w-full rounded-2xl bg-slate-900 hover:bg-black font-semibold text-white transition-all
                         duration-200 shadow-sm hover:shadow-md cursor-pointer">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending Invite...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Send Invitation
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}