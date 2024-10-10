import { cn } from '@bem-react/classname';
import { TextField } from '@mui/material';
import {
    ChangeEvent,
    ChangeEventHandler,
    ComponentProps,
    ComponentRef,
    forwardRef,
    useId,
    useState,
} from 'react';
import {
    TextFieldStyleWrapper,
    TextFieldStyleWrapperPropsType,
} from '../TextFieldStyleWrapper';

const cnTextFieldCounted = cn('TextFieldCounted');

type TextFieldMultilineProps = Pick<
    ComponentProps<typeof TextField>,
    'multiline' | 'rows' | 'maxRows'
>;

type TextFieldCountedProps = {
    value: string;
    maxLength?: number;
    numeric?: boolean;
} & TextFieldMultilineProps &
    TextFieldStyleWrapperPropsType &
    Omit<ComponentProps<typeof TextField>, 'InputProps' | 'size' | 'color'>;

export const TextFieldCounted = forwardRef<
    ComponentRef<'input'>,
    TextFieldCountedProps
>((props, ref) => {
    const { maxLength: maxLengthProp, numeric: numericProp, ...rest } = props;

    const [focused, setFocused] = useState(false);

    const id = useId();

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | void => {
        if (props.onChange) {
            if (props.numeric && event.target.value.match(/[^0-9]/)) {
                return;
            }

            return props.onChange(event);
        }
    };

    return (
        <TextFieldStyleWrapper
            className={cnTextFieldCounted(undefined, [props.className])}
            label={props.label}
            required={props.required}
            htmlFor={id}
        >
            <TextField
                {...rest}
                label=""
                id={id}
                onChange={handleChange}
                inputProps={{
                    maxLength:
                        maxLengthProp && maxLengthProp > 0
                            ? maxLengthProp
                            : undefined,
                }}
                InputProps={{
                    ref: ref,
                }}
                onFocus={() => {
                    setFocused(true);
                }}
                onBlur={() => {
                    setFocused(false);
                }}
            />
        </TextFieldStyleWrapper>
    );
});
