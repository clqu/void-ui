import { createContext, useContext, useState } from "react";
import { Props } from "../props";

interface ITabsGroup { 
    activeTab: number;
    setActiveTab: (activeTab: number) => void;
    indicatorClass: string;
    tabClass: string;
    activeTabClass: string;
};

const TabsContext = createContext<ITabsGroup>({} as ITabsGroup);
export const useTabs = () => useContext(TabsContext);

export default function TabsGroup({ indicatorClass = "", tabClass = "", activeTabClass = "", children }: Props) {
    let [activeTab, setActiveTab] = useState(0);

    return <div className="voidui-tabs__group">
        <TabsContext.Provider value={{ activeTab, setActiveTab, indicatorClass, tabClass, activeTabClass }}>
            {children}
        </TabsContext.Provider>
    </div>;
}