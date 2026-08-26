import { Icon } from '@/app/ui/utils/icons/icons'

export default function StoreStatusBanner({reason}) {
    if (!reason) return null

    return (
        <div style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: '#c0392b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <Icon icon="alert" color="white" size={[18, 18]}/>
            <p className="p2-b" style={{color: 'white'}}>{reason}</p>
        </div>
    )
}
