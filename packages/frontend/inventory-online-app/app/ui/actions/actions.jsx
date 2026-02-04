'use client'
import { getUser } from '@/app/utils/getUser'
import { useState, useEffect } from 'react'
import { Container } from '@/app/ui/utils/container'
import Link from 'next/link'

export default function Actions () {
    const [currentUser, setCurrentUser] = useState({permissions: []})

    const getCurrentUser = async () => {
        const user = await getUser()
        return user
    }
    
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser()
            setCurrentUser(user)
        }
        fetchUser()
    }, [])
    
    const view = (href='/') => {
        return (
            <Link href={href}>Ver</Link>
        )
    }

    const edit = (href='/') => {
        return (
            <Link href={href}>Editar</Link>
        )
    }

    const remove = (href='/') => {
        return (
            <Link href={href}>Eliminar</Link>
        )
    }

    if (currentUser.permissions.includes('delete')) {
        return (
            <Container 
                padding={'0px'}
            >
                {view()}
                {edit()}
                {remove()}
            </Container>
        )
    
    }

    if (currentUser.permissions.includes('edit')) {
        return (
            <>
                {view()}
                {edit()}
            </>
        )
    }

    return (
        <>
            {view()}
        </>
    )



}