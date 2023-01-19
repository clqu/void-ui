import React from 'react';

export const getVTT = (vtt: string) => {
    let [vttContent, setVttContent] = React.useState<string>("");
    if (vtt.includes("/")) {
        fetch(vtt).then(res => res.text()).then(text => {
            setVttContent(text);
        });

        const lines = vttContent.split("\n");
        const newLines = lines.map((line, index) => {
            if (line === " " || line === "") {
                return "";
            } else {
                if (line.includes("WEBVTT")) {
                    return "";
                } else if (line.includes("-->")) {
                    const removeSpaces = line.replace(/ /g, "");
                    const addSpace = removeSpaces.replace("-->", " --> ")
                        .replace(/(<([^>]+)>)/gi, "")
                        .replace(/(\r\n|\n|\r)/gm, "");
                    return [addSpace, lines[index + 1]];
                } else {
                    return "";
                }
            }
        }).filter(line => line !== "")
            .reduce((acc: any, curr: any) => {
                return {
                    ...acc,
                    [String(curr[0])]: curr[1],
                };
            }, {});

        return newLines;
    } else {
        return vtt;
    }
}