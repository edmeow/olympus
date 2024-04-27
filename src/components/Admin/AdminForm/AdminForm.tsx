import React, { ChangeEvent, FormEvent, useState } from 'react';
import './AdminForm.scss';
import AdminService from '../../../services/AdminService';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface AdminFormProps {
    setView: React.Dispatch<React.SetStateAction<any>>;
}

const AdminForm: React.FC<AdminFormProps> = () => {
    const [session, setSession] = useState<string>('');
    const [nameContest, setNameContest] = useState<string>('');
    const [participantCount, setParticipantCount] = useState<string>('');
    const [judgeCount, setJudgeCount] = useState<string>('');
    const [prefix, setPrefix] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [problems, setProblems] = useState<string[]>([]);
    const history = useNavigate();
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        const files = event.target.files;

        if (files) {
            // Читаем содержимое каждого файла и обновляем состояние
            const newproblems: string[] = [];
            for (let i = 0; i < files.length; i++) {
                fileReader.readAsText(files[i]);
                await new Promise<void>((resolve) => {
                    fileReader.onloadend = () => {
                        if (fileReader.result) {
                            newproblems.push(fileReader.result.toString());
                        }
                        resolve();
                    };
                });
            }
            setProblems(newproblems);
        }
    };

    function onChange(
        e: ChangeEvent<HTMLInputElement>,
        setFunction: React.Dispatch<React.SetStateAction<any>>,
    ) {
        setFunction(e.currentTarget.value);
    }
    function onSubmit(e: FormEvent) {
        e.preventDefault();
        AdminService.createContest(
            session,
            nameContest,
            participantCount,
            judgeCount,
            prefix,
            duration,
            problems,
        )
            .then((res) => {
                const base64String = res.data.fileContent;

                const binaryData = atob(base64String);
                const byteArray = new Uint8Array(binaryData.length);
                for (let i = 0; i < binaryData.length; i++) {
                    byteArray[i] = binaryData.charCodeAt(i);
                }
                const link = document.createElement('a');
                link.href = `data:application/octet-stream;base64,${base64String}`;
                link.download = 'contest_info.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })

            .catch((err: AxiosError) => {
                console.log(err);
            })
            .finally(() => {
                history(`/admin/contest/${session}`);
            });
    }

    return (
        <div className="AdminForm_сontainer">
            <form
                className="adminForm"
                onSubmit={onSubmit}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <h1>Create contest</h1>
                <label>
                    Session Id
                    <input
                        placeholder="Session Id"
                        value={session}
                        onChange={(e) => onChange(e, setSession)}
                    ></input>
                </label>
                <label>
                    Name contest
                    <input
                        placeholder="Name contest"
                        value={nameContest}
                        onChange={(e) => onChange(e, setNameContest)}
                    ></input>
                </label>
                <label>
                    Count participant
                    <input
                        placeholder="Count participant"
                        value={participantCount}
                        onChange={(e) => onChange(e, setParticipantCount)}
                    ></input>
                </label>
                <label>
                    Count judge
                    <input
                        placeholder="Count judge"
                        value={judgeCount}
                        onChange={(e) => onChange(e, setJudgeCount)}
                    ></input>
                </label>
                <label>
                    Prefix contest
                    <input
                        placeholder="Prefix contest"
                        value={prefix}
                        onChange={(e) => onChange(e, setPrefix)}
                    ></input>
                </label>
                <label>
                    Contest duration
                    <input
                        placeholder="Contest duration"
                        value={duration}
                        onChange={(e) => onChange(e, setDuration)}
                    ></input>
                </label>
                <label>
                    Add problems
                    <input
                        type="file"
                        onChange={(event) => handleFileChange(event)}
                        multiple
                    />
                </label>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};
export default AdminForm;
