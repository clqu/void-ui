import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
   alwaysOpen?: boolean;
};