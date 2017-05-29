import styled from "styled-components"
import * as React from "react"
import { flexBox } from "../Helpers/styles"

const Container = styled.div`
    background-color: ${(props) => props.selected ? "green" : "white"};
    width: 175px;
    ${flexBox};
`

const SectionHeader = styled.h4`
    cursor: pointer;
    color: black;
`
interface Props {
    isSelected: boolean
    name: string
    tasks: any[]
    id: number
    tasksLoaded: boolean
    onSectionClicked: (id: number) => void
}
export default function Section(props: Props) {
    return (
        <Container layout="column" selected={!!props.isSelected}>
            <SectionHeader onClick={() => props.onSectionClicked(props.id)}>{props.name}</SectionHeader>
            {!props.tasksLoaded ? "Loading tasks" : props.tasks.length}
        </Container>
    )
}