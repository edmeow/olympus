import React, { FC, ReactNode, useEffect, useId } from 'react';
import './AdminForm.scss';
import AdminService from '../../../services/AdminService';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { createContestSchema } from '../../../models/zodSchemas/createContestSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    IСreateContestRequest,
    IСreateContestRequestForm,
} from '../../../models/request/IСreateContestRequest';
import { TextFieldFormComponent } from '../../UI/FormInputs/TextFieldFormComponent';
import { DialogContentText } from '@mui/material';
import { ButtonComponent } from '../../UI/Button/ButtonComponent';
import { useApiHook } from '../../../hooks/useApiHook';
import { ContestCreationResponse } from '../../../models/response/ContestCreationResponse';

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

interface BaseFormModalProps {
    methods: UseFormReturn<any, any, any>;
    title?: string;
    content?: ReactNode;
    onSubmit: (data: any) => Promise<void>;
    className?: string;
    active: boolean;
}

export const BaseFormModal: FC<BaseFormModalProps> = (props) => {
    const formId = useId();

    return (
        <FormProvider {...props.methods}>
            <form
                style={{ width: '100%' }}
                id={formId}
                noValidate
                onSubmit={props.methods.handleSubmit(props.onSubmit)}
            >
                <DialogContentText component={'div'}>
                    {props.content}
                </DialogContentText>
            </form>

            <ButtonComponent
                variant="contained"
                className="adminForm__btn"
                form={formId}
                fullWidth={true}
                type={'submit'}
                tooltipText={'Подтвердить'}
                disabled={props.methods.formState.isSubmitting}
            >
                Создать
            </ButtonComponent>
        </FormProvider>
    );
};
