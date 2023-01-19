import React from 'react';

export interface Props {
    children: React.ReactNode;
    content: any;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    className?: string;
    reverseAnimation?: boolean;
};