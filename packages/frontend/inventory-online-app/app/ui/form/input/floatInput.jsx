'use client'
import { useState, useEffect, useRef } from 'react'
import InputStyles from '@/app/ui/form/input/input.module.css'

export default function FloatInput({inputValue = false, name='value'}) {
    const [value, setValue] = useState('0.00')
    const inputRef = useRef(null)

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
        <input type="text" 
                value={value} onChange={handleInputChange} 
                className={`p2-r ${InputStyles.input}`}
                name={name}
                autoFocus={true}
                ref={inputRef}
                style={{width: '100%'}}
        />
    )
}