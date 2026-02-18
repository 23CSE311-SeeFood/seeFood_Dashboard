"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/global/role-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCanteens, registerCashier } from "@/lib/api";

export default function RegisterCashierPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [canteens, setCanteens] = useState([]);
    const [canteenId, setCanteenId] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loadingCanteens, setLoadingCanteens] = useState(false);

    useEffect(() => {
        let isActive = true;
        const loadCanteens = async () => {
            setLoadingCanteens(true);
            try {
                const data = await getCanteens();
                if (!isActive) return;
                setCanteens(Array.isArray(data) ? data : []);
                if (!canteenId && Array.isArray(data) && data.length > 0) {
                    setCanteenId(String(data[0].id));
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

        if (!name || !email || !password || !canteenId) {
            setErrorMessage("All fields are required.");
            return;
        }

        setLoading(true);
        try {
            await registerCashier({
                name,
                email,
                password,
                canteenId: Number(canteenId),
            });
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
                                <div className="space-y-2">
                                    <select
                                        id="cashier-canteen"
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
                            </div>

                            <Button type="submit" disabled={loading || loadingCanteens || !canteenId} className="w-full">
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
