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
import { cn } from "@/lib/utils";

export default function DocumentUploadDialog({ children, onUploadSuccess }: DocumentUploadDialogProps) {
    const { organization } = useOrganization();
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
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
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        processFile(file);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.currentTarget === e.target) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];

        if (!file) return;

        processFile(file);
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

        formData.append("name", documentName.trim());
        formData.append("organizationId", organization.id);
        formData.append("file", selectedFile);

        try {
            const response = await fetch("/api/documents", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            toast.success("Document uploaded successfully!");

            // Refresh documents list
            await onUploadSuccess?.();

            // Reset state
            setDocumentName("");
            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setIsOpen(false);
        } catch (error) {
            console.error("Upload error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Upload failed"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsOpen(open);

        if (!open) {
            setDocumentName("");
            setSelectedFile(null);
            setIsDragging(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                {children}

            </DialogTrigger>

            <DialogContent className="sm:max-w-140 border-white/40 bg-white/80 backdrop-blur-2xl rounded-[32px] p-0 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
                aria-describedby="upload-document-description">
                {/* Close */}
                <DialogClose
                    className="absolute right-4 sm:right-6 top-4 sm:top-6 z-50 rounded-full p-2 opacity-70 transition-opacity disabled:pointer-events-none
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-700"
                    aria-label="Close upload dialog"
                >
                    <X className="h-5 w-5 text-slate-800 hover:text-slate-600" aria-hidden="true" />
                </DialogClose>

                {/* Glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40" />
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-100 rounded-full blur-3xl opacity-30" />
                </div>

                <div className="relative z-10 p-5 sm:p-6 lg:p-8">
                    {/* Header */}
                    <DialogHeader className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-orange-100 to-orange-50 border border-orange-200/50 flex 
                            items-center justify-center shadow-sm shrink-0" aria-hidden="true">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                            </div>

                            <div className="min-w-0">
                                <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-strong wrap-break-word">
                                    Upload Document
                                </DialogTitle>

                                <DialogDescription id="upload-document-description" className="text-slate-500 mt-1 text-sm sm:text-base leading-relaxed">
                                    Add documents to generate AI-powered insights and summaries.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="mt-6 sm:mt-8 space-y-6">
                        {/* Name */}
                        <div className="space-y-3">
                            <label htmlFor="document-name" className="text-sm font-medium text-slate-700 pl-1">
                                Document Name
                            </label>

                            <Input
                                id="document-name"
                                placeholder="Enter document name"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                disabled={isUploading}
                                className="h-11 rounded-2xl border-slate-200 bg-white/80 px-4 text-[15px] shadow-sm transition-all focus-visible:ring-1 
                                focus-visible:ring-offset-1 focus-visible:ring-orange-400 focus-visible:border-orange-200
                                 focus-visible:shadow-[0_0_0_4px_rgba(251,146,60,0.08)]"
                                aria-label="Document name"
                            />
                        </div>

                        {/* Upload Box */}
                        <div className="space-y-3">
                            <label htmlFor="file-upload" className="text-sm font-medium text-slate-700">
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
                                    aria-label="Choose document file"
                                />

                                <label
                                    htmlFor="file-upload"
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className={cn(
                                        "group relative flex flex-col items-center justify-center gap-4 rounded-[28px] border-2 border-dashed px-5 sm:px-6 py-8 sm:py-10 text-center transition-all duration-300 cursor-pointer overflow-hidden min-h-52 sm:min-h-60",
                                        isDragging
                                            ? "border-orange-500 bg-orange-50 shadow-[0_0_0_4px_rgba(251,146,60,0.12)]"
                                            : "border-slate-200 bg-white/60 hover:border-orange-300 hover:bg-orange-50/40"
                                    )}
                                >
                                    {/* Glow */}
                                    <div className="absolute inset-0 bg-linear-to-br from-orange-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-hidden="true" />

                                    {selectedFile ? (
                                        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm mb-4"
                                                aria-hidden="true">
                                                <Check className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
                                            </div>

                                            <div className="space-y-1">
                                                <div className="font-semibold text-strong text-base sm:text-lg max-w-52 sm:max-w-62.5 truncate">
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
                                                className="mt-4 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-red-500"
                                                onClick={handleRemoveFile}
                                                aria-label="Remove selected file"
                                            >
                                                <X className="w-4 h-4 mr-2 shrink-0" aria-hidden="true" />
                                                Remove file
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className={cn(
                                                "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center shadow-sm mb-4 transition-all duration-300",
                                                isDragging
                                                    ? "bg-orange-100 border-orange-400 scale-110"
                                                    : "bg-linear-to-br from-orange-100 to-orange-50 border-orange-200/50"
                                            )}
                                                aria-hidden="true">
                                                <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="font-semibold text-strong text-base sm:text-lg">
                                                    {isDragging ? "Release to upload" : "Drag & drop your file here"}
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    or click to browse from your computer
                                                </p>

                                                <div className="flex flex-wrap justify-center gap-2 pt-2">
                                                    {["PDF", "DOCX", "TXT", "MD", "DOC"].map((type) => (
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
                    <DialogFooter className="mt-6 sm:mt-8 flex-col-reverse sm:flex-row justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isUploading}
                            className="w-full sm:w-auto rounded-2xl border-slate-200 hover:bg-slate-50 h-11 px-5 focus-visible:ring-1
                             focus-visible:ring-offset-1 focus-visible:ring-slate-400"
                            aria-label="Cancel document upload"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleUpload}
                            disabled={isUploading || !documentName.trim() || !selectedFile}
                            className="w-full sm:w-auto rounded-2xl bg-strong hover:bg-strong-dark text-white shadow-lg shadow-black/10 h-11 px-5
                             focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900"
                            aria-label={isUploading ? "Uploading document" : "Upload document"}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin shrink-0" aria-hidden="true" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
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