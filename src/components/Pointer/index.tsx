import React from 'react';
export const Pointer: React.FC<any> = props => {
    const { showMouse = true, render } = props;
    const pointerRef = React.useRef<HTMLDivElement>(null);
    const [isOnLink, setIsOnLink] = React.useState(false);
    const [isOutside, setIsOutside] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    React.useEffect(() => {
        if (!showMouse) {
            document.documentElement.style.cursor = 'none';
        } else {
            document.documentElement.style.cursor = 'auto';
        }

        const pointer = pointerRef.current as HTMLDivElement;
        if (pointer) {
            const updatePosition = (e: MouseEvent) => {
                let x = e.clientX + pointer.scrollLeft;
                let y = e.clientY + pointer.scrollTop;

                pointer.style.setProperty('--x', x + 'px');
                pointer.style.setProperty('--y', y + 'px');

            };
            document.addEventListener('mousemove', updatePosition);
            return () => document.removeEventListener('mousemove', updatePosition);
        }
    }, []);

    React.useEffect(() => {
        const pointer = pointerRef.current as HTMLDivElement;
        if (pointer) {
            const updatePosition = (e: MouseEvent) => {
                let isLink = e.target instanceof HTMLAnchorElement;
                if (isLink) {
                    setIsOnLink(true);
                } else {
                    setIsOnLink(false);
                }
            };
            document.addEventListener('mousemove', updatePosition);
            return () => document.removeEventListener('mousemove', updatePosition);
        }
    }, []);

    React.useEffect(() => {
        const pointer = pointerRef.current as HTMLDivElement;
        if (pointer) {
            const mouseOut = (e: MouseEvent) => {
                setIsOutside(true);
            };
            const mouseIn = (e: MouseEvent) => {
                setIsOutside(false);
            };

            document.addEventListener('mouseout', mouseOut);
            document.addEventListener('mouseover', mouseIn);
            return () => {
                document.removeEventListener('mouseout', mouseOut);
                document.removeEventListener('mouseover', mouseIn);
            };
        }
    }, []);

    React.useEffect(() => {
        const pointer = pointerRef.current as HTMLDivElement;
        if (pointer) {
            const mouseDown = (e: MouseEvent) => {
                setIsActive(true);
            };
            const mouseUp = (e: MouseEvent) => {
                setIsActive(false);
            };

            document.addEventListener('mousedown', mouseDown);
            document.addEventListener('mouseup', mouseUp);

            return () => {
                document.removeEventListener('mousedown', mouseDown);
                document.removeEventListener('mouseup', mouseUp);
            };
        }
    }, []);



    return <>
        <div ref={pointerRef}>
            {render ? render({ isOnLink, isOutside, isActive, pointerRef }) : null}
        </div>
    </>
};