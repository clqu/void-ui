import React from 'react';
import { Dropdown as TypeDropdown, Toggle as TypeToggle, Item as TypeItem, Menu as TypeMenu } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const DropdownContext = React.createContext({} as any);
const useDropdown = () => React.useContext(DropdownContext);

const Dropdown: React.FC<TypeDropdown> = props => {
    const { children, animation = "fade-up", ...rest } = props;
    let [isOpen, setIsOpen] = React.useState(false);
    let menuRef = React.useRef<HTMLDivElement>(null);
    let buttonRef = React.useRef<HTMLDivElement>(null);
    let dropdownRef = React.useRef<HTMLDivElement>(null);

    const getAnimation = () => {
        switch (animation) {
            case "fade-up":
                return {
                    initial: { opacity: 0, y: -10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -10 },
                };
            case "fade-down":
                return {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 10 },
                };
            case "fade-left":
                return {
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -10 },
                };
            case "fade-right":
                return {
                    initial: { opacity: 0, x: 10 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 10 },
                };
            default:
                return {
                    ...animation,
                };
        }
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <DropdownContext.Provider
            value={{
                isOpen,
                toggle: () => setIsOpen(!isOpen),
                refers: {
                    menu: menuRef,
                    button: buttonRef
                },
                animation: getAnimation()
            }}
        >
            <div {...rest} ref={dropdownRef}>
                {React.Children.map(children, child => {
                    return <>{typeof child === "function" ? child?.({ isOpen }) : child}</>;
                })}
            </div>
        </DropdownContext.Provider>
    );
};

const Button: React.FC<TypeToggle> = props => {
    const { children, ...rest } = props;
    const { isOpen, toggle, refers } = useDropdown();

    return (
        <div {...rest} onClick={toggle} ref={refers.button}>
            {typeof children === "function" ? children?.({ isOpen }) : children}
        </div>
    );
};

const Menu: React.FC<TypeMenu> = props => {
    const { children, className, ...rest } = props;
    const { isOpen, refers, animation } = useDropdown();

    return (
        <>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        {...animation}
                        transition={{ duration: 0.2 }}
                        layout
                        ref={refers.menu}
                        className={"absolute z-[50] " + className}
                        {...rest}
                    >
                        <p style={{ display: isOpen ? 'block' : 'none' }}>
                            {React.Children.map(children, (child: any) => {
                                return <>{typeof child === "function" ? child?.({ isOpen }) : child}</>;
                            })}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Item: React.FC<TypeItem> = props => {
    const { children, ...rest } = props;

    return (
        <div {...rest}>
            {children}
        </div>
    );
};

export default Object.assign(Dropdown, {
    Button,
    Menu,
    Item,
});