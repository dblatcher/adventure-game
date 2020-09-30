
import unpackOrder from './unpackOrder';
import { Verb } from "../modules/constructors";



// All icons are added to the bundle this way, even if not needed by the game?
// TO DO - move icons to game folders, except those used by core UI
function importAll(r) {
    let images = {}
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}
const iconFiles = importAll(require.context(`../icons`, false, /\.(png|jpe?g|svg)$/));

function unpackVerb(verbData) {
    const specialConfigKeys = ['defaultResponse', 'icon']
    const verbId = verbData[0]
    const rawConfig = verbData[1]

    let config = {}

    Object.keys (rawConfig)
    .filter(key => specialConfigKeys.indexOf(key) == -1)
    .forEach(key => {config[key] = rawConfig[key]})


    config.defaultResponse = rawConfig.defaultResponse
    ? rawConfig.defaultResponse.map(order => unpackOrder(order))
    : undefined;

    config.icon = rawConfig.icon
    ? iconFiles[rawConfig.icon]
    : undefined

    return new Verb(verbId, config)
}

export default function unpackRawVerbList (verbListData) {
    return verbListData.map(verbData => unpackVerb(verbData))
}
