import "./globals.css";
import { AuthProvider } from "@/components/global/auth-provider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// Metadata for the application, used for SEO and browser tab title
export const metadata = {
    title: "SeeFood Staff Operations",
    description: "Cafeteria Management System",
};

// Root layout component - Wraps all pages in the application
export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
