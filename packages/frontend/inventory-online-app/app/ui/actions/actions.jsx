'use client'
import { useState, useEffect } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import { Button } from '@/app/ui/utils/button/buttons'
import Link from 'next/link'

export default function Actions ({currentUser={permissions:[]}, urlPath='customers', id=1, params='', showView=true, showEdit=true, showDelete=true}) {
    const path = '/store'
    const view = (href=`${path}/${urlPath}/view/detail/${id}${params?params:''}`) => {
        if (showView){
            return (
                <Link href={href}>
                    <Button 
                        children={false}
                        showIcon={true}
                        icon={'view'}
                        type={'secondary'}
                        size={[15, 15]}
                        style={{padding: '3px 5px'}}
                        title={'Ver'}
                    />
                </Link>
            )
        }
    }

    const edit = (href=`${path}/${urlPath}/edit/${id}${params?params:''}`) => {
        if (showEdit){
            return (
                <Link href={href}>
                    <Button 
                        children={false}
                        showIcon={true}
                        icon={'edit'}
                        type={'warning'}
                        size={[15, 15]}
                        style={{padding: '3px 5px'}}
                        title={'Editar'}
                    />
                </Link>
            )
        }
    }

    const remove = (href=`${path}/${urlPath}/delete/${id}`) => {
        if (showDelete){
            return (
                <Link href={href}>
                    <Button 
                        children={false}
                        showIcon={true}
                        icon={'trash'}
                        type={'danger'}
                        size={[15, 15]}
                        style={{padding: '3px 5px'}}
                        title={'Eliminar'}
                    />
                </Link>
            )
        }
    }

    if (currentUser.permissions.includes('delete')) {
        
        return (
            <Container 
                padding={'0px'}
                gap={'20px'}
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