import { Props } from './props';
import React from 'react';
import { GlobalProvider } from './contexts/global';
import { ToastProvider, useToast } from './contexts/toast';

export const Provider: React.FC<Props> = ({ toastOptions, theme, children }: Props) => {
    return (
        <GlobalProvider theme={theme}>
            <ToastProvider
                toastOptions={toastOptions}
            >
                {children}
            </ToastProvider>
        </GlobalProvider>
    );
};

export { useToast };