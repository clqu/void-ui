import React from 'react';
import styled from 'styled-components';
import { Props } from './props';

const getSize = (size: string) => {
    switch (size) {
        case 'xs':
            return 8;
        case 'sm':
            return 16;
        case 'md':
            return 24;
        case 'lg':
            return 32;
        default:
            return 40;
    }
};

interface SpinnerSvgProps {
    fill?: keyof React.CSSProperties['color'];
    size?: string;
}

const SpinnerSvg = styled.svg<React.SVGProps<SVGSVGElement> & SpinnerSvgProps>({
    'animation': 'rotate 2s linear infinite',
    'flex-shrink': 0,
    'width': ((props: { size: any; }) => getSize(props.size || 'md') + "px") as unknown as string,
    'position': 'relative',
    'height': ((props: { size: any; }) => getSize(props.size || 'md') + "px") as unknown as string,
    '& .path': {
        'stroke': 'currentColor',
        'strokeLinecap': 'round',
        'animation': 'dash 1.5s ease-in-out infinite',
    },
    '@keyframes rotate': {
        '100%': {
            'transform': 'rotate(360deg)',
        }
    },
    '@keyframes dash': {
        '0%': {
            strokeDasharray: '1, 150',
            strokeDashoffset: '0',
        },
        '50%': {
            strokeDasharray: '90, 150',
            strokeDashoffset: '-35',
        },
        '100%': {
            strokeDasharray: '90, 150',
            strokeDashoffset: '-124',
        }
    }
});

export const Spinner: React.FC<Props> = props => {
    return (
        <SpinnerSvg viewBox="0 0 24 24" {...props}>
            <circle className="path" cx="12" cy="12" r="10" fill="none" />
        </SpinnerSvg>
    );
};