export interface IconItem {
    icon: string; // Iconify icon name (e.g., "mdi:plus")
    action: () => void;
    title?: string;
}