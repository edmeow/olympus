import { DialogContentText } from '@mui/material';
import { FC, ReactNode, useId } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { ButtonComponent } from './Button/ButtonComponent';

interface BaseFormModalProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    methods: UseFormReturn<any, any, any>;
    title?: string;
    content?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => Promise<void>;
    className?: string;
    active?: boolean;
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
                {props.title ? props.title : 'Создать'}
            </ButtonComponent>
        </FormProvider>
    );
};
