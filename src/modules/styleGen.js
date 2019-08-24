function innerBorder (gColor='white', gWidth=5) {
    let gOffset= 0;
    let gPattern = `transparent,${gColor} ${gOffset}%,transparent ${gOffset+gWidth}%,transparent ${100-gOffset-gWidth}%, ${gColor} ${100-gOffset}%,transparent`;
    return `linear-gradient(to right, ${gPattern}), linear-gradient(${gPattern})`;
}

function ringGradient (gColor='white', gInner=60, gWidth=10 ) {
   
   return `radial-gradient(transparent ${gInner}%, ${gColor} ${ gInner + (gWidth/2) }%, transparent ${gInner+gWidth}%)`;
}

export { innerBorder, ringGradient }