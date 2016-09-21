require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"PrefabMsg":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7135avAZUlB+KcE+qrKXijV', 'PrefabMsg');
// scripts\PrefabMsg.js

cc.Class({
    "extends": cc.Component,

    properties: {
        firePrefab: cc.Prefab, //场景上增加预置资源属性
        firePool: cc.NodePool, //对象池
        initCount: 5, //对象池最大存储数量
        parentNode: cc.Node //决定在哪个节点上运行
    },

    init: function init() {},

    //场景加载  创建对象池  加载挂在Canvas下的  火球预置资源
    onLoad: function onLoad() {
        this.firePool = new cc.NodePool();
        this.initCount = 5; //let 类型是js的块级作用域
        this.fireSpeed = this.firePrefab.fireSpeed; //记录fire初速度

        for (var i = 0; i < this.initCount; i++) {
            var fire = cc.instantiate(this.firePrefab); //创建火球节点
            this.firePool.put(fire); //将火球节点加入对象池
        }
    },

    //从对象池创建新的
    createPrefabNode: function createPrefabNode() {
        var node = null;

        //先检查对象池是否充足   不足则创建新的
        if (this.firePool.size() > 0) {
            node = this.firePool.get();
        } else {
            node = cc.instantiate(this.firePrefab);
        }

        // node.parent = parentNode;  //将预制对象节点加入
        this.parentNode.addChild(node);
        // node.getComponent('fire').init(); //获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。
        //传入参数也可以是脚本的名称。
    },

    //回收对象
    releasePrefabNode: function releasePrefabNode(fire) {
        if (this.firePool.size() >= this.initCount) {
            fire.node.destroy();
        } else {
            //初始化fire数据
            fire.fireSpeed = 200;
            fire.node.setPosition(0, 0);
            this.firePool.put(fire.node);
        }
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"brave":[function(require,module,exports){
"use strict";
cc._RFpush(module, '82ee3zT0MRCbp45g9T2j1Zz', 'brave');
// scripts\brave.js

var nodePool = require('PrefabMsg');

cc.Class({
    'extends': cc.Component,

    properties: {

        // 壮汉的最大移动速度_(:з」∠)_
        maxMoveSpeed: 0,
        // 壮汉移动的加速度_(:з」∠)_
        accel: 0,

        //引用对象池
        firePool: {
            'default': null,
            type: nodePool
        }
    },

    setInputControl: function setInputControl() {
        var self = this;
        // 添加键盘事件监听器_(:з」∠)_
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 根据按下的按键，设置向对应方向加速_(:з」∠)_
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.left:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                    case cc.KEY.a:
                        // 按a建  获取一个火球
                        self.firePool.createPrefabNode(self.node);
                        break;
                }
            },
            // 松开按键时，停止移动_(:з」∠)_
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.left:
                        self.accLeft = false;
                        self.xSpeed = 0;
                        break;
                    case cc.KEY.right:
                        self.accRight = false;
                        self.xSpeed = 0;
                        break;
                }
            }

        }, self.node);
    },

    // use this for initialization
    onLoad: function onLoad() {

        // 加速度方向开关_(:з」∠)_
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度_(:з」∠)_
        this.xSpeed = 0;

        // 初始化输入控制_(:з」∠)_
        this.setInputControl();

        //this.firePool = new cc.nodePool('PrefabMsg');
    },
    update: function update(dt) {
        // 根据当前加速度方向每帧更新速度_(:з」∠)_
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值_(:з」∠)_
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新壮汉的位置，但是不能超过屏幕范围_(:з」∠)_
        if (this.node.x >= 0) {
            this.node.x += this.xSpeed * dt;
        } else {
            this.xSpeed = 0;

            this.node.x += 1;
        }
        if (this.node.x <= 1100) {
            this.node.x += this.xSpeed * dt;
        } else {
            this.xSpeed = 0;

            this.node.x -= 1;
        }

        var childs = this.getComponentsInChildren('fire'); //return Component[]
        for (var i = childs.length - 1; i >= 0; i--) {
            if (childs[i].fireSpeed == 0) {
                this.firePool.releasePrefabNode(childs[i]);
            }
        }
    }

});

