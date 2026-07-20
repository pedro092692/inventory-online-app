'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/add/input.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'

export default function AddStaffForm() {
    
    const initialState = {message: null, inputs: {}, errors: {}}
    const addStaff = AddItemAction.bind(
            null, 
            'sellers', 
            ['id_number', 'name', 'last_name', 'address', 'email', 'password', 'role_id'])
}