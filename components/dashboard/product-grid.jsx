"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ProductGrid({ items }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [vegFilter, setVegFilter] = useState(null); // null = All, true = Veg, false = Non-Veg

    const defaultProducts = [
        // ... (keep existing mocks if needed, but we rely on props mostly now)
    ];

    const allProducts = items || defaultProducts;

    // Derive unique categories from data
    const categories = ["All", ...new Set(allProducts.map(product => product.category))];

    const products = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesVeg = vegFilter === null || product.veg === vegFilter;
        return matchesSearch && matchesCategory && matchesVeg;
    });

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Product Lists</h2>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setVegFilter(true)}
                            className={`px-6 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${
                                vegFilter === true
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-white border-2 border-green-500 text-green-600 hover:bg-green-50"
                            }`}
                        >
                            <Leaf className="w-4 h-4" />
                            Veg
                        </Button>
                        <Button
                            onClick={() => setVegFilter(false)}
                            className={`px-6 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${
                                vegFilter === false
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-white border-2 border-red-600 text-red-600 hover:bg-red-50"
                            }`}
                        >
                            Non-Veg
                        </Button>
                        <Button
                            onClick={() => setVegFilter(null)}
                            variant="outline"
                            className={`px-6 py-2 rounded-md font-semibold transition-all ${
                                vegFilter === null
                                    ? "bg-gray-800 text-white border-gray-800 hover:bg-gray-900"
                                    : "bg-white border-gray-200 text-gray-600"
                            }`}
                        >
                            All
                        </Button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search for food"
                            className="pl-10 w-full h-10 bg-white border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-10 px-3 bg-white border-gray-200">
                        <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
                {categories.map((cat, idx) => (
                    <Button
                        key={idx}
                        variant={selectedCategory === cat ? "default" : "outline"}
                        onClick={() => setSelectedCategory(cat)}
                        className={`whitespace-nowrap rounded-full ${selectedCategory === cat ? "bg-emerald-600 text-white hover:bg-emerald-700 border-0" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Product Table */}
            <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
                <div className="overflow-y-auto flex-1 p-0">
                    <Table>
                        <TableHeader className="bg-gray-50 text-gray-700 font-semibold sticky top-0 z-10 shadow-sm">
                            <TableRow>
                                <TableHead className="px-6 py-4 w-2/3">Item</TableHead>
                                <TableHead className="px-6 py-4 w-1/3 text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                                    <TableCell className="px-6 py-4 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800 text-base mb-1">{product.name}</span>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs text-gray-500 inline-block bg-gray-100 px-2 py-0.5 rounded-full w-fit">
                                                    {product.category}
                                                </span>
                                                {product.veg ? (
                                                    <span className="text-xs font-semibold text-white bg-green-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Leaf className="w-3 h-3" /> Veg
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-semibold text-white bg-red-600 px-2 py-0.5 rounded-full">
                                                        Non-Veg
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right align-middle">
                                        <span className="font-bold text-emerald-600 text-lg">Rs. {product.price}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
