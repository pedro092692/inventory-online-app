import { Icon } from '@/app/ui/utils/icons/icons'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import Link from 'next/link'

export default async function StoreStatusBanner({reason}) {
    if (!reason) return null

    const userInfo = await getCurrentUser()
    const canManageSubscription = userInfo?.role === 2

    return (
        <div style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#c0392b',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
        }}>
            <Icon icon="alert" color="white" size={[18, 18]}/>
            <p className="p2-b" style={{color: 'white'}}>{reason}</p>
            {canManageSubscription &&
                <Link href="/store/subscription" className="p2-b" style={{color: 'white', textDecoration: 'underline'}}>
                    Gestionar suscripción
                </Link>
            }
        </div>
    )
}
