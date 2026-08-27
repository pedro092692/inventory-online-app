'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from './editStoreOwnerForm.module.css'
import EditItemAction from '@/app/lib/actions/edit'
import { OvalLoader } from '@/app/ui/loader/spinner'
import BlockStoreModal from './blockStoreModal'
import { useActionState, useState } from 'react'

export default function StoreOwnerDetailForm({user, seller, store, stats}) {
    const daysUntil = (dateStr) => {
        if (!dateStr) return null
        const diffMs = new Date(dateStr).getTime() - Date.now()
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    }

    const remaining = daysUntil(store?.subscription_expires_at)

    const subscriptionLabel = remaining === null
        ? 'Sin información de pago'
        : remaining >= 0
            ? `Activa — vence en ${remaining} día${remaining === 1 ? '' : 's'}`
            : `Vencida hace ${Math.abs(remaining)} día${Math.abs(remaining) === 1 ? '' : 's'}`

    const subscriptionColor = remaining === null ? '#888' : remaining >= 0 ? 'green' : '#c0392b'

    const originalValues = {
        email: user?.email,
        store_name: store?.name,
        fiscal_id: store?.fiscal_id,
        store_phone: store?.phone,
        store_address: store?.address,
        name: seller?.name,
        last_name: seller?.last_name,
        id_number: seller?.id_number,
        address: seller?.address,
    }
    const initialState = {message: null, inputs: originalValues, errors: {}}

    const updateStoreOwner = EditItemAction.bind(null, `users/storeOwner/${user?.id}`,
        ['email', 'password', 'store_name', 'fiscal_id', 'store_phone', 'store_address', 'name', 'last_name', 'id_number', 'address'],
        'Tienda editada con éxito')

    const [state, formAction, isPending] = useActionState(updateStoreOwner, initialState)
    const [phoneValue, setPhoneValue] = useState(state.inputs?.store_phone ?? store?.phone ?? '')
    const [showBlockModal, setShowBlockModal] = useState(false)

    const unblockStoreAction = EditItemAction.bind(null, `users/store/${user?.id}/unblock`, [], 'Tienda desbloqueada')
    const [unblockState, unblockAction, unblockPending] = useActionState(unblockStoreAction, {message: null, errors: {}, inputs: {}})

    const isBlocked = store?.is_active === false

    const handleSubmit = (formData) => {
        const formattedPhone = formData.get('store_phone') || ''
        formData.set('store_phone', '+' + formattedPhone.replace(/\D/g, ''))
        return formAction(formData)
    }

    return (
        <>
            {user &&
                <Form className={`${styles.form} shadow`} action={handleSubmit}>

                    {/* <fieldset className={styles.fieldset}>
                        <legend className={`p2-b ${styles.legend}`}>Salud de la tienda</legend>
                        <p className='p2-r' style={{color: subscriptionColor}}>{subscriptionLabel}</p>
                        <p className='p2-r'>Vendedores: {stats?.sellerCount ?? '—'}</p>
                        <p className='p2-r'>Clientes: {stats?.customerCount ?? '—'}</p>
                        <p className='p2-r'>
                            Última factura: {stats?.lastInvoiceDate ? new Date(stats.lastInvoiceDate).toLocaleDateString('es-VE') : 'Sin facturas'}
                        </p>
                        <p className='p2-r' style={{color: isBlocked ? '#c0392b' : 'green'}}>
                            Estado: {isBlocked ? 'Bloqueada' : 'Activa'}
                        </p>
                        {isBlocked && store?.blocked_reason &&
                            <p className='p2-r' style={{color: '#c0392b'}}>
                                Motivo: {store.blocked_reason}
                                {store?.blocked_at ? ` (${new Date(store.blocked_at).toLocaleDateString('es-VE')})` : ''}
                            </p>
                        }

                        {isBlocked ? (
                            <Button type="secondary" disabled={unblockPending} onClick={() => unblockAction()}>
                                {unblockPending && <OvalLoader/>}
                                {unblockPending ? 'Desbloqueando...' : 'Desbloquear tienda'}
                            </Button>
                        ) : (
                            <Button type="danger" onClick={() => setShowBlockModal(true)}>
                                Bloquear tienda
                            </Button>
                        )}
                        {unblockState?.message && <span style={{color: 'green'}}>{unblockState.message}</span>}
                    </fieldset> */}

                    <div className={styles.grid}>
                        <fieldset className={styles.fieldset}>
                            <legend className={`p2-b ${styles.legend}`}>Datos de la tienda</legend>

                            <Input type="text" icon="store" name={'store_name'}
                                defaultValue={state.inputs?.store_name ?? store?.name}
                                placeHolder='Nombre de la tienda' capitalize={true}
                            />
                            {state?.errors?.store_name && <span className="field_error">{state?.errors?.store_name}</span>}

                            <Input type="text" icon="id" name={'fiscal_id'}
                                defaultValue={state.inputs?.fiscal_id ?? store?.fiscal_id}
                                placeHolder='Registro fiscal (opcional)' required={false}
                            />
                            {state?.errors?.fiscal_id && <span className="field_error">{state?.errors?.fiscal_id}</span>}

                            <Input type="phone" icon="phone" value={phoneValue} name={'store_phone'}
                                onChange={(e) => setPhoneValue(e.target.value)}
                            />
                            {state?.errors?.store_phone && <span className="field_error">{state?.errors?.store_phone}</span>}

                            <Input type="text" icon="address" name={'store_address'}
                                defaultValue={state.inputs?.store_address ?? store?.address}
                                placeHolder='Dirección' capitalize={true}
                            />
                            {state?.errors?.store_adress && <span className="field_error">{state?.errors?.store_adress}</span>}
                        </fieldset>

                        <fieldset className={styles.fieldset}>
                            <legend className={`p2-b ${styles.legend}`}>Datos del usuario</legend>

                            <Input type="email" icon="mail" name={'email'}
                                defaultValue={state.inputs?.email ?? user?.email}
                                placeHolder='Email'
                            />
                            {state?.errors?.email && <span className="field_error">{state?.errors?.email}</span>}

                            <Input type="password" icon="padlock" name={'password'}
                                defaultValue={""}
                                placeHolder='Nueva contraseña (opcional)' required={false}
                            />
                            {state?.errors?.password && <span className="field_error">{state?.errors?.password}</span>}
                        </fieldset>

                        <fieldset className={styles.fieldset}>
                            <legend className={`p2-b ${styles.legend}`}>Datos del vendedor</legend>

                            <Input type="text" icon="person" name={'name'}
                                defaultValue={state.inputs?.name ?? seller?.name}
                                placeHolder='Nombre del dueño' capitalize={true}
                            />
                            {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}

                            <Input type="text" icon="paper" name={'last_name'}
                                defaultValue={state.inputs?.last_name ?? seller?.last_name}
                                placeHolder='Apellido' capitalize={true}
                            />
                            {state?.errors?.last_name && <span className="field_error">{state?.errors?.last_name}</span>}

                            <Input type="number" icon="id" name={'id_number'}
                                defaultValue={state.inputs?.id_number ?? seller?.id_number}
                                placeHolder='Número de cédula'
                            />
                            {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}

                            <Input type="text" icon="address" name={'address'}
                                defaultValue={state.inputs?.address ?? seller?.address}
                                placeHolder='Dirección' capitalize={true}
                            />
                            {state?.errors?.address && <span className="field_error">{state?.errors?.address}</span>}
                        </fieldset>
                    </div>

                    {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}
                    {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

                    <Button role="submit" type="secondary" disabled={isPending}>
                        {isPending && <OvalLoader/>}
                        {isPending ? 'Guardando...' : 'Editar Tienda'}
                    </Button>
                </Form>
            }
            <BlockStoreModal show={showBlockModal} onClose={setShowBlockModal} tenantId={user?.id}/>
        </>
    )
}
