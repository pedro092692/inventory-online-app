'use client'
import { useState, useEffect, useRef, useMemo, useImperativeHandle } from 'react'
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
        customer = null,
        emptyMsg = 'No hay opciones disponibles.',
        ref = null,
    }) {

    const [open, setOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const selectRef = useRef(null)
    const triggerRef = useRef(null)

    // options actually renderable (hides store credit when the customer has no credit available)
    const visibleOptions = useMemo(() => {
        const totalCredits = parseFloat(customer?.total_credits || 0)
        return options.filter(option => {
            const isCreditOption = option.value == STORE_CREDIT_ID
            return !(isCreditOption && totalCredits <= 0)
        })
    }, [options, customer])

    const selectedOption = options.find(option => String(option.value) === String(value))
    const displayLabel = selectedOption ? selectedOption.label : (options[0]?.label || 'Seleccionar...')

    const handleOptionClick = (option) => {
        onChange(option)
        setOpen(false)
        triggerRef.current?.focus()
    }

    const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
            setOpen(false)
        }
    }

    // Opens the list and highlights the currently selected option (or the first one).
    const openList = () => {
        setOpen(true)
        const currentIndex = visibleOptions.findIndex(option => String(option.value) === String(value))
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
    }

    // Keyboard support: Enter/Space/ArrowDown/ArrowUp open the list, then
    // ArrowUp/ArrowDown move the highlight, Enter/Space pick it and Escape closes.
    const handleTriggerKeyDown = (e) => {
        if (disabled) return

        if (!open) {
            if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
                e.preventDefault()
                openList()
            }
            return
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlightedIndex(prev => (prev < visibleOptions.length - 1 ? prev + 1 : 0))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : visibleOptions.length - 1))
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
                handleOptionClick(visibleOptions[highlightedIndex])
            }
        } else if (e.key === 'Escape') {
            e.preventDefault()
            setOpen(false)
        } else if (e.key === 'Tab') {
            setOpen(false)
        }
    }

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside)
        return () => {
           window.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        setOpen(false)
    }, [resetKey])

    // Lets a parent (e.g. a keyboard shortcut) jump straight into this select
    // and open it in one step, instead of relying on Tab order to reach it —
    // handy when this field sits far from wherever focus currently is.
    useImperativeHandle(ref, () => ({
        openAndFocus: () => {
            if (disabled) return
            triggerRef.current?.focus()
            openList()
        }
    }), [disabled, visibleOptions, value])

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
                ref={triggerRef}
                width={'100%'}
                padding={'12px'}
                justifyContent={'space-between'}
                borderRadius={'8px'}
                backgroundColor={'white'}
                className={`${styles.parent} shadow`}
                onClick={() => !disabled && (open ? setOpen(false) : openList())}
                onKeyDown={handleTriggerKeyDown}
                tabIndex={disabled ? -1 : 0}
                role='combobox'
                aria-expanded={open}
                aria-haspopup='listbox'
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
                    role='listbox'
                >
                    {
                    visibleOptions.length > 0
                    ?
                    visibleOptions.map((option, index) => {
                        const isHighlighted = index === highlightedIndex
                        return (
                            <Container
                                padding={'0px'}
                                width={'100%'}
                                direction={'column'}
                                alignItem={'start'}
                                key={option.value}
                                role='option'
                                aria-selected={String(option.value) === String(value)}
                            >
                                <p className={`${styles.item} ${isHighlighted ? styles.itemHighlighted : ''} p2-r`}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    onClick={() => handleOptionClick(option)}>
                                    {option.label}
                                </p>
                            </Container>
                        )
                    })
                    :
                    <p>{emptyMsg}</p>
                    }
                </Container>
                )
            }
            <input type='hidden' name={name} value={value} />
        </Container>


    )
}
