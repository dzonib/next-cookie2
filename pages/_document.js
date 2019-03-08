// is executed only on server side
// as result we can read signed cookie -> get and presist information within it

import Document, { Head, Main, NextScript } from 'next/document'
import { getUserScript } from '../lib/auth';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        // get things from server ctx gives req, res, query
        const props = await Document.getInitialProps(ctx)
        
        const { signedCookies = {} } = ctx.req
        const { tokenyo = {} } = signedCookies

        const user = tokenyo

        // returning props so we dont get wierd error
        return { ...props, user}
    }

    render() {
        const { user = {} } = this.props

        const WINDOW_USER_SCRIPT_VARIABLE = "__USER__"

        const getUserScript = user => {
            return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)}`
        }

        return (
            <html>
                <Head />
                <body>
                    <Main />
                    <script dangerouslySetInnerHTML={{__html: getUserScript(user)}}/>
                    <NextScript />
                </body>
            </html>
        )
    }
}