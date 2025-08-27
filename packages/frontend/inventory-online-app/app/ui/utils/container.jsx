export function Container(
    {
        children='default content',
        gap,
        width,
        height,
        direction,
        padding, 
        alignItem,
        justifyContent,
        flexGrow,
        backgroundColor
    }) {

        const styles = {
            gap: gap,
            width: width,
            height: height,
            direction: direction,
            padding: padding,
            alignItem: alignItem,
            justifyContent: justifyContent,
            flexGrow: flexGrow,
            backgroundColor: backgroundColor
        }
    return (
        <div className="container" style={styles}>
            {children}
        </div>
    )
}


