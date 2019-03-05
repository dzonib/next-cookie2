import {useEffect, useState} from 'react'
import {getUserProfile} from '../lib/auth'
import Layout from '../components/Layout';

export default function Profile() {

    const [userProfile, setUserProfile] = useState('')

    useEffect(() => {
        getUserProfile().then((data) => {

            setUserProfile(data)
        })
    }, [])

    return (
        <Layout title="Profile">
            <pre>{JSON.stringify(userProfile, null, 4)}</pre>
        </Layout>
    )
}