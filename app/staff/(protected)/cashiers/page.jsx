"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/global/role-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterCashierPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [canteenId, setCanteenId] = useState("1");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!name || !email || !password || !canteenId) {
            setErrorMessage("All fields are required.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${apiBaseUrl}/auth/cashier/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    canteenId: Number(canteenId),
                }),
            });

            if (!response.ok) {
                let message = "Registration failed. Please try again.";
                try {
                    const errorData = await response.json();
                    message = errorData?.message || errorData?.error || message;
                } catch {
                    // ignore parse errors
                }
                throw new Error(message);
            }

            setSuccessMessage("Cashier registered successfully.");
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            setErrorMessage(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleGuard allowedRoles={["admin"]}>
            <div className="flex-1 p-8">
                <Card className="max-w-xl border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Register Cashier</CardTitle>
                        <CardDescription>Create a cashier account with email and password.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="cashier-name">Full Name</Label>
                                <Input
                                    id="cashier-name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Cashier One"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cashier-email">Email</Label>
                                <Input
                                    id="cashier-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="cashier@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cashier-password">Password</Label>
                                <Input
                                    id="cashier-password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Create a password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cashier-canteen">Canteen ID</Label>
                                <Input
                                    id="cashier-canteen"
                                    type="number"
                                    min="1"
                                    value={canteenId}
                                    onChange={(event) => setCanteenId(event.target.value)}
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Registering..." : "Register Cashier"}
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
