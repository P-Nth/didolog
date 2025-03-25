export interface IconItem {
    icon: string;
    action: () => void;
    title?: string;
}

export type PinStatus = 'completed' | 'progressing' | 'canceled';