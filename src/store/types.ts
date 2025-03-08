// src/types.ts
export interface Workspace {
    id: string;
    title: string;
    description: string;
    isDefault?: boolean;
    isComplete?: boolean;
    colorId?: number;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    isDefault?: boolean;
    workspaceId: string;
    isComplete?: boolean;
    access?: string;
    colorId?: string;
    viewId?: string;
    sections: Section[];
}

export type Section = {
    id: string;
    title: string;
    taskId?: string;
};

export type Note = {
    id: string;
    title: string;
    taskId?: string;
    sectionId?: string;
};

export interface Todo {
    id: string;
    title: string;
    description: string;
    taskId?: string ;
    sectionId?: string ;
    dueDate: [string, string];
    priorityId: number;
    labelIds: string[];
    reminderIds: string[];
    locationId: string;
    isComplete?: boolean;
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
    title: string;
    isDefault?: boolean;
}

export interface Loc {
    id: string;
    title: string;
    description: string;
}

