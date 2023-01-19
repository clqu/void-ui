import React, { useContext, createContext } from 'react';
import { Theme } from '../props';

interface GlobalContextProps {
    theme?: Theme;
}

export const GlobalContext = createContext<GlobalContextProps>({} as GlobalContextProps);
export const useGlobalContext = () => useContext<GlobalContextProps>(GlobalContext);

export const GlobalProvider = ({ theme, children }: {
    theme?: Theme;
    children: React.ReactNode;
}) => {

    return (
        <GlobalContext.Provider value={{
            theme,

        }}>
            {children}
        </GlobalContext.Provider>
    );
};