import React from 'react';
import styled from 'styled-components';
import { Props } from './types';
import { getTheme } from '../../utils';
import { Spinner } from '../Spinner';
import { Ripple } from '../Ripple';

const getClasses = (size: any) => {
    switch (size) {
        case 'sm':
            return "px-4 py-2 text-sm rounded-lg transition-all duration-200 min-h-[33px] relative overflow-hidden";
        case 'md':
            return "px-6 py-3 text-base rounded-lg transition-all duration-200 min-h-[44px] relative overflow-hidden";
        case 'lg':
            return "px-8 py-4 text-lg rounded-lg transition-all duration-200 min-h-[44px] relative overflow-hidden";
        default:
            return "px-4 py-2 rounded-lg transition-all duration-200 min-h-[44px] relative overflow-hidden";
    }
}

const getStyles = (colorSchema: any, isLoading: any, disabled: any, variant: any) => {
    switch (variant) {
        case 'contained':
            return `
                background-color: ${colorSchema['600']};
                color: ${colorSchema['100']};
                ${(!isLoading && !disabled) ? `
                    &:hover {
                        background-color: ${colorSchema['700']};
                        outline: none;
                    }
                    &:active {
                        background-color: ${colorSchema['800']};
                        outline: none;
                    }
                ` : `
                    cursor: not-allowed;
                    opacity: 0.5;
                `}
            `;
        case 'outlined':
            return `
                background-color: ${colorSchema['500']}1a;
                color: ${colorSchema['600']};
                border: 0.5px solid ${colorSchema['600']};
                ${(!isLoading && !disabled) ?
                    `&:hover {
                        background-color: ${colorSchema['600']}2a;
                        outline: none;
                    }
                    &:active {
                        background-color: ${colorSchema['600']}3a;
                        outline: none;
                    }
                `: `
                    cursor: not-allowed;
                    opacity: 0.5;
                `}
            `;
        case 'text':
            return `
                background-color: transparent;
                color: ${colorSchema['600']};
                ${(!isLoading && !disabled) ?
                    `&:hover {
                        background-color: ${colorSchema['600']}2a;
                        outline: none;
                    }
                    &:active {
                        background-color: ${colorSchema['600']}3a;
                        outline: none;
                    }
                ` : `
                    cursor: not-allowed;
                    opacity: 0.5;
                `}
            `;
        default:
            return `
                background-color: ${colorSchema['600']};
                color: ${colorSchema['100']};
                ${(!isLoading && !disabled) ? `
                    &:hover {
                        background-color: ${colorSchema['700']};
                        outline: none;
                    }
                    &:active {
                        background-color: ${colorSchema['800']};
                        outline: none;
                    }
                ` : `
                    cursor: not-allowed;
                    opacity: 0.5;
                `}
            `;
    }
}

const StyledButton = styled.button<any>`
    ${props => getStyles(props.colorSchema, props.isLoading, props.disabled, props.variant)}
`;

const StyledChildren = styled.div<any>`
        opacity: ${((props: any) => props.isLoading ? 0 : 1) as unknown as number};
        transition: opacity 0.2s ease-in-out;
    `;

export const Button: React.FC<Props> = props => {
    let { children, disabled, className, size, variant, rippleDisabled, isLoading, theme, ...rest } = props;
    const colorSchema = getTheme(theme);


    const getRippleColor = () => {
        switch (variant) {
            case 'contained':
                return colorSchema['100'];
            case 'outlined':
                return colorSchema['600'];
            case 'text':
                return colorSchema['600'];
            default:
                return colorSchema['100'];
        }
    }




    return (
        <Ripple
            as={StyledButton}
            className={getClasses(size) + (className ? className : "")}
            disabled={isLoading || disabled}
            size={size}
            variant={variant}
            isLoading={isLoading}
            colorSchema={colorSchema}
            color={getRippleColor()}
            rippleDisabled={rippleDisabled}
            {...rest}
        >
            {isLoading ? <div className="absolute w-full h-full left-0 top-0 !opacity-100 z-[1]">
                <div className="w-full h-full flex justify-center items-center">
                    <Spinner size={size} color={getRippleColor()} />
                </div>
            </div> : null}
            <StyledChildren isLoading={isLoading}>
                {children}
            </StyledChildren>
        </Ripple>
    );
};