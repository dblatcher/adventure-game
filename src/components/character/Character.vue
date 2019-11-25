<template>
    <article 
    @click="clickHandler($event)" 
    v-on:mouseover="hoverHandler($event)"
    v-on:mouseout="hoverHandler($event)"
    v-bind:name="name" 
    v-bind:action="currentAction">
        <div v-bind:style="styleObject">
            <Sprite v-for="sprite in this.spriteSet" :key="sprite.id"
                v-bind:sprite="sprite"
                v-bind:fx="sprite.p.frame.fx" 
                v-bind:fy="sprite.p.frame.fy"
                v-bind:height="sprite.p.scaledHeight"
                v-bind:width="sprite.p.scaledWidth"
                v-bind:index="sprite.p.frame.sprite"
                v-bind:measure="sprite.p.measure"
                ></Sprite>
        </div>
        
        <SpeechLine 
            v-bind:text="saying"
            v-bind:measure="this.measure"
            v-bind:color="char.speechColor"
            v-bind:pos="this.speechLinePositioning"
        ></SpeechLine>
        
    </article>
</template>

<script>
import Sprite from "../Sprite";
import SpeechLine from "./SpeechLine";
import {say, countDownSpeech} from "./sayFunction";
import {goTo, turnTo } from "./goFunction";
import doFunction from "./doFunction";
import moveFunction from "./moveFunction";

import { innerBorder } from "../../modules/styleGen";

export default {
    name:'Character',
    components:{Sprite, SpeechLine},

    props:['char','measure','roomWidth','roomHeight','highlight'],

    data: function() {        
        var spriteSet = [];        
        var fullSet = this.$parent.$parent.$parent.sprites;
        for (var i=0; i< fullSet.length; i++) {
            if (this.char.spritesUsed.includes(fullSet[i].id)) {spriteSet.push ( Object.assign({}, fullSet[i], {p:this} ) )    }
        }

        return {
            spriteSet : spriteSet,
            timeSpentIdle : 0
        }
    },

    computed :{
        theApp: function() {return this.$parent.$parent.$parent},

        name: function() {return this.char.name},
        x: function() {return this.char.x},
        y: function() {return this.char.y},
        ident: function() {return this.char.id},
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
            var v, directionToUse;
            var currentOrder = this.char.actionQueue[0] || this.behaviour;
            var directionNeeded = !Array.isArray(this.char.cycles[currentOrder.action]);

            if (directionNeeded) {
                if (this.char.cycles[currentOrder.action][currentOrder.direction]) {
                    directionToUse = currentOrder.direction
                } else {
                    directionToUse = Object.keys( this.char.cycles[currentOrder.action] )[0] ;
                    console.warn(`falling back to ${directionToUse}`)
                }
                v =  this.char.cycles[currentOrder.action][directionToUse][currentOrder.actFrame]
            } else {
                v = this.char.cycles[currentOrder.action][currentOrder.actFrame]
            }

            return {sprite: v[0], fx:v[1], fy:v[2]}
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
            transform: 'translateX(-50%)',
            backgroundColor: (this.highlight ? 'rgba(255,255,255,.5)' : 'unset' ),
            backgroundImage: (this.highlight ?  innerBorder('blue') : 'unset'),
            pointerEvents: (this.ident === this.theApp.pcId ? 'none' : 'unset'),
            transition: 'background-color 1s',
            borderRadius: '5px',
            filter: this.zoneEffects.filter,
        }},
        zoneEffects : function() {
            var result= {
                filter:"",
                scale:function(){return 1},
            };
            var effectZones = this.theApp.rooms[this.theApp.roomNumber].effectZones;
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
                speechBubbleDown:this.char.speechBubbleDown,
                speechBubbleIn:this.char.speechBubbleIn,
            }
        },
    },
    
    methods : {
        doAction : doFunction,
        goTo, turnTo,
        say, countDownSpeech,
        move : moveFunction,
        setDefaultWait: function (type, cycleName){ return this.char.setDefaultWait (type, cycleName) },
        setDefaultWalk: function (type, cycleName){ return this.char.setDefaultWalk (type, cycleName) },
        setDefaultTalk: function (type, cycleName){ return this.char.setDefaultTalk (type, cycleName) },

        goToRoom : function (target,options){
            this.theApp.teleportCharacter ([this.char].concat(target), options)
        },
        showNextFrame : function () { //TO DO - move this method to the data Model?
            var noActions = ( this.char.actionQueue[0] ) ? false:true; 
            var order = this.char.actionQueue[0] || this.behaviour;

            var directionNeeded = !Array.isArray(this.char.cycles[order.action]);
            if (directionNeeded && !this.char.cycles[order.action][order.direction] ) {
                console.warn (`Character model for  ${this.char.name} has no cycle for : ${order.action} ${order.direction}!`);
                let firstKey = Object.keys( this.char.cycles[order.action] )[0] ;
                order.direction = firstKey;
            }

            let cycle = directionNeeded ? 
            this.char.cycles[order.action][order.direction] :
            this.char.cycles[order.action] ;
            var onLastFrame = !(cycle.length > order.actFrame+1);

            order.actFrame = onLastFrame ? 0 : order.actFrame + 1;
            //this.behaviour is just an object with convience copies of the this.char behaviour properties
            if (noActions) {this.char.behaviour_actFrame = order.actFrame}

            if (onLastFrame && (!order.loop && !noActions )) {
                this.char.actionQueue.shift();
                this.$emit ('actionOrderDone', order)
            }
        },    
        clickHandler : function (event) {
            if (this.ident === this.theApp.pcId) {return false}
            event.stopPropagation();
            this.$emit('clicked-thing', this.char);
        },
        hoverHandler : function (event) {
            if (this.ident === this.theApp.pcId) {return false}
            this.$emit('hover-event', [this, event]);
        },
        checkForIdleAnimation : function () {
            if ( this.isIdle ) {
                this.timeSpentIdle++
                if (this.char.idleAnimations && this.timeSpentIdle >= this.char.idleAnimations.delay) {
                    if (Math.random() < this.char.idleAnimations.chance) {
                        let randomChoice = Math.ceil( Math.random()*this.char.idleAnimations.cycles.length )-1;
                        this.doAction( this.char.idleAnimations.cycles[randomChoice] )
                    }
                    this.timeSpentIdle = 0;
                }
            } else if (this.timeSpentIdle) {
                this.timeSpentIdle = 0;
            }
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



