import { Props } from './props';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const Tooltip: React.FC<Props> = props => {
    let { content, delay, position = "bottom", disabled, className, trigger = "hover", interactive = false, autoPosition = true, windowRef = null } = props;
    let hoverRef = React.useRef<HTMLDivElement>(null);
    let contentRef = React.useRef<HTMLDivElement>(null);

    const [hover, setHover] = React.useState(false);

    React.useEffect(() => {
        if (disabled) {
            setHover(false);
        }
    }, [disabled]);


    React.useEffect(() => {
        if (hoverRef.current && contentRef.current) {
            let hoverElement = hoverRef.current as HTMLDivElement;
            let contentElement = contentRef.current as HTMLDivElement;

            const Calculate = () => {
                const hoverRect = hoverElement.getBoundingClientRect();
                const contentRect = contentElement.getBoundingClientRect();

                const iss = {
                    x: hoverElement.offsetLeft,
                    y: hoverElement.offsetTop,
                    width: hoverRect.width,
                    height: hoverRect.height,
                    windowWidth: windowRef?.current?.clientWidth || window.innerWidth,
                    windowHeight: windowRef?.current?.clientHeight || window.innerHeight
                }


                const positions = {
                    right: {
                        x: iss.y - contentRect.height / 2 + iss.height / 2,
                        y: iss.x + iss.width + 5
                    },
                    left: {
                        x: iss.y - contentRect.height / 2 + iss.height / 2,
                        y: iss.x - contentRect.width - 5
                    },
                    top: {
                        x: iss.y - contentRect.height - 5,
                        y: iss.x - contentRect.width / 2 + iss.width / 2
                    },
                    bottom: {
                        x: iss.y + iss.height + 5,
                        y: iss.x - contentRect.width / 2 + iss.width / 2
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
                if (autoPosition) {
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
                }

                // if item is outside of iss.windowWidth then change pos 2rem

                if (pos.y + contentRect.width >= iss.windowWidth) {
                    pos.y = iss.windowWidth - contentRect.width - 16
                } else if (pos.y <= 2) {
                    pos.y = 16;
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

    React.useEffect(() => {
        if (hoverRef.current && contentRef.current) {
            const isOutside = (e: MouseEvent) => {
                if (disabled) return;
                if (trigger === "hover") return;

                if (hoverRef.current && contentRef.current) {
                    let hoverElement = hoverRef.current as HTMLDivElement;
                    let contentElement = contentRef.current as HTMLDivElement;

                    if (hoverElement.contains(e.target as Node)) {
                        return;
                    }

                    if (contentElement.contains(e.target as Node)) {
                        return;
                    }

                    setHover(false);
                }
            }

            document.addEventListener("click", isOutside);

            return () => {
                document.removeEventListener("click", isOutside);
            }
        }
    }, [trigger, disabled]);
    return (
        <>
            <div
                ref={hoverRef}
                onMouseEnter={() => {
                    if (disabled) return;
                    if (trigger === "click") return;
                    setTimeout(() => {
                        setHover(true);
                    }, delay);
                }}
                onMouseLeave={() => {
                    if (trigger === "click") return;
                    setHover(false);
                }}
                onClick={() => {
                    if (disabled) return;
                    if (trigger === "hover") return;
                    setTimeout(() => {
                        setHover(!hover);
                    }, delay);
                }}
            >
                {props.children}

                {interactive && (
                    <AnimatePresence>
                        {hover && (
                            <motion.div
                                ref={contentRef}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={getAnimation(position)}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                }}
                                style={{
                                    position: "absolute",
                                    zIndex: 100
                                }}
                                className={"bg-black text-white rounded p-2 text-sm whitespace-nowrap " + className}
                                layout
                            >
                                {content}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
            {!interactive && (
                <AnimatePresence>
                    {hover && (
                        <motion.div
                            ref={contentRef}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={getAnimation(position)}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                            }}
                            style={{
                                position: "absolute",
                                zIndex: 100
                            }}
                            className={"bg-black text-white rounded p-2 text-sm whitespace-nowrap " + className}
                            layout
                        >
                            {content}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </>
    );
};