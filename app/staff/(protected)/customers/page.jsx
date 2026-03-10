"use client";

import { RoleGuard } from "@/components/global/role-guard";
import CustomerFeedback from "@/components/customers/customer-feedback";
import { customerFeedback, getAverageRating, getRatingDistribution } from "@/lib/customer-feedback-data";

export default function CustomersPage() {
    const averageRating = getAverageRating();
    const ratingDistribution = getRatingDistribution();

    return (
        <RoleGuard allowedRoles={["admin"]}>
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer Directory</h1>
                    <p className="text-gray-500 mb-8">View customer feedback and ratings from your service</p>

                    <CustomerFeedback 
                        feedback={customerFeedback}
                        averageRating={averageRating}
                        ratingDistribution={ratingDistribution}
                    />
                </div>
            </div>
        </RoleGuard>
    );
}
