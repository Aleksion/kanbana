import * as Modal from "react-modal"
import * as React from "react"

import { Client, resources } from "asana"

import MoveButton from "../Components/MoveButton"
import { Observable } from "rxjs"
import Section from "../Components/Section"
import { flexBox } from "../Helpers/styles"
import styled from "styled-components"

const Spinner = require("react-spinkit")

const Container = styled.div`
    background-color: yellow;
    height: 100%;
    width: 100%;
    ${flexBox}
`

const SideBar = styled.div`
    width: 300px;
    height: 100%;
    background-color: blue;
    padding-left: 20px;
`

const WorkspaceSection = styled.div`
    ${flexBox}
`

const WorkspaceHeader = styled.h3`
    color: white;
`

interface ProjectHeaderProps {
    isSelected?: boolean
}
const ProjectHeader = styled.h4`
    color: ${(props: ProjectHeaderProps) => props.isSelected ? "yellow" : "white"}
`
const MainContainer = styled.div`
    ${flexBox}
    padding: 40px;
`
const SectionWrapper = styled.div`
    ${flexBox}
    overflow: y;
`

const CustomModal = styled(Modal) `
    width: 400px;
    height: 200px;
    background-color: green;
    top                   : 50%;
    left                  : 50%;
    right                 : auto;
    bottom                : auto;
    marginRight           : -50%;
    transform             : translate(-50%, -50%);
    position: fixed;
    ${flexBox};
`

const ModalDropdown = styled.select`
        width: 150px;
    height: 30px;
    font-size: 15px;
    border: none;
    background-color: white;
    border-radius: 0;
    margin-top: 10px;
    margin-bottom: 10px;
`

const ModalMoveButton = styled.button`
    width: 150px;
    height: 30px;
    background-color: ${(props) => props.disabled ? "grey" : "teal"};
    color: black;
    font-size: 20px;
    font-weight: bold;
    border: solid 1px;
`

const Overlay = styled(Modal) `
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, 0.2);
    ${flexBox};
`

interface Props {
    client: Client
}

interface EnhancedProjectType extends resources.Projects.Type {
    workspaceName: string
}

