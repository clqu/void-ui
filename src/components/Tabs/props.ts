import { BaseProps } from '../../interfaces';
import React from 'react';

export interface Props extends BaseProps {
    children: React.ReactNode[] | React.ReactNode;
    indicatorClass?: string;
    tabClass?: string;
    activeTabClass?: string;
};