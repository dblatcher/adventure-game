function innerBorder (gColor='white', gWidth=10, gOffset=0) {
    let gPattern = `transparent,${gColor} ${gOffset}px,transparent ${gOffset+gWidth}px`;
    return `linear-gradient(to right, ${gPattern}),linear-gradient(to top, ${gPattern}),linear-gradient(to left, ${gPattern}), linear-gradient(${gPattern})`;
}

function ringGradient (gColor='white', gInner=60, gWidth=10 ) {
   
   return `radial-gradient(transparent ${gInner}%, ${gColor} ${ gInner + (gWidth/2) }%, transparent ${gInner+gWidth}%)`;
}

function backingShape (bg) {
    if (!bg || typeof bg !== 'object'){return {display:'none'}}

    switch (bg.shape) {
        case 'circle': return {
            borderRadius: '50%',
            backgroundColor : bg.color,
            boxShadow: '2px 2px black',
        }
        case 'square': return {
            backgroundColor : bg.color,
            boxShadow: '2px 2px black',
        }
        case 'diamond': return {
            transform: 'translateX(-50%) translateY(-50%) rotate(45deg) scale(.75,.75)',
            backgroundColor : bg.color,
            boxShadow: '3px 1px black',
        }
        default: return { display:'none' }
    }
}

export { innerBorder, ringGradient,backingShape }