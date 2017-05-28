import * as React from "react"
import "./App.css"
import { Client } from "asana"
import Login from "./Containers/Login"
import Main from "./Containers/Main"

const logo = require("./logo.svg")

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
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        {this.renderMainContent()}
      </div>
    )
  }
}

export default App
