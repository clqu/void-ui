import { Props } from './props';
import React from 'react';
import { getTheme } from '../../utils';
import generateCSS from '../../utils/generateCSS';

export const Range: React.FC<Props> = props => {

    const { value = 0, setValue, min, max = 100, step, theme, colors, sizes = {}, className, withHover = true, ...rest } = props;
    let [myValue, setMyValue] = React.useState(value);

    React.useEffect(() => {
        setMyValue(value);
    }, [value]);


    const myTheme = getTheme(theme);
    const slate = theme === "slate" ? getTheme("zinc") : getTheme("slate");

    const getBackgroundSize = () => {
        return { backgroundSize: `${(myValue * 100) / max}% 100%` };
    };

    generateCSS(`input[type="range"] {
        --range-thumb-size: ${sizes?.thumb?.default || "20px"};
        --hover-range-thumb-size: ${sizes?.thumb?.hover || "8px"};
        --active-range-thumb-size: ${sizes?.thumb?.active || "12px"};
        -webkit-appearance: none;
        cursor: pointer;
        width: ${sizes?.width || "100%"};
        height: ${sizes?.height || "12px"};
        background: ${colors?.background || slate["800"]};
        border-radius: ${sizes?.borderRadius || "5px"};
        background-image: linear-gradient(${colors?.slider || myTheme["600"]}, ${colors?.slider || myTheme["600"]});
        background-repeat: no-repeat;
    }
    
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: var(--range-thumb-size);
        width: var(--range-thumb-size);
        border-radius: 50%;
        background: ${colors?.thumb || myTheme["600"]};
        cursor: pointer;
        box-shadow: ${colors?.thumb || myTheme["600"]}00 0px 0px 0px 8px;
        transition: all 0.3s ease-in-out;
        flex-shrink: 0;
    }

    input[type="range"]::-moz-range-thumb {
        -webkit-appearance: none
        height: var(--range-thumb-size);
        width: var(--range-thumb-size);
        border-radius: 50%;
        background: ${colors?.thumb || myTheme["600"]};
        cursor: pointer;
        box-shadow: ${colors?.thumb || myTheme["600"]}00 0px 0px 0px 8px;
        transition: all 0.3s ease-in-out;
    }

    input[type="range"]::-ms-thumb {
        -webkit-appearance: none;
        height: var(--range-thumb-size);
        width: var(--range-thumb-size);
        border-radius: 50%;
        background: ${colors?.thumb || myTheme["600"]};
        cursor: pointer;
        box-shadow: ${colors?.thumb || myTheme["600"]}00 0px 0px 0px 8px;
        transition: all 0.3s ease-in-out;
    }
    
    input[type="range"]::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        box-shadow: none;
        border: none;
        background: transparent;
    }

    input[type="range"]::-moz-range-track {
        -webkit-appearance: none;
        box-shadow: none;
        border: none;
        background: transparent;
    }

    input[type="range"]::-ms-track {
        -webkit-appearance: none;
        box-shadow: none;
        border: none;
        background: transparent;
    }

    input[type="range"].withHover::-webkit-slider-thumb:hover {
        box-shadow: ${colors?.thumb || myTheme["600"]}50 0px 0px 0px var(--hover-range-thumb-size);
    }
    input[type="range"].withHover::-moz-range-thumb:hover {
        box-shadow: ${colors?.thumb || myTheme["600"]}50 0px 0px 0px var(--hover-range-thumb-size);
    }
    input[type="range"].withHover::-ms-thumb:hover {
        box-shadow: ${colors?.thumb || myTheme["600"]}50 0px 0px 0px var(--hover-range-thumb-size);
    }
    
    input[type="range"].withHover::-webkit-slider-thumb:active {
        box-shadow: ${colors?.thumb || myTheme["600"]}50 0px 0px 0px var(--active-range-thumb-size);
        transition: box-shadow 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        left 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        bottom 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }

    input[type="range"].withHover::-moz-range-thumb:active {
        box-shadow: ${colors?.thumb || myTheme["600"]}50 0px 0px 0px var(--active-range-thumb-size);
        transition: box-shadow 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        left 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        bottom 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
    input[type="range"].withHover::-ms-thumb:active {
        box-shadow: ${colors?.thumb || myTheme["600"]}50 0px 0px 0px var(--active-range-thumb-size);
        transition: box-shadow 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        left 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        bottom 350ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }`);

    return (
        <input
            type="range"
            min={min || 0}
            max={max || 100}
            step={step || 1}
            value={myValue}
            onChange={e => {
                setMyValue(Number(e.target.value));
                if (setValue) setValue(Number(e.target.value));
            }}
            style={getBackgroundSize()}
            className={`${className || ""} ${withHover ? "withHover" : ""}`}
            {...rest}
        />
    );
};