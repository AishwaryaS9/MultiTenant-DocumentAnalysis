"use client"

import React, { useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { useOrganization, useUser } from "@clerk/nextjs";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { allowedTypes } from "@/app/data/data";

interface DocumentUploadDialogProps {
    onUploadSuccess?: () => void;
    trigger?: React.ReactNode;
}

export default function DocumentUploadDialog({ onUploadSuccess, trigger }: DocumentUploadDialogProps) {

    const { organization } = useOrganization();
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            formData.append("file", selectedFile)
        }
        try {
            const response = await fetch("/api/documents", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                toast.success("Document uploaded successfully!");

                //Reset form
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
    }

    // Reset form when dialog closes
    const handleDialogOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Reset form state
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
                    <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="sm:max-w-125">
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>Upload a file for analysis</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Document name *
                        </label>
                        <Input placeholder="Enter document name"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            disabled={isUploading} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Upload File
                        </label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                            <input type="file" ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".txt, .pdf, .doc, .docx, .md"
                                className="hidden"
                                id="file-upload"
                                disabled={isUploading} />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-8 w-8 text-gray-500" />
                                    <span className="font-medium">{selectedFile ? selectedFile.name : "Click to select file"}</span>
                                    <span className="text-sm text-gray-500">
                                        Supports: .txt, .pdf, .doc, .docx, .md (Max  10MB)
                                    </span>
                                    {selectedFile && (
                                        <Button type="button" variant="ghost" size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }
                                            }}>
                                            <X className="h-3 w-3 mr-1" />
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={isUploading || !documentName.trim()}>
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
            </DialogContent>

        </Dialog>
    )
}