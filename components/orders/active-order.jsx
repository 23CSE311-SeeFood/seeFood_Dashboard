"use client";

import { useState } from "react";
import { Trash2, Plus, Minus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { createOrder, verifyOrder } from "@/lib/api";
import { useAuth } from "@/components/global/auth-provider";

let razorpayScriptPromise;
const loadRazorpayScript = () => {
    if (razorpayScriptPromise) return razorpayScriptPromise;
    razorpayScriptPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
    return razorpayScriptPromise;
};

export function ActiveOrder({ items = [], onUpdateQty, onRemove, onSuccess }) {
    // Calculated total
    // Mock conversion 15000 for display consistency with OrderEntry if items only have USD price, 
    // but let's assume items coming in might have 'price' in USD, we need consistent currency.
    // OrderEntry had `item.price * 15000`. Let's assume passed items have the base price.

    const { user } = useAuth();
    const [isPaying, setIsPaying] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState("");

    const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const resolveOrderMeta = (data) => {
        if (!data || typeof data !== "object") return {};
        return {
            orderId:
                data.order_id ||
                data.orderId ||
                data.id ||
                data?.order?.id ||
                data?.razorpayOrderId,
            amount: data.amount || data.amount_due || data.amountDue,
            currency: data.currency || "INR",
        };
    };

    const handlePayment = async () => {
        if (items.length === 0 || isPaying) return;
        setPaymentError("");
        setPaymentSuccess("");

        if (user?.role !== "cashier" || !user?.id) {
            setPaymentError("Please log in as a cashier to place orders.");
            return;
        }

        setIsPaying(true);

        try {
            const orderPayload = {
                cashierId: user.id,
                items: items.map((item) => ({
                    canteenItemId: item.id,
                    quantity: item.qty,
                })),
            };

            const orderData = await createOrder(orderPayload);
            const { orderId, amount, currency } = resolveOrderMeta(orderData);

            if (!orderId) {
                throw new Error("Order ID not returned by server.");
            }
            const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!key) {
                throw new Error("Missing Razorpay key. Set NEXT_PUBLIC_RAZORPAY_KEY_ID.");
            }

            const loaded = await loadRazorpayScript();
            if (!loaded || !window.Razorpay) {
                throw new Error("Failed to load Razorpay checkout.");
            }

            const options = {
                key,
                amount: amount ?? Math.round(total * 100),
                currency: currency || "INR",
                name: "SeeFood",
                description: "Canteen order payment",
                order_id: orderId,
                handler: async (response) => {
                    try {
                        await verifyOrder({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        setPaymentSuccess("Payment verified successfully.");
                        if (onSuccess) {
                            onSuccess();
                        }
                    } catch (error) {
                        setPaymentError(error.message || "Payment verification failed.");
                    } finally {
                        setIsPaying(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsPaying(false);
                    },
                },
                theme: {
                    color: "#B1464A",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            setPaymentError(error.message || "Payment failed. Please try again.");
            setIsPaying(false);
        }
    };

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
                <Button
                    disabled={items.length === 0 || isPaying}
                    onClick={handlePayment}
                    className="w-full bg-[#B1464A] hover:bg-[#963c3f] text-white font-bold h-10 rounded-lg flex items-center gap-2"
                >
                    <span>{isPaying ? "Processing..." : "Proceed to Payment"}</span>
                    <Send className="w-4 h-4" />
                </Button>
                {paymentError ? (
                    <div className="text-xs text-red-600 mt-2">{paymentError}</div>
                ) : null}
                {paymentSuccess ? (
                    <div className="text-xs text-emerald-600 mt-2">{paymentSuccess}</div>
                ) : null}
            </CardFooter>
        </Card>
    );
}
