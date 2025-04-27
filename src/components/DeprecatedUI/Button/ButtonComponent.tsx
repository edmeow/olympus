import React, { ComponentProps, FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { Button, Tooltip } from '@mui/material';

const cnButtonComponent = cn('ButtonComponent');

interface ButtonComponentProps {
  children: ReactNode;
  className?: string;
  color?: ComponentProps<typeof Button>['color'];
  disabled?: boolean;
  endIcon?: ComponentProps<typeof Button>['endIcon'];
  form?: ComponentProps<typeof Button>['form'];
  fullWidth?: ComponentProps<typeof Button>['fullWidth'];
  id?: ComponentProps<typeof Button>['id'];
  onClick?: ComponentProps<typeof Button>['onClick'];
  size?: ComponentProps<typeof Button>['size'];
  startIcon?: ComponentProps<typeof Button>['startIcon'];
  tooltipText?: string;
  type?: ComponentProps<typeof Button>['type'];
  variant?: ComponentProps<typeof Button>['variant'];
}

export const ButtonComponent: FC<ButtonComponentProps> = (props) => {
  const button = (
    <Button
      sx={{ margin: '10px' }}
      className={cnButtonComponent(undefined, [props.className])}
      fullWidth={props.fullWidth}
      variant={props.variant}
      size={props.size}
      color={props.color}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      startIcon={props.startIcon}
      endIcon={props.endIcon}
      id={props.id}
      form={props.form}
    >
      {props.children}
    </Button>
  );

  return props.tooltipText ? (
    <Tooltip title={props.tooltipText}>{button}</Tooltip>
  ) : (
    button
  );
};
