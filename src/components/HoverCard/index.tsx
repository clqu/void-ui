import { Props } from './props';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const HoverCard: React.FC<Props> = props => {
    let { as, className, parentClassName, children, content, delay, position = "bottom", onHover, onLeave, disabled } = props;
    let hoverRef = React.useRef<HTMLDivElement>(null);
    let contentRef = React.useRef<HTMLDivElement>(null);

    const [hover, setHover] = React.useState(false);


    React.useEffect(() => {
        if (hoverRef.current && contentRef.current) {
            let hoverElement = hoverRef.current as HTMLDivElement;
            let contentElement = contentRef.current as HTMLDivElement;

            const Calculate = () => {
                if (disabled) return;
                const hoverRect = hoverElement.getBoundingClientRect();
                const contentRect = contentElement.getBoundingClientRect();

                const iss = {
                    x: hoverElement.offsetLeft,
                    y: hoverElement.offsetTop,
                    width: hoverRect.width,
                    height: hoverRect.height,
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight
                }


                const positions = {
                    right: {
                        x: iss.y,
                        y: iss.x + iss.width + 5
                    },
                    left: {
                        x: iss.y,
                        y: iss.x - contentRect.width - 5
                    },
                    top: {
                        x: iss.y - contentRect.height - 5,
                        y: iss.x
                    },
                    bottom: {
                        x: iss.y + iss.height + 5,
                        y: iss.x
                    }
                }
                let diffes = {
                    "bottom": "top",
                    "top": "bottom",
                    "left": "right",
                    "right": "left"
                }

                let diff = diffes[position] as keyof typeof positions;

                let pos = positions[position];
                if (positions[position].x + contentRect.height > iss.windowHeight) {
                    positions[position].x = positions[diff].x;
                    pos = positions[diff];
                } else if (positions[position].x < 0) {
                    positions[position].x = positions[diff].x;
                    pos = positions[diff];
                }

                if (positions[position].y + contentRect.width > iss.windowWidth) {
                    positions[position].y = positions[diff].y;
                    pos = positions[diff];
                } else if (positions[position].y < 0) {
                    positions[position].y = positions[diff].y;
                    pos = positions[diff];
                }

                contentElement.style.top = pos.x + "px";
                contentElement.style.left = pos.y + "px";
            }

            Calculate();

            window.addEventListener("resize", Calculate);

            return () => {
                window.removeEventListener("resize", Calculate);
            }
        }
    }, [hover, position]);

    const getAnimation = (pos: string) => {
        switch (pos) {
            case "bottom":
                return {
                    initial: {
                        opacity: 0,
                        y: -10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -10
                    }
                }
            case "top":
                return {
                    initial: {
                        opacity: 0,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: 10
                    }
                }
            case "right":
                return {
                    initial: {
                        opacity: 0,
                        x: -10
                    },
                    animate: {
                        opacity: 1,
                        x: 0
                    },
                    exit: {
                        opacity: 0,
                        x: -10
                    }
                }
            case "left":
                return {
                    initial: {
                        opacity: 0,
                        x: 10
                    },
                    animate: {
                        opacity: 1,
                        x: 0
                    },
                    exit: {
                        opacity: 0,
                        x: 10
                    }
                }
        }
    }

    let Element = as || "div";

    return (
        <>
            <Element
                ref={hoverRef}
                onMouseEnter={() => {
                    if (disabled) return;
                    setTimeout(async () => {
                        if (onHover) {
                            const isHover = await onHover();
                            if (isHover !== undefined) {
                                setHover(isHover);
                            } else {
                                setHover(true);
                            }
                        } else {
                            setHover(true);
                        }
                    }, delay);
                }}
                onMouseLeave={() => {
                    if (disabled) return;
                    setTimeout(async () => {
                        if (onLeave) {
                            const isHover = await onLeave();
                            if (isHover !== undefined) {
                                setHover(isHover);
                            } else {
                                setHover(false);
                            }
                        } else {
                            setHover(false);
                        }
                    }, delay);
                }}
                className={"voidui_hovercard_parent " + parentClassName}
            >
                {children}
                <AnimatePresence initial={false}>
                    {hover && (
                        <>
                            <motion.div
                                className={"voidui_hovercard w-full " + className}
                                style={{
                                    position: "absolute",
                                    zIndex: 100,
                                    width: contentRef.current?.getBoundingClientRect().width
                                }}
                                transition={{
                                    duration: 0.2
                                }}
                                ref={contentRef}
                                data-hovercard={true}
                                data-hovercard-position={position}
                                {...getAnimation(position)}
                            >
                                {content}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </Element>
        </>
    );
};