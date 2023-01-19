import React, { useContext, createContext } from 'react';
import { Toast, ToastOptions } from '../props';
import { AnimatePresence, motion } from 'framer-motion';

interface GlobalContextProps {
    toasts: Toast[];
    create: (data: any) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    promise: (promise: Promise<any>, options?: { loadingMessage?: string, successMessage?: string, errorMessage?: string, duration?: number, isCloseable?: boolean }) => void;
}

export const ToastContext = createContext<GlobalContextProps>({} as GlobalContextProps);
export const useToast = () => useContext<GlobalContextProps>(ToastContext);

export const ToastProvider = ({ toastOptions = {}, children }: {
    toastOptions?: ToastOptions;
    children: React.ReactNode;
}) => {

    const { component, position = "bottom-right", maxToasts = 5 } = toastOptions;

    const ToastRender = ({ toast }: {
        toast: Toast;
    }) => {

        const timeout: any = setTimeout(() => {
            if (toast) {
                if (toast.isCloseable) {
                    toast.close();
                }
            }

            return clearTimeout(timeout);
        }, toast.duration);

        return (
            component ? component({ toast }) : (
                <div className={`p-4 rounded-lg ${getClasses(toast.type)}`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {getIcon(toast.type)}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">
                                {toast.message}
                            </p>
                        </div>
                        {toast.isCloseable && <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button onClick={toast.close} className="inline-flex bg-zinc-500/20 hover:bg-zinc-500/50 transition-all duration-200 rounded-md p-1.5 text-gray-50 hover:text-gray-100 outline-none border-none">
                                    <span className="sr-only">Close</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>}
                    </div>
                </div>
            )
        )
    }

    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const addToast = ({ message, type = "info", duration, onClose, isCloseable }: {
        message: string,
        type?: 'error' | 'success' | 'info' | 'warning',
        duration?: number,
        onClose?: () => void,
        isCloseable?: boolean
    }) => {
        let id = Math.random().toString(36).substring(2, 9);
        if (toasts.length >= maxToasts) {
            toasts[0].close();
        }
        let data: Toast = {
            id,
            message,
            date: new Date(),
            type: type || 'info',
            duration: duration || 5000,
            onClose: onClose || (() => { }),
            isCloseable: isCloseable || true,
            close: () => {
                setToasts(t => t.filter((toast) => toast.id !== id));
            },
            setMessage: (message: string) => {
                setToasts(t => t.map((toast) => toast.id === id ? { ...toast, message } : toast));
            },
            setType: (type: 'error' | 'success' | 'info' | 'warning') => {
                setToasts(t => t.map((toast) => toast.id === id ? { ...toast, type } : toast));
            },
            setCloseable: (isCloseable: boolean) => {
                setToasts(t => t.map((toast) => toast.id === id ? { ...toast, isCloseable } : toast));
            },
        }

        setToasts(t => [...t, data]);
        return data;
    }

    const toastPromise = (promise: Promise<any>, options?: { loadingMessage?: string, successMessage?: string, errorMessage?: string, duration?: number, isCloseable?: boolean }) => {
        let loadingToast: Toast = addToast({
            message: options?.loadingMessage || "Loading...",
            type: "info",
            duration: options?.duration || 5000,
            isCloseable: options?.isCloseable || false
        });
        promise.then((data) => {
            loadingToast.setMessage(options?.successMessage || "Success");
            loadingToast.setType("success");
            loadingToast.setCloseable(true);
            return data;
        }).catch((error) => {
            loadingToast.setMessage(options?.errorMessage || "Error");
            loadingToast.setType("error");
            loadingToast.setCloseable(true);
            return error;
        })
    }


    const getClasses = (type: 'error' | 'success' | 'info' | 'warning') => {
        switch (type) {
            case 'error':
                return 'bg-red-500 text-white';
            case 'success':
                return 'bg-green-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            default:
                return 'bg-blue-500 text-white';
        }
    }

    const getIcon = (type: 'error' | 'success' | 'info' | 'warning') => {
        switch (type) {
            case 'error':
                return <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>;
            case 'success':
                return <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>;
            case 'info':
                return <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>;
            case 'warning':
                return <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14 h7v7l9-11h-7z" />
                </svg>;
            default:
                return <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>;
        }
    }

    const getAnimations = (pos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center', index: number) => {
        switch (pos) {
            case 'bottom-right':
                return {
                    initial: { x: 60, y: 0, opacity: 0 },
                    animate: { x: 0, y: 0, opacity: 1 },
                    exit: { x: index === 0 ? 60 : 0, y: index > 0 ? index * 60 : 0, opacity: 0 }
                }
            case 'top-right':
                return {
                    initial: { x: 60, y: 0, opacity: 0 },
                    animate: { x: 0, y: 0, opacity: 1 },
                    exit: { x: index === 0 ? 60 : 0, y: index > 0 ? 60 : 0, opacity: 0 }
                }
            case 'bottom-left':
                return {
                    initial: { x: -60, y: 0, opacity: 0 },
                    animate: { x: 0, y: 0, opacity: 1 },
                    exit: { x: index === 0 ? -60 : 0, y: index > 0 ? index * 60 : 0, opacity: 0 }
                }
            case 'top-left':
                return {
                    initial: { x: -60, y: 0, opacity: 0 },
                    animate: { x: 0, y: 0, opacity: 1 },
                    exit: { x: index === 0 ? -60 : 0, y: index > 0 ? -60 : 0, opacity: 0 }
                }
            case 'top-center':
                return {
                    initial: { x: 0, y: -60, opacity: 0 },
                    animate: { x: 0, y: 0, opacity: 1 },
                    exit: { x: 0, y: -60, opacity: 0 }
                }
            case 'bottom-center':
                return {
                    initial: { x: 0, y: 60, opacity: 0 },
                    animate: { x: 0, y: 0, opacity: 1 },
                    exit: { x: 0, y: 60, opacity: 0 }
                }
            default:
                return {
                    initial: { x: 0, y: 60, opacity: 0 },
                    animate: { x: 0, y: 0, opacity: 1 },
                    exit: { x: index > 0 ? index * 60 : 0, y: index === 0 ? 60 : 0, opacity: 0 }
                }
        }
    }

    const getToastPosition = (pos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center') => {
        switch (pos) {
            case 'top-left':
                return 'top-4 left-4';
            case 'top-right':
                return 'top-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            default:
                return 'bottom-4 right-4';
        }
    }

    return (
        <ToastContext.Provider
            value={{
                toasts: toasts,
                create: addToast,
                promise: toastPromise,
                success: (message: string, options?: { duration?: number, onClose?: () => void, isCloseable?: boolean }) => addToast({ message, type: 'success', ...options }),
                error: (message: string, options?: { duration?: number, onClose?: () => void, isCloseable?: boolean }) => addToast({ message, type: 'error', ...options }),
                info: (message: string, options?: { duration?: number, onClose?: () => void, isCloseable?: boolean }) => addToast({ message, type: 'info', ...options }),
                warn: (message: string, options?: { duration?: number, onClose?: () => void, isCloseable?: boolean }) => addToast({ message, type: 'warning', ...options }),
            }}
        >

            <div className="w-full h-full fixed z-[999999999999] left-0 top-0 pointer-events-none">
                <div className={`absolute flex flex-col space-y-2 pointer-events-none ${getToastPosition(position)}`}>
                    <ul className="flex flex-col space-y-2">
                        <AnimatePresence initial={false}>
                            {toasts.map((toast, index) => (
                                <motion.li
                                    key={toast.id}
                                    initial={getAnimations(position, index).initial}
                                    animate={getAnimations(position, index).animate}
                                    exit={getAnimations(position, index).exit}
                                    transition={{ duration: 0.2 }}
                                    className="w-96 pointer-events-auto"
                                    layout
                                >
                                    <ToastRender toast={toast} />
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            </div>

            {children}
        </ToastContext.Provider>
    );
};