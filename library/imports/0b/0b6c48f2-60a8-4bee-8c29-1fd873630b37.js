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