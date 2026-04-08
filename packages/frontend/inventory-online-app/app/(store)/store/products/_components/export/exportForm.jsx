'use client'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useState } from 'react'
import sytles from './form.module.css'


export default function exportProductForm() {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)
    
    const handleDownload = async (e) => {
        e.preventDefault()
        setIsPending(true)
        
        try{ 
            const response = await fetch('/api/export', {
                method: 'GET'
            })

            if (!response.ok) {
                throw Error('Error en la descarga')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'productos.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

        }catch(error){
            setError("No se pudo generar el archivo. Inténtalo de nuevo.")
        }finally{
            setIsPending(false)
        }
    }
 
    return (
        <form className={sytles.form}>
            <Button 
                icon={isPending ? null : 'excel'}
                showIcon={!isPending} 
                onClick={handleDownload}
                role="submit" type="primary" 
                disabled={isPending}
                style={{backgroundColor: 'var(--color-blue700)', 
                color: 'var(--color-neutralWhite)',
                fontSize: '16px',
                fontWeight: 300
            }}
            >
                {isPending ? <OvalLoader /> : null}
                {isPending ? 'Generando archivo...' : 'Exportar Productos'}
            </Button>
            {error && <span className='field_error'>{error}</span>}
        </form>
    )
    
}