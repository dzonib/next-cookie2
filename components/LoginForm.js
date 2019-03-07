import { useState } from "react"
import Router from "next/router"
import axios from "axios"

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setErrors] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    function handleChange(event) {
        event.target.name === "email"
            ? setEmail(event.target.value)
            : setPassword(event.target.value)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        setErrors("")
        setIsLoading(true)

        try {
            const { data } = await axios.post("/api/login", { email, password })
            Router.push("/profile")
        } catch (e) {
            setIsLoading(false)
            handleErrors(e)
        }
    }

    function handleErrors(err) {
        const error = (err.response && err.response.data) || err.message
        setErrors(error)
    }

    return (
        <form onSubmit={handleSubmit}>
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
                {isLoading ? "Logging in..." : "Login"}
            </button>
            {error && <div>{error}</div>}
        </form>
    )
}

export default LoginForm
