export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
    children: React.ReactNode;
    content: React.ReactNode;
    delay?: number;
    disabled?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    style?: React.CSSProperties;
    onHover?: () => void;
    onLeave?: () => void;
    parentClassName?: string;
};