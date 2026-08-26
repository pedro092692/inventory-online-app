import { Container } from '@/app/ui/utils/container'
import { Panel } from '../ui/dashboard/panel/panel'
import StoreStatusBanner from './_components/storeStatusBanner'
import GetItemAction from '@/app/lib/actions/get'

export default async function Dashboard({children, }) {
    const { data } = await GetItemAction('store/status')
    const reason = data?.active === false ? data?.reason : null

    return (
        <Container
            marginLeft={'15%'}
            flexGrow='1'
            alignItem='start'
            justifyContent='start'
            direction='row'
            padding='0'
            gap='0px'

        >
            {/* panel */}
            <Panel />
            {/* panel */}
            <Container
                padding='8px'
                direction='column'
                flexGrow='1'
                height='100%'
                alignItem='start'
                justifyContent='start'
                gap='8px'
            >
                <StoreStatusBanner reason={reason}/>
                {/* content */}
                {children}
            </Container>
        </Container>
    )
}