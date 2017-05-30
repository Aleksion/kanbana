import * as React from "react"
import LoginButton from "../Components/LoginButton"

import { Client } from "asana"
import { parseHash } from "../Helpers/locationHelpers"
import * as localForage from "localforage"

interface AccessTokenResponse {
    access_token?: string
}
interface Props {
    onSignedIn: () => void
    client: Client
}

const TOKEN_RESPONSE_KEY = "authData"
export default class Login extends React.PureComponent<Props, {}> {
    constructor(props: Props) {
        super(props)

        this.init()
    }

    async init() {
        // If our cache contains a token, we'll try to authenticate
        const cachedTokenResponse = await localForage.getItem<AccessTokenResponse>(TOKEN_RESPONSE_KEY)

        if (!!cachedTokenResponse && !!cachedTokenResponse.access_token) {
            const promise = this.signin()
            console.log(cachedTokenResponse)
            promise.catch(() => localForage.removeItem(TOKEN_RESPONSE_KEY))

            return
        }

        // If the location hash contains a token, we'll try to authenticate
        const accessTokenResponse = parseHash<AccessTokenResponse>(location.hash)

        if (accessTokenResponse.access_token) {

            this.signin(accessTokenResponse)
        }
    }
    signin = (tokenResponse?: any) => {
        this.props.client.useOauth()

        return this.props.client.authorize().then((res) => {
            if (tokenResponse) {
                localForage.setItem(TOKEN_RESPONSE_KEY, tokenResponse)
            }
            // The client is authorized! Make a simple request.

            this.props.onSignedIn()

            return

        }).catch((err) => {
            console.error(err)
        })
    }

    render() {

        return (<LoginButton onClick={() => this.signin()} />)
    }
}