cc._RFpop();
},{"PrefabMsg":"PrefabMsg"}],"fire":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0b6c4jyYKhL7owpH9hzYws3', 'fire');
// scripts\fire.js

// const nodePool = require('PrefabMsg');

cc.Class({
    "extends": cc.Component,

    properties: {

        // 火球的最大移动速度
        fireMaxMoveSpeed: 0,
        // 火球移动的加速度
        fireAccel: 0,
        //火球初速度
        fireSpeed: 200
    },

    //引用对象池
    // firePool: {
    //     default: null,
    //     type: nodePool
    // }
    //  setInputControl: function () {
    //     var self = this;
    //     // 添加键盘事件监听器
    //     cc.eventManager.addListener({
    //         event: cc.EventListener.KEYBOARD,
    //         // 根据按下的按键，设置向对应方向加速_(:з」∠)_
    //         onKeyPressed: function(keyCode, event) {
    //             switch(keyCode) {
    //                 case cc.KEY.a:

    //                     self.accLeft = false;
    //                     self.accRight = true;

    //                     break;
    //             }
    //         },

    //     },self.node);
    // },

    onLoad: function onLoad() {
        // 加速度方向开关
        this.accLeft = false;
        // this.accRight = false;
        this.accRight = true;

        // 火球当前水平方向速度
        // this.fireSpeed = 0;

        // 初始化输入控制
        //this.setInputControl();

        // this.firePool.init();
    },
    update: function update(dt) {

        if (this.accRight) {
            this.fireSpeed += this.fireAccel * dt;
        }

        // 限制火球的速度不能超过最大值
        if (Math.abs(this.fireSpeed) > this.fireMaxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.fireSpeed = this.fireMaxMoveSpeed * this.fireSpeed / Math.abs(this.fireSpeed);
        }

        // 改变火球的位置，一段时间后消失

        if (this.node.x <= 600) {
            this.node.x += this.fireSpeed * dt;
        } else {
            this.fireSpeed = 0;
            //   this.node.destroy();
            // this.firePool.releasePrefabNode(this);
        }
    }

});

cc._RFpop();
},{}]},{},["fire","PrefabMsg","brave"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL0FkbWluaXN0cmF0b3IvQXBwRGF0YS9Mb2NhbC9Db2Nvc0NyZWF0b3IvYXBwLTEuMS4xL3Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdHMvUHJlZmFiTXNnLmpzIiwiYXNzZXRzL3NjcmlwdHMvYnJhdmUuanMiLCJhc3NldHMvc2NyaXB0cy9maXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzEzNWF2QVpVbEIrS2NFK3FyS1hpalYnLCAnUHJlZmFiTXNnJyk7XG4vLyBzY3JpcHRzXFxQcmVmYWJNc2cuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGZpcmVQcmVmYWI6IGNjLlByZWZhYiwgLy/lnLrmma/kuIrlop7liqDpooTnva7otYTmupDlsZ7mgKdcbiAgICAgICAgZmlyZVBvb2w6IGNjLk5vZGVQb29sLCAvL+WvueixoeaxoFxuICAgICAgICBpbml0Q291bnQ6IDUsIC8v5a+56LGh5rGg5pyA5aSn5a2Y5YKo5pWw6YePXG4gICAgICAgIHBhcmVudE5vZGU6IGNjLk5vZGUgLy/lhrPlrprlnKjlk6rkuKroioLngrnkuIrov5DooYxcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHt9LFxuXG4gICAgLy/lnLrmma/liqDovb0gIOWIm+W7uuWvueixoeaxoCAg5Yqg6L295oyC5ZyoQ2FudmFz5LiL55qEICDngavnkIPpooTnva7otYTmupBcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5maXJlUG9vbCA9IG5ldyBjYy5Ob2RlUG9vbCgpO1xuICAgICAgICB0aGlzLmluaXRDb3VudCA9IDU7IC8vbGV0IOexu+Wei+aYr2pz55qE5Z2X57qn5L2c55So5Z+fXG4gICAgICAgIHRoaXMuZmlyZVNwZWVkID0gdGhpcy5maXJlUHJlZmFiLmZpcmVTcGVlZDsgLy/orrDlvZVmaXJl5Yid6YCf5bqmXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmluaXRDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZmlyZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuZmlyZVByZWZhYik7IC8v5Yib5bu654Gr55CD6IqC54K5XG4gICAgICAgICAgICB0aGlzLmZpcmVQb29sLnB1dChmaXJlKTsgLy/lsIbngavnkIPoioLngrnliqDlhaXlr7nosaHmsaBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL+S7juWvueixoeaxoOWIm+W7uuaWsOeahFxuICAgIGNyZWF0ZVByZWZhYk5vZGU6IGZ1bmN0aW9uIGNyZWF0ZVByZWZhYk5vZGUoKSB7XG4gICAgICAgIHZhciBub2RlID0gbnVsbDtcblxuICAgICAgICAvL+WFiOajgOafpeWvueixoeaxoOaYr+WQpuWFhei2syAgIOS4jei2s+WImeWIm+W7uuaWsOeahFxuICAgICAgICBpZiAodGhpcy5maXJlUG9vbC5zaXplKCkgPiAwKSB7XG4gICAgICAgICAgICBub2RlID0gdGhpcy5maXJlUG9vbC5nZXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmZpcmVQcmVmYWIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm9kZS5wYXJlbnQgPSBwYXJlbnROb2RlOyAgLy/lsIbpooTliLblr7nosaHoioLngrnliqDlhaVcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLmFkZENoaWxkKG5vZGUpO1xuICAgICAgICAvLyBub2RlLmdldENvbXBvbmVudCgnZmlyZScpLmluaXQoKTsgLy/ojrflj5boioLngrnkuIrmjIflrprnsbvlnovnmoTnu4Tku7bvvIzlpoLmnpzoioLngrnmnInpmYTliqDmjIflrprnsbvlnovnmoTnu4Tku7bvvIzliJnov5Tlm57vvIzlpoLmnpzmsqHmnInliJnkuLrnqbrjgIJcbiAgICAgICAgLy/kvKDlhaXlj4LmlbDkuZ/lj6/ku6XmmK/ohJrmnKznmoTlkI3np7DjgIJcbiAgICB9LFxuXG4gICAgLy/lm57mlLblr7nosaFcbiAgICByZWxlYXNlUHJlZmFiTm9kZTogZnVuY3Rpb24gcmVsZWFzZVByZWZhYk5vZGUoZmlyZSkge1xuICAgICAgICBpZiAodGhpcy5maXJlUG9vbC5zaXplKCkgPj0gdGhpcy5pbml0Q291bnQpIHtcbiAgICAgICAgICAgIGZpcmUubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL+WIneWni+WMlmZpcmXmlbDmja5cbiAgICAgICAgICAgIGZpcmUuZmlyZVNwZWVkID0gMjAwO1xuICAgICAgICAgICAgZmlyZS5ub2RlLnNldFBvc2l0aW9uKDAsIDApO1xuICAgICAgICAgICAgdGhpcy5maXJlUG9vbC5wdXQoZmlyZS5ub2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzgyZWUzelQwTVJDYnA0NWc5VDJqMVp6JywgJ2JyYXZlJyk7XG4vLyBzY3JpcHRzXFxicmF2ZS5qc1xuXG52YXIgbm9kZVBvb2wgPSByZXF1aXJlKCdQcmVmYWJNc2cnKTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIC8vIOWjruaxieeahOacgOWkp+enu+WKqOmAn+W6pl8oOtC344CN4oigKV9cbiAgICAgICAgbWF4TW92ZVNwZWVkOiAwLFxuICAgICAgICAvLyDlo67msYnnp7vliqjnmoTliqDpgJ/luqZfKDrQt+OAjeKIoClfXG4gICAgICAgIGFjY2VsOiAwLFxuXG4gICAgICAgIC8v5byV55So5a+56LGh5rGgXG4gICAgICAgIGZpcmVQb29sOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBub2RlUG9vbFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldElucHV0Q29udHJvbDogZnVuY3Rpb24gc2V0SW5wdXRDb250cm9sKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIOa3u+WKoOmUruebmOS6i+S7tuebkeWQrOWZqF8oOtC344CN4oigKV9cbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgLy8g5qC55o2u5oyJ5LiL55qE5oyJ6ZSu77yM6K6+572u5ZCR5a+55bqU5pa55ZCR5Yqg6YCfXyg60LfjgI3iiKApX1xuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkucmlnaHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmjIlh5bu6ICDojrflj5bkuIDkuKrngavnkINcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZmlyZVBvb2wuY3JlYXRlUHJlZmFiTm9kZShzZWxmLm5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIOadvuW8gOaMiemUruaXtu+8jOWBnOatouenu+WKqF8oOtC344CN4oigKV9cbiAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQ6IGZ1bmN0aW9uIG9uS2V5UmVsZWFzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi54U3BlZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi54U3BlZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHNlbGYubm9kZSk7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXG4gICAgICAgIC8vIOWKoOmAn+W6puaWueWQkeW8gOWFs18oOtC344CN4oigKV9cbiAgICAgICAgdGhpcy5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgLy8g5Li76KeS5b2T5YmN5rC05bmz5pa55ZCR6YCf5bqmXyg60LfjgI3iiKApX1xuICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW6L6T5YWl5o6n5Yi2Xyg60LfjgI3iiKApX1xuICAgICAgICB0aGlzLnNldElucHV0Q29udHJvbCgpO1xuXG4gICAgICAgIC8vdGhpcy5maXJlUG9vbCA9IG5ldyBjYy5ub2RlUG9vbCgnUHJlZmFiTXNnJyk7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICAvLyDmoLnmja7lvZPliY3liqDpgJ/luqbmlrnlkJHmr4/luKfmm7TmlrDpgJ/luqZfKDrQt+OAjeKIoClfXG4gICAgICAgIGlmICh0aGlzLmFjY0xlZnQpIHtcbiAgICAgICAgICAgIHRoaXMueFNwZWVkIC09IHRoaXMuYWNjZWwgKiBkdDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFjY1JpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLnhTcGVlZCArPSB0aGlzLmFjY2VsICogZHQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8g6ZmQ5Yi25Li76KeS55qE6YCf5bqm5LiN6IO96LaF6L+H5pyA5aSn5YC8Xyg60LfjgI3iiKApX1xuICAgICAgICBpZiAoTWF0aC5hYnModGhpcy54U3BlZWQpID4gdGhpcy5tYXhNb3ZlU3BlZWQpIHtcbiAgICAgICAgICAgIC8vIGlmIHNwZWVkIHJlYWNoIGxpbWl0LCB1c2UgbWF4IHNwZWVkIHdpdGggY3VycmVudCBkaXJlY3Rpb25cbiAgICAgICAgICAgIHRoaXMueFNwZWVkID0gdGhpcy5tYXhNb3ZlU3BlZWQgKiB0aGlzLnhTcGVlZCAvIE1hdGguYWJzKHRoaXMueFNwZWVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOagueaNruW9k+WJjemAn+W6puabtOaWsOWjruaxieeahOS9jee9ru+8jOS9huaYr+S4jeiDvei2hei/h+Wxj+W5leiMg+WbtF8oOtC344CN4oigKV9cbiAgICAgICAgaWYgKHRoaXMubm9kZS54ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS54ICs9IHRoaXMueFNwZWVkICogZHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZS54ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9kZS54IDw9IDExMDApIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS54ICs9IHRoaXMueFNwZWVkICogZHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZS54IC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRzID0gdGhpcy5nZXRDb21wb25lbnRzSW5DaGlsZHJlbignZmlyZScpOyAvL3JldHVybiBDb21wb25lbnRbXVxuICAgICAgICBmb3IgKHZhciBpID0gY2hpbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGRzW2ldLmZpcmVTcGVlZCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maXJlUG9vbC5yZWxlYXNlUHJlZmFiTm9kZShjaGlsZHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzBiNmM0anlZS2hMN293cEg5aHpZd3MzJywgJ2ZpcmUnKTtcbi8vIHNjcmlwdHNcXGZpcmUuanNcblxuLy8gY29uc3Qgbm9kZVBvb2wgPSByZXF1aXJlKCdQcmVmYWJNc2cnKTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgLy8g54Gr55CD55qE5pyA5aSn56e75Yqo6YCf5bqmXG4gICAgICAgIGZpcmVNYXhNb3ZlU3BlZWQ6IDAsXG4gICAgICAgIC8vIOeBq+eQg+enu+WKqOeahOWKoOmAn+W6plxuICAgICAgICBmaXJlQWNjZWw6IDAsXG4gICAgICAgIC8v54Gr55CD5Yid6YCf5bqmXG4gICAgICAgIGZpcmVTcGVlZDogMjAwXG4gICAgfSxcblxuICAgIC8v5byV55So5a+56LGh5rGgXG4gICAgLy8gZmlyZVBvb2w6IHtcbiAgICAvLyAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAvLyAgICAgdHlwZTogbm9kZVBvb2xcbiAgICAvLyB9XG4gICAgLy8gIHNldElucHV0Q29udHJvbDogZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gICAgIC8vIOa3u+WKoOmUruebmOS6i+S7tuebkeWQrOWZqFxuICAgIC8vICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgIC8vICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQsXG4gICAgLy8gICAgICAgICAvLyDmoLnmja7mjInkuIvnmoTmjInplK7vvIzorr7nva7lkJHlr7nlupTmlrnlkJHliqDpgJ9fKDrQt+OAjeKIoClfXG4gICAgLy8gICAgICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgLy8gICAgICAgICAgICAgc3dpdGNoKGtleUNvZGUpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gdHJ1ZTtcblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfSxcblxuICAgIC8vICAgICB9LHNlbGYubm9kZSk7XG4gICAgLy8gfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICAvLyDliqDpgJ/luqbmlrnlkJHlvIDlhbNcbiAgICAgICAgdGhpcy5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgIC8vIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hY2NSaWdodCA9IHRydWU7XG5cbiAgICAgICAgLy8g54Gr55CD5b2T5YmN5rC05bmz5pa55ZCR6YCf5bqmXG4gICAgICAgIC8vIHRoaXMuZmlyZVNwZWVkID0gMDtcblxuICAgICAgICAvLyDliJ3lp4vljJbovpPlhaXmjqfliLZcbiAgICAgICAgLy90aGlzLnNldElucHV0Q29udHJvbCgpO1xuXG4gICAgICAgIC8vIHRoaXMuZmlyZVBvb2wuaW5pdCgpO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcblxuICAgICAgICBpZiAodGhpcy5hY2NSaWdodCkge1xuICAgICAgICAgICAgdGhpcy5maXJlU3BlZWQgKz0gdGhpcy5maXJlQWNjZWwgKiBkdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOmZkOWItueBq+eQg+eahOmAn+W6puS4jeiDvei2hei/h+acgOWkp+WAvFxuICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5maXJlU3BlZWQpID4gdGhpcy5maXJlTWF4TW92ZVNwZWVkKSB7XG4gICAgICAgICAgICAvLyBpZiBzcGVlZCByZWFjaCBsaW1pdCwgdXNlIG1heCBzcGVlZCB3aXRoIGN1cnJlbnQgZGlyZWN0aW9uXG4gICAgICAgICAgICB0aGlzLmZpcmVTcGVlZCA9IHRoaXMuZmlyZU1heE1vdmVTcGVlZCAqIHRoaXMuZmlyZVNwZWVkIC8gTWF0aC5hYnModGhpcy5maXJlU3BlZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5pS55Y+Y54Gr55CD55qE5L2N572u77yM5LiA5q615pe26Ze05ZCO5raI5aSxXG5cbiAgICAgICAgaWYgKHRoaXMubm9kZS54IDw9IDYwMCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnggKz0gdGhpcy5maXJlU3BlZWQgKiBkdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmlyZVNwZWVkID0gMDtcbiAgICAgICAgICAgIC8vICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIC8vIHRoaXMuZmlyZVBvb2wucmVsZWFzZVByZWZhYk5vZGUodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
