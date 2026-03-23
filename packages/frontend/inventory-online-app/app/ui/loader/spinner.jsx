import { Oval } from 'react-loader-spinner'

export function OvalLoader({size=[20, 20], color1='#B1B2B2', color2='#F7FCFF', stroke=[2, 4]}) {
    return (
        <Oval
        height={size[0]}
        width={size[1]}
        color={color1}
        secondaryColor={color2}
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        strokeWidth={stroke[0]}
        strokeWidthSecondary={stroke[1]}
    />
    )
}