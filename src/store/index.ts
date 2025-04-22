import { makeAutoObservable } from 'mobx';
import { IUser } from '../models/IUser';
import { IContest } from '../models/IContest';
import DOMPurify from 'dompurify';
import { IUserAnwser } from '../models/IUserAnwser';
import { IUserResults } from '../models/IUserResult';
import { ContestsStatesEnum } from '../models/constants/ContestsStatesEnum';
import { selectedViewContentType } from '../models/selectedContentModel';
import { createContext } from 'react';
import ITask from '../models/ITask';

class MainStore {
    user = {} as IUser;
    contest = {} as IContest;
    selectedTask: number = 0;
    selectedComment: string = '';
    userAnswser = [] as IUserAnwser[];
    isAuth = false;
    userResults: IUserResults = {
        groups: [],
        tasksCount: 0,
    };
    selectedViewContent: selectedViewContentType = 'answers';

    constructor() {
        makeAutoObservable(this);
    }

    setSelectedViewContent(selectedViewContent: selectedViewContentType) {
        this.selectedViewContent = selectedViewContent;
    }

    setUserAnswer(answers: IUserAnwser[]) {
        this.userAnswser = answers;
    }

    setUserResults(results: IUserResults) {
        this.userResults = results;
    }

    updateUserAnswer(answer: IUserAnwser) {
        const index = this.userAnswser.findIndex(
            (item) => item.id === answer.id,
        ); // находим индекс элемента по ID
        this.userAnswser[index] = answer;
    }

    setSelectedTask(task: number) {
        this.selectedTask = task;
    }

    setSelectedComment(task: string) {
        this.selectedComment = task;
    }

    sanitizeHtml = (htmlCode: string) => {
        const sanitizedHtml = DOMPurify.sanitize(htmlCode);

        return { __html: sanitizedHtml };
    };

    getSelectedTask(): ITask {
        const task = this.contest.tasks.find(
            (task: ITask) => task.id === this.selectedTask,
        );
        return task as ITask;
    }

    getSelectedTaskId(): number {
        const task = this.contest.tasks.find(
            (task: ITask) => task.id === this.selectedTask,
        );
        if (task && task.taskId) {
            return task.taskId;
        }
        return 0;
    }

    setContest(contest: IContest) {
        if (contest.tasks.length) {
            this.setSelectedTask(contest.tasks[0].id);
        }
        this.contest = contest;
    }

    updateDurationContest(newDuration: string) {
        this.contest.duration = newDuration;
    }

    updateProblemsList(problems: ITask[]) {
        this.contest.tasks = problems;
    }

    addTask(task: ITask) {
        if (Array.isArray(this.contest.tasks)) this.contest.tasks.push(task);
        else this.contest.tasks = [task];
    }

    getStartTime() {
        const startTime = this.contest.startTime;
        if (startTime) {
            return this.formatDateToCustomString(new Date(startTime));
        }
        return null;
    }

    getEndTime() {
        const endTime = this.contest.endTime;
        if (endTime) {
            return this.formatDateToCustomString(new Date(endTime));
        }
        return null;
    }

    private formatDateToCustomString(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            minute: 'numeric',
            hour: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };

        return new Intl.DateTimeFormat('ru-RU', options).format(date);
    }

    startContest({
        startTime,
        endTime,
    }: {
        startTime: string;
        endTime: string;
    }): void {
        this.contest.startTime = startTime;
        this.contest.endTime = endTime;

        this.contest.state = ContestsStatesEnum.IN_PROGRESS;
    }

    renameContest(name: string) {
        this.contest.name = name;
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    logout() {
        try {
            this.setAuth(false);
            this.setUser({} as IUser);
            this.setContest({} as IContest);
        } catch (e) {
            console.log(e);
        }
    }
}

const main = new MainStore();

export const StoreContext = createContext({ main });

export default main;