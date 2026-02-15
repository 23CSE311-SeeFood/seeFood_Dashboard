"use client";

import { User, MapPin, Minus, Plus, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card className="w-96 h-full border-l border-gray-100 flex flex-col flex-shrink-0 rounded-none">
            <CardHeader className="p-6 border-b border-gray-50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-gray-800">Cart Details</CardTitle>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                        <TicketPercent className="w-5 h-5" />
                    </Button>
                </div>
                <div className="bg-gray-50 p-1 rounded-xl flex mt-4">
                    <Button variant="secondary" className="flex-1 py-2 bg-white shadow-sm rounded-lg text-sm font-semibold text-gray-800">Dine in</Button>
                    <Button variant="ghost" className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Takeaway</Button>
                    <Button variant="ghost" className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Delivery</Button>
                </div>
                <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Customer information</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            <Input placeholder="Enter name" className="pl-10 bg-gray-50 border-transparent focus:bg-white transition-colors" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Table location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            <Input placeholder="Select table" className="pl-10 bg-gray-50 border-transparent focus:bg-white transition-colors" />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 pt-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Order items</h3>
                    <Button variant="link" className="text-xs text-red-500 font-medium h-auto p-0 hover:underline">Clear all items</Button>
                </div>
                {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">Variant: {item.variant}</p>
                            <p className="text-xs text-gray-400">Addition: {item.addition}</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-sm font-bold text-emerald-600">Rs.{item.price.toLocaleString()}</span>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                    <Button variant="secondary" size="icon" className="w-6 h-6 bg-white shadow-sm rounded text-gray-600 hover:text-gray-900">
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-xs font-bold text-gray-900">{item.qty}</span>
                                    <Button variant="secondary" size="icon" className="w-6 h-6 bg-white shadow-sm rounded text-gray-600 hover:text-gray-900">
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>

            <CardFooter className="p-6 border-t border-gray-50 bg-gray-50/50 flex-col items-stretch">
                <div className="space-y-3 mb-6 w-full">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Sub total</span>
                        <span className="font-medium text-gray-900">Rs.400,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Discount (5%)</span>
                        <span className="font-medium text-red-500">-Rs.25,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Tax (2.6%)</span>
                        <span className="font-medium text-gray-900">-Rs.9,500</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total amount</span>
                        <span>Rs.380,000</span>
                    </div>
                </div>
                <div className="flex gap-3 mb-4 w-full">
                    <Input placeholder="Enter promo code" className="bg-white flex-1" />
                    <Button variant="outline" className="bg-white shrink-0">Apply</Button>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-200">
                    Proceed payment
                </Button>
            </CardFooter>
        </Card>
    );
}
