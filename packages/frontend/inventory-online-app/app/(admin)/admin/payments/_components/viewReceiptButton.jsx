'use client'
import { Button } from '@/app/ui/utils/button/buttons'
import GetItemAction from '@/app/lib/actions/get'
import { useState } from 'react'

export default function ViewReceiptButton({paymentId}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleClick = async () => {
        setLoading(true)
        setError(null)
        const { data, error: reqError } = await GetItemAction(`users/payments/${paymentId}/receipt-url`)
        setLoading(false)

        if (data?.url) {
            window.open(data.url, '_blank', 'noopener,noreferrer')
            return
        }

        setError((typeof data?.errors === 'string' && data.errors) || reqError || 'No se pudo abrir el comprobante')
    }

    return (
        <>
            <Button
                showIcon={true}
                icon='view'
                type="outline"
                size={[15, 15]}
                style={{padding: '3px 8px'}}
                onClick={handleClick}
                disabled={loading}
                className='p2-r'
            >
                {loading ? 'Abriendo...' : 'Ver comprobante'}
            </Button>
            {error && <span className="field_error">{error}</span>}
        </>
    )
}
