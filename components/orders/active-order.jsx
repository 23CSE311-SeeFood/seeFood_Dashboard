"use client";

import { Trash2, Plus, Minus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export function ActiveOrder({ items = [], onUpdateQty, onRemove }) {
    // Calculated total
    // Mock conversion 15000 for display consistency with OrderEntry if items only have USD price, 
    // but let's assume items coming in might have 'price' in USD, we need consistent currency.
    // OrderEntry had `item.price * 15000`. Let's assume passed items have the base price.

    const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <Card className="w-80 border-l border-gray-100 flex flex-col h-full shadow-sm rounded-none">
            <CardHeader className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-gray-800">New Order</h2>
                <div className="text-xs text-gray-500">{items.length > 0 ? `${items.length} items selected` : "No items selected"}</div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 pt-4">
                {items.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        Cart is empty
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-sm text-gray-800 line-clamp-2">{item.name}</span>
                                <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 h-8 w-8">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-bold text-emerald-600">Rs.{(item.price * item.qty).toLocaleString()}</span>
                                <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200 p-0.5">
                                    <Button variant="ghost" size="icon" onClick={() => onUpdateQty(item.id, -1)} className="h-7 w-7 p-1">
                                        <Minus className="w-3 h-3 text-gray-600" />
                                    </Button>
                                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                                    <Button variant="ghost" size="icon" onClick={() => onUpdateQty(item.id, 1)} className="h-7 w-7 p-1">
                                        <Plus className="w-3 h-3 text-gray-600" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>

            <CardFooter className="p-4 border-t border-gray-100 bg-gray-50/50 flex-col items-stretch">
                <div className="flex justify-between items-center mb-4 w-full">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-lg font-bold text-gray-900">Rs.{total.toLocaleString()}</span>
                </div>
                <Button disabled={items.length === 0} className="w-full bg-[#B1464A] hover:bg-[#963c3f] text-white font-bold h-10 rounded-lg flex items-center gap-2">
                    <span>Place Order</span>
                    <Send className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
