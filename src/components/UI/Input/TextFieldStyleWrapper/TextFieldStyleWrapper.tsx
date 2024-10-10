import { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import './TextFieldStyleWrapper.scss';

const cnTextFieldStyleWrapper = cn('TextFieldStyleWrapper');

interface TextFieldStyleWrapperProps {
    children: ReactNode;
    className?: string;
    label?: ReactNode;
    required?: boolean;
    htmlFor?: string;
}

export type TextFieldStyleWrapperPropsType = Omit<
    TextFieldStyleWrapperProps,
    'children'
>;

export const TextFieldStyleWrapper: FC<TextFieldStyleWrapperProps> = (
    props,
) => {
    return (
        <div
            className={cnTextFieldStyleWrapper(
                { size: 'medium', color: 'light' },
                [props.className],
            )}
        >
            {props.label && (
                <label
                    className={cnTextFieldStyleWrapper('labelText', {
                        size: 'medium',
                        required: props.required,
                    })}
                    htmlFor={props.htmlFor}
                >
                    {props.label}
                </label>
            )}
            {props.children}
        </div>
    );
};
