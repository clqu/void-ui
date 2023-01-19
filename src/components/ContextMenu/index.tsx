import React from 'react';
import { Props } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const Context = React.createContext({} as any);
const useContext = () => React.useContext(Context);

const ContextMenu: React.FC<Props> = props => {
    const { children, ...rest } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isOutOfScreen, setIsOutOfScreen] = React.useState(false as any);
    const ref = React.useRef<HTMLDivElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const close = () => {
        setIsOpen(false);
        setPosition({ x: 0, y: 0 });
    }


    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();

        if (ref.current) {
            if (isOpen && menuRef.current) {
                if (menuRef.current.contains(e.target as Node)) {
                    return;
                }
            }

            setIsOpen(true);

            const el = ref.current as HTMLElement;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const scrollX = el.scrollLeft || ref.current.scrollLeft;
            const scrollY = el.scrollTop || ref.current.scrollTop;

            const x = e.clientX + scrollX;
            const y = e.clientY + scrollY;

            const menuWidth = menuRef.current ? menuRef.current.offsetWidth : (windowWidth / 4);
            const menuHeight = menuRef.current ? menuRef.current.offsetHeight : (windowHeight / 2);

            const isOverflowingRight = x + menuWidth > windowWidth;
            const isOverflowingBottom = y + menuHeight > windowHeight;

            const toPositive = (num: number) => num < 0 ? Number(num.toString().replace('-', '')) : num;

            setIsOutOfScreen({
                moreFromRight: toPositive(x + menuWidth - windowWidth),
                moreFromBottom: toPositive(y + menuHeight - windowHeight),
                moreFromLeft: toPositive(x - menuWidth),
                moreFromTop: toPositive(y - menuHeight),
            });

            const newX = isOverflowingRight ? x - menuWidth : x;
            const newY = isOverflowingBottom ? y - menuHeight : y;

            setPosition({ x: newX, y: newY });
        }
    };

    return (
        <Context.Provider value={{ isOpen, setIsOpen, position, menuRef, close, ref }}>
            <div {...rest} onContextMenu={handleContextMenu} ref={ref}>
                {typeof children === 'function' ? children({ isOpen, setIsOpen, close, isOutOfScreen }) : children}
            </div>
        </Context.Provider>
    );
};

const Menu: React.FC<Props> = props => {
    const { children, ...rest } = props;
    const { isOpen, position, menuRef, close, ref } = useContext();

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                let isRightClick = false;
                if (e.button === 2) {
                    isRightClick = true;
                }

                if (ref.current && ref.current.contains(e.target as Node) && isRightClick) {
                    return;
                }

                close();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: position.x > 0 ? 1 : 0, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                        type: 'spring',
                        damping: 20,
                        stiffness: 100
                    }}
                    className="absolute z-10"
                    ref={menuRef}
                    style={{
                        top: position.y,
                        left: position.x
                    }}
                >
                    <div {...rest} onContextMenu={e => e.preventDefault()} onClick={e => e.stopPropagation()}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Object.assign(ContextMenu, {
    Menu
});