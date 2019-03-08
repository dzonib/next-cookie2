import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'

axios.defaults.withCredentials = true

export default function Profile() {

    const [userProfile, setUserProfile] = useState('')

    useEffect(() => {
        // cookie will be automaticly 
        // put on header (because of withCredentials option we added on axios)

        axios.get('/api/profile').then(({ data }) => {
            setUserProfile(data)
        })
    }, [])

    return (
        <Layout title="Profile">
            <pre>{JSON.stringify(userProfile, null, 4)}</pre>
        </Layout>
    )
}