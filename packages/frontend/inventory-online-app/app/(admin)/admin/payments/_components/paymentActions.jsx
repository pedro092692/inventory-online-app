'use client'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import ApprovePaymentAction from '@/app/lib/actions/approvePayment'
import ViewReceiptButton from '@/app/(admin)/admin/payments/_components/viewReceiptButton'
import RejectPaymentModal from '@/app/(admin)/admin/payments/_components/rejectPaymentModal'
import { useActionState, useState } from 'react'

export default function PaymentActions({paymentId}) {
    const initialState = {message: null, errors: {}, inputs: {}}
    const approveAction = ApprovePaymentAction.bind(null, paymentId)
    const [approveState, approveDispatch, approvePending] = useActionState(approveAction, initialState)
    const [showReject, setShowReject] = useState(false)

    return (
        <Container padding="0px" gap="8px" direction="row" justifyContent="start">
            <ViewReceiptButton paymentId={paymentId}/>

            <Button
                type="secondary"
                size={[15, 15]}
                style={{padding: '3px 5px'}}
                disabled={approvePending}
                onClick={() => approveDispatch()}
            >
                {approvePending && <OvalLoader/>}
                {approvePending ? 'Aprobando...' : 'Aprobar'}
            </Button>

            <Button
                type="danger"
                size={[15, 15]}
                style={{padding: '3px 5px'}}
                onClick={() => setShowReject(true)}
            >
                Rechazar
            </Button>

            <RejectPaymentModal show={showReject} onClose={setShowReject} paymentId={paymentId}/>

            {approveState?.errors?.error && <span className="field_error">{approveState.errors.error}</span>}
        </Container>
    )
}
