const next = require('next')
const express = require('express')
const cors = require("cors")
const bcrypt = require('bcryptjs')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.port || 3000
const app = next({ dev })
const handle = app.getRequestHandler()
const sequelize = require('./db/sequelize')
const User = require('./db/models/user')

app.prepare().then(() => {
    sequelize.sync().then(() => {
        const server = express()
        server.use(cors())
        server.use(express.json())

        server.post('/api/register', async (req, res) => {
            const { name, email, password } = req.body

            try {
                const user = await User.create({
                    name,
                    email,
                    password
                })
    
                res.json(user)
            } catch(e) {
                console.log(e.message)
            }
        })

        server.post('/api/login', (req, res) => {
            const {email, password} = req.body

            res.json({
                user: {
                    email,
                    password,
                    success: true
                }
            })
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