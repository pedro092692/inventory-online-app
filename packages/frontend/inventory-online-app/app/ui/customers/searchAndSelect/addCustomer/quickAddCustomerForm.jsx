'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useEffect, useState } from 'react'

/**
 * Compact "agregar cliente" form meant to live inside a Modal, used when a
 * search in CustomerSelector doesn't match any existing customer.
 * Mirrors the fields/validation/action of AddClientForm (app/(store)/store/customers/_components/add/addCustomerForm.jsx)
 * but calls onCreated with the new customer instead of navigating away.
 */
export default function QuickAddCustomerForm({ initialQuery = '', onCreated = () => {}, onCancel = () => {} }) {
    const trimmedQuery = initialQuery.trim()
    const isIdNumber = /^\d+$/.test(trimmedQuery)

    const initialState = {
        message: null,
        errors: {},
        inputs: {
            name: isIdNumber ? '' : trimmedQuery,
            id_number: isIdNumber ? trimmedQuery : ''
        }
    }

    const addCustomer = AddItemAction.bind(null, 'customers', ['name', 'id_number', 'phone'], 'Cliente agregado con éxito')
    const [state, formAction, isPending] = useActionState(addCustomer, initialState)
    const [phoneValue, setPhoneValue] = useState('')

    const handleSubmit = (formData) => {
        if (!formData.get('name') || !formData.get('id_number') || !formData.get('phone')) return
        const formattedPhone = formData.get('phone')
        const cleaned = '+' + formattedPhone.replace(/\D/g, '')
        formData.set('phone', cleaned)
        formAction(formData)
    }

    useEffect(() => {
        if (state?.message && state?.item?.newCustomer) {
            onCreated(state.item.newCustomer)
        }
    }, [state])

    return (
        // The Modal wrapper closes itself on a second Enter keypress (see modal.jsx),
        // which fights with tabbing across 3 inputs. Stop Enter from bubbling up to
        // it; the form's own submit (via the `action`) still runs normally.
        <div onKeyDown={(e) => { if (e.key === 'Enter') e.stopPropagation() }}>
        <Form action={handleSubmit}>
            <Container direction='column' padding='0px' gap='16px' justifyContent='start' alignItem='start'
                width={'400px'}
            >
                <Input type="text" icon="person" name={'name'}
                    defaultValue={state.inputs?.name ?? ''}
                    placeHolder='Nombre'
                    capitalize={true}
                    autoFocus={!isIdNumber && !!trimmedQuery}
                />
                {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}

                <Input type="number" icon="id" name={'id_number'} placeHolder='Número de cedula'
                    defaultValue={state.inputs?.id_number ?? ''}
                    autoFocus={isIdNumber}
                />
                {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}

                <Input type="phone" icon="phone" name={'phone'} placeHolder='Número de teléfono'
                    value={phoneValue}
                    onChange={(e) => setPhoneValue(e.target.value)}
                />
                {state?.errors?.phone && <span className="field_error">{state?.errors?.phone}</span>}

                {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

                <Container direction='row' padding='0px' gap='8px' justifyContent='space-between' width={'100%'}>
                    <Button role="submit" type="secondary" disabled={isPending}>
                        {isPending && <OvalLoader/>}
                        {isPending ? 'Guardando...' : 'Guardar Cliente'}
                    </Button>
                    <Button role="button" type="danger" onClick={onCancel} disabled={isPending}>
                        Cancelar
                    </Button>
                </Container>
            </Container>
        </Form>
        </div>
    )
}
