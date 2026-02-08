"use client";

import { User, MapPin, Trash2, Minus, Plus, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CartPanel() {
    const cartItems = [
        {
            id: 1,
            name: "Thai hot seafood",
            variant: "Medium",
            addition: "Lemon",
            price: 250000,
            qty: 3,
            image: "https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            name: "Shrimp fried spicy sauce",
            variant: "Medium",
            addition: "Lemon",
            price: 150000,
            qty: 2,
            image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=400&q=80"
        }
    ];

    return (
        <div className="w-96 bg-white h-full border-l border-gray-100 flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-gray-50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Cart Details</h2>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <TicketPercent className="w-5 h-5" />
                    </button>
                </div>

                {/* Type Selector */}
                <div className="bg-gray-50 p-1 rounded-xl flex mb-6">
                    <button className="flex-1 py-2 bg-white shadow-sm rounded-lg text-sm font-semibold text-gray-800">Dine in</button>
                    <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Takeaway</button>
                    <button className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Delivery</button>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Customer information</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Enter name" className="pl-10 bg-gray-50 border-transparent focus:bg-white transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Table location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Select table" className="pl-10 bg-gray-50 border-transparent focus:bg-white transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Order items</h3>
                    <button className="text-xs text-red-500 font-medium hover:underline">Clear all items</button>
                </div>

                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">Variant: {item.variant}</p>
                            <p className="text-xs text-gray-400">Addition: {item.addition}</p>

                            <div className="flex items-center justify-between mt-3">
                                <span className="text-sm font-bold text-emerald-600">Rp.{item.price.toLocaleString()}</span>

                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                    <button className="w-6 h-6 flex items-center justify-center bg-white shadow-sm rounded text-gray-600 hover:text-gray-900"><Minus className="w-3 h-3" /></button>
                                    <span className="text-xs font-bold text-gray-900">{item.qty}</span>
                                    <button className="w-6 h-6 flex items-center justify-center bg-white shadow-sm rounded text-gray-600 hover:text-gray-900"><Plus className="w-3 h-3" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 bg-gray-50/50">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Sub total</span>
                        <span className="font-medium text-gray-900">Rp.400,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Discount (5%)</span>
                        <span className="font-medium text-red-500">-Rp.25,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Tax (2.6%)</span>
                        <span className="font-medium text-gray-900">-Rp.9,500</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total amount</span>
                        <span>Rp.380,000</span>
                    </div>
                </div>

                <div className="flex gap-3 mb-4">
                    <Input placeholder="Enter promo code" className="bg-white" />
                    <Button variant="outline" className="bg-white">Apply</Button>
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-200">
                    Proceed payment
                </Button>
            </div>
        </div>
    );
}
