export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    value?: boolean;
    disabled?: boolean;
    setValue?: (value: boolean) => void;
};