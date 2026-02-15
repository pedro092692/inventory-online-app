export function Container(
    {   
        ref,
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
        className = '',
        onClick,
        onMouseEnter,
        onMouseLeave,
        borderRadius,
        listContiner=false
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
            borderRadius: borderRadius,
        }
    return (
        <div ref={ref} className={`container ${className} ${listContiner ? 'container-list' : ''}`} style={styles} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave} 
            onClick={onClick}
        >
            {children}
        </div>
    )
}


