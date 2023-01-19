import React from 'react';

export interface ToastOptions {
    component?: (props: { toast: Toast }) => JSX.Element;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    maxToasts?: number;
}

export interface Props {
    toastOptions?: ToastOptions;
    theme?: Theme;
    children: React.ReactNode;
};

export interface Theme {
    [themeName: string]: {
        "900": string;
        "800": string;
        "700": string;
        "600": string;
        "500": string;
        "400": string;
        "300": string;
        "200": string;
        "100": string;
        "50": string;
    }
};

export interface Toast {
    id: string;
    message: string;
    date: Date;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose?: () => void;
    isCloseable?: boolean;
    close: () => void;
    setMessage: (message: string) => void;
    setType: (type: 'success' | 'error' | 'warning' | 'info') => void;
    setCloseable: (t: boolean) => void;
}