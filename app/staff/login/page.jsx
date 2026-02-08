'use client';

import { useState } from 'react';
import { useAuth } from '@/components/global/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CreditCard, User } from 'lucide-react';


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
        <div className="flex min-h-screen w-full">
            {/* Left Panel - Red */}
            <div className="hidden lg:flex w-1/2 bg-[#B1464A] p-12 flex-col justify-between relative overflow-hidden">
                <div className="z-10">
                    <h1 className="text-4xl font-black text-white tracking-widest uppercase">SEEFOOD</h1>
                </div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl rounded-tr-none"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-black/5 blur-3xl rounded-full"></div>
            </div>

            {/* Right Panel - White/Light */}
            <div className="flex-1 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 border border-gray-300 rounded-xl p-10 shadow-lg bg-gray-50/50">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-black uppercase tracking-wider">Staff Login</h2>
                        <p className="text-sm text-gray-400">Enter your credentials to access the ops dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 mt-8">
                        {/* Inputs: Email & Password */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-600 font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="EMAIL"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-14 bg-white border border-gray-200 text-black placeholder:text-gray-400 text-lg px-6 rounded-md focus-visible:ring-2 focus-visible:ring-[#B1464A]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-600 font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-14 bg-white border border-gray-200 text-black placeholder:text-gray-400 text-lg px-6 rounded-md focus-visible:ring-2 focus-visible:ring-[#B1464A]"
                                />
                            </div>
                        </div>

                        {/* Role Selector */}
                        <div className="grid grid-cols-3 gap-3">
                            {roles.map((role) => (
                                <Button
                                    key={role.id}
                                    type="button"
                                    variant={selectedRole === role.id ? "default" : "outline"}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`h-24 flex flex-col gap-2 rounded-md transition-all ${
                                        selectedRole === role.id
                                            ? "bg-[#B1464A] text-white border-[#B1464A] shadow-md scale-105 hover:bg-[#A04144]"
                                            : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                                    }`}
                                >
                                    <role.icon className="h-6 w-6" />
                                    <span className="text-xs font-bold uppercase">{role.label}</span>
                                </Button>
                            ))}
                        </div>


                        <Button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full h-14 bg-[#BD6467] hover:bg-[#A04144] text-white font-bold text-lg rounded-md mt-4 transition-transform active:scale-95 shadow-md"
                        >
                            {loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
