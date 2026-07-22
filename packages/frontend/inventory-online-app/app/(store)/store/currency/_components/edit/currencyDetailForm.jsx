'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/_components/detail/input.module.css'
import InputStyles from '@/app/ui/form/input/input.module.css'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import EditItemAction from '@/app/lib/actions/edit'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect, useRef } from 'react'

export default function CurrencyDetailForm({data}) {
    const originalValues = {
        value: data?.value,
        date: data?.date,
        id: data?.id
    }
    
    const initialState = {message: null, inputs: originalValues, errors: {}}
    const updateCurrency = EditItemAction.bind(null, `dollar-value`, ['value', 'id'], 'Valor editado con éxito')
    const [state, formAction, isPending] = useActionState(updateCurrency, initialState)
    const [value, setValue] = useState(data.value)
    const inputRef = useRef(null)
    
    const handleSubmit = (formData) => {
    
        return formAction(formData)

    }
    

    const handleInputChange = (e) => {
        let raw = e.target.value.replace(/\D/g, "")
        if (raw === "") raw = "0"
        const number = (parseInt(raw, 10) / 100).toFixed(2)

        setValue(number)
    }

    useEffect(() => {
        if (inputRef.current) {
            const len = inputRef.current.value.length
            inputRef.current.setSelectionRange(len, len);
        }
    }, [value])

    return (
        <>
            {data &&
                <Form className={`${styles.formview} shadow`} action={handleSubmit}  >
                    <Container
                    padding={'0px 0px 0px 16px'}
                    backgroundColor={'var(--color-neutralGrey300)'}
                    width='100%'
                    gap={'0px'}
                    borderRadius='8px'
                    justifyContent='start'
                    >
                        <Icon icon={'dollar'} color='black'/>
                        <input type="text" 
                            value={value} 
                            onChange={handleInputChange} 
                            className={`p2-r ${InputStyles.input}`}
                            name={'value'}
                            autoFocus={true}
                            ref={inputRef}
                        />
                    </Container>
                    {state?.errors?.value && <span className="field_error">{state?.errors?.value}</span>}

                    <input type="hidden" name='id' value={data.id}/>
                    
                    <Container
                    padding={'0px 0px 0px 16px'}
                    backgroundColor={'var(--color-neutralGrey600)'}
                    width='100%'
                    gap={'0px'}
                    borderRadius='8px'
                    justifyContent='start'
                    >
                        <Icon icon={'calendar'} color='black'/>
                        <input type="date" 
                            value={data.date.split('T')[0]} 
                            className={`p2-r ${InputStyles.input}`}
                            name={'date'}
                            readOnly={true} 
                            disable="true"
                            style={{backgroundColor: 'var(--color-neutralGrey600)'}}
                        />
                    </Container>
                  
                    {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

                    {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
                    
                    <Button role="submit" type="secondary" disabled={isPending} style={{cursor: 'pointer' }}>
                         {isPending && <OvalLoader/>}   
                         {isPending ? 'Guardando...' : 'Editar Valor'} 
                    </Button>
                </Form>
            }
        </>
    )  
}