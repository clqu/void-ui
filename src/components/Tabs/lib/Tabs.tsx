import { AnimatePresence, motion } from "framer-motion";
import { classNames } from "../../../utils";
import { Props } from "../props";
import { useTabs } from "./TabsGroup";

export default function Tabs({ children }: Props) {
    const { activeTab, setActiveTab, tabClass, activeTabClass, indicatorClass } = useTabs();


    return <div className="voidui-tabs__group overflow-hidden relative flex items-center w-full">
        {Array.isArray(children) ? children.map((child: any, index) => {
            return <div
                key={index}
                className={
                    classNames(`relative voidui-tab p-2 w-full text-center cursor-pointer ${tabClass} ${index === activeTab && activeTabClass + ' wui-tabs__tab-active'}`)
                }
                onClick={() => {
                    setActiveTab(index);
                }}
            >
                {child}

                <AnimatePresence>
                    {index === activeTab && (
                        <motion.div
                            key={activeTab}
                            layoutId="underline"
                            className={classNames('absolute left-0 bottom-0 right-0 h-0.5 bg-blue-500 ' + indicatorClass)}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 50
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>;
        }) : children}

    </div>;
}