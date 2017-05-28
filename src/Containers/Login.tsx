import * as React from "react"
import LoginButton from "../Components/LoginButton"

import { Client } from "asana"
import { parseHash } from "../Helpers/locationHelpers"

interface AccessTokenResponse {
    access_token?: string
}
interface Props {
    onSignedIn: () => void
    client: Client
}
export default class Login extends React.PureComponent<Props, {}> {
    constructor(props: Props) {
        super(props)

        const hash = parseHash<AccessTokenResponse>(location.hash)

        if (hash.access_token) {
            this.signin()
        }
        console.log("search params", parseHash(location.hash))
    }
    signin = () => {
        this.props.client.useOauth()

        this.props.client.authorize().then(() => {
            // The client is authorized! Make a simple request.
            console.log("Authorized")
            this.props.onSignedIn()

        }).catch((err) => {
            console.error(err)
        })
    }

    render() {

        return (<LoginButton onClick={() => this.signin()} />)
    }
}