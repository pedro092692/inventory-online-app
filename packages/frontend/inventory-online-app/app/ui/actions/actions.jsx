
'use client'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import DeleteModal from '@/app/ui/actions/delete'
import { use, useState } from 'react'
import Link from 'next/link'

export default function Actions({
        userPermissions=[], 
        resourceId = null,
        deleteKey = '',
        endpoint = '',
        showView=true, 
        showEdit=true, 
        showDelete=true,
        queryString='',
        deleteMsg='Elemento eliminado con éxito'
    }){
    
    const [showModal, setShowModal] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const canEdit = userPermissions.includes('update')
    const canDelete = userPermissions.includes('delete')
    const createURL = (action, id) => {
        const path = `/store/${endpoint}`
        const url = `${path}/${action}/${id}${queryString ? `?${queryString}` : ''}`
        return url
    }

    const openModal = () => {
        setIsMounted(true)
        setTimeout(() => setShowModal(true), 70)
    }

    const closeModal = () => {
        setShowModal(false)
        setTimeout(() => setIsMounted(false), 170)
    }

    const view = () => {
        if (showView){
            return (
                <Link href={createURL('detail', resourceId)}>
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

    const edit = () => {
        if (showEdit){
            return (
                <Link href={createURL('edit', resourceId)}>
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

    const remove = () => {
        if (showDelete){
            return (
                <Link 
                    href={'#'}
                    onClick={(e) => {e.preventDefault(); openModal()} }
                >
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

    return (
        <Container 
            padding={'0px'}
            gap={'20px'}
        >
            {view()}
            {canEdit && edit()}
            {canDelete && remove()}
            {canDelete && isMounted && <DeleteModal 
                                       show={showModal} 
                                       onClose={closeModal} 
                                       id={resourceId}
                                       path={endpoint}
                                       deleteKey={deleteKey}
                                       deleteMsg={deleteMsg}
                                       />}
        </Container>
    )
}