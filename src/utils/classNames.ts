export const classNames = (classList: string) => {
    let allProps: string[] = [];
    const split = classList.split(' ');

    split.forEach(className => {
        if (className.trim().length === 0) return;
        const prefix = className.split('-')?.[0];
        if (prefix) {
            const props = allProps.filter(p => p.split('-')?.[0] === prefix && p.split('-')?.length === className.split('-')?.length);
            props.forEach(prop => (allProps = allProps.filter(p => p !== prop)));
            allProps.push(className);
        };
    });

    return allProps
        .join(' ');
};