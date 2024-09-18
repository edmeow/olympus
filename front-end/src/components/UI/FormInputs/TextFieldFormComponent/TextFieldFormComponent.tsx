import { ComponentProps, FC } from 'react';
import {
    Controller,
    ControllerRenderProps,
    useFormContext,
} from 'react-hook-form';
import { cn } from '@bem-react/classname';
import { TextFieldCounted } from '../../Input/TextFieldCounted';

const cnTextFieldFormComponent = cn('TextFieldFormComponent');

type TextFieldFormComponentProps = Omit<
    ComponentProps<typeof TextFieldCounted>,
    keyof ControllerRenderProps
> & { name: string; disabled?: boolean };

export const TextFieldFormComponent: FC<TextFieldFormComponentProps> = (
    props,
) => {
    const { name, disabled, ...rest } = props;

    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name];

    return (
        <Controller
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <TextFieldCounted
                    {...rest}
                    {...field}
                    className={cnTextFieldFormComponent(undefined, [
                        props.className,
                    ])}
                    error={!!error}
                    helperText={error?.message && String(error?.message)}
                />
            )}
        />
    );
};
