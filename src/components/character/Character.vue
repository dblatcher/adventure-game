<template>
    <article 
    @click="clickHandler($event)" 
    @contextmenu="rightClickHandler($event)" 
    v-on:mouseover="hoverHandler($event)"
    v-on:mouseout="hoverHandler($event)"
    v-bind:name="name" 
    v-bind:action="currentAction">
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
        
        <SpeechLine 
            v-bind:text="saying"
            v-bind:measure="this.measure"
            v-bind:color="item.speechColor"
            v-bind:pos="this.speechLinePositioning"
        ></SpeechLine>
        
        <SfxPlayer 
        v-bind:audioPosition="audioPosition"
        ref="audio"/>

    </article>
</template>

<script>
import Sprite from "../Sprite";
import SpeechLine from "./SpeechLine";
import SfxPlayer from "../SfxPlayer"
import {say, countDownSpeech} from "./sayFunction";
import { checkForIdleAnimation } from "./idleAnimations";
import {goTo, turnTo } from "./goFunction";
import doFunction from "./doFunction";
import moveFunction from "./moveFunction";

import { innerBorder } from "../../modules/styleGen";
import { TinyEmitter } from 'tiny-emitter';

export default {
    name:'Character',
    components:{Sprite, SpeechLine, SfxPlayer},
    props:['data', 'measure','roomWidth','roomHeight','highlight'],

    data: function() {
        return {
            timeSpentIdle : 0,
            emitter: new TinyEmitter()
        }
    },

    computed :{
        item: function() {return this.data},
        spriteSet: function() {return this.$store.state.gameData.sprites.filter(sprite => this.item.model.spritesUsed.includes(sprite.id) )},
        gameInstance: function() {return this.$parent.$parent},
        name: function() {return this.item.name},
        x: function() {return this.item.x},
        y: function() {return this.item.y},
        room: function() {return this.item.room},
        ident: function() {return this.item.id},
        dataType: function() {return 'Character'},
        recommendedVerb: function() {return this.item.recommendedVerb},
        saying : {
            get: function() { return this.item.saying },
            set: function(v) { this.item.saying=v }
        },
        sayingCountDown : {
            get: function() { return this.item.sayingCountDown },
            set: function(v) { this.item.sayingCountDown=v }
        },
        behaviour : {
            get: function() {return {
                action:this.item.behaviour_action,
                actFrame:this.item.behaviour_actFrame,
                direction:this.item.behaviour_direction,
            }}
        },

        scaledHeight : function() {return this.item.scale * this.item.baseHeight * this.zoneEffects.scale();},
        scaledWidth : function() {return this.item.scale * this.item.baseWidth* this.zoneEffects.scale();},
        currentAction : function () {
            return (this.item.actionQueue.length) ? 
                this.item.actionQueue[0].action : this.behaviour.action;
        },
        currentDirection : function () {
            return (this.item.actionQueue.length) ? 
                this.item.actionQueue[0].direction : this.behaviour.direction;
        }, 
        frame : function() {
            const frameData = this.item.model.getFrame(
                this.item.actionQueue[0] || this.behaviour
            )
            return {
                sprite: frameData[0],
                fx:     frameData[1],
                fy:     frameData[2],
                sound:  frameData[3]
            }
        },
        walkToPoint: function() {
            return {x:this.x, y:this.y}
        },
        styleObject : function () { return {
            position: 'absolute',
            height: (this.scaledHeight * this.measure.scale) + this.measure.unit,
            width:  (this.scaledWidth  * this.measure.scale) + this.measure.unit,
            bottom: (this.y  * this.measure.scale) + this.measure.unit,
            left:   (this.x  * this.measure.scale) + this.measure.unit,
            backgroundColor: (this.highlight ? 'rgba(255,255,255,.5)' : 'unset' ),
            backgroundImage: (this.highlight ?  innerBorder('blue') : 'unset'),
            pointerEvents: (this.ident === this.gameInstance.pcId ? 'none' : 'unset'),
            transition: 'background-color 1s',
            borderRadius: '5px',
            transform: 'translateX(-50%)',
            filter: this.zoneEffects.filter,
        }},
        zoneEffects : function() {
            var result= {
                filter:"",
                scale:function(){return 1},
            };
            var effectZones = this.gameInstance.rooms[this.gameInstance.roomNumber].effectZones;
            for (var i=0; i<effectZones.length; i++) {
                if (effectZones[i].zone.containsPoint(this)) {
                    if (effectZones[i].effect.filter) {
                        result.filter += effectZones[i].effect.filter + ' ';
                    }
                    if (effectZones[i].effect.scale && !this.item.noZoneScaling) {
                        result.scale = effectZones[i].effect.scale.bind(this);
                    }
                }
            }
            return result;
        },
        isIdle : function() {
            return !this.item.actionQueue[0] && !this.item.destinationQueue[0] && !this.item.actionQueue[0] && !this.item.saying
        },
        speechLinePositioning : function() {
            return {
                x:this.x,
                y:this.y,
                characterHeight:this.scaledHeight,
                characterWidth:this.scaledWidth,
                roomHeight:this.roomHeight,
                roomWidth:this.roomWidth,
                speechBubbleDown:this.item.model.speechBubbleDown,
                speechBubbleIn:this.item.model.speechBubbleIn,
            }
        },
        audioPosition : function() {
            return {
                pan: Math.max (Math.min( (this.x - this.roomWidth/2) / (this.roomWidth/2),1), -1),
                gain: .1,
                loopSound: this.item.model.getCycleSoundLoop(this.currentAction)
            }
        }
    },

    methods : {
        doAction : doFunction,
        goTo, turnTo,
        say, countDownSpeech,
        move : moveFunction,
        checkForIdleAnimation, 
        setDefaultWait: function (cycleName) { return this.item.setDefaultWait (cycleName, this) },
        setDefaultWalk: function (cycleName) { return this.item.setDefaultWalk (cycleName, this) },
        setDefaultTalk: function (cycleName) { return this.item.setDefaultTalk (cycleName, this) },

        goToRoom : function (target,options){
            this.gameInstance.teleportCharacter ([this.item].concat(target), options)
        },
        showNextFrame : function () { //TO DO - move this method to the data Model?
            var order = this.item.actionQueue[0] || this.behaviour;
            this.item.model.correctOrder(order)

            const cycle = this.item.model.getCycle(order)
            
            const onLastFrame = !(cycle.length > order.actFrame+1);
            order.actFrame = onLastFrame ? 0 : order.actFrame + 1;

            //this.behaviour is just an object with convience copies of the this.item behaviour properties
            const noActions = ( this.item.actionQueue[0] ) ? false:true; 
            if (noActions) {this.item.behaviour_actFrame = order.actFrame}

            let newFrame = this.item.model.getFrame(order)
            if (newFrame[3]) {
               this.playSound(newFrame[3])
            }
           
            if (onLastFrame && (!order.loop && !noActions )) {
                this.item.actionQueue.shift();
                this.emitter.emit ('actionOrderDone', order)
            }
        },  
        clickHandler : function (event) {
            if (this.ident === this.gameInstance.pcId) {return false}
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
            if (this.ident === this.gameInstance.pcId) {return false}
            this.$emit('hover-event', [this, event]);
        },
        

        playSound (soundId, options={}) {
            return this.$refs.audio.play(soundId,options)
        },

        stopSound (soundId, options={}) {
            return this.$refs.audio.stop(soundId,options)
        },

        onBeat(beat) {
           this.checkForIdleAnimation()
            if (beat.count % 2 === 0 ) {this.showNextFrame()}
            this.move();
            this.countDownSpeech(beat);
        }
    },

    mounted () {
        this.$store.state.gameEmitter.on('beat', this.onBeat)
    },

    beforeUnmount() {
        this.$store.state.gameEmitter.off('beat', this.onBeat)
    }

}
</script>



