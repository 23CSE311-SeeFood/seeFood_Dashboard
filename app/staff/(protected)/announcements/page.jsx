"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/global/role-guard";
import { AnnouncementsBanner } from "@/components/announcements/announcements-banner";
import { AddAnnouncementDialog } from "@/components/announcements/add-announcement-dialog";
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleAddAnnouncement = (newAnnouncement) => {
        setAnnouncements((prev) => [newAnnouncement, ...prev]);
    };

    const handleDeleteAnnouncement = (id) => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <RoleGuard allowedRoles={["admin"]}>
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-5xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Bell className="w-8 h-8 text-[#B1464A]" />
                                <h1 className="text-3xl font-bold text-gray-800">Announcements & Events</h1>
                            </div>
                            <p className="text-gray-500">
                                Manage and display announcements for campus events and promotions
                            </p>
                        </div>
                        <Button
                            onClick={() => setDialogOpen(true)}
                            className="bg-[#B1464A] hover:bg-[#8f3739] flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Announcement
                        </Button>
                    </div>

                    {/* Announcements List */}
                    <AnnouncementsBanner
                        announcements={announcements}
                        onDelete={handleDeleteAnnouncement}
                    />

                    {/* Stats */}
                    {announcements.length > 0 && (
                        <div className="mt-12 grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Total Announcements</p>
                                <p className="text-2xl font-bold text-[#B1464A] mt-2">{announcements.length}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Active Now</p>
                                <p className="text-2xl font-bold text-[#B1464A] mt-2">
                                    {announcements.filter(
                                        (a) => new Date() >= new Date(a.startDate) &&
                                               new Date() <= new Date(a.endDate)
                                    ).length}
                                </p>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Upcoming</p>
                                <p className="text-2xl font-bold text-[#B1464A] mt-2">
                                    {announcements.filter(
                                        (a) => new Date(a.startDate) > new Date()
                                    ).length}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Announcement Dialog */}
                <AddAnnouncementDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onAdd={handleAddAnnouncement}
                />
            </div>
        </RoleGuard>
    );
}
