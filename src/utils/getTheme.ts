import React from "react";
import { useGlobalContext } from "../components/Provider/contexts/global";
import colors from 'tailwindcss/colors'

export const getTheme = (theme: string | undefined) => {
    let [t, setTheme] = React.useState<any>(null);
    const gcf: any = useGlobalContext();

    React.useEffect(() => {
        let allThemes = { ...colors, ...gcf.theme };

        if (!theme) return setTheme(allThemes.gray);
        const _theme = allThemes?.[theme] || allThemes.gray;
        const a = _theme ? _theme : allThemes.gray;

        setTheme(a);
    }, [theme]);

    return t || colors.gray;
};