interface EnhancedTask extends resources.Tasks.Type {
    sectionId: number
}
interface EnhancedSection extends resources.Tasks.Type {
    tasksLoaded?: boolean
}
interface State {
    projects: StringMap<EnhancedProjectType>
    sections: EnhancedSection[]
    tasks: EnhancedTask[]
    sectionsLoading: boolean
    selectedSection?: number
    selectedProject?: number
    currentTargetProject?: number
    modalIsOpen: boolean
    movingTasks: boolean
}
interface StringMap<T> {
    [key: string]: T[]
}
export default class Main extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            projects: {},
            sections: [],
            tasks: [],
            sectionsLoading: false,
            modalIsOpen: false,
            movingTasks: false,
        }

        this.init()
    }
    async init() {

        Observable.from(this.getWorkspaces())
            .flatMap((data) => data)
            .flatMap((data) =>
                Observable.from(this.getProjects(data.id))
                    .flatMap((pr) => pr)
                    .map((pr) => ({ ...pr, workspaceName: data.name }) as EnhancedProjectType)
            )
            .reduce((a, b) => {
                a[b.workspaceName] ? a[b.workspaceName].push(b) : a[b.workspaceName] = [b]

                return a
                // tslint:disable-next-line
            }, {})
            .subscribe((projects) => this.setState({ projects }))
    }

    async getWorkspaces() {
        const { data } = await this.props.client.workspaces.findAll()

        return data
    }

    async getProjects(workspace: number) {
        const { data } = await this.props.client.projects.findAll({ workspace } as any)

        return data
    }

    async getSections(project: number) {
        const { data } = await this.props.client.projects.sections(project)

        return data
    }

    async getTasksForSection(sectionId: number) {
        const { data } = await this.props.client.tasks.findAll({ section: sectionId } as any)

        return data
    }
    async onProjectClicked(projectId: number) {
        this.setState({ sectionsLoading: true, sections: [], tasks: [], selectedProject: projectId })

        // Wait for sections to be set
        const sections = await this.getSections(projectId)
        this.setState({ sections, sectionsLoading: false })

        Observable.of(sections)
            .flatMap((sr) => sr)
            .flatMap((sr) =>
                Observable.from(this.getTasksForSection(sr.id))
                    .do(() => this.setState((prvState: State) => ({
                        ...prvState,
                        sections: prvState.sections
                            .map((s) => s.id === sr.id ? { ...s, tasksLoaded: true } : s)
                    })))
                    .flatMap((ts) => ts)

                    .map((ts) => ({ ...ts, sectionId: sr.id }))
            )
            .toArray()
            .subscribe((tasks) => this.setState({ tasks }))
    }

    renderWorkspace(name: string, projects: EnhancedProjectType[], selectedProjectId?: number) {
        console.log(selectedProjectId)
        return (
            <WorkspaceSection layout="column" align="flex-start" key={name}>
                <WorkspaceHeader> {name} </WorkspaceHeader>
                {projects.map((pr) => <ProjectHeader isSelected={pr.id === selectedProjectId} onClick={() => this.onProjectClicked(pr.id)} key={pr.id}> {pr.name} </ProjectHeader>)}
            </WorkspaceSection>
        )
    }

    renderSectionWrapperContent() {
        if (this.state.sectionsLoading) {
            return "Loading Sections"
        }
        if (!this.state.selectedProject) {
            return "Please select a project to continue"
        }
        if (this.state.sections.length === 0) {
            return "The project doesn't contain any sections"
        }

        return this.state.sections.map((sr) => (
            <Section
                key={sr.id}
                tasks={this.state.tasks.filter((ts) => ts.sectionId === sr.id)}
                id={sr.id}
                name={sr.name}
                isSelected={this.state.selectedSection === sr.id}
                onSectionClicked={(selectedSection) => this.setState({ selectedSection })}
                tasksLoaded={!!sr.tasksLoaded}
            />))

    }

    onDropdownSelected(e: React.FormEvent<HTMLSelectElement>) {
        this.setState({ currentTargetProject: parseInt(e.currentTarget.value, 10) })
    }

    createSelectItems() {
        const projects = Object.keys(this.state.projects).reduce((a, b) => {
            const subProjects = this.state.projects[b]
            a.push(...subProjects)

            return a
            // tslint:disable-next-line
        }, new Array<EnhancedProjectType>())

        return projects.map((pr) => (<option key={pr.id} value={pr.id}>{pr.name} </option>))
    }

    onMoveButtonClicked() {
        const { selectedSection, currentTargetProject, selectedProject } = this.state

        if (!selectedSection || !currentTargetProject || !selectedProject) {
            return
        }

        this.setState({ movingTasks: true, modalIsOpen: false })

        Observable.of(this.state.tasks.filter((ts) => ts.sectionId === selectedSection))
            .flatMap((tasks) => tasks)
            // Map over each task and set it as complete
            .flatMap((ts) => Observable.from<resources.Tasks.Type>(this.props.client.tasks.update(ts.id, { completed: true, name: ts.name })))
            // Add each task to the archive project
            .flatMap((ts) => Observable.from<resources.Tasks.Type>(this.props.client.tasks.addProject(ts.id, { project: currentTargetProject }).then(() => ts)))
            // Remove each task from the current project
            .flatMap((ts) => Observable.from<resources.Tasks.Type>(this.props.client.tasks.removeProject(ts.id, { project: selectedProject }).then(() => ts)))
            // Buffer so it only works on 5 at a time
            .bufferCount(5, 1)
            .subscribe((tasks) => this.setState((prvState) => ({
                selectedSection: undefined,
                currentTargetProject: undefined,
                tasks: prvState.tasks.filter((ts) => !tasks.find((nts) => nts.id === ts.id)),
                movingTasks: false,
            })))

    }

    render() {

        return (
            <Container layout="column" align="flex-start">
                <SideBar>
                    {Object.keys(this.state.projects)
                        .map((workspaceName) => this.renderWorkspace(workspaceName, this.state.projects[workspaceName], this.state.selectedProject))}
                </SideBar>
                <MainContainer layout="column" align="center" flex={1}>
                    <SectionWrapper layout="row" align="flex-start" justify="flex-start" flex={0.9}>
                        {this.renderSectionWrapperContent()}
                    </SectionWrapper>
                    <MoveButton disabled={!this.state.selectedSection} onClick={() => this.setState({ modalIsOpen: true })}> Move </MoveButton>
                </MainContainer>
                <CustomModal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={() => this.setState({ modalIsOpen: false })}
                    contentLabel="Modal"
                    layout="column"
                    align="center"
                    justify="center"
                >
                    Target Project:
                    <ModalDropdown onChange={(e) => this.onDropdownSelected(e)}>
                        {this.createSelectItems()}
                    </ModalDropdown>
                    <ModalMoveButton onClick={() => this.onMoveButtonClicked()} disabled={!this.state.currentTargetProject}> Move </ModalMoveButton>
                </CustomModal>
                <Overlay isOpen={this.state.movingTasks} shouldCloseOnOverlayClick={false} align="center" justify="center">
                    <Spinner name="pacman" />
                </Overlay>
            </Container>
        )
    }
}