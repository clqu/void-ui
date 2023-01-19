import { HTMLAttributes, CSSProperties } from 'react';
import { TailwindColors } from './TailwindColors';

export interface BaseProps {
    theme?: TailwindColors;
    className?: HTMLAttributes<HTMLAnchorElement>['className'];
    style?: CSSProperties;
};