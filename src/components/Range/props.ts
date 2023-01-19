// framer-motion div types
import { BaseProps } from "../../interfaces";

export interface Props extends BaseProps, React.HTMLAttributes<HTMLInputElement> {
    value?: number;
    disabled?: boolean;
    setValue?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    colors?: {
        track?: string;
        thumb?: string;
        slider?: string;
        background?: string;
    };
    style?: any;
    sizes?: {
        width?: string;
        height?: string;
        borderRadius?: string;
        thumb?: {
            default?: string;
            hover?: string;
            active?: string;
        }
    };
    withHover?: boolean;
};