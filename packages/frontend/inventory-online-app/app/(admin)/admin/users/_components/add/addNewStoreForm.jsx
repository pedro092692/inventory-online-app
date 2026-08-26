'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/add/input.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useRef, useEffect } from 'react'

const STEPS = [
    { key: 'store', label: 'Datos de la tienda' },
    { key: 'owner', label: 'Datos del dueño' }
]

// para saber a qué paso saltar si el backend devuelve un error de un campo
const FIELD_STEP = {
    store_name: 0, fiscal_id: 0, address: 0, phone: 0,
    given_name: 1, last_name: 1, id_number: 1, email: 1, password: 1, pin: 1
}

export default function AddNewStoreForm() {

    const initialState = {message: null, inputs: {}, errors: {}}
    const addStore = AddItemAction.bind(null, 'users/store', [
        'given_name', 'last_name', 'id_number', 'address', 'email',
        'password', 'pin', 'store_name', 'fiscal_id', 'phone'
    ], 'Nueva tienda creada con éxito')
    const [state, formAction, isPending] = useActionState(addStore, initialState)
    const [phoneValue, setPhoneValue] = useState(state.inputs?.phone ?? '')
    const [step, setStep] = useState(0)
    const formRef = useRef(null)
    const step0Ref = useRef(null)
    const step1Ref = useRef(null)
    const stepRefs = [step0Ref, step1Ref]

    // si el submit final falla, salta automáticamente al paso del primer error
    useEffect(() => {
         if (state?.message) {
            setStep(0)
            setPhoneValue('')
            return
        }
        
        const errorFields = Object.keys(state?.errors || {})
        if (errorFields.length > 0) {
            setStep(Math.min(...errorFields.map((f) => FIELD_STEP[f] ?? 0)))
        }

    }, [state])
    
    const goNext = () => {
        const currentStepEl = stepRefs[step].current
        const inputs = [...currentStepEl.querySelectorAll('input')]
        const valid = inputs.every((input) => input.reportValidity())

        if (valid) {
            setStep((s) => Math.min(s + 1, STEPS.length - 1))
        }
    }
    const goBack = () => setStep((s) => Math.max(s - 1, 0))

    const handleSubmit = (formData) => {
        const formattedPhone = formData.get('phone') || ''
        formData.set('phone', '+' + formattedPhone.replace(/\D/g, ''))
        return formAction(formData)
    }

    const isLastStep = step === STEPS.length - 1

    return (
        <Form ref={formRef} className={`${styles.form} shadow`} action={handleSubmit}>
            <p className='p2-r' style={{marginBottom: '8px'}}>
                Paso {step + 1} de {STEPS.length} — {STEPS[step].label}
            </p>

            <div ref={step0Ref} style={{display: step === 0 ? 'flex' : 'none', flexDirection: 'column', gap: '12px', width: '100%'}}>
                <Input type="text" icon="store" name={'store_name'}
                    defaultValue={state.inputs?.store_name ?? ""}
                    placeHolder='Nombre de la tienda' capitalize={true}
                />
                {state?.errors?.store_name && <span className="field_error">{state?.errors?.store_name}</span>}

                <Input type="text" icon="id" name={'fiscal_id'}
                    defaultValue={state.inputs?.fiscal_id ?? ""}
                    placeHolder='Registro fiscal (opcional)' required={false}
                />
                {state?.errors?.fiscal_id && <span className="field_error">{state?.errors?.fiscal_id}</span>}

                <Input type="text" icon="address" name={'address'}
                    defaultValue={state.inputs?.address ?? ""}
                    placeHolder='Dirección de la tienda' capitalize={true}
                />
                {state?.errors?.address && <span className="field_error">{state?.errors?.address}</span>}

                <Input type="phone" icon="phone" value={phoneValue} name={'phone'}
                    onChange={(e) => setPhoneValue(e.target.value)}
                />
                {state?.errors?.phone && <span className="field_error">{state?.errors?.phone}</span>}
            </div>

            <div ref={step1Ref} style={{display: step === 1 ? 'flex' : 'none', flexDirection: 'column', gap: '12px', width: '100%'}}>
                <Input type="text" icon="person" name={'given_name'}
                    defaultValue={state.inputs?.given_name ?? ""}
                    placeHolder='Nombre del dueño' capitalize={true}
                />
                {state?.errors?.given_name && <span className="field_error">{state?.errors?.given_name}</span>}

                <Input type="text" icon="paper" name={'last_name'}
                    defaultValue={state.inputs?.last_name ?? ""}
                    placeHolder='Apellido' capitalize={true}
                />
                {state?.errors?.last_name && <span className="field_error">{state?.errors?.last_name}</span>}

                <Input type="number" icon="id" name={'id_number'} placeHolder='Número de cedula'
                    defaultValue={state.inputs?.id_number ?? ""}
                />
                {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}

                <Input type="email" icon="mail" name={'email'}
                    defaultValue={state.inputs?.email ?? ""}
                    placeHolder='Email'
                />
                {state?.errors?.email && <span className="field_error">{state?.errors?.email}</span>}

                <Input type="password" icon="padlock" name={'password'}
                    defaultValue={state.inputs?.password ?? ""}
                    autocomplete={'new-password'}
                    placeHolder='Contraseña' capitalize={true}
                />
                {state?.errors?.password && <span className="field_error">{state?.errors?.password}</span>}

                <Input type="password" icon="padlock" name={'pin'}
                    defaultValue={state.inputs?.pin ?? ""}
                    placeHolder='PIN Para Permisos' capitalize={true}
                />
                {state?.errors?.pin && <span className="field_error">{state?.errors?.pin}</span>}
            </div>

            {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}
            {state?.errors && typeof state.errors != 'object' && <span className="field_error">{state?.errors}</span>}
            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

            <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                {step > 0 &&
                    <Button role="button" type="outline" onClick={goBack}>Atrás</Button>
                }
                {!isLastStep &&
                    <Button role="button" type="secondary" onClick={goNext}>Siguiente</Button>
                }
                {isLastStep &&
                    <Button role="submit" type="secondary" disabled={isPending}>
                        {isPending && <OvalLoader/>}
                        {isPending ? 'Creando Tienda...' : 'Crear Nueva Tienda'}
                    </Button>
                }
            </div>
        </Form>
    )
}