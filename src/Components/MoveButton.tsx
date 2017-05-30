import * as React from "react"

import styled from "styled-components"

const MoveButton = styled.button`
    height: 74px;	
    width: 395px;	
    border-radius: 8px;	
    color: ${(props) => props.disabled ? "#000" : "#fff"};    
    font-size: 30px;
    font-weight: bold;
    border: solid 1px;
    background-color: ${(props) => props.disabled ? "teal" : "#1AAFD0"};

    &:active,
    &:visited,
    &:hover,
    &:focus{
        outline: none;
    }
`
const MoveButtonText = styled.p`
    color: teal;
`

interface Props {
    onClick: () => void
    disabled: boolean
}

export default (props: Props) => {
    return (
        <MoveButton onClick={props.onClick}>
            <MoveButtonText>
                Move
            </MoveButtonText>
        </MoveButton>
    )
}