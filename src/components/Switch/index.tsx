import { Props } from './props';
import React from 'react';
import { motion } from 'framer-motion';
import generateCSS from '../../utils/generateCSS';

export const Switch: React.FC<Props> = props => {
    const { value, setValue, ...rest } = props;
    let [state, setState] = React.useState(value);

    React.useEffect(() => {
        setState(value);
    }, [value]);

    generateCSS(`.switch {
        width: 3.5rem;
        height: 2rem;
        border-radius: 100px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.2s ease;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
    }
    
    .switch[data-active="true"] {
        background-color: #22cc88;
        justify-content: flex-end;
    }
    
    .switch[data-active="false"] {
        background-color: #dddddd;
        justify-content: flex-start;
    }
    
    .switch div {
        width: 1.5rem;
        height: 1.5rem;
        background-color: #ffffff;
        border-radius: 50%;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.02);
    }`);
    return (
        <div className="switch" data-active={state || false} onClick={() => setState(!state)} {...rest}>
            <motion.div className="handle" layout transition={{ type: "spring", stiffness: 500, damping: 30 }} />
        </div>
    );
};