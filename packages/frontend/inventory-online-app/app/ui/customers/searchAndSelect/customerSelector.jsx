'use client'
import GetItemAction from '@/app/lib/actions/get'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDebouncedCallback } from 'use-debounce'
import { Container } from '@/app/ui/utils/container'
import inputStyles from './input.module.css'
import InputWithIcon from '@/app/ui/customers/searchAndSelect/input/inputWithIcon'
import SearchCustomerInput from '@/app/ui/customers/searchAndSelect/input/searchInput'
import SearchResultsContainer from '@/app/ui/customers/searchAndSelect/results/searchResults'
import { Modal } from '@/app/ui/utils/alert/modal'
import QuickAddCustomerForm from '@/app/ui/customers/searchAndSelect/addCustomer/quickAddCustomerForm'


export default function CustomerSelector({value, onChange, placeHolder='Buscar cliente por Nombre, Cédula', showResult=true, bgColor, activeScreen=null, autoFocus=true}) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [error, setError] = useState(null)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [searched, setSearched] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [customerToAdd, setCustomerToAdd] = useState('')
    const [mounted, setMounted] = useState(false)
    const showResultsRef = useRef(null)
    const inputRef = useRef(null)

    const endpoint = `customers/search`
    const params = new URLSearchParams()

    // add params to url
    params.append('data', query)
    params.append('limitResults', 6)
    params.append('page', 1)
    const url = `${endpoint}?${params.toString()}`

    const handleInputChange = (e) => {
        const value = e.target.value
        setQuery(value)
        handleSearch(value)
    }

    const handleSearch = useDebouncedCallback(async (term) => {
        if(term) {
            const response = await GetItemAction(url)
            const {data, error} = response
            if (error) {setError(error)} else setError(null)
            setResults(data?.customers || [])
            setSearched(true)
        }else{
            setResults([])
            setSearched(false)
        }

    }, 300)

    const handleClick = (selectedValue) => {
        onChange(selectedValue)
        setResults([])
        setQuery('')
        setSearched(false)
    }

    const handleClickOutside = (event) => {
        if (showResultsRef.current && !showResultsRef.current.contains(event.target)) {
            setResults([])
            setQuery('')
            setSearched(false)
        }
    }

    // Opens the "agregar cliente" modal, carrying over what the user already
    // typed so they don't have to retype the name/cédula.
    const handleOpenAddModal = () => {
        setCustomerToAdd(query)
        setShowAddModal(true)
        setResults([])
        setQuery('')
        setSearched(false)
    }

    const handleCloseAddModal = () => {
        setShowAddModal(false)
        setCustomerToAdd('')
        // The modal closes (Escape, the "Cancelar" button, or a customer
        // being created) but nothing else claims focus afterward, so it was
        // just getting dropped — send it back to the search box so the
        // cashier can keep going without reaching for the mouse.
        inputRef.current?.focus()
    }

    const handleCustomerCreated = (newCustomer) => {
        onChange(newCustomer)
        handleCloseAddModal()
    }

    const handleKeyDown = (e) => {
        if (results.length === 0) {
            // No matches: Enter goes straight to "¿Deseas agregarlo?", the
            // same action as clicking that prompt with the mouse. Always
            // preventDefault on Enter here, whether or not we can actually
            // open the modal (e.g. the search itself errored out, or nothing
            // has been searched yet) — this input lives inside SellForm's own
            // <form>, so an Enter we don't swallow falls through to the
            // browser's default behavior and submits that outer form
            // instead. That's what was costing the focus: the sale form
            // pops up its own "falta completar el pago" warning and the
            // cashier is dropped out of the flow, forced back to the mouse.
            if (e.key === 'Enter') {
                e.preventDefault()
                if (searched && !error && query.trim() !== '') {
                    handleOpenAddModal()
                }
            }
            return
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlightedIndex(prev =>
                prev < results.length - 1 ? prev + 1 : 0
            )
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlightedIndex(prev =>
                prev > 0 ? prev - 1 : results.length - 1
            )
        }

        if (e.key === 'Enter') {
            // Same reasoning as above: swallow Enter unconditionally so it
            // can never reach the outer form, even before the cashier has
            // arrow-keyed onto one of the results yet.
            e.preventDefault()
            if (highlightedIndex >= 0) {
                setHighlightedIndex(-1)
                handleClick(results[highlightedIndex])
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [value])

    useEffect(() => {
        if (activeScreen === 'customer') {
            inputRef.current?.focus()
        }
    }, [activeScreen])

    // The modal (and the <form> inside QuickAddCustomerForm) is portaled to
    // document.body below, since CustomerSelector normally renders inside
    // SellForm's own outer <form> — a <form> nested inside another <form>
    // is invalid HTML and triggers a hydration error. document isn't
    // available during SSR, so we only portal once mounted on the client.
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <Container
            padding={'0px'}
            direction={'column'}
            justifyContent={'start'}
            alignItem={'start'}
            width={'100%'}
            className={inputStyles.father}
        >
            {/* input search */}
            <SearchCustomerInput query={query} onChange={handleInputChange} placeHolder={placeHolder} bgColor={bgColor} onKeyDown={handleKeyDown}            autoFocus={autoFocus}
            inputRef={inputRef}/>

            {/* show results  */}
            <SearchResultsContainer
                ref={showResultsRef}
                results={results}
                onClick={handleClick}
                highlightedIndex={highlightedIndex}
                showNoResults={searched && !error && query.trim() !== ''}
                onAddCustomer={handleOpenAddModal}
            />


            {error &&  <p className='p2-r errorMsg'>{error}</p>}

            {value && showResult &&(
                <>
                    <InputWithIcon value={value.name} icon="person" name={'name'}/>
                    <InputWithIcon value={value.id_number} icon="id" name={'id_number'}/>
                    <InputWithIcon value={value.phone} icon="phone" name={'phone'}/>
                </>
                )
            }

            {mounted && createPortal(
                <Modal show={showAddModal} onClose={handleCloseAddModal} title='Agregar cliente' ignoreEnter={true}>
                    {/* Modal keeps its children mounted at all times and only
                        toggles a CSS class to show/hide, so QuickAddCustomerForm's
                        own autoFocus (which only fires once, at mount) would never
                        fire again after the very first render. Keying it on
                        showAddModal forces a fresh mount — and a fresh autoFocus —
                        every time the modal opens. */}
                    <QuickAddCustomerForm
                        key={showAddModal}
                        initialQuery={customerToAdd}
                        onCreated={handleCustomerCreated}
                        onCancel={handleCloseAddModal}
                    />
                </Modal>,
                document.body
            )}
        </Container>
    )

}
