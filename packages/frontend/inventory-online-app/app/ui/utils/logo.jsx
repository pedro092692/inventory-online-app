import Image from 'next/image'

export function Logo({type='fullColor'}) {
    const path = 'images/logo/'

    const imgInfo = {
        fullColor: {
            src: `${path}/fullColor.svg`,
            with: 220,
            height: 18.72
        },

        monoColor: {
            src: `${path}/monoColor.svg`,
            with: 220,
            height: 18.72
        },

        iconColor: {
            src: `${path}/iconColor.svg`,
            with: 48,
            height: 48
        },

        iconMono: {
            src: `${path}/iconMono.svg`,
            with: 48,
            height: 48
        }
    }
    
    if( !imgInfo[type] ) {
        type = 'fullColor'
    }

    return <Image 
        src={`${imgInfo[type] ? imgInfo[type].src : imgInfo.fullColor.src}`} 
        alt="Logo" 
        width={imgInfo[type].with} 
        height={imgInfo[type].height } 
        />
}

