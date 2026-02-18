"use client";

import { useState } from "react";
import { Search, Plus, Minus, ScanBarcode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function OrderEntry({ onAdd, items = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Filter available items
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (item) => {
        setSelectedItem(item);
        setQuantity(1);
        setSearchTerm(""); // Clear search to focus on selection? Or keep it? keeping it empty for clarity
    };

    const handleAdd = () => {
        if (selectedItem && onAdd) {
            onAdd(selectedItem, quantity);
            setSelectedItem(null);
            setQuantity(1);
        }
    };

    return (
        <Card className="flex flex-col h-full rounded-xl overflow-hidden">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100 flex gap-3 bg-gray-50/50">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        className="pl-9 h-10 bg-white"
                        placeholder="Search for food item..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10">
                    <ScanBarcode className="w-4 h-4 text-gray-600" />
                </Button>
            </div>

            <div className="flex-1 overflow-hidden flex">
                {/* List of Filtered Items */}
                <div className="flex-1 overflow-y-auto p-2 border-r border-gray-100 bg-gray-50/30">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">No items found</div>
                    ) : (
                        <div className="space-y-1">
                            {filteredItems.map(item => (
                                <Button
                                    key={item.id}
                                    variant="ghost"
                                    onClick={() => handleSelect(item)}
                                    className={`w-full justify-between p-3 h-auto font-normal rounded-lg text-sm border border-transparent hover:border-gray-100 ${selectedItem?.id === item.id ? "bg-white shadow-sm border-emerald-100 ring-1 ring-emerald-500/20" : "hover:bg-white hover:shadow-sm"}`}
                                >
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                    <span className="text-gray-500 font-medium">Rs.{item.price.toLocaleString()}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Item Details & Action */}
                <CardContent className="w-1/3 p-4 flex flex-col items-center justify-center text-center pt-4">
                    {selectedItem ? (
                        <div className="space-y-6 w-full">
                            <div>
                                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Selected Item</div>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedItem.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">{selectedItem.category}</p>
                            </div>
                            <div className="py-4 border-y border-dashed border-gray-100 w-full">
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-full"
                                    >
                                        <Minus className="w-4 h-4 text-gray-600" />
                                    </Button>
                                    <span className="text-2xl font-bold w-12">{quantity}</span>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 rounded-full"
                                    >
                                        <Plus className="w-4 h-4 text-gray-600" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400 mb-1">Total Price</div>
                                <div className="text-2xl font-bold text-emerald-600">
                                    Rs.{(selectedItem.price * quantity).toLocaleString()}
                                </div>
                            </div>
                            <Button onClick={handleAdd} className="w-full h-12 text-lg font-bold bg-[#B1464A] hover:bg-[#963c3f]">
                                Add to Order
                            </Button>
                        </div>
                    ) : (
                        <div className="text-gray-300 text-center px-4">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Select an item from the list to view details and add to order</p>
                        </div>
                    )}
                </CardContent>
            </div>
        </Card>
    );
}
