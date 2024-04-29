import { makeAutoObservable } from 'mobx';
import { IUser } from '../models/IUser';
import { IContest } from '../models/IContest';
import { Itasks } from '../models/ITasks';
import DOMPurify from 'dompurify';
import { IUserAnwser } from '../models/IUserAnwser';

export default class Store {
    user = {} as IUser;
    contest = {} as IContest;
    selectedTask: number = 0;
    userAnswser = [] as IUserAnwser[];
    isAuth = false;
    constructor() {
        makeAutoObservable(this);
    }
    setUserAnswer(answers: IUserAnwser[]) {
        this.userAnswser = answers;
    }
    setSelectedTask(task: number) {
        this.selectedTask = task;
    }
    sanitizeHtml = (htmlCode: string) => {
        const sanitizedHtml = DOMPurify.sanitize(htmlCode);
        return { __html: sanitizedHtml };
    };
    getSelectedTask(): Itasks {
        const task = this.contest.tasks.find(
            (task: Itasks) => task.id === this.selectedTask,
        );
        return task as Itasks;
    }
    setContest(contest: IContest) {
        // if (contest.startTime && contest.endTime) {
        //     contest.startTime = this.formatDateToCustomString(
        //         new Date(contest.startTime),
        //     );
        //     contest.endTime = this.formatDateToCustomString(
        //         new Date(contest.endTime),
        //     );
        // } else {
        //     console.error(
        //         'Invalid startTime or endTime in the contest object.',
        //     );
        // }        this.setSelectedTask(contest.tasks[0].id);
        this.contest = contest;
    }
    updateDurationContest(newDuration: string) {
        this.contest.duration = newDuration;
    }
    updateProblemsList(problems: Itasks[]) {
        this.contest.tasks = problems;
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
    setContestTime({
        startTime,
        endTime,
    }: {
        startTime: string;
        endTime: string;
    }): void {
        const startTimeDate: string = this.formatDateToCustomString(
            new Date(startTime),
        );
        const endTimeDate: string = this.formatDateToCustomString(
            new Date(endTime),
        );

        this.contest.startTime = startTimeDate;
        this.contest.endTime = endTimeDate;
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    setUser(user: IUser) {
        this.user = user;
    }

    async logout() {
        try {
            this.setAuth(false);
            this.setUser({} as IUser);
            this.setContest({} as IContest);
        } catch (e) {
            console.log(e);
        }
    }
}
