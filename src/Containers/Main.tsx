import * as React from "react"

import { Client, resources } from "asana"

interface Props {
    client: Client
}

interface State {
    projects: resources.Projects.Type[]
    workspaces: resources.Workspaces.ShortType[]
}
export default class Main extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            projects: [],
            workspaces: []
        }

        this.getWorkspaces()
    }
    async getWorkspaces() {
        const { data } = await this.props.client.workspaces.findAll()

        this.setState({ workspaces: data })
    }

    async getProjects() {
        const { data } = await this.props.client.projects.findAll()

        this.setState({ projects: data })
    }

    render() {

        return (
            <div>
                {this.state.workspaces.map((ws) => ws.name)}
            </div>
        )
    }
}