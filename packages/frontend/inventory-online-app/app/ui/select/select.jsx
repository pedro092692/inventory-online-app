'use client'
import { useState, useEffect, useRef } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import styles from './select.module.css'

export default function Select({options=[], defaultValue=null, selectKey='', name='select_name'}) {
    const [value, setValue] = useState(defaultValue)
    const [key, setKey] = useState(selectKey || '')
    const [open, setOpen] = useState(false)
    const selectRef = useRef(null)

    const handleOptionClick = (option) => {
        setValue(option.label)
        setKey(option.value)
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
                onClick={() => setOpen(!open)}
            >


                <p className='p2-b'>{value}</p>
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
                    {options.map(option => {
                        return (
                            <Container
                                padding={'0px'}
                                width={'100%'}
                                direction={'column'}
                                alignItem={'start'}
                                key={option.value}
                            >
                                <p className={`${styles.item} p2-r`} onClick={() => handleOptionClick(option)}>
                                    {option.label}
                                </p>
                            </Container>
                        )
                    })}
                </Container>
                )
            }
            <input type='hidden' name={name} value={key} />
        </Container>

        
    )
}