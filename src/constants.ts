export default {
    asana: {
        clientId: process.env.NODE_ENV === "production" ? "351682588617738" : "351330568718362",
        redirectUri: process.env.NODE_ENV === "production" ? "https://www.kanbana.co" : "http://localhost:3000/"
    }
}