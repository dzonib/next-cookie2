const next = require('next')
const express = require('express')
const cors = require("cors")
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.port || 3000
const app = next({ dev })
const handle = app.getRequestHandler()
const sequelize = require('./db/sequelize')
const User = require('./db/models/user')

const COOKIE_SECRET = 'yo'

app.prepare().then(() => {
    sequelize.sync().then(() => {
        const server = express()
        server.use(cors())
        server.use(express.json())

        server.use(cookieParser(COOKIE_SECRET))
        // when we add cookie parser middleware we can read 
        // signed cookies as req.signedCookies

        server.post('/api/register', async (req, res) => {
            const { name, email, password } = req.body

            const hashedPassword = await bcrypt.hash(password, 10)

            try {
                const user = await User.create({
                    name,
                    email,
                    password: hashedPassword
                })
    
                res.json(user)
            } catch(e) {
                console.log(e.message)
            }
        })

        server.post('/api/login', async (req, res) => {
            const {email, password} = req.body
            try {
                const user = await User.findOne({ email })

                if (!user) {
                    return res.status(404).send("User not found!")
                }

                const match = await bcrypt.compare(password, user.password)
    
                if (match) {
    
                    res.cookie("tokenyo", user, {
                        // prevent acces from clientside
                        httpOnly: true,
                        // https only
                        secure: !dev,
                        // we can verify the source of the cookie
                        signed: true
                    })
    
                    return res.json(user)
                } else {
                    // throw new Error('crap')
                    return res.status(403).send("Invalid email or password")
                }
            } catch(e) {
                console.log(e.message)
            }
        })

        server.get('/api/profile', async (req, res) => {
            // its possible to be empty if unauthenticated
            const { signedCookies = {} } = req
            const { tokenyo = {}} = signedCookies

            if (tokenyo && tokenyo.email) {
                try {
                    const user = await User.findOne({ email: tokenyo.email })

                    return res.json(user)
                } catch(e) {
                    console.log(e.message)
                }
            }

            res.status(404).send("Unahthenticated")
        })

        server.get('*', (req, res) => {
            return handle(req, res)
        })

        server.listen(port, err => {
            if (err) throw err
            console.log(`Listening on ${port}`)
        })
    })
})