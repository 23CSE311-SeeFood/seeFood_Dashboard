"use client";

import { useEffect, useState } from "react";
import { OrderQueue } from "@/components/dashboard/order-queue";
import { ProductGrid } from "@/components/dashboard/product-grid";
import { getCanteenItems, getCanteens } from "@/lib/api";
import { useAuth } from "@/components/global/auth-provider";

export default function DashboardPage() {
    const [canteens, setCanteens] = useState([]);
    const [selectedCanteenId, setSelectedCanteenId] = useState(null);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        let isActive = true;
        const loadCanteens = async () => {
            try {
                const data = await getCanteens();
                if (!isActive) return;
                const canteenList = Array.isArray(data) ? data : [];
                setCanteens(canteenList);
                const defaultId = user?.canteenId ?? canteenList[0]?.id ?? null;
                if (defaultId) {
                    setSelectedCanteenId(defaultId);
                }
            } catch (error) {
                if (isActive) {
                    setErrorMessage(error.message || "Failed to load canteens.");
                }
            }
        };

        loadCanteens();
        return () => {
            isActive = false;
        };
    }, [user?.canteenId]);

    useEffect(() => {
        let isActive = true;
        if (!selectedCanteenId) return;

        const loadItems = async () => {
            setLoadingItems(true);
            setErrorMessage("");
            try {
                const data = await getCanteenItems(selectedCanteenId);
                if (!isActive) return;
                setItems(Array.isArray(data) ? data : []);
            } catch (error) {
                if (isActive) {
                    setErrorMessage(error.message || "Failed to load items.");
                }
            } finally {
                if (isActive) {
                    setLoadingItems(false);
                }
            }
        };

        loadItems();
        return () => {
            isActive = false;
        };
    }, [selectedCanteenId]);

    return (
        <div className="flex w-full h-full">
            {/* Middle Section */}
            <div className="flex-1 flex flex-col min-w-0 p-8 overflow-hidden">
                {canteens.length > 0 ? (
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                            <p className="text-sm text-gray-500">Overview for the selected canteen.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="dashboard-canteen" className="text-sm text-gray-500">
                                Canteen
                            </label>
                            <select
                                id="dashboard-canteen"
                                value={selectedCanteenId ?? ""}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setSelectedCanteenId(value ? Number(value) : null);
                                }}
                                className="h-10 rounded-md border border-input bg-white px-3 text-sm"
                                disabled={Boolean(user?.canteenId)}
                            >
                                {canteens.map((canteen) => (
                                    <option key={canteen.id} value={canteen.id}>
                                        {canteen.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : null}
                <OrderQueue />
                <div className="flex-1 min-h-0">
                    {errorMessage ? (
                        <div className="text-sm text-red-600 mb-2">{errorMessage}</div>
                    ) : null}
                    <ProductGrid items={items} />
                    {loadingItems ? (
                        <div className="text-xs text-gray-400 mt-2">Loading items...</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
