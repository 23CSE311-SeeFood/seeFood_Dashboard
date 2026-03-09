"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export function AvailabilityModal({ item, onAvailable, onNotAvailable, onClose }) {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <Card className="w-96 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 space-y-6">
                    {/* Item Header */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">ID: {item.id}</p>
                        <p className="text-xl font-semibold text-[#B1464A] mt-2">₹{item.price}</p>
                    </div>

                    {/* Current Status */}
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold uppercase">Current Status</p>
                        <p className={`text-base font-bold mt-1 ${
                            item.available === false ? "text-red-600" : "text-green-600"
                        }`}>
                            {item.available === false ? "Not Available" : "Available"}
                        </p>
                    </div>

                    {/* Action Message */}
                    <p className="text-gray-700 text-center font-medium">
                        Update availability status across the system
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={onAvailable}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Available
                        </Button>
                        <Button
                            onClick={onNotAvailable}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Not Available
                        </Button>
                    </div>

                    {/* Cancel Button */}
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 font-semibold py-2"
                    >
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    );
}
