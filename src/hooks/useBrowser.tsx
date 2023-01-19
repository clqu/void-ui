import React from "react";


export default function useBrowser() {
    const [browser, setBrowser] = React.useState<string | null>(null);
    React.useEffect(() => {
        const getBrowser = () => {
            const agent = window.navigator.userAgent;
            
            let name = 'Unknown';
            if (agent.match(/chrome|chromium|crios/i)) {
                name = 'Chrome';
            } else if (agent.match(/safari/i)) {
                name = 'Safari';
            } else if (agent.match(/firefox|iceweasel/i)) {
                name = 'Firefox';
            } else if (agent.match(/msie|trident/i)) {
                name = 'Internet Explorer';
            } else if (agent.match(/edg/i)) {
                name = 'Microsoft Edge';
            } else if (agent.match(/opr/i)) {
                name = 'Opera';
            }

            
            setBrowser(name);
        };
        getBrowser();
    }, []);

    return browser;
}