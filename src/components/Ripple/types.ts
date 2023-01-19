import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType | "div";
    children: React.ReactNode;
    disabled?: boolean | undefined;
    rippleDisabled?: boolean;
    color?: string;
    zIndex?: number | string;
};