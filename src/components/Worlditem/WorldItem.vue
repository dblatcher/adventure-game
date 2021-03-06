<template>
    <article 
    @click="clickHandler($event)" 
    @contextmenu="rightClickHandler($event)" 
    v-on:mouseover="hoverHandler($event)" 
    v-on:mouseout="hoverHandler($event)"
    v-bind:name="name" 
    v-bind:status="status">
        <div v-bind:style="styleObject">
            <Sprite v-for="sprite in this.spriteSet" :key="sprite.id"
                v-bind:sprite="sprite"
                v-bind:fx="frame.fx" 
                v-bind:fy="frame.fy"
                v-bind:height="scaledHeight"
                v-bind:width="scaledWidth"
                v-bind:index="frame.sprite"
                v-bind:measure="measure"
                ></Sprite>
        </div>
        <SfxPlayer
        v-bind:audioPosition="audioPosition"
        ref="audio"/>
    </article>
</template>

<script>
import Sprite from "../Sprite";
import SfxPlayer from "../SfxPlayer";
import setStatus from "./setStatus.js";
import setRemoval from "./setRemoval.js";
import {EffectZone} from "../../modules/constructors"
import { innerBorder } from "../../modules/styleGen";
import { TinyEmitter } from 'tiny-emitter';

export default {
    name:'WorldItem',
    components: { Sprite,SfxPlayer },
    props:['data','measure','highlight'],

    data: function() {
        return {
            cycleFrame:0,
            emitter: new TinyEmitter()
        }
    },

    computed :{
        item: function() {return this.data},
        spriteSet: function() {return this.$store.state.gameData.sprites.filter(sprite => this.item.model.spritesUsed.includes(sprite.id) )},
        ident: function() {return this.item.id},
        dataType: function() {return 'WorldItem'},
        gameInstance: function() {return this.$parent.$parent},
        x: function() {return this.item.x},
        y: function() {return this.item.y},
        recommendedVerb: function() {return this.item.recommendedVerb},
        scale: function() {return this.item.scale},
        baseHeight: function() {return this.item.baseHeight},
        baseWidth: function() {return this.item.baseWidth},
        scaledHeight : function() {return this.scale * this.baseHeight*this.zoneEffects.scale();},
        scaledWidth : function() {return this.scale * this.baseWidth*this.zoneEffects.scale();},
        frame : function() {
            const frameData = this.item.model.getFrame({
                action: this.status,
                direction: null,
                actFrame: this.cycleFrame
            })
            return {
                sprite: frameData[0],
                fx:     frameData[1],
                fy:     frameData[2], 
                sound:  frameData[3]
            }
        },
        status : function() {return this.item.status},
        name : {
            get: function () {return this.item.name},
            set: function(v) {this.item.name = v}
        },
        walkToPoint: function() {
            return {x:this.x + this.item.walkOffsetX, y:this.y + this.item.walkOffsetY}
        },
        styleObject : function () { return {
            position: 'absolute',
            height: (this.scaledHeight * this.measure.scale) + this.measure.unit,
            width:  (this.scaledWidth  * this.measure.scale) + this.measure.unit,
            bottom: (this.y  * this.measure.scale) + this.measure.unit,
            left:   (this.x  * this.measure.scale) + this.measure.unit,
            backgroundColor: this.highlight && !this.item.unclickable ? 'rgba(255,255,255,.5)' : 'unset',
            backgroundImage: (this.highlight && !this.item.unclickable ? innerBorder('green') : 'unset'),
            pointerEvents: (this.item.unclickable ? 'none' : 'unset'),
            transition: 'background-color 1s',
            borderRadius: '5px',
            transform: 'translateX(-50%)'
        }},
        zoneEffects : function() {
            return EffectZone.combineEffects(this, this.gameInstance.rooms[this.gameInstance.roomNumber].effectZones)
        },
        audioPosition : function() {

            return {
                pan: 0,
                gain: .1,
                loopSound: this.item.model.getCycleSoundLoop(this.item.status)
            }
        }

    },

    methods : {
        clickHandler : function (event) {
            if (this.item.unclickable) {return false}
            event.stopPropagation();
            this.$emit('clicked-thing', this.item);
        },
        rightClickHandler : function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.item.unclickable) {return false}
            this.$emit('right-clicked-thing', this.item);
        },
        hoverHandler : function (event) {
            if (this.item.unclickable) {return false}
            this.$emit('hover-event', [this, event]);
        },
        setStatus, setRemoval,

        showNextFrame : function () {
            var cycle = this.item.model.getCycle({
                action:this.item.status
            })

            var onLastFrame = !(cycle.length > this.cycleFrame+1);
            this.cycleFrame = onLastFrame ? 0: this.cycleFrame + 1;

            if (cycle[this.cycleFrame][3]){
                this.playSound(cycle[this.cycleFrame][3])
            }

            if (onLastFrame) {
                if (this.item.queue.length) {
                    this.emitter.emit('statusOrderDone',this.item.queue[0])
                    this.item.status = this.item.queue.shift().cycle;
                }
            }
        },
        onBeat(data) {
            if (this.spriteSet.length > 0 && data.count % 5 === 0) {
                this.showNextFrame()
            }
        },
        playSound (soundId, options={}) {
            return this.$refs.audio.play(soundId,options)
        },
        stopSound (soundId, options={}) {
            return this.$refs.audio.stop(soundId,options)
        },

    },

    mounted () {
        this.$store.state.gameEmitter.on('beat', this.onBeat)
    },

    beforeUnmount() {
        this.$store.state.gameEmitter.off('beat', this.onBeat)
    }

}
</script>

