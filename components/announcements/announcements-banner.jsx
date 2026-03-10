"use client";

import { Card } from "@/components/ui/card";
import { Calendar, Link as LinkIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnnouncementsBanner({ announcements, onDelete }) {
    if (announcements.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No announcements yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {announcements.map((announcement) => (
                <Card
                    key={announcement.id}
                    className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
                            <img
                                src={announcement.image}
                                alt={announcement.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{announcement.name}</h3>

                                {/* Dates */}
                                <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(announcement.startDate).toLocaleDateString()} - {new Date(announcement.endDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* URL */}
                                    <div className="flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" />
                                        <a
                                            href={announcement.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline truncate"
                                        >
                                            {announcement.url}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Button */}
                            {onDelete && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(announcement.id)}
                                    className="w-fit"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
