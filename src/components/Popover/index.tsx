import { Props } from './props';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const Popover: React.FC<Props> = props => {
    let { content, delay, position = "bottom", disabled, className } = props;
    let hoverRef = React.useRef<HTMLDivElement>(null);
    let contentRef = React.useRef<HTMLDivElement>(null);

    const [hover, setHover] = React.useState(false);


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
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight
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

    React.useEffect(() => {
        if (hoverRef.current && contentRef.current) {
            const isOutside = (e: MouseEvent) => {
                if (disabled) return;

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
    }, [disabled]);
    return (
        <>
            <div
                ref={hoverRef}
                onClick={() => {
                    if (disabled) return;
                    setTimeout(() => {
                        setHover(!hover);
                    }, delay);
                }}
            >
                {props.children}

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
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={"bg-slate-900 border border-zinc-500/50 text-white rounded-xl px-4 py-2 text-base " + className}
                            layout
                        >
                            {content}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};