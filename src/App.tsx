import * as React from "react"
import "./App.css"
import { Client } from "asana"
import LoginButton from "./Components/LoginButton"
const logo = require("./logo.svg")

interface AccessTokenResponse {
  access_token?: string
}

function parseHash<T extends {}>(hash: string): T {
  if (hash.charAt(0) !== "#") {
    return {} as any
  }

  const withoutHash = hash.substring(1, hash.length - 1)

  let values: any = {}

  withoutHash.split("&").map((cb) => {
    const resultSet = cb.split("=")
    values[resultSet[0]] = resultSet[1]
  })

  return values
}

class App extends React.Component<{}, null> {

  constructor(props: {}) {
    super(props)

    const hash = parseHash<AccessTokenResponse>(location.hash)

    if (hash.access_token) {
      this.signin()
    }
    console.log("search params", parseHash(location.hash))
  }
  signin = () => {
    const client = Client.create({
      clientId: "351330568718362",
      redirectUri: "http://localhost:3000/"
    })

    client.useOauth()

    client.authorize().then(function () {
      // The client is authorized! Make a simple request.
      console.log("Authorized")

      return client.users.me().then((me) => {
        console.log("Me", me)
      })
    }).catch((err) => {
      console.error(err)
    })
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <LoginButton onClick={() => this.signin()} />
      </div>
    )
  }
}

export default App
