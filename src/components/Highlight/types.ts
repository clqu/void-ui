import { BaseProps } from '../../interfaces';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement>, BaseProps {
   text: string;
   includes: string[];
   render?: (text: string) => React.ReactNode;
   regexSource?: string;
};