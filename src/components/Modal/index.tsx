import React from "react";
import { Props } from './props';
import { motion, AnimatePresence } from "framer-motion";

export const Modal: React.FC<Props> = props => {
    const { isOpen, setIsOpen, children, content, reverseAnimation = false, ...rest } = props;
    const [open, setOpen] = React.useState(isOpen);
    const openerRef = React.useRef<HTMLDivElement>(null);

    const closeModal = () => {
        setOpen(false);
    };

    const openModal = () => {
        setOpen(true);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    };

    return (
        <>
            <div onClick={open ? closeModal : openModal} ref={openerRef}>
                {children}
            </div>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        onClick={closeModal}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                            background: 'rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <motion.div
                            initial={reverseAnimation ? { scale: 1.15, opacity: 0 } : { scale: 0.95, opacity: 0 }}
                            animate={{ 
                                scale: 1, 
                                opacity: 1,
                            }}
                            exit={reverseAnimation ? { scale: 1.15, opacity: 0 } : { scale: 0.95, opacity: 0 }}
                            transition={{
                                duration: 0.2
                            }}
                            onClick={e => {
                                e.stopPropagation();
                            }}
                            {...rest}
                        >
                            {content({ close: closeModal })}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};