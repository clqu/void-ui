import React from 'react';
import styled from 'styled-components';

const StyledRipple = styled.div<any>`
    --ripple-color: ${props => props.color || '#FFFFFF'};
    position: relative;
    overflow: hidden;
    .ripple {
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        opacity: 0;
        margin-top: -50px;
        margin-left: -50px;
        background: var(--ripple-color);
        pointer-events: none;
        animation: ripple 0.6s ease-in-out;
        transition: all 0.5s ease-in-out;
        left: var(--x);
        top: var(--y);
        z-index: ${(props: {
            zIndex?: number;
        }) => props.zIndex || 1};
    }
    @keyframes ripple {
        0% {
            opacity: 0.5;
            transform: scale(0, 0);
        }
    
        100% {
            opacity: 0;
            transform: scale(10);
        }
    }
`;

export const Ripple: React.FC<any> = props => {
    const { as = "div", children, rippleDisabled, ...rest } = props;
    const rippleRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (rippleDisabled) return;
        const el = rippleRef.current as HTMLDivElement;

        const listener = (e: MouseEvent) => {
            const ripple = document.createElement("span");
            ripple.classList.add("ripple");
            let x = e.clientX - el.getBoundingClientRect().left + el.scrollLeft;
            let y = e.clientY - el.getBoundingClientRect().top + el.scrollTop;
            ripple.style.setProperty('--x', `${x}px`);
            ripple.style.setProperty('--y', `${y}px`);

            el.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        }

        el.addEventListener('click', listener);

        return () => el.removeEventListener('click', listener);
    }, []);


    return (
        <StyledRipple as={as} ref={rippleRef} {...rest}>
            {children}
        </StyledRipple>
    );
};