"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function InviteTeamModal() {
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
                <Button
                    variant="ghost"
                    className="rounded-xl font-semibold text-slate-600"
                >
                    Invite Team
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-3xl border-none p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                        Invite Team Member
                    </DialogTitle>

                    <DialogDescription className="text-slate-500 pt-1">
                        Invite collaborators to your workspace.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-4">
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
                            className="h-12 rounded-xl"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Role
                        </label>

                        <Select
                            value={role}
                            onValueChange={setRole}
                        >
                            <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="org:member">
                                    Member
                                </SelectItem>

                                <SelectItem value="org:admin">
                                    Admin
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Button */}
                    <Button
                        onClick={handleInvite}
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black font-semibold"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending Invite...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Send Invitation
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}