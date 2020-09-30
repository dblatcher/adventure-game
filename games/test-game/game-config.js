
const config = {
    title: 'Test Game',
    interface: 'Scumm',
    alwaysWalkWhenClickOnRoom: true,
    resetVerbAfterEachCommand: true,
    rightClickForRecommendedVerb:true,
    titleScreen: {
        title: 'The Test Game',
        subtitle: 'A game for testing and examples.',
    },
    endingScreen : {

    },
    defaultVerb: {WorldItem:"LOOK", InventoryItem:"USE", Character:"TALK"},
    pcId: 'JANE_C',
    initialGameVars: {
        wantsHammer: false,
        numberOfSomething: 5,
    }
}


export default config