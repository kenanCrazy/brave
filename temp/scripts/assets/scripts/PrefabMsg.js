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