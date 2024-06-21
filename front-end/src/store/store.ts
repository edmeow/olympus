import { makeAutoObservable } from 'mobx';
import { IUser } from '../models/IUser';
import { IContest } from '../models/IContest';
import { Itasks } from '../models/ITasks';
import DOMPurify from 'dompurify';
import { IUserAnwser } from '../models/IUserAnwser';
import { IUserResults } from '../models/IUserResult';
import { ContestsStatesEnum } from '../models/constants/ContestsStatesEnum';

export default class Store {
    user = {} as IUser;
    contest = {} as IContest;
    selectedTask: number = 0;
    selectedComment: string = '';
    userAnswser = [] as IUserAnwser[];
    isAuth = false;
    userResults: IUserResults = {
        users: [],
        tasksCount: 0,
    };

    constructor() {
        makeAutoObservable(this);
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
        // }
        if (contest.tasks.length) {
            this.setSelectedTask(contest.tasks[0].id);
        }
        this.contest = contest;
    }

    updateDurationContest(newDuration: string) {
        this.contest.duration = newDuration;
    }

    updateProblemsList(problems: Itasks[]) {
        this.contest.tasks = problems;
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
        const startTimeDate: string = this.formatDateToCustomString(
            new Date(startTime),
        );
        const endTimeDate: string = this.formatDateToCustomString(
            new Date(endTime),
        );

        this.contest.startTime = startTimeDate;
        this.contest.endTime = endTimeDate;

        this.contest.state = ContestsStatesEnum.IN_PROGRESS;
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
