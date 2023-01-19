import { BaseProps } from '../../interfaces';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLButtonElement>, BaseProps {
    children: React.ReactNode;
    disabled?: boolean | undefined;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'contained' | 'outlined' | 'text';
    isLoading?: boolean;
    rippleDisabled?: boolean;
};