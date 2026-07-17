'use client'
import { useState, useEffect, useRef } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import styles from './select.module.css'
const STORE_CREDIT_ID = process.env.NEXT_PUBLIC_STORE_CREDIT_ID || 8

export default function Select({
        options = [],
        value = '',
        name = 'select_name',
        resetKey = null, 
        onChange = () => {}, 
        disabled = false, 
        customer = null
    }) {
    
    const [open, setOpen] = useState(false)
    const selectRef = useRef(null)

    const selectedOption = options.find(option => String(option.value) === String(value))
    const displayLabel = selectedOption ? selectedOption.label : (options[0]?.label || 'Seleccionar...')
    
    const handleOptionClick = (option) => {
        onChange(option) 
        setOpen(false)
    }

    const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
            setOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        setOpen(false)
    }, [resetKey])

    return (
        <Container
            ref={selectRef}
            width={'100%'}
            padding={'0px'}
            direction={'column'}
            gap={'4px'}
            alignItem={'start'}
            className={`${styles.parent}`}
        >
            <Container
                width={'100%'}
                padding={'12px'}
                justifyContent={'space-between'}
                borderRadius={'8px'}
                backgroundColor={'white'}
                className={`${styles.parent} shadow`}
                onClick={() => !disabled && setOpen(!open)}
            >


                <p className='p2-b'>{displayLabel}</p>
                <Icon icon='playArrow' color='var(--color-neutralGrey900)' style={{ rotate: open ? '90deg' : '0deg' }}/>

            
            </Container>

            {/* options */}
            {open && (
                <Container
                    width={'100%'}
                    padding={'12px'}
                    direction={'column'}
                    gap={'8px'}
                    borderRadius={'8px'}
                    backgroundColor={'white'}
                    alignItem={'start'}
                    className={`${styles.child}`}
                >
                    {options.map((option, index) => {
                        const isCreditOption = option.value == STORE_CREDIT_ID
                        const totalCredits = parseFloat(customer?.total_credits || 0)
                        if (isCreditOption && totalCredits <= 0) {
                            return null
                        }
                        return (
                            <Container
                                padding={'0px'}
                                width={'100%'}
                                direction={'column'}
                                alignItem={'start'}
                                key={option.value}
                            >
                                <p className={`${styles.item} p2-r`} 
                                    onClick={ onChange ? () => {onChange(option); handleOptionClick(option)} 
                                    : () => handleOptionClick(option)}>
                                    {option.label}
                                </p>
                            </Container>
                        )
                    })}
                </Container>
                )
            }
            <input type='hidden' name={name} value={value} />
        </Container>

        
    )
}