
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import inputStyles from '@/app/ui/customers/searchAndSelect/input.module.css'

export default function SearchCustomerInput({query, onChange, placeHolder, onKeyDown = () => ''}) {
    return (
        <Container
                padding={'0px 0px 0px 16px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                width='100%'
                gap={'0px'}
                borderRadius={'8px'}
                justifyContent={'start'}
                className={'shadow-bottom-sm'}
            >
                <Icon icon={'search'} color='black'/>
                <input 
                    className={`p2-r ${inputStyles.input}`}
                    style={{background: 'var(--color-neutralGrey300)'}}
                    type="search" 
                    name="search" 
                    placeholder={placeHolder} 
                    icon="search" 
                    autoFocus={true}
                    onChange={(e) => onChange(e)}
                    onKeyDown={(e) => onKeyDown(e)}
                    value={query}
                    autoComplete='off'

                />
        </Container>
    )
}