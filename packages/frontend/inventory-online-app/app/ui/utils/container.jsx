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
        backgroundColor,
        className = ''
    }) {

        const styles = {
            gap: gap,
            width: width,
            height: height,
            flexDirection: direction,
            padding: padding,
            alignItems: alignItem,
            justifyContent: justifyContent,
            flexGrow: flexGrow,
            backgroundColor: backgroundColor,
        }
    return (
        <div className={`container ${className}`} style={styles}>
            {children}
        </div>
    )
}


