'use client'
import { useState, useEffect } from 'react'
import { Container } from '@/app/ui/utils/container'
import Link from 'next/link'

export default function Actions ({currentUser={permissions:[]}, urlPath='customers', id=1, params=''}) {
    const path = '/store'
    const view = (href=`${path}/${urlPath}/view/detail/${id}${params?params:''}`) => {
        return (
            <Link href={href}>Ver</Link>
        )
    }

    const edit = (href=`${path}/${urlPath}/edit/${id}`) => {
        return (
            <Link href={href}>Editar</Link>
        )
    }

    const remove = (href=`${path}/${urlPath}/delete/${id}`) => {
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