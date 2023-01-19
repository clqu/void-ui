import { Props } from './props';
import React from 'react';

const CodeMockup: React.FC<Props> = props => {
    const { className, copy, style } = props;

    const Copy = () => {
        const code = document.querySelectorAll("[data-code]");
        let text = "";
        code.forEach((item) => {
            text += item.textContent + "\n";
        });
        navigator.clipboard.writeText(text);
    }
    return (
        <>
            <div className={
                "voidui_mockup bg-slate-900 text-white !font-mono !text-sm !rounded-md !p-4 " + className
            } style={style}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    {copy && (
                        <button className="bg-slate-600/20 px-2 py-1 rounded-md text-xs" onClick={Copy}>
                            {copy || "Copy"}
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    {props.children}
                </div>
            </div>
        </>
    );
};

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'deckgo-highlight-code': any
        }
    }
}

interface LineProps {
    className?: string;
    style?: React.CSSProperties;
    prefix?: string;
    code: string;
}

const Line: React.FC<LineProps> = props => {
    const { className, style, prefix, code } = props;

    return (
        <pre
            className={
                className
            }
            style={style}
        >
            <span
                className="font-mono"
                style={{
                    width: "1.5rem",
                    display: "inline-block",
                    textAlign: "right",
                    marginRight: "1.5rem",
                }}
            >
                {prefix}
            </span>
            <span data-code={code} className="font-mono">{code}</span>
        </pre>
    );
};


const Raw: React.FC<any> = props => {
    const { className, style } = props;

    return (
        props.code.split("\n").map((line: string, index: number) => (
            <Line
                key={index}
                className={className}
                style={style}
                code={line}
                prefix={props.prefix || index + 1}
            />
        ))
    );
};

export default Object.assign(CodeMockup, {
    Line,
    Raw,
});
