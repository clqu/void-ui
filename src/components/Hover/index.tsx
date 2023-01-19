import React from 'react';

export const Hover: React.FC<any> = props => {
    const { children, onHover, onBlur, ...rest } = props;
    const ref = React.useRef<HTMLDivElement>(null);

    const [isHover, setIsHover] = React.useState(false) as any;

    return (
        <div {...rest} ref={ref} onMouseEnter={(e: any) => {
            setIsHover(e.currentTarget);
            onHover && onHover(e);
        }} onMouseLeave={(e: any) => {
            setIsHover(false);
            onBlur && onBlur(e);
        }}>
            {typeof children === 'function' ? children({
                isHover: isHover ? true : false,
                item: isHover
            }) : children}
        </div>
    );
};