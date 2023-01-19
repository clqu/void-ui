import React from 'react';
import { Props } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const AccordionContext = React.createContext({} as any); 

const AccordionGroup: React.FC<Props> = props => {
    const { children, alwaysOpen = false, ...rest } = props;
    let [isOpen, setIsOpen] = React.useState(false);
    let [actives, setActives] = React.useState([] as number[]);

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <AccordionContext.Provider value={{ isOpen, toggle }}>
            <div {...rest}>
                {React.Children.map(children, (child: any, i) => {
                    return <>
                        {React.Children.map(child.props.children, (child, j) => {
                            if (child.type.name === 'Header') {
                                return React.cloneElement(child, {
                                    onClick: () => {
                                        if (alwaysOpen) {
                                            if (actives.includes(i)) {
                                                setActives(actives.filter(a => a !== i));
                                            } else {
                                                setActives([...actives, i]);
                                            }
                                        } else {
                                            if (actives.includes(i)) {
                                                setActives(actives.filter(a => a !== i));
                                            } else {
                                                setActives([i]);
                                            }
                                        }
                                    },
                                    isOpen: actives.includes(i)
                                });
                            } else if (child.type.name === 'Body') {
                                return <AnimatePresence>
                                    {actives.includes(i) && <motion.div
                                        initial={{ 
                                            height: 0,
                                            overflow: 'hidden',
                                            opacity: 0
                                        }}
                                        animate={{
                                            height: 'auto',
                                            overflow: 'hidden',
                                            opacity: 1
                                        }}
                                        exit={{
                                            height: 0,
                                            overflow: 'hidden',
                                            opacity: 0
                                        }}
                                        transition={{ 
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                    >
                                        {child}
                                    </motion.div>}
                                </AnimatePresence>
                            }
                        })}
                    </>
                })}
            </div>
        </AccordionContext.Provider>
    );
};

const Accordion: React.FC<Props> = props => {
    const { children, ...rest } = props;

    return (
        <div {...rest}>
            {children}
        </div>
    );
};

interface HeaderProps {
    children: React.ReactNode | (({ isOpen }: { isOpen: boolean }) => React.ReactNode);
    className?: string;
    style?: React.CSSProperties;
    isOpen?: boolean;
}

const Header: React.FC<HeaderProps> = props => {
    const { children, isOpen = false, ...rest } = props;

    return (
        <div {...rest}>
            {typeof children === 'function' ? children({ 
                isOpen
            }) : children}
        </div>
    );
};

const Body: React.FC<Props> = props => {
    const { children, ...rest } = props;

    return (
        <div {...rest}>
            {children}
        </div>
    );
};

export default Object.assign(AccordionGroup, {
    Accordion,
    Header,
    Body
});