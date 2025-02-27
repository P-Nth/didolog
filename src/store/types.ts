// src/types.ts
export interface Workspace {
    id: string;
    title: string;
    description: string;
    isDefault?: boolean;
    isComplete?: boolean;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    isDefault?: boolean;
    workspaceId: string;
    isComplete?: boolean;
    colorId?: number;
}

export interface Todo {
    id: string;
    title: string;
    description: string;
    isComplete?: boolean;
    taskId: string ;
    priorityId: number;
    labelIds: string[];
    reminderIds: string[];
    locationId: string;
    dueDate: string | null;
}

export interface Priority {
    id: number;
    title: string;
    description: string;
    isDefault?: boolean;
}

export interface Label {
    id: string;
    title: string;
    description: string;
}

export interface Reminder {
    id: string;
    time: string;
    isDefault?: boolean;
}

export interface Loc {
    id: string;
    title: string;
    description: string;
}

