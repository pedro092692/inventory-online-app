'use client'
import { useState, useEffect, use } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Button } from '@/app/ui/utils/button/buttons'
import ActionDelete from '@/app/ui/utils/delete/delete'
import Link from 'next/link'

export default function Actions (
    {
        userPermission=[], 
        urlPath='', 
        id=1, 
        params='', 
        showView=true, 
        showEdit=true, 
        showDelete=true,
        deletionID='id',
        setTableData=null
    }) {
    
    const basePath = '/store'
    const [showAlert, setShowAlert] = useState(false)


    const handleDelete  = () => {
        setShowAlert(true)
    }

    const view = (href=`${basePath}/${urlPath}/view/detail/${id}${params?params:''}`) => {
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

    const edit = (href=`${basePath}/${urlPath}/edit/${id}${params?params:''}`) => {
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

    const remove = (href=`${basePath}/${urlPath}/delete/${id}`) => {
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

    if (userPermission.includes('delete')) {
        
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
                        deletionID={deletionID}
                        urlPath={urlPath}
                        id={id}
                        setTableData={setTableData}
                        show={showAlert}
                        
                    />
                </Modal>
            </Container>
            )

    }

    if (userPermission.includes('edit')) {
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