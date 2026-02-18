"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/dashboard/product-grid";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCanteenItems, getCanteens } from "@/lib/api";
import { useAuth } from "@/components/global/auth-provider";

export default function MenuPage() {
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
        <div className="flex w-full h-full p-8 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0 h-full gap-6">
                <div className="flex flex-col gap-4">
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardHeader className="p-0">
                            <CardTitle className="text-2xl text-gray-800">Menu Management</CardTitle>
                            <CardDescription>View and manage items for each canteen</CardDescription>
                        </CardHeader>
                    </Card>

                    {canteens.length > 0 ? (
                        <div className="flex items-center gap-3">
                            <label htmlFor="menu-canteen" className="text-sm text-gray-500">
                                Canteen
                            </label>
                            <select
                                id="menu-canteen"
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
                    ) : null}
                </div>

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
