"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/global/role-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCanteenItem, getCanteens } from "@/lib/api";

const FOOD_TYPES = ["VEG", "NON_VEG", "EGG"];
const CATEGORIES = ["RICE", "SNACKS", "CURRY", "DESSERT", "DRINKS"];

export default function AddItemPage() {
    const [canteens, setCanteens] = useState([]);
    const [canteenId, setCanteenId] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState("");
    const [foodType, setFoodType] = useState("VEG");
    const [category, setCategory] = useState("RICE");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingCanteens, setLoadingCanteens] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        let isActive = true;
        const loadCanteens = async () => {
            setLoadingCanteens(true);
            try {
                const data = await getCanteens();
                if (!isActive) return;
                const list = Array.isArray(data) ? data : [];
                setCanteens(list);
                if (list.length > 0) {
                    setCanteenId(String(list[0].id));
                }
            } catch (error) {
                if (isActive) {
                    setErrorMessage(error.message || "Failed to load canteens.");
                }
            } finally {
                if (isActive) {
                    setLoadingCanteens(false);
                }
            }
        };

        loadCanteens();
        return () => {
            isActive = false;
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!canteenId || !name || !price || !foodType || !category) {
            setErrorMessage("Canteen, name, price, food type, and category are required.");
            return;
        }

        setLoading(true);
        try {
            await createCanteenItem(Number(canteenId), {
                name,
                price: Number(price),
                rating: rating ? Number(rating) : undefined,
                foodType,
                category,
                imageUrl: imageUrl || null,
            });

            setSuccessMessage("Item created successfully.");
            setName("");
            setPrice("");
            setRating("");
            setFoodType("VEG");
            setCategory("RICE");
            setImageUrl("");
        } catch (error) {
            setErrorMessage(error.message || "Failed to create item.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleGuard allowedRoles={["admin"]}>
            <div className="flex-1 p-8">
                <Card className="max-w-2xl border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Add Food Item</CardTitle>
                        <CardDescription>Select a canteen and create a new menu item.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="item-canteen">Canteen</Label>
                                <select
                                    id="item-canteen"
                                    value={canteenId}
                                    onChange={(event) => setCanteenId(event.target.value)}
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    disabled={loadingCanteens}
                                >
                                    {canteens.length === 0 ? (
                                        <option value="">No canteens available</option>
                                    ) : (
                                        canteens.map((canteen) => (
                                            <option key={canteen.id} value={canteen.id}>
                                                {canteen.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {loadingCanteens ? (
                                    <div className="text-xs text-gray-400">Loading canteens...</div>
                                ) : null}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="item-name">Item Name</Label>
                                <Input
                                    id="item-name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Veg Thali"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="item-price">Price</Label>
                                    <Input
                                        id="item-price"
                                        type="number"
                                        min="0"
                                        value={price}
                                        onChange={(event) => setPrice(event.target.value)}
                                        placeholder="120"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="item-rating">Rating (optional)</Label>
                                    <Input
                                        id="item-rating"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={rating}
                                        onChange={(event) => setRating(event.target.value)}
                                        placeholder="4.2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="item-foodtype">Food Type</Label>
                                    <select
                                        id="item-foodtype"
                                        value={foodType}
                                        onChange={(event) => setFoodType(event.target.value)}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {FOOD_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="item-category">Category</Label>
                                    <select
                                        id="item-category"
                                        value={category}
                                        onChange={(event) => setCategory(event.target.value)}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="item-image">Image URL (optional)</Label>
                                <Input
                                    id="item-image"
                                    value={imageUrl}
                                    onChange={(event) => setImageUrl(event.target.value)}
                                    placeholder="https://cdn.example.com/items/veg-thali.jpg"
                                />
                            </div>

                            <Button type="submit" disabled={loading || loadingCanteens || !canteenId} className="w-full">
                                {loading ? "Creating..." : "Create Item"}
                            </Button>

                            {errorMessage ? (
                                <div className="text-sm text-red-600 text-center">{errorMessage}</div>
                            ) : null}
                            {successMessage ? (
                                <div className="text-sm text-emerald-600 text-center">{successMessage}</div>
                            ) : null}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </RoleGuard>
    );
}
