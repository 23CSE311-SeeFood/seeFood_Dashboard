const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function fetchJson(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        let message = `Request failed (${response.status}). Please try again.`;
        try {
            const errorData = await response.json();
            message = errorData?.message || errorData?.error || message;
        } catch {
            try {
                const text = await response.text();
                if (text) {
                    message = text;
                }
            } catch {
                // ignore parse errors
            }
        }
        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export function getCanteens() {
    return fetchJson("/canteens");
}

export function getCanteenItems(canteenId) {
    return fetchJson(`/canteens/${canteenId}/items`);
}

export function registerCashier(payload) {
    return fetchJson("/auth/cashier/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function createCanteenItem(canteenId, payload) {
    return fetchJson(`/canteens/${canteenId}/items`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function createOrder(payload) {
    return fetchJson("/orders/create", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function verifyOrder(payload) {
    return fetchJson("/orders/verify", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
