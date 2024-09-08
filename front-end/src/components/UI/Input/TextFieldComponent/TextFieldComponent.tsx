import { TextField } from '@mui/material';
import {
    ComponentProps,
    ComponentRef,
    forwardRef,
    useId,
    useState,
} from 'react';
import { cn } from '@bem-react/classname';
import { TextFieldStyleWrapper } from '../TextFieldStyleWrapper/TextFieldStyleWrapper';

export type TextFieldBaseProps = Pick<
    ComponentProps<typeof TextField>,
    | 'label'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'disabled'
    | 'required'
    | 'error'
    | 'helperText'
>;

const cnTextFieldComponent = cn('TextFieldComponent');

interface TextFieldComponentProps
    extends TextFieldBaseProps,
        Omit<ComponentProps<typeof TextFieldStyleWrapper>, 'children'> {
    className?: string;
}
export const TextFieldComponent = forwardRef<
    ComponentRef<'input'>,
    TextFieldComponentProps
>((props, ref) => {
    const [focused, setFocused] = useState(false);

    const id = useId();

    return (
        <TextFieldStyleWrapper
            className={cnTextFieldComponent(undefined, [props.className])}
            htmlFor={id}
            label={props.label}
        >
            <TextField
                inputRef={ref}
                label={props.label}
                id={id}
                name={props.name}
                value={props.value}
                defaultValue={props.defaultValue}
                onChange={props.onChange}
                disabled={props.disabled}
                required={props.required}
                InputLabelProps={{
                    shrink: focused || !!props.value,
                }}
                onFocus={() => {
                    setFocused(true);
                }}
                onBlur={() => {
                    setFocused(false);
                }}
                error={props.error}
                helperText={props.helperText}
            />
        </TextFieldStyleWrapper>
    );
});
