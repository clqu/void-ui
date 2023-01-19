export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    content: React.ReactNode | string;
    delay?: number;
    disabled?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
    interactive?: boolean;
    trigger?: 'hover' | 'click';
    autoPosition?: boolean;
    windowRef?: React.RefObject<HTMLElement>;
};