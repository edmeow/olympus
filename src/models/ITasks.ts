export interface Itasks {
    id: number;
    task: string;
    points: number;
    htmlName: string;
    name: string | null;
    taskId: number;
}

export type ItasksList = Itasks[];
