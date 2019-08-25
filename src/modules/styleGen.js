function innerBorder (gColor='white', gWidth=10, gOffset=0) {
    let gPattern = `transparent,${gColor} ${gOffset}px,transparent ${gOffset+gWidth}px`;
    return `linear-gradient(to right, ${gPattern}),linear-gradient(to top, ${gPattern}),linear-gradient(to left, ${gPattern}), linear-gradient(${gPattern})`;
}

function ringGradient (gColor='white', gInner=60, gWidth=10 ) {
   
   return `radial-gradient(transparent ${gInner}%, ${gColor} ${ gInner + (gWidth/2) }%, transparent ${gInner+gWidth}%)`;
}

export { innerBorder, ringGradient }