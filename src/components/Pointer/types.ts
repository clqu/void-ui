import { BaseProps } from '../../interfaces';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement>, BaseProps {
   showMouse?: boolean;
   render?: (text: string) => React.ReactNode;
};