import { Container } from "@/app/ui/utils/container"
import styles from './productSelector.module.css'


export default function ProductResultContainer({results = [], ref}) {
    
    return (
        
        <Container className={`${styles.headerContainer}`} ref={ref}>
            <Container className={styles.header}>
                    <div className={styles.headerCOD}>COD</div>
                    <div className={styles.headerName}>NOMBRE</div>
                    <div className={styles.headerPrice}>PRECIO $</div>
                    <div className={styles.headerPriceBs}>PRECIO Bs</div>
            </Container>
            
            <Container className={styles.resultsContainer}>
                {results.map((product, index) => {
                    return (
                        <Container key={index} className={styles.result}>
                            <div className={styles.resultCOD}>
                                <p className={'p2-b'}>
                                    {product.id}
                                </p>
                            </div>
                            <div className={styles.resultName}>
                                <p className={`${styles.name} p1-r`}>
                                    {product.name}
                                </p>
                            </div>
                            <div className={styles.resultPrice}>
                                <p className={'p2-b'}>
                                    {product.selling_price}
                                </p>
                            </div>
                            <div className={styles.resultPriceBs}>
                                <p className={'p2-b'}>
                                    {product.reference_selling_price}
                                </p>
                            </div>
                        </Container>
                    )
                })}
            </Container>
        </Container>
    )
}