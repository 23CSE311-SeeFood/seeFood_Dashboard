'use client';

import { useState } from 'react';
import { useAuth } from '@/components/global/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Shield, CreditCard, User, Utensils } from 'lucide-react';


export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('operator');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoading(true);

        setTimeout(() => {
            login(selectedRole, email, password);
            setLoading(false);
            alert(`Login Successful!\nRole: ${selectedRole}\nEmail: ${email}\n\n(Dashboard module is currently removed for this baseline)`);
        }, 800);
    };

    const roles = [
        { id: 'admin', label: 'Admin', icon: Shield },
        { id: 'cashier', label: 'Cashier', icon: CreditCard },
        { id: 'operator', label: 'Operator', icon: User },
    ];

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-md border-border/60 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8 pt-8">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                        <Utensils className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Staff Portal</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">Sign in to SeeFood Dashboard</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@seefood.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Role</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 hover:bg-accent/50 ${
                                            selectedRole === role.id
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-transparent bg-secondary text-muted-foreground hover:border-border"
                                        }`}
                                    >
                                        <role.icon className={`h-6 w-6 ${selectedRole === role.id ? "text-primary fill-primary/20" : ""}`} />
                                        <span className="text-xs font-semibold">{role.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full h-12 text-base font-medium mt-6" 
                            size="lg"
                        >
                            {loading ? "Authenticating..." : "Sign in to Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
