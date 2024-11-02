import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useApiHook } from '../../../hooks/useApiHook';
import {
    IСreateContestRequest,
    IСreateContestRequestForm,
} from '../../../models/request/IСreateContestRequest';
import { ContestCreationResponse } from '../../../models/response/ContestCreationResponse';
import { createContestSchema } from '../../../models/zodSchemas/createContestSchema';
import AdminService from '../../../services/AdminService';
import { TextFieldFormComponent } from '../../UI/FormInputs/TextFieldFormComponent';
import './AdminForm.scss';
import { BaseFormModal } from '../../UI/BaseFormModal';

interface AdminFormProps {
    active?: boolean;
}

const AdminForm: React.FC<AdminFormProps> = (props) => {
    const history = useNavigate();
    const addFormMethods = useForm<IСreateContestRequestForm>({
        defaultValues: {
            name: '',
            participantCount: null,
            judgeCount: null,
            usernamePrefix: '',
            duration: null,
        },
        resolver: zodResolver(createContestSchema),
    });

    const { handleRequest: addContest } = useApiHook<ContestCreationResponse>({
        resolveMessage: 'Олимпиада успешно создана',
    });

    const handleAddFormSubmit = async (
        dataFields: IСreateContestRequest,
    ): Promise<void> => {
        const resp = await addContest(() =>
            AdminService.createContest({
                name: dataFields.name,
                participantCount: dataFields.participantCount,
                judgeCount: dataFields.judgeCount,
                usernamePrefix: dataFields.usernamePrefix,
                duration: dataFields.duration,
            }),
        );

        if (resp) {
            const base64String = resp.fileContent;
            console.log(resp);

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
            history(`/admin/contest/${resp.contest.session}`);
        }
    };

    useEffect(() => {
        if (props.active) {
            addFormMethods.reset({
                name: '',
                participantCount: '',
                judgeCount: '',
                usernamePrefix: '',
                duration: '',
            });
        }
    }, [addFormMethods, props.active]);

    return (
        <BaseFormModal
            active={props.active ? props.active : false}
            methods={addFormMethods}
            title={'Создать'}
            onSubmit={handleAddFormSubmit}
            content={
                <div style={{ width: '100%' }}>
                    <TextFieldFormComponent
                        fullWidth
                        required
                        name={'name'}
                        label={'Название олимпиады'}
                    />
                    <TextFieldFormComponent
                        fullWidth
                        required
                        name={'participantCount'}
                        label={'Количество участников'}
                    />
                    <TextFieldFormComponent
                        fullWidth
                        required
                        name={'judgeCount'}
                        label={'Количество жюри'}
                    />
                    <TextFieldFormComponent
                        fullWidth
                        required
                        name={'usernamePrefix'}
                        label={'Префикс олимпиады'}
                    />
                    <TextFieldFormComponent
                        fullWidth
                        required
                        name={'duration'}
                        label={'Длительность олимпиады'}
                    />
                </div>
            }
        />
    );
};
export default AdminForm;
