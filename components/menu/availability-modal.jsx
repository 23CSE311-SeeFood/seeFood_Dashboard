"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";

export function AvailabilityModal({ item, onAvailable, onNotAvailable, onClose }) {
    const isOpen = !!item;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-sm w-full">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="break-words text-base">{item?.name}</DialogTitle>
                    <DialogDescription className="text-xs">
                        ID: {item?.id} • ₹{item?.price}
                    </DialogDescription>
                </DialogHeader>

                {item && (
                    <>
                        <div className="space-y-4 py-2">
                            {/* Current Status */}
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="text-xs text-gray-600 font-semibold uppercase">Current Status</p>
                                <p className={`text-sm font-bold mt-2 ${
                                    item.available === false ? "text-red-600" : "text-green-600"
                                }`}>
                                    {item.available === false ? "Not Available" : "Available"}
                                </p>
                            </div>

                            {/* Action Message */}
                            <p className="text-gray-700 text-center text-sm font-medium">
                                Update availability status
                            </p>
                        </div>

                        <DialogFooter className="flex flex-col gap-2">
                            <div className="flex gap-2 w-full">
                                <Button
                                    onClick={onAvailable}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 h-auto rounded-md flex items-center justify-center gap-2 text-sm"
                                >
                                    <Check className="w-4 h-4" />
                                    Available
                                </Button>
                                <Button
                                    onClick={onNotAvailable}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 h-auto rounded-md flex items-center justify-center gap-2 text-sm"
                                >
                                    <X className="w-4 h-4" />
                                    Not Available
                                </Button>
                            </div>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="w-full border-gray-300 text-gray-700 font-semibold py-2 h-auto text-sm"
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
