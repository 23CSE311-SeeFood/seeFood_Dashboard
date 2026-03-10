"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

export function AddAnnouncementDialog({ open, onOpenChange, onAdd }) {
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        startDate: "",
        endDate: "",
        image: null,
        imagePreview: null,
    });

    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Check 16:9 aspect ratio
                const aspectRatio = img.width / img.height;
                const expectedRatio = 16 / 9;
                const tolerance = 0.05;

                if (Math.abs(aspectRatio - expectedRatio) > tolerance) {
                    setError("Image must have a 16:9 aspect ratio");
                    return;
                }

                setFormData((prev) => ({
                    ...prev,
                    image: file,
                    imagePreview: event.target?.result,
                }));
                setError("");
            };
            img.src = event.target?.result;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.name.trim()) {
            setError("Announcement name is required");
            return;
        }
        if (!formData.url.trim()) {
            setError("URL is required");
            return;
        }
        if (!formData.startDate) {
            setError("Start date is required");
            return;
        }
        if (!formData.endDate) {
            setError("End date is required");
            return;
        }
        if (!formData.imagePreview) {
            setError("Image is required");
            return;
        }

        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        if (endDate < startDate) {
            setError("End date must be after start date");
            return;
        }

        // Add announcement
        onAdd({
            id: Date.now(),
            name: formData.name,
            url: formData.url,
            startDate: formData.startDate,
            endDate: formData.endDate,
            image: formData.imagePreview,
        });

        // Reset form
        setFormData({
            name: "",
            url: "",
            startDate: "",
            endDate: "",
            image: null,
            imagePreview: null,
        });
        setError("");
        onOpenChange(false);
    };

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
            imagePreview: null,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Announcement</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Image (16:9 ratio)</Label>
                        {formData.imagePreview ? (
                            <div className="relative">
                                <img
                                    src={formData.imagePreview}
                                    alt="Preview"
                                    className="w-full rounded-lg border border-gray-200"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">Click to upload image</span>
                                <span className="text-xs text-gray-400 mt-1">Image must be 16:9 ratio</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Announcement Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Announcement Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Campus Festival 2026"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* URL */}
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            name="url"
                            type="url"
                            placeholder="https://example.com"
                            value={formData.url}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#B1464A] hover:bg-[#8f3739]"
                    >
                        Add Announcement
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
