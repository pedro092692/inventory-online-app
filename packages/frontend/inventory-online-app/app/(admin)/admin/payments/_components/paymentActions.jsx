'use client'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import ApprovePaymentAction from '@/app/lib/actions/approvePayment'
import RevertPaymentAction from '@/app/lib/actions/revertPayment'
import ViewReceiptButton from '@/app/(admin)/admin/payments/_components/viewReceiptButton'
import RejectPaymentModal from '@/app/(admin)/admin/payments/_components/rejectPaymentModal'
import ConfirmActionModal from '@/app/(admin)/admin/payments/_components/confirmActionModal'
import { useState } from 'react'

export default function PaymentActions({paymentId, status = 'pending'}) {
    const [showApprove, setShowApprove] = useState(false)
    const [showReject, setShowReject] = useState(false)
    const [showRevert, setShowRevert] = useState(false)

    const approveAction = ApprovePaymentAction.bind(null, paymentId)
    const revertAction = RevertPaymentAction.bind(null, paymentId)

    return (
        <Container padding="0px" gap="8px" direction="row" justifyContent="start">
            <ViewReceiptButton paymentId={paymentId}/>

            {status === 'pending' && (
                <>
                    <Button
                        type="secondary"
                        size={[15, 15]}
                        style={{padding: '3px 5px'}}
                        onClick={() => setShowApprove(true)}
                    >
                        Aprobar
                    </Button>

                    <Button
                        type="danger"
                        size={[15, 15]}
                        style={{padding: '3px 5px'}}
                        onClick={() => setShowReject(true)}
                    >
                        Rechazar
                    </Button>

                    <ConfirmActionModal
                        show={showApprove}
                        onClose={setShowApprove}
                        title="Aprobar pago"
                        message="Se marcará el pago como aprobado y se renovará la suscripción de la tienda. ¿Confirmas?"
                        action={approveAction}
                        confirmLabel="Sí, aprobar"
                        pendingLabel="Aprobando..."
                        iconColor="var(--color-accentGreen400)"
                    />

                    <RejectPaymentModal show={showReject} onClose={setShowReject} paymentId={paymentId}/>
                </>
            )}

            {status !== 'pending' && (
                <>
                    <Button
                        type="outline"
                        size={[15, 15]}
                        style={{padding: '3px 5px'}}
                        onClick={() => setShowRevert(true)}
                    >
                        Revertir a pendiente
                    </Button>

                    <ConfirmActionModal
                        show={showRevert}
                        onClose={setShowRevert}
                        title="Revertir pago"
                        message={
                            status === 'approved'
                                ? 'El pago volverá a quedar pendiente y se descontarán los días de suscripción que se otorgaron al aprobarlo. ¿Confirmas?'
                                : 'El pago volverá a quedar pendiente para revisarlo de nuevo. ¿Confirmas?'
                        }
                        action={revertAction}
                        confirmLabel="Sí, revertir"
                        pendingLabel="Revirtiendo..."
                        iconColor="var(--color-accentRed400)"
                    />
                </>
            )}
        </Container>
    )
}
