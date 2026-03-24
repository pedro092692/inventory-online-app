
'use client'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import DeleteModal from '@/app/ui/actions/delete'
import { useState } from 'react'
import Link from 'next/link'

export default function Actions({
        userPermissions=[], 
        resourceId = null,
        endpoint = '',
        deleteKey = '',
        showView=true, 
        showEdit=true, 
        showDelete=true,
        queryString=''
    }){
    
    const [showModal, setShowModal] = useState(false)
    const canEdit = userPermissions.includes('update')
    const canDelete = userPermissions.includes('delete')
    const createURL = (action, id) => {
        const path = `/store/${endpoint}`
        const url = `${path}/${action}/${id}${queryString ? `?${queryString}` : ''}`
        return url
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
                    onClick={(e) => {e.preventDefault(); setShowModal(true)} }
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
            {canDelete && <DeleteModal show={showModal} onClose={setShowModal}/>}
        </Container>
    )
}