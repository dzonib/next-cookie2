import { useState } from 'react'
import Router from "next/router"
import axios from 'axios'

export default function RegisterForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setErrors] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    function handleChange(e) {

        const value = e.target.value

        switch (e.target.name) {
            case "name":
                return setName(value)
            case "email":
                return setEmail(value)
            case "password":
                return setPassword(value)
            default:
                break
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        setErrors("")
        setIsLoading(true)
        try {
            await axios.post("/api/register", {name, email, password})
            setIsLoading(false)
            Router.push('/login')
        } catch(e) {
            setIsLoading(false)
            setErrors(e)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" 
                    value={name}
                    name='name'
                    placeholder="name"
                    onChange={handleChange}
                />
            </div>
            <div>
                <input
                    type="email"
                    value={email}
                    name="email"
                    placeholder="email"
                    onChange={handleChange}
                />
            </div>
            <div>
                <input
                    type="password"
                    value={password}
                    name="password"
                    placeholder="password"
                    onChange={handleChange}
                />
            </div>
            <button disabled={isLoading} type="submit">
                {isLoading ? "Signing up..." : "Signup"}
            </button>
            {error && <div>{error}</div>}
        </form>
    )
}