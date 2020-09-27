import { createStore } from 'vuex'
import { TinyEmitter } from 'tiny-emitter';

export default function buildStore(gameData, debugSetting) {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const masterGainNode = audioContext.createGain()
    masterGainNode.gain.value = 0; // initial gain value is 0 because soundEnabled is false 

    function DebugMessage(input, messageType) {
        this.messageType = messageType
        this.message = input.toString ? input.toString() : '*error - no toString*'
        this.time = Date.now()
    }


    return createStore({
        state: {
            gameData: gameData,
            audio: {
                audioContext,
                masterGainNode,
                soundEnabled: false,
                sfxVolume: 1,
                musicVolume: .2,
                emitter: new TinyEmitter(),
            },
            nonAudioOptions: {
                textDelay: 100
            },
            gameEmitter: new TinyEmitter(),
            timerIsStopped: undefined,
            debugMessages: [],
        },
        getters: {
            options: state => {
                return {
                    textDelay: state.nonAudioOptions.textDelay,
                    soundEnabled: state.audio.soundEnabled,
                    sfxVolume: state.audio.sfxVolume,
                    musicVolume: state.audio.musicVolume,
                }
            }
        },
        mutations: {
            setOptions(state, payload) {

                state.audio.soundEnabled = !!payload.soundEnabled
                if (typeof payload.sfxVolume === 'number') {
                    state.audio.sfxVolume = payload.sfxVolume
                }
                if (typeof payload.musicVolume === 'number') {
                    state.audio.musicVolume = payload.musicVolume
                }
                state.audio.masterGainNode.gain.value = state.audio.soundEnabled ? state.audio.sfxVolume : 0;

                if (typeof payload.textDelay === 'number') {
                    state.nonAudioOptions.textDelay = payload.textDelay
                }

            },
            setTimerStopped(state, value) {
                state.timerIsStopped = !!value;
            },
            debugMessage(state, message) {
                if (debugSetting.inConsole) {
                    // eslint-disable-next-line
                    console.warn(message)
                }
                if (debugSetting.onScreen) {
                    state.debugMessages.push(new DebugMessage(message))
                }
            }
        }
    })
}