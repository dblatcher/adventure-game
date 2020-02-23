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
            v-bind:color="char.speechColor"
            v-bind:pos="this.speechLinePositioning"
        ></SpeechLine>
        
        <SfxPlayer 
        v-bind:sounds="gameInstance.sounds" 
        v-bind:audioPosition="audioPosition"
        v-bind:timer="gameInstance.$refs.heartBeat"
        v-bind:contextSource="gameInstance.$parent.audio"   
        v-bind:audioContextStatusEmitter="gameInstance.$parent"   
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
import {sprites} from "../../gameIndex"

export default {
    name:'Character',
    components:{Sprite, SpeechLine, SfxPlayer},
    props:['char','measure','roomWidth','roomHeight','highlight'],

    data: function() {
        return {
            spriteSet : sprites.filter( sprite=> this.char.model.spritesUsed.includes(sprite.id) ),
            timeSpentIdle : 0
        }
    },

    computed :{
        gameInstance: function() {return this.$parent.$parent.$parent},
        name: function() {return this.char.name},
        x: function() {return this.char.x},
        y: function() {return this.char.y},
        ident: function() {return this.char.id},
        dataType: function() {return 'Character'},
        recommendedVerb: function() {return this.char.recommendedVerb},
        saying : {
            get: function() { return this.char.saying },
            set: function(v) { this.char.saying=v }
        },
        sayingCountDown : {
            get: function() { return this.char.sayingCountDown },
            set: function(v) { this.char.sayingCountDown=v }
        },
        behaviour : {
            get: function() {return {
                action:this.char.behaviour_action,
                actFrame:this.char.behaviour_actFrame,
                direction:this.char.behaviour_direction,
            }}
        },

        scaledHeight : function() {return this.char.scale * this.char.baseHeight * this.zoneEffects.scale();},
        scaledWidth : function() {return this.char.scale * this.char.baseWidth* this.zoneEffects.scale();},
        currentAction : function () {
            return (this.char.actionQueue.length) ? 
                this.char.actionQueue[0].action : this.behaviour.action;
        },
        currentDirection : function () {
            return (this.char.actionQueue.length) ? 
                this.char.actionQueue[0].direction : this.behaviour.direction;
        }, 
        frame : function() {
            const frameData = this.char.model.getFrame(
                this.char.actionQueue[0] || this.behaviour
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
                    if (effectZones[i].effect.scale && !this.char.noZoneScaling) {
                        result.scale = effectZones[i].effect.scale.bind(this);
                    }
                }
            }
            return result;
        },
        isIdle : function() {
            return !this.char.actionQueue[0] && !this.char.destinationQueue[0] && !this.char.actionQueue[0] && !this.char.saying
        },
        speechLinePositioning : function() {
            return {
                x:this.x,
                y:this.y,
                characterHeight:this.scaledHeight,
                characterWidth:this.scaledWidth,
                roomHeight:this.roomHeight,
                roomWidth:this.roomWidth,
                speechBubbleDown:this.char.model.speechBubbleDown,
                speechBubbleIn:this.char.model.speechBubbleIn,
            }
        },
        audioPosition : function() {
            return {
                pan: Math.max (Math.min( (this.x - this.roomWidth/2) / (this.roomWidth/2),1), -1),
                gain: .1,
                loopSound: this.char.model.getCycleSoundLoop(this.currentAction)
            }
        }
    },
    
    methods : {
        doAction : doFunction,
        goTo, turnTo,
        say, countDownSpeech,
        move : moveFunction,
        checkForIdleAnimation, 
        setDefaultWait: function (type, cycleName){ return this.char.setDefaultWait (type, cycleName) },
        setDefaultWalk: function (type, cycleName){ return this.char.setDefaultWalk (type, cycleName) },
        setDefaultTalk: function (type, cycleName){ return this.char.setDefaultTalk (type, cycleName) },

        goToRoom : function (target,options){
            this.gameInstance.teleportCharacter ([this.char].concat(target), options)
        },
        showNextFrame : function () { //TO DO - move this method to the data Model?
            var order = this.char.actionQueue[0] || this.behaviour;
            this.char.model.correctOrder(order)

            const cycle = this.char.model.getCycle(order)
            
            const onLastFrame = !(cycle.length > order.actFrame+1);
            order.actFrame = onLastFrame ? 0 : order.actFrame + 1;

            //this.behaviour is just an object with convience copies of the this.char behaviour properties
            const noActions = ( this.char.actionQueue[0] ) ? false:true; 
            if (noActions) {this.char.behaviour_actFrame = order.actFrame}

            let newFrame = this.char.model.getFrame(order)
            if (newFrame[3]) {
               this.playSound(newFrame[3])
            }
           
            if (onLastFrame && (!order.loop && !noActions )) {
                this.char.actionQueue.shift();
                this.$emit ('actionOrderDone', order)
            }
        },  
        clickHandler : function (event) {
            if (this.ident === this.gameInstance.pcId) {return false}
            event.stopPropagation();
            this.$emit('clicked-thing', this.char);
        },
        rightClickHandler : function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.char.unclickable) {return false}
            this.$emit('right-clicked-thing', this.char);
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
    }

}
</script>



