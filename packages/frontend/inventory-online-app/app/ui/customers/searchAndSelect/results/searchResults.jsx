
import { Container } from '@/app/ui/utils/container'
import inputStyles from '@/app/ui/customers/searchAndSelect/input.module.css'

export default function SearchResultsContainer({results=[], onClick}) {
    return (
        <>
        {results.length > 0 && 
            <Container
                gap={'2px'}
                direction={'column'}
                alignItem={'start'}
                justifyContent={'start'}
                className={inputStyles.results}
            >
                {results.map((customer) => {
                    return (
                        <p 
                            className={`p2-b ${inputStyles.result}`}
                            key={customer.id}
                            onClick={() => onClick(customer) }
                        >
                            {customer.name}  
                            <span className='p2-r' style={{color: 'grey'}}> | </span>
                            <span className='p2-r' style={{fontStyle: 'italic'}}>Cédula: {customer.id_number}</span>
                        </p>
                    )
                })}
            </Container>
        }
        </>
    )
} 