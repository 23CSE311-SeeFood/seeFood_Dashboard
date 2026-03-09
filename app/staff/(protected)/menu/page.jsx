"use client";

import { useState, useEffect } from "react";
import { menuItems } from "@/lib/menu-data";
import { enrichMenuItems, internalTimeSlots, displayTimeSlots, timeSlotNames } from "@/lib/menu-utils";
import { MenuViewComponent } from "@/components/menu/menu-view-component";
import { OperatorMenuView } from "@/components/menu/operator-menu-view";
import { AvailabilityModal } from "@/components/menu/availability-modal";
import { useAuth } from "@/components/global/auth-provider";
import { useRouter } from "next/navigation";

export default function MenuPage() {
    const { user, isInitialized } = useAuth();
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemAvailability, setItemAvailability] = useState({});

    // Redirect if not authenticated or not authorized
    useEffect(() => {
        if (!isInitialized) return;
        if (!user) {
            router.replace("/staff/login");
            return;
        }
        // Menu is accessible to all roles now (operator, admin, cashier)
    }, [user, isInitialized, router]);

    // Load availability from localStorage on mount (operator only)
    useEffect(() => {
        if (user?.role === "operator") {
            const savedAvailability = localStorage.getItem("menu_item_availability");
            if (savedAvailability) {
                try {
                    setItemAvailability(JSON.parse(savedAvailability));
                } catch (error) {
                    console.warn("Failed to load availability data", error);
                }
            }
        }
    }, [user?.role]);

    // Enrich menu items with veg/non-veg tags
    const enrichedMenuItems = enrichMenuItems(menuItems);

    // Handle availability change (operator only)
    const handleAvailabilityChange = (itemId, isAvailable) => {
        const updatedAvailability = {
            ...itemAvailability,
            [itemId]: isAvailable
        };
        setItemAvailability(updatedAvailability);
        localStorage.setItem("menu_item_availability", JSON.stringify(updatedAvailability));
        setSelectedItem(null);
    };

    // Show loading state
    if (!isInitialized) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    // OPERATOR VIEW - Menu Management with Availability Toggle
    if (user?.role === "operator") {
        return (
            <div className="flex w-full h-full p-8 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 h-full">
                    <OperatorMenuView
                        items={enrichedMenuItems}
                        internalTimeSlots={internalTimeSlots}
                        itemAvailability={itemAvailability}
                        onItemClick={setSelectedItem}
                    />
                </div>

                {/* Availability Modal */}
                {selectedItem && (
                    <AvailabilityModal
                        item={{
                            ...selectedItem,
                            available: itemAvailability[selectedItem.id] !== false
                        }}
                        onAvailable={() => handleAvailabilityChange(selectedItem.id, true)}
                        onNotAvailable={() => handleAvailabilityChange(selectedItem.id, false)}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </div>
        );
    }

    // ADMIN/CASHIER VIEW - Menu View with Filters
    return (
        <div className="flex w-full h-full p-8 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <MenuViewComponent
                    items={enrichedMenuItems}
                    timeSlotNames={timeSlotNames}
                    internalTimeSlots={internalTimeSlots}
                    displayTimeSlots={displayTimeSlots}
                />
            </div>
        </div>
    );
}
