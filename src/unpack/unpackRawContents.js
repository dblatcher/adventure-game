import { RectZone, PolyZone } from "../modules/zone";
import { Room, EffectZone, Foreground, Sprite, Sound } from "../modules/constructors"
import Character from "../modules/characterDataClass"
import WorldItem from "../modules/WorldItemDataClass"
import InventoryItem from "../modules/InventoryItem"


export default function unpackRawContents(allGameContentsData) {

    function importAll(r) {
        let images = {}
        r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
        return images;
    }
    const spriteFiles = importAll(require.context(`../../games/${process.env.VUE_APP_GAME_NAME}/sprites`, false, /\.(png|jpe?g|svg)$/));
    const roomFiles = importAll(require.context(`../../games/${process.env.VUE_APP_GAME_NAME}/rooms`, false, /\.(png|jpe?g|svg)$/));
    const audioFiles = importAll(require.context(`../../games/${process.env.VUE_APP_GAME_NAME}/audio`, false, /\.(mp3|wav|mp4)$/));
    const itemFiles = importAll(require.context(`../../games/${process.env.VUE_APP_GAME_NAME}/items`, false, /\.(png|jpe?g|svg)$/));

    var sprites = allGameContentsData.sprites.map(datum => new Sprite(datum[0], spriteFiles[datum[1]], datum[2]))
    var sounds = allGameContentsData.sounds.map(datum => new Sound(datum[0], datum[1], audioFiles[datum[2]]))


    var music = {}
    allGameContentsData.music.forEach(datum => { music[datum[1]] = new Sound(datum[0], datum[1], audioFiles[datum[2]]) })


    var characterModels = {}
    for (let key in allGameContentsData.characterModels) {
        let datum = allGameContentsData.characterModels[key]
        characterModels[key] = new Character.Model(datum[0], datum[1])
    }

    var worldItemModels = {}
    for (let key in allGameContentsData.worldItemModels) {
        let datum = allGameContentsData.worldItemModels[key]
        worldItemModels[key] = new WorldItem.Model(datum[0], datum[1])
    }


    var makeCharacters = function () {
        return allGameContentsData.characters.map(datum => new Character(
            datum.id, datum.coords, characterModels[datum.model], datum.config
        ))
    }

    var makeRooms = function () {

        function makeRoomWorldItems(worldItems) {
            if (!worldItems) { return [] }
            return worldItems.map(subDatum => {
                return new WorldItem(subDatum[0], subDatum[1], subDatum[2], subDatum[3],
                    subDatum[4] ? worldItemModels[subDatum[4]] : null,
                    subDatum[5])
            })
        }

        function makeZone(subDatum) {
            switch (subDatum[0]) {
                case 'PolyZone': return new PolyZone(subDatum[1]);
                case 'RectZone': return new RectZone(subDatum[1], subDatum[2], subDatum[3], subDatum[4], subDatum[5]);
            }
        }

        function makeRoomObstabcles(obstacles) {
            if (!obstacles) { return [] }
            return obstacles.map(subDatum => makeZone(subDatum))
        }

        function makeEffectZones(effectZones) {
            if (!effectZones) { return [] }
            return effectZones.map(subDatum => new EffectZone(makeZone(subDatum[0]), subDatum[1]))
        }

        function makeForegrounds(foregrounds) {
            if (!foregrounds) { return [] }
            return foregrounds.map(subDatum => new Foreground(roomFiles[subDatum[0]], subDatum[1], subDatum[2], subDatum[3]))
        }

        return allGameContentsData.rooms.map(datum => {
            const configData = datum[4] || {}
            const { name, screenScrollX, bgm, worldItems, obstacles, effectZones, foregrounds, filter } = configData;


            return new Room(datum[0], roomFiles[datum[1]], datum[2], datum[3], {
                name, screenScrollX, bgm, filter,
                worldItems: makeRoomWorldItems(worldItems),
                obstacles: makeRoomObstabcles(obstacles),
                effectZones: makeEffectZones(effectZones),
                foregrounds: makeForegrounds(foregrounds),
            })
        })
    }


    var makeInventoryItems = function () {

        function processImageMap(imageMap) {
            let output = {}
            for (let key in imageMap) { output[key] = itemFiles[imageMap[key]] }
            return output
        }

        return allGameContentsData.inventoryItems.map(datum => new InventoryItem(
            datum[0],
            typeof datum[1] == 'string'
                ? itemFiles[datum[1]]
                : processImageMap(datum[1]),
            datum[2] || {})
        )
    };

    return { sprites, sounds, music, makeCharacters, makeRooms, makeInventoryItems }

}