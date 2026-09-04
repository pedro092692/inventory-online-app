
import { Container } from '@/app/ui/utils/container'
import inputStyles from '@/app/ui/customers/searchAndSelect/input.module.css'
import styles from '@/app/(store)/store/sell/_components/product/productSelector.module.css'

export default function SearchResultsContainer({results=[], onClick, ref, highlightedIndex=null, showNoResults=false, onAddCustomer=null}) {
    const hasContent = results.length > 0 || showNoResults

    return (
        <>
        {hasContent &&
            <Container
                gap={'2px'}
                direction={'column'}
                alignItem={'start'}
                justifyContent={'start'}
                className={inputStyles.results}
                zIndex={'100'}
                ref={ref}
            >
                {results.map((customer, index) => {
                    const isActive = index === highlightedIndex
                    return (
                        <p
                            className={`p2-b ${inputStyles.result} ${isActive && styles.active}`}
                            key={customer.id}
                            onClick={() => onClick(customer) }
                        >
                            {customer.name}
                            <span className='p2-r' style={{color: 'grey'}}> | </span>
                            <span className='p2-r' style={{fontStyle: 'italic'}}>Cédula: {customer.id_number}</span>
                        </p>
                    )
                })}

                {showNoResults && results.length === 0 &&
                    <div className={inputStyles.noResultRow}>
                        <p className='p2-r'>Este cliente no existe.</p>
                        {onAddCustomer &&
                            <p
                                className={`p2-b ${inputStyles.addCustomerLink}`}
                                // onMouseDown (not onClick) fires before the document-level
                                // "click outside" listener that clears the search, and
                                // stopPropagation keeps that listener from wiping the query
                                onMouseDown={(e) => { e.stopPropagation(); onAddCustomer() }}
                            >
                                ¿Deseas agregarlo?
                            </p>
                        }
                    </div>
                }
            </Container>
        }
        </>
    )
}