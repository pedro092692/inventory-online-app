import { Icon } from './icons'
import Styles from './cirlceIcon.module.css'
import { Container } from '../container' 

export default function CircleIcon({
    size=[56, 56], 
    circleBg='var(--color-blue100)', 
    iconSize=[32, 32], 
    icon='person', 
    iconColor='var(--color-blue600)',
    title='This is a title',
    text='this the content text'
    }) {
    return (
        <Container
            padding={'0px'}
            direction={'column'}
            gap={'4px'}
            alignItem={'center'}
            justifyContent={'start'}
            height={'100%'}
        >
            <div className={Styles.container} style={{background: circleBg, width: size[0], height: size[1]}}>
                <Icon icon={icon} color={iconColor} size={iconSize}/>  
            </div>

            <p className='p3-b' style={{textAlign: 'center'}}>{title}</p>
            <p className='p3-r' style={{textAlign: 'center'}}>{text}</p>
        </Container>
    )
}