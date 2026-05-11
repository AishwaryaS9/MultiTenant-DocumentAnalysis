"use client";
import React, { useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Check, Loader2, Sparkles, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { allowedTypes } from "@/app/data/data";
import { DocumentUploadDialogProps } from "@/types";

export default function DocumentUploadDialog({ onUploadSuccess, trigger }: DocumentUploadDialogProps) {
    const { organization } = useOrganization();
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size exceeds 10MB");
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            toast.error("File type not supported");
            return;
        }

        setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!organization || !user || !selectedFile) {
            toast.error("Please select a file");
            return;
        }

        if (!documentName.trim()) {
            toast.error("Please enter a document name");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();

        formData.append("name", documentName);
        formData.append("organizationId", organization.id);

        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            const response = await fetch("/api/documents", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                toast.success("Document uploaded successfully!");

                setDocumentName("");
                setSelectedFile(null);
                setIsOpen(false);

                onUploadSuccess?.();
            } else {
                const error = await response.json();

                toast.error(error.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error", error);

            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsOpen(open);

        if (!open) {
            setDocumentName("");
            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        className="rounded-2xl bg-[#1A1A1A] hover:bg-black text-white shadow-lg shadow-black/10 h-11 px-5 " >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-140 border-white/40 bg-white/80 backdrop-blur-2xl rounded-[32px] p-0 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
                {/* Glow */}
                <DialogClose className="absolute right-6 top-6 z-50 rounded-full p-2 opacity-70 transition-opacity disabled:pointer-events-none">
                    <X className="h-5 w-5 text-slate-800 hover:text-slate-600" />
                    <span className="sr-only">Close</span>
                </DialogClose>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40" />
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-100 rounded-full blur-3xl opacity-30" />
                </div>

                <div className="relative z-10 p-8">
                    {/* Header */}
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 border border-orange-200/50 flex items-center justify-center shadow-sm">
                                <Sparkles className="w-6 h-6 text-orange-400" />
                            </div>

                            <div>
                                <DialogTitle className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">
                                    Upload Document
                                </DialogTitle>

                                <DialogDescription className="text-slate-500 mt-1 text-base">
                                    Add documents to generate AI-powered insights and
                                    summaries.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="mt-8 space-y-6">
                        {/* Name */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 pl-1">
                                Document Name
                            </label>

                            <Input
                                placeholder="Enter document name"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                disabled={isUploading}
                                className="h-11 rounded-2xl border-slate-200 bg-white/80 px-4 text-[15px] shadow-sm transition-all focus-visible:ring-2
                                 focus-visible:ring-orange-100 focus-visible:ring-offset-0 focus-visible:border-orange-200  focus-visible:shadow-[0_0_0_4px_rgba(251,146,60,0.08)]"
                            />
                        </div>
                        {/* Upload Box */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700">
                                Upload File
                            </label>

                            <div className="relative">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept=".txt,.pdf,.doc,.docx,.md"
                                    className="hidden"
                                    id="file-upload"
                                    disabled={isUploading}
                                />

                                <label
                                    htmlFor="file-upload"
                                    className="group relative flex flex-col items-center justify-center gap-4 rounded-[28px] border-2 border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center transition-all duration-300 hover:border-orange-300 hover:bg-orange-50/40 cursor-pointer overflow-hidden min-h-[240px]"
                                >
                                    {/* Glow */}
                                    <div className="absolute inset-0 bg-linear-to-br from-orange-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {selectedFile ? (
                                        /* UI STATE: FILE SELECTED */
                                        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm mb-4">
                                                <Check className="w-8 h-8 text-emerald-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-semibold text-[#1A1A1A] text-lg max-w-[250px] truncate">
                                                    {selectedFile.name}
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="mt-4 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                                }}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Remove file
                                            </Button>
                                        </div>
                                    ) : (
                                        /* UI STATE: EMPTY / DROPZONE */
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 border border-orange-200/50 flex items-center justify-center shadow-sm mb-4">
                                                <Upload className="w-7 h-7 text-orange-600" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="font-semibold text-[#1A1A1A] text-lg">
                                                    Drop your file here
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    or click to browse from your computer
                                                </p>
                                                <div className="flex flex-wrap justify-center gap-2 pt-2">
                                                    {["PDF", "DOCX", "TXT", "MD"].map((type) => (
                                                        <div key={type} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                                                            {type}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-400 pt-2">
                                                    Maximum file size: 10MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="mt-8 flex-row justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isUploading}
                            className=" rounded-2xl border-slate-200 hover:bg-slate-50 h-11 px-5">
                            Cancel
                        </Button>

                        <Button
                            onClick={handleUpload}
                            disabled={
                                isUploading ||
                                !documentName.trim() ||
                                !selectedFile
                            }
                            className="rounded-2xl bg-[#1A1A1A] hover:bg-black text-white shadow-lg shadow-black/10 h-11 px-5">
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Document
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

