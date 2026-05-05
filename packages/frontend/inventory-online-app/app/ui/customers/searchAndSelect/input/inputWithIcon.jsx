import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import inputStyles from '@/app/ui/customers/searchAndSelect/input.module.css'

export default function InputWithIcon({value='Jhon Doe', icon='person', type='text', name='name'}) {
    return (
        <Container
            padding={'0px 0px 0px 16px'}
            backgroundColor={'var(--color-neutralGrey300)'}
            width='100%'
            borderRadius='8px'
            gap={'0px'}
            justifyContent='start'
        >

            <Icon icon={icon} color='black'/>
            <input type={type} icon={icon} value={value} className={`p2-r ${inputStyles.customerInput}`} 
            name={name}
            readOnly={true} style={{padding: '0px 0px 0px 8px'}}/>
                        
       </Container>
    )
}