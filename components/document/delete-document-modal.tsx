"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DeleteDocumentModalProps } from "@/types";
import { Loader2, Trash2, X } from "lucide-react";

export default function DeleteDocumentModal({
    open,
    onOpenChange,
    onConfirm,
    isDeleting = false,
    documentName,
}: DeleteDocumentModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-105 overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl shadow-slate-200/40">

                {/* Close Button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:text-slate-900"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="p-6 sm:p-7">
                    <AlertDialogHeader className="items-center space-y-5 text-center">

                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                                Delete Document?
                            </AlertDialogTitle>

                            <AlertDialogDescription className="mx-auto max-w-sm text-sm leading-relaxed text-slate-500">
                                This action is permanent and cannot be undone.
                            </AlertDialogDescription>

                            {documentName && (
                                <div className="mt-3 inline-flex max-w-full items-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs break-all">
                                    {documentName}
                                </div>
                            )}

                            <p className="text-sm text-slate-500">
                                The document will be permanently removed from your workspace.
                            </p>
                        </div>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 
                            transition-all hover:bg-slate-100 hover:text-slate-900 focus:ring-1 focus:ring-slate-200 disabled:pointer-events-none disabled:opacity-50"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirm();
                            }}
                            disabled={isDeleting}
                            className="h-11 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm shadow-rose-500/10 
                            transition-all hover:bg-rose-500 active:scale-[0.98] focus:ring-1 focus:ring-rose-500/20 disabled:pointer-events-none disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    Delete Document
                                </span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

