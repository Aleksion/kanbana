
import styled from "styled-components"
import * as React from "react"

const LoginButton = styled.button`
    width: 125px;
    height: 75px;
    background-color: teal;
    color: black;
    font-size: 30px;
    font-weight: bold;
    border: none;
`

interface Props {
    onClick: () => void
}

export default (props: Props) => {
    return <LoginButton onClick={props.onClick}> Login </LoginButton>
}