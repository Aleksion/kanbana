import { css } from "styled-components"

/*
 * Theme Colors
 */
export const themeColors = {
  bgWhite: "#f6f6f6",
  primary: "#5C9FB4",
  accent: "#CEC7B0",
  textColor: "#1D1D26",
  screenDark: "#35495D",
}

export const breakpoints = {
  xsmall: "350px",
  small: "667px",
  medium: "980px",
  large: "1140px",
}

/*
 * Media Queries
 */
export const media = {
  xsmall: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${breakpoints.xsmall}) {
      ${css(strings, ...args)}
    }
    `,
  small: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${breakpoints.small}) {
      ${css(strings, ...args)}
    }
    `,
  medium: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${breakpoints.medium}) {
      ${css(strings, ...args)}
    }
  `,
  large: (strings: TemplateStringsArray, ...args: any[]) => css`
    @media (max-width: ${breakpoints.large}) {
      ${css(strings, ...args)}
    }
  `,
}

interface FlexProps {
  noWrap?: boolean
  flex?: number
  layout?: "row" | "column"
  align?: string
  justify?: string

  layoutLg?: "row" | "column"
  alignLg?: string
  justifyLg?: string

  layoutMd?: "row" | "column"
  alignMd?: string
  justifyMd?: string

  layoutSm?: "row" | "column"
  alignSm?: string
  justifySm?: string

  layoutXs?: "row" | "column"
  alignXs?: string
  justifyXs?: string

}

export const flexBox = css`
    display: flex;
    flex: ${(props: FlexProps) => props.flex ? props.flex : "initial"};
    flex-wrap: ${(props: FlexProps) => props.noWrap ? "nowrap" : "wrap"};
    flex-direction: ${(props: FlexProps) => props.layout || "row"};
    align-items: ${(props: FlexProps) => props.align || "center"};
    justify-content: ${(props: FlexProps) => props.justify || "center"};
    ${media.large`
      flex-direction: ${(props: FlexProps) => props.layoutLg || props.layout || "row"};
      justify-content: ${(props: FlexProps) => props.justifyLg || props.justify || "center"};
      align-items: ${(props: FlexProps) => props.alignLg || props.align || "center"};
    `}
    ${media.medium`
      flex-direction: ${(props: FlexProps) => props.layoutMd || props.layoutLg || props.layout || "row"};
      justify-content: ${(props: FlexProps) => props.justifyMd || props.justifyLg || props.justify || "center"};
      align-items: ${(props: FlexProps) => props.alignMd || props.alignLg || props.align || "center"};
    `}
    ${media.small`
      flex-direction: ${(props: FlexProps) => props.layoutSm || props.layoutMd || props.layoutLg || props.layout || "row"}
      justify-content: ${(props: FlexProps) => props.justifySm || props.justifyMd || props.justifyLg || props.justify || "center"};
      align-items: ${(props: FlexProps) => props.alignSm || props.alignMd || props.alignLg || props.align || "center"};
    `}
    ${media.xsmall`
      flex-direction: ${(props: FlexProps) => props.layoutXs || props.layoutSm || props.layoutMd || props.layoutLg || props.layout || "row"}
      justify-content: ${(props: FlexProps) => props.justifyXs || props.justifySm || props.justifyMd || props.justifyLg || props.justify || "center"};
      align-items: ${(props: FlexProps) => props.alignXs || props.alignSm || props.alignMd || props.alignLg || props.align || "center"};
    `}
`

export const shadows = {
  z1: "0 1px 2px 0 rgba(0,0,0,0.2)",
  z2: "0 2px 4px 0 rgba(0,0,0,0.18)",
  z3: "0 4px 8px 0 rgba(0,0,0,0.15)",
}
