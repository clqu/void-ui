import React from 'react';

export interface VideoProps extends React.HTMLAttributes<HTMLVideoElement> {
    src: string;
    primaryColor?: string;
    subtitles?: {
        [key: string]: string;
    };
    subtitleComponent?: (text: string) => JSX.Element;
    qualities?: {
        [key: string]: string;
    };
    translations?: {
        [key: string]: string;
    };
    controls?: boolean;
    loop?: boolean;
    features?: {
        ambientLight?: boolean;
        pictureInPicture?: boolean;
        loop?: boolean;
    };
    muted?: boolean;
    next?: {
        onClick: () => void;
        disabled: boolean;
    };
    previous?: {
        onClick: () => void;
        disabled: boolean;
    };
    defaultSettings?: {
        quality?: string;
        subtitle?: string;
        ambientLight?: boolean;
        speed?: number;
        volume?: number;
    };
    children?: React.ReactNode;
    className?: any;
}