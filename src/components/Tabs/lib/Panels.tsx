import { AnimatePresence, motion } from "framer-motion";
import { Props } from "../props";
import { useTabs } from "./TabsGroup";

export default function Panels({ children }: Props) {
    const { activeTab } = useTabs();

    return <div className="relative flex items-center w-full">
        <AnimatePresence exitBeforeEnter>
            <motion.div
                key={activeTab}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {Array.isArray(children) ? children.map((child: any, index) => {
                    if (index === activeTab) {
                        return <div
                            key={index}
                        >
                            {child}
                        </div>;
                    }
                }) : children}
            </motion.div>
        </AnimatePresence>
    </div>;
}