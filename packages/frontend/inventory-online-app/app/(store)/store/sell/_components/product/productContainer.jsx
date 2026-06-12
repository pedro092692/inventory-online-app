import { Container } from "@/app/ui/utils/container"
import styles from './productSelector.module.css'


export default function ProductResultContainer({results = [], ref, onClick=() => ''}) {
    
    return (
        
        <Container className={`${styles.headerContainer}`} ref={ref}>
            <Container className={styles.header}>
                    <div className={styles.headerCOD}>
                        <p className={'p3-b'}>
                            COD
                        </p>
                    </div>
                    <div className={styles.headerName}>
                        <p className={'p3-b'}>
                            NOMBRE
                        </p>
                    </div>
                    <div className={styles.headerPriceBs}>
                        <p className={'p3-b'}>
                            PRECIO Bs
                        </p>
                    </div>
                    <div className={styles.headerPrice}>
                        <p className={'p3-b'}>
                            PRECIO $
                        </p>
                    </div>
            </Container>
            
            <Container className={styles.resultsContainer}>
                {results.map((product, index) => {
                    return (
                        <Container key={index} className={styles.result} onClick={() => onClick(product)}>
                            <div className={styles.resultCOD}>
                                <p className={'p2-b'}>
                                    {product.id}
                                </p>
                            </div>
                            <div className={styles.resultName}>
                                <p className={`${styles.name} p2-r`}>
                                    {product.name}
                                </p>
                            </div>
                            <div className={styles.resultPriceBs}>
                                <p className={'p2-b'}>
                                    {new Intl.NumberFormat('es-Ve').format(product.reference_selling_price)}
                                </p>
                            </div>
                            <div className={styles.resultPrice}>
                                <p className={'p2-b'}>
                                    {new Intl.NumberFormat('es-Ve').format(product.selling_price)}
                                </p>
                            </div>
                        </Container>
                    )
                })}
            </Container>
        </Container>
    )
}