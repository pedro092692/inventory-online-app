'use client'
import { Container } from '@/app/ui/utils/container'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Button } from '@/app/ui/utils/button/buttons'
import ActionDelete from '@/app/ui/utils/delete/delete'
import { useSearchParams} from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function Actions (
    {
        userPermissions=[], 
        resourceId = null,
        endpoint = '',
        deleteKey = '',
        showView=true, 
        showEdit=true, 
        showDelete=true,
    }) {
    const searchParams = useSearchParams()
    const [showAlert, setShowAlert] = useState(false)
    const createURL = (enpoint, id) => {
        const params = new URLSearchParams(searchParams)
        const basePath = `/store/${endpoint}`
        return `${basePath}/${enpoint}/${id}?${params.toString()}`
    }

    const handleDelete  = () => {
        setShowAlert(true)
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
                    onClick={(e) => {e.preventDefault(); handleDelete()} }
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

    if (userPermissions.includes('delete')) {
        return (
            <Container 
                padding={'0px'}
                gap={'20px'}
            >
                {view()}
                {edit()}
                {remove()}
                <Modal 
                    show={showAlert} 
                    onClose={setShowAlert} 
                    title='¿Estas Seguro De Eliminar Este Elemento?'
                    showIcon={true}
                    icon='trash'
                    iconColor='var(--color-accentRed400)'
                
                >
                    <ActionDelete 
                        onClose={setShowAlert}
                        endpoint={endpoint}
                        id={resourceId}
                        deleteKey={deleteKey}
                    />
                </Modal>
            </Container>
            )

    }

    if (userPermissions.includes('update')) {
        return (
            <Container 
                padding={'0px'}
                gap={'20px'}
            >
                {view()}
                {edit()}
            </Container>
        )
    }

    return (
        <Container 
            padding={'0px'}
            gap={'20px'}
        >
            {view()}
        </Container>
    )



}