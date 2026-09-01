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
    }

    const handleCustomerCreated = (newCustomer) => {
        onChange(newCustomer)
        handleCloseAddModal()
    }

    const handleKeyDown = (e) => {
        if (results.length === 0) return 

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

        if (e.key === 'Enter' && highlightedIndex >=0) {
            e.preventDefault()
            setHighlightedIndex(-1)
            handleClick(results[highlightedIndex])
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

    // CustomerSelector is used inside the invoice/"sell" <form> (see sellForm.jsx).
    // A <form> can't legally contain another <form>, so the quick-add modal is
    // portaled to document.body instead of rendered inline, to avoid nesting
    // its own <form> inside that outer one (which caused React's
    // "form was unexpectedly submitted" warning/bug on submit).
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
            <SearchCustomerInput query={query} onChange={handleInputChange} placeHolder={placeHolder} bgColor={bgColor} onKeyDown={handleKeyDown} 
            inputRef={inputRef} autoFocus={autoFocus}/>

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
                    <QuickAddCustomerForm
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