import axios from 'axios';
import useSWR from 'swr';

export default function (url: string, { swrOptions = {}, axiosOptions = {} }: { swrOptions?: any, axiosOptions?: any}) {
    return useSWR(url, href => (
        axios(href, { 
            ...axiosOptions
        }).then(res => res.data).catch(res => res?.response?.data).catch(() => {})
    ), { ...swrOptions });
};