"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FoodItemManagement({ initialItems = [] }) {
    const [items, setItems] = useState(initialItems);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        quantity: "",
        category: "",
        description: "",
        available: true,
    });

    const categories = ["Food", "Beverages", "Desserts", "Snacks"];

    // Save items to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("food_items", JSON.stringify(items));
    }, [items]);

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            name: "",
            price: "",
            quantity: "",
            category: "",
            description: "",
            available: true,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            price: item.price,
            quantity: item.quantity || "",
            category: item.category,
            description: item.description || "",
            available: item.available !== false,
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.price || !formData.quantity || !formData.category) {
            alert("Please fill in all required fields");
            return;
        }

        if (editingId) {
            // Update existing item
            setItems(items.map(item =>
                item.id === editingId
                    ? { ...item, ...formData }
                    : item
            ));
        } else {
            // Add new item
            const newItem = {
                id: Date.now(),
                ...formData,
                price: parseFloat(formData.price),
            };
            setItems([...items, newItem]);
        }

        setIsDialogOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Food Item Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Add, edit, or delete food items from the menu</p>
                    </div>
                    <Button
                        onClick={handleAddNew}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Item
                    </Button>
                </div>

                {/* Items Grid */}
                {items.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-gray-500 text-lg">No food items yet. Create your first item to get started.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <Card key={item.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{item.name}</CardTitle>
                                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                        </div>
                                        <Badge variant={item.available ? "default" : "destructive"}>
                                            {item.available ? "Available" : "Unavailable"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {item.description && (
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    )}
                                    <div className="flex justify-between items-baseline gap-2">
                                        <div className="text-xl font-bold text-[#B1464A]">₹{item.price}</div>
                                        <div className="text-sm text-gray-600">({item.quantity})</div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={() => handleEdit(item)}
                                            variant="outline"
                                            className="flex-1 flex items-center justify-center gap-2"
                                        >
                                            <Edit2 size={16} />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(item.id)}
                                            variant="destructive"
                                            className="flex-1 flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? "Edit Food Item" : "Add New Food Item"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingId ? "Update the item details below" : "Fill in the details to add a new food item"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Item Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Item Name *</label>
                            <Input
                                name="name"
                                placeholder="e.g., Butter Chicken"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                            <Input
                                name="price"
                                type="number"
                                placeholder="e.g., 250"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="mt-1"
                                step="0.01"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Quantity *</label>
                            <Input
                                name="quantity"
                                type="text"
                                placeholder="e.g., 1 piece, 2 pcs, 500ml, 1 cup"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="mt-1"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                placeholder="Add item description (optional)"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                rows="3"
                            />
                        </div>

                        {/* Availability Toggle */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="available"
                                id="available"
                                checked={formData.available}
                                onChange={handleInputChange}
                                className="rounded"
                            />
                            <label htmlFor="available" className="text-sm font-medium text-gray-700">
                                Available for sale
                            </label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                            {editingId ? "Update Item" : "Add Item"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
