import { menuItems } from "./menu-data";

/**
 * Get merged menu items from both original data and newly added items from localStorage
 */
export const getMergedMenuItems = () => {
    try {
        const newItems = localStorage.getItem("food_items");
        const parsedNewItems = newItems ? JSON.parse(newItems) : [];
        
        // Merge: original items + newly added items
        const merged = [...menuItems, ...parsedNewItems];
        
        // Remove duplicates by id
        const uniqueItems = Array.from(new Map(merged.map(item => [item.id, item])).values());
        
        return uniqueItems;
    } catch (error) {
        console.warn("Failed to get merged menu items", error);
        return menuItems;
    }
};

/**
 * Get newly added items only
 */
export const getNewlyAddedItems = () => {
    try {
        const newItems = localStorage.getItem("food_items");
        return newItems ? JSON.parse(newItems) : [];
    } catch (error) {
        console.warn("Failed to get newly added items", error);
        return [];
    }
};
