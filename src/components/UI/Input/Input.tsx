import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import './Input.scss';
interface InputProps {
    label?: string;
    className?: string;
    placeholder?: string;
    errors: FieldErrors;
    register: UseFormRegister<any>;
    name: string;
    type: string;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    errors,
    register,
    name,
    type,
    disabled,
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
            ></input>
            {errors[name] && (
                <p className="formAuth__input-error">{`${errors[name]?.message}`}</p>
            )}
        </label>
    );
};

export default Input;
