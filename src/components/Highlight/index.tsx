import React from 'react';
import styled from 'styled-components';
import { getTheme } from '../../utils';

const StyledMark = styled.span<any>`
    background-color: ${props => props.colorSchema['600']};
    color: ${props => props.colorSchema['100']};
    padding: 2px 4px;
    border-radius: 4px;
`;

export const Highlight: React.FC<any> = props => {
    const { text, includes = ["@", "#"], render, regexSource, theme } = props;
    const colorSchema = getTheme(theme);

    let defaultRender = (text: string) => <StyledMark colorSchema={colorSchema}>
        {text}
    </StyledMark>;

    let allChars = regexSource ? regexSource : "a-zA-Z0-9ŞşĞğÜüİıÖöÇç!#$%&'*+\\-./=?^_`{|}~";
    let regex = new RegExp(`(${includes.map((e: string) => `${e}[${allChars}]+`).join("|")})`, "g");
    let parts = text.split(regex);

    return parts.map((part: string) => regex.test(part) ? render ? render(part) : defaultRender(part) : part);
};