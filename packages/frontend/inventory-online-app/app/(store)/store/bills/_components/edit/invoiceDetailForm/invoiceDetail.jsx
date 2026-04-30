'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import EditItemAction from '@/app/lib/actions/edit'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'

export default function ProductDetailForm() {
    return (
        <Form className={'form-edit'} style={{padding: "16px"}}>

            <label>Nombre del cliente</label>
            <Input type="text" placeHolder="Nombre del cliente" icon="product" defaultValue={state.inputs?.name ?? product.name} name={'name'} /> 
        </Form>
    )
}