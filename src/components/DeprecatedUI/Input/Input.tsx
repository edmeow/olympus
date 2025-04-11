import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import './Input.scss';
interface InputProps {
    label?: string;
    className?: string;
    placeholder?: string;
    errors: FieldErrors;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>;
    name: string;
    type: string;
    disabled?: boolean;
    max?: number;
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    errors,
    register,
    name,
    type,
    disabled,
    max,
}) => {
    return (
        <label className="input__label">
            {label}
            <input
                {...register(name)}
                disabled={disabled}
                className="formAuth__input formAuth__input_login"
                placeholder={placeholder}
                type={type}
                max={max}
            ></input>
            {errors[name] && (
                <p className="formAuth__input-error">{`${errors[name]?.message}`}</p>
            )}
        </label>
    );
};

export default Input;
