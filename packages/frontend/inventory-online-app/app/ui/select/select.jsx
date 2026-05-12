'use client'
import { useState, useEffect, useRef } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import styles from './select.module.css'

export default function Select({options=[], defaultValue=null, onChange, name='select_name'}) {
    const [value, setValue] = useState(defaultValue)
    const [open, setOpen] = useState(false)
    const selectRef = useRef(null)

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
                            <div
                                key={option.value}
                            >
                                <p className='p2-r'>{option.label}</p>
                            </div>
                        )
                    })}
                </Container>
                )
            }
        </Container>

        
    )
}