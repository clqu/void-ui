export interface Dropdown extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    className?: string;
    style?: React.CSSProperties;
    animation?: any;
}

export interface Item extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export interface Menu extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    className?: string;
    style?: React.CSSProperties;
}

export interface Toggle extends React.HTMLAttributes<HTMLDivElement> {
    children: any;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}