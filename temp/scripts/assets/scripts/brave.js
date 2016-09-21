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