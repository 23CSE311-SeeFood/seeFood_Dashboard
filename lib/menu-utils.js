// Utility function to determine if an item is vegetarian
export function isVegetarian(itemName) {
    const nonVegKeywords = [
        "egg",
        "chicken",
        "fish",
        "meat",
        "mutton",
        "prawn",
        "seafood",
        "biryani", // Most biryani have meat unless explicitly veg
    ];

    const vegKeywords = [
        "vegetable",
        "veg",
        "paneer",
        "dosa",
        "idli",
        "uttapam",
        "sambar",
        "rasam",
        "dal",
        "paruppu",
        "avial",
        "kootu",
        "poriyal",
        "curry",
        "samosa",
        "pakora",
        "bonda",
        "vada",
        "appam",
        "idiyappam",
        "pongal",
        "upma",
        "rice",
        "payasam",
        "kesari",
        "filter coffee",
        "tea",
        "lassi",
        "buttermilk",
        "milk",
    ];

    const lowerName = itemName.toLowerCase();

    // Check non-veg keywords first
    for (const keyword of nonVegKeywords) {
        if (lowerName.includes(keyword)) {
            // Exception for "Vegetable Biryani"
            if (keyword === "biryani" && lowerName.includes("vegetable")) {
                return true;
            }
            return false;
        }
    }

    // If no non-veg keyword found, it's vegetarian
    return true;
}

// Add veg/non-veg property to menu items
export function enrichMenuItems(items) {
    return items.map((item) => ({
        ...item,
        isVeg: isVegetarian(item.name),
    }));
}

// Map time slots to display names
export const timeSlotNames = {
    Morning: "Breakfast",
    Afternoon: "Lunch",
    Evening: "Snacks",
    Night: "Dinner",
};

export const displayTimeSlots = ["Breakfast", "Lunch", "Snacks", "Dinner"];
export const internalTimeSlots = ["Morning", "Afternoon", "Evening", "Night"];
