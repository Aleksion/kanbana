import { flexBox } from "./Helpers/styles";
import * as React from "react"
import "./App.css"
import { Client } from "asana"
import Login from "./Containers/Login"
import Main from "./Containers/Main"
import * as localForage from "localforage"
import styled from "styled-components"

const OuterWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  ${flexBox}
`
interface State {
  loggedIn: boolean
}
class App extends React.Component<{}, State> {
  client = Client.create({
    clientId: "351330568718362",
    redirectUri: "http://localhost:3000/"
  })

  constructor(props: any) {
    super(props)

    // Set config
    localForage.config()

    this.state = {
      loggedIn: false
    }
  }

  renderMainContent() {
    if (this.state.loggedIn) {
      return (
        <Main client={this.client} />
      )
    } else {
      return <Login client={this.client} onSignedIn={() => this.setState({ loggedIn: true })} />
    }
  }

  render() {

    return (
      <OuterWrapper>
        {this.renderMainContent()}
      </OuterWrapper>
    )
  }
}

export default App
