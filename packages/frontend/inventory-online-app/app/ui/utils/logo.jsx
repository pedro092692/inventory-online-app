import Image from 'next/image'

export function Logo({type='fullColor', style}) {
    const path = '/images/logo/'

    const imgInfo = {
        fullColor: {
            src: `${path}fullColor.svg`,
            with: 220,
            height: 18.72
        },

        fullColorLogin: {
            src: `${path}fullColor.svg`,
            with: 320,
            height: 27.23,
        },

        monoColor: {
            src: `${path}monoColor.svg`,
            with: 220,
            height: 18.72
        },

        iconColor: {
            src: `${path}iconColor.svg`,
            with: 48,
            height: 48
        },

        iconMono: {
            src: `${path}iconMono.svg`,
            with: 48,
            height: 48
        },

        iconWhite: {
            src: `${path}iconWhite.svg`,
            with: 48,
            height: 48
        },

        logoWhite: {
            src: `${path}logoWhite.svg`,
            height: 16.34,
            with: 192
            
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
        style={style}
        />
}

