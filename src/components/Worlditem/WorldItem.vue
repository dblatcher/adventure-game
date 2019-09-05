<template>
    <article 
    @click="clickHandler($event)" 
    v-on:mouseover="hoverHandler($event)" 
    v-on:mouseout="hoverHandler($event)"
    v-bind:name="name" 
    v-bind:status="status">
        <div v-bind:style="styleObject">
            <Sprite v-for="sprite in this.spriteSet" :key="sprite.id"
                v-bind:sprite="sprite"
                v-bind:fx="sprite.p.frame.fx" 
                v-bind:fy="sprite.p.frame.fy"
                v-bind:height="sprite.p.scaledHeight"
                v-bind:width="sprite.p.scaledWidth"
                v-bind:index="sprite.p.frame.sprite"
                v-bind:measure = "sprite.p.measure"
                ></Sprite>
        </div>
    </article>
</template>

<script>
import Sprite from "../Sprite";
import setStatus from "./setStatus.js";
import { innerBorder } from "../../modules/styleGen";

export default {
    name:'WorldItem',
    components: { Sprite },
    props:['item','measure','highlight'],
    data: function() {
        var spriteSet = [];
        var fullSet = this.$parent.$parent.$parent.sprites;
        for (var i=0; i< fullSet.length; i++) {
            if (this.item.spritesUsed.includes(fullSet[i].id)) {spriteSet.push ( Object.assign({}, fullSet[i], {p:this} ) )    }
        }

        return {
        spriteSet : spriteSet,
        cycleFrame:0
        }
    },
    computed :{
        ident: function() {return this.item.id},
        gameInstance: function() {return this.$parent.$parent.$parent},
        x: function() {return this.item.x},
        y: function() {return this.item.y},
        scale: function() {return this.item.scale},
        baseHeight: function() {return this.item.baseHeight},
        baseWidth: function() {return this.item.baseWidth},
        scaledHeight : function() {return this.scale * this.baseHeight*this.zoneEffects.scale();},
        scaledWidth : function() {return this.scale * this.baseWidth*this.zoneEffects.scale();},
        frame : function() {
            let cycle = this.item.status.cycle;
            //fix for issue where this.cycleFrame exceeds length? cause unknown, causes error
            let frameNumber = this.cycleFrame >= this.item.cycles[cycle].length ? 0 : this.cycleFrame
            var v= this.item.cycles[cycle][frameNumber];
            return {sprite: v[0], fx:v[1], fy:v[2]}
        },
        status : function() {return this.item.status.cycle},
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
            transition: 'background-color 1s',
            borderRadius: '5px',
            transform: 'translateX(-50%)'
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

    },
    methods : {
        clickHandler : function (event) {
            if (this.item.unclickable) {return false}
            event.stopPropagation();
            this.gameInstance.$emit('clicked-thing', this.item);
        },
        hoverHandler : function (event) {
            if (this.item.unclickable) {return false}
            this.gameInstance.$emit('hover-event', this, event);
        },
        setStatus : setStatus,
        showNextFrame : function () {
            var cycle = this.item.cycles[this.item.status.cycle] ;
            var onLastFrame = !(cycle.length > this.cycleFrame+1);
            this.cycleFrame = onLastFrame ? 0: this.cycleFrame + 1;

            if (onLastFrame) {
                if (this.item.queue.length) {
                    this.item.status = this.item.queue.shift();
                }
            }
            
        },

    },
    mounted : function() {
        var that = this;
        if (this.spriteSet.length > 0 ) {
            setInterval (function(){that.showNextFrame()},250);
        }
    },
}
</script>

