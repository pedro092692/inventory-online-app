import styles from './list.module.css'
import { Container } from '@/app/ui/utils/container'
export default function ListSkeleton({nTitle = 5, nRows = 8}) {
    
    return (
        <div className={`${styles.container} shadow-sm`} >
            <Container
                direction='column'
                alignItem='start'
                padding='0px'
                height='100%'
            >
                <Container
                    padding='0px 8px'
                    backgroundColor='var(--color-blue400)'
                    width='100%'
                    height='35px'
                    justifyContent='space-between'

                >
                    {Array.from({length: nTitle}).map((_, index) => {
                        return(
                            <div key={index} className={`${styles.headTitle} skeleton`} style={{width: Math.floor(1509.36 / (nTitle + 1))}} />
                        )
                    })}
                        
                </Container>

                <Container
                    padding='0px 8px'
                    direction='row'
                    gap='16px'
                    width='100%'
                    flexGrow='1'
                    justifyContent='space-between'
                >  
                   
                   {Array.from({length: nTitle}).map((_, index) => {
                        return(
                            <Container
                                width='100%'
                                padding='8px 0px'
                                direction='column'
                                gap='16px'
                                height='100%'
                                key={index}
                                >
                                   {Array.from({length: nRows}).map((_, index) => {
                                        return(
                                            <div key={index} className={`${styles.listRow} skeleton`} />

                                        )
                                    })} 
                            </Container> 
                        )
                   })}
                </Container>  
            </Container>
        </div>
    )
}