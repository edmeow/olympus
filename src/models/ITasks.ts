export interface Itasks {
    id: number;
    session: number;
    task: string;
    points: number;
    htmlName: string;
    name: string | null;
    taskId: number;
}

export type ItasksList = Itasks[];
