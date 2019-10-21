<template>
    <div class="root">
        <upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                :fileList="fileList"
                @preview="handlePreview"
                @change="handleChange"
                class="upload-style"
        >
            <div>
                <Icon type="plus" />
                <div class="ant-upload-text">upload</div>
            </div>
        </upload>
        <modal
                :visible="previewVisible"
                :footer="null"
                @cancel="handleCancel"
        >
            <img alt="example" style="width: 100%" :src="previewImage" />
        </modal>
        <div class="content">
            <div style="border: 2px solid black">
                <Scroll class="phone" ref="phone" :class="{write:write}" :probeType="3" :listen-scroll="true"
                        @scroll="scroll">
                    <div ref="dom" style="position: relative" @mousemove="__mouseMove" @mouseup="__mouseMoveEnd">
                        <img v-for="item in fileList" class="image-src" :src="item.thumbUrl" />
                        <div @mousedown="_moveZoneStart(item)"
                             @mouseup="_zoneClick(item)"
                             class="hot-zone inner-zone"
                             v-for="(item,index) in innerZoneList" :key="index"
                             :style="{
                                 top:item.top+'px',
                                 left:item.left+'px',
                                 width:item.width+'px',
                                 height:item.height+'px'
                             }"
                        >
                            <div class="dot" v-for="dot in dots" :class="dot"
                                 @mousedown="_resizeZoneStart(dot,item,$event)"></div>
                            <p style="color:#fff;font-size: 16px;margin:unset">{{item.remark}}</p>
                        </div>
                    </div>

                    <!--画布-->
                    <div class="canvas" v-show="write" @mousedown="mouseStart" @mouseup="mouseEnd"
                         @mousemove="mouseMove">
                        <div class="hot-zone" v-for="(item,index) in hotZoneList" :key="index"
                             :style="{
                         top:item.top?(item.top+'px'):'unset',
                         left:item.left?(item.left+'px'):'unset',
                         right:item.right?(item.right+'px'):'unset',
                         bottom:item.bottom?(item.bottom+'px'):'unset',
                         width:item.width+'px',
                         height:item.height+'px'}"
                        >
                        </div>
                    </div>
                </Scroll>
            </div>
            <div class="action">
                <a-button class="action-button" @click="_handleClick" :type="primary">{{write?'确定':'绘制热区'}}</a-button>
                <a-button class="action-button" @click="_handleClean">重置热区</a-button>
                <div class="bug-button action-button" @click="_handleBug">bug处理</div>
                <a-button type="primary" class="action-button" @click="submit">提交</a-button>
            </div>
        </div>
        <m-drawer v-if="drawerData" @drawerEvent="_drawerEvent" :data-prop="drawerData"></m-drawer>
        <modal title="文章标题" v-model="showModal" @ok="_handleOk">
            <a-input placeholder="请输入文章标题" v-model="title"/>
        </modal>
    </div>
</template>

<script>
    import AButton from 'ant-design-vue/lib/button'
    import Upload from 'ant-design-vue/lib/upload'
    import Modal from 'ant-design-vue/lib/modal'
    import Icon from 'ant-design-vue/lib/icon'
    import {mapMutations, mapGetters} from 'vuex'
    import Scroll from './scroll'
    import createZone, {Zone} from '../common/js/zone'
    import MDrawer from './drawer'
    import {getHTML} from '../common/js/template'
    import AInput from 'ant-design-vue/lib/input'

    export default {
        name: "HotZone",
        components: {
            AButton, Upload, Modal, Icon, Scroll, MDrawer,AInput
        },
        data() {
            return {
                previewVisible: false,
                previewImage: '',
                write: false,
                hotZoneList: [],
                drawerData: null, // 抽屉数据
                showModal:false, // 填标题框
                title:'' // html标题
            }
        },
        computed: {
            ...mapGetters(["fileList", "innerZoneList"]),
            primary() {
                return this.write ? 'primary' : ''
            }
        },
        created() {
            this.touch = false; // 是否按下
            this.scrollY = 0; // 滚动距离
            this.type = 'rb'; // 划热区的时候有四种状态 rb rt lb lt
            this.phoneWidth = 0;
            this.phoneHeight = 0;
            this.changeItem = null; // 正在修改的item
            this.dots = ["lt", "mt", "rt", "lm", "rm", "lb", "mb", "rb"];
            this.firstTime = 0; // 点击事件
            this.lastTime = 0; // 点击事件
            this.PHONE_LEFT = 0;
            this.PHONE_TOP = 0;
        },
        mounted() {
            this.phoneWidth = this.$refs.phone.$el.offsetWidth;
            this.phoneHeight = this.$refs.phone.$el.offsetHeight;
        },
        methods: {
            ...mapMutations({
                setFileList: 'SET_FILE',
                setZoneList: 'SET_ZONE',
                cleanZone: 'CLEAN_ZONE',
                setUrlAndRemark: 'SET_ZONE_URL_AND_REMARK',
                deleteZone: 'DELETE_ZONE'
            }),

            // 监听 模拟手机的滚动
            scroll(val) {
                this.scrollY = val.y;
            },

            // 画画事件
            mouseStart(e) {
                this.PHONE_LEFT = this.$refs.phone.$el.offsetLeft - document.documentElement.scrollLeft;
                this.PHONE_TOP = this.$refs.phone.$el.offsetTop - document.documentElement.scrollTop;
                // 点击的时候要重新计算手机距离上方与左方的距离
                console.log(this.PHONE_TOP)
                this.type = 'rb';
                if (!this.write) return;
                this.touch = true;
                this.hotZoneList.push(createZone({
                    top: e.layerY,
                    left: e.layerX,
                }))
            },
            mouseMove(e) {
                if (this.touch) {
                    let zone = this.hotZoneList[this.hotZoneList.length - 1];
                    if (this.type === 'rb') {
                        this._rbMove(e, zone)
                    } else if (this.type === 'rt') {
                        this._rtMove(e, zone)
                    } else if (this.type === 'lb') {
                        this._lbMove(e, zone)
                    } else if (this.type === 'lt') {
                        this._ltMove(e, zone)
                    }
                    this.$forceUpdate();
                }
            },
            mouseEnd(e) {
                if (!this.write) return;
                this.touch = false;
                this._handleClick();
                this.__drawerOpen(this.innerZoneList[this.innerZoneList.length - 1]);
            },

            // 上传图片事件
            // 删除
            handleCancel() {
                this.previewVisible = false;
            },
            // 预览
            handlePreview(file) {
                this.previewImage = file.url || file.thumbUrl;
                this.previewVisible = true;
            },
            // 图片change事件
            handleChange({fileList}) {
                this.setFileList(fileList);
                this.$forceUpdate();
            },


            // 操作栏事件
            // 设置
            _handleClick() {
                this.write = !this.write;
                if (this.write) { // 可写就不能动
                    this.$refs.phone.disable()
                } else { // 按理说没必要 todo
                    this.setZoneList(this.hotZoneList.map(item => {
                        if (!item.top) {
                            item.top = this.phoneHeight - item.bottom - item.height
                        }
                        item.top -= this.scrollY;
                        if (!item.left) {
                            console.log(this.phoneWidth, item.right, item.width)
                            item.left = this.phoneWidth - item.right - item.width
                        }
                        return createZone(item)
                    }));
                    this.hotZoneList = [];
                    console.log(this.innerZoneList);
                    this.$refs.phone.enable()
                }
            },

            // 重置热区
            _handleClean() {
                this.cleanZone();
            },

            _handleBug() { // 处理操作dom的bug
                this.$refs.phone.enable();
                this.changeItem = null;
                this.innerZoneList.forEach(item => {
                    item.move = false;
                    item.resizeType = ''
                });
            },

            submit() {
                this.showModal = true
            },

            _handleOk(){
                this.showModal = false
                getHTML(this.fileList, this.innerZoneList,this.title)
            },

            // 不同方向的创建热区,在画板操作，与底图无关
            _rbMove(e, zone) {
                let width = e.clientX - this.PHONE_LEFT - zone.left;
                let height = e.clientY - this.PHONE_TOP - zone.top;
                if (width < 0) {
                    // r-l
                    this.type = 'lb';
                    this.__rtol(zone);
                    return
                }
                if (height < 0) {
                    // b-t
                    this.type = 'rt';
                    this.__btot(zone);
                    return
                }
                zone.width = width;
                zone.height = height;
            },
            _rtMove(e, zone) {
                let width = e.clientX - this.PHONE_LEFT - zone.left;
                let height = this.phoneHeight - zone.bottom - (e.clientY - this.PHONE_TOP);
                if (width < 0) {
                    this.type = 'lt';
                    // r-l
                    this.__rtol(zone);
                    return
                }
                if (height < 0) {
                    // t-b
                    this.type = 'rb';
                    this.__ttob(zone);
                    return
                }
                zone.width = width;
                zone.height = height;
            },
            _lbMove(e, zone) {
                let width = this.phoneWidth - zone.right - (e.clientX - this.PHONE_LEFT);
                let height = (e.clientY - this.PHONE_TOP) - zone.top;
                if (width < 0) {
                    this.type = 'rb';
                    // l-r
                    this.__ltor(zone)
                    return
                }
                if (height < 0) {
                    this.type = 'lt';
                    // b-t
                    this.__btot(zone)
                    return
                }
                zone.width = width;
                zone.height = height;
            },
            _ltMove(e, zone) {
                let width = this.phoneWidth - zone.right - (e.clientX - this.PHONE_LEFT);
                let height = this.phoneHeight - zone.bottom - (e.clientY - this.PHONE_TOP);
                // console.log(width, height);
                if (width < 0) {
                    this.type = 'rt';
                    // l-r
                    this.__ltor(zone);
                    return
                }
                if (height < 0) {
                    this.type = 'lb';
                    // t-b
                    this.__ttob(zone);
                    return
                }
                zone.width = width;
                zone.height = height;
            },

            __rtol(zone) {
                zone.right = this.phoneWidth - zone.left;
                zone.left = null;
            },
            __btot(zone) {
                zone.bottom = this.phoneHeight - zone.top;
                zone.top = null;
            },
            __ltor(zone) {
                zone.left = this.phoneWidth - zone.right;
                zone.right = null;
            },
            __ttob(zone) {
                zone.top = this.phoneHeight - zone.bottom;
                zone.bottom = null;
            },

            __mouseMove(e) { // 监听全图的鼠标移动，可能是改变大小，也可能是移动
                const item = this.changeItem;
                this._moveZoneMove(e, item); // 区域移动
                this._resizeZoneMove(e, item); // 改变区域大小
            },
            __mouseMoveEnd() { // 监听全图的鼠标抬起，可能是鼠标移动结束，也可能是改变大小结束
                const item = this.changeItem;
                if (item) {
                    this._moveZoneEnd(item);
                    this._resizeZoneEnd(item);
                }
                this.changeItem = null;
                this.$refs.phone.enable();
            },

            _moveZoneStart(item) { // 按下热区
                this.changeItem = item;
                item.move = true;
                item.resizeType = '';
                this.$refs.phone.disable();
                this.firstTime = (new Date()).getTime();
            },
            _zoneClick(item) { // 点击热区
                this.lastTime = (new Date()).getTime();
                const clickTime = this.lastTime - this.firstTime;
                if (clickTime <= 200) {
                    this.__zoneClickEvent(item); // 热区点击事件
                }
            },
            __zoneClickEvent(item) {
                this._drawerEvent('open', item);
            },
            _moveZoneMove(e, item) { // 移动热区
                if (item && item.move) {
                    if (item.movePos) {
                        item.movePos(e.movementX, e.movementY)
                    } else {
                        Zone.prototype.movePos.call(item, e.movementX, e.movementY)
                    }
                }
            },
            _moveZoneEnd(item) { // 移动完成
                item.move = false;
            },
            _resizeZoneStart(dot, item, e) {
                e.stopPropagation();
                this.changeItem = item;
                item.resizeType = dot;
                item.move = false;
                this.$refs.phone.disable()
            },
            _resizeZoneMove(e, item) {
                if (item && item.resizeType) {
                    if (item.resize) {
                        item.resize(e.movementX, e.movementY)
                    } else {
                        Zone.prototype.resize.call(item, e.movementX, e.movementY)
                    }
                }
            },
            _resizeZoneEnd(item) { //改变大小完成
                item.resizeType = '';
            },

            // 抽屉
            _drawerEvent(action, arg) { // 抽屉事件
                if (action === 'close') { // 关闭抽屉
                    this.__drawerClose()
                }
                if (action === 'open') { // 打开抽屉
                    this.__drawerOpen(arg)
                }
                if (action === 'confirm') { // 确认
                    this.__drawerConfirm(arg)
                }
                if (action === 'cancel') { // 取消
                    this.__drawerCancel()
                }
                if (action === 'delete') { // 删除热区
                    this.__drawerDelete(arg);
                }
            },
            __drawerOpen(arg) {
                this.drawerData = arg
            },
            __drawerClose() {
                this.drawerData = null
            },
            __drawerConfirm(arg) {
                this.setUrlAndRemark(arg);
                this.drawerData = null
            },
            __drawerCancel() {
                this.drawerData = null;
            },
            __drawerDelete(arg) {
                this.deleteZone(arg);
                this.drawerData = null;
            }
        }
    }
</script>

<style scoped lang="less">
    .root {
        width: 100%;
        height: 100%;

        .upload-style {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .upload-style /deep/ .ant-upload {
            display: flex;
            justify-content: center;
            align-items: center;
        }


        .content {
            display: flex;
            justify-content: center;
            width: 100%;
            padding: 50px;

            .phone {
                position: relative;
                width: 375px;
                height: 667px;
                overflow: hidden;

                .hot-zone {
                    position: absolute;
                    background-color: rgba(0, 0, 0, 0.3);
                }

                .inner-zone {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .dot {
                        position: absolute;
                        width: 6px;
                        height: 6px;
                        background-color: black;
                        border-radius: 50%;
                    }

                    &:hover {
                        cursor: move;
                    }

                    .lt {
                        left: 0;
                        top: 0;

                        &:hover {
                            cursor: se-resize;
                        }
                    }

                    .mt {
                        top: 0;
                        left: calc(50% - 3px);

                        &:hover {
                            cursor: s-resize;
                        }
                    }

                    .rt {
                        top: 0;
                        right: 0;

                        &:hover {
                            cursor: ne-resize;
                        }
                    }

                    .lm {
                        left: 0;
                        top: calc(50% - 3px);

                        &:hover {
                            cursor: w-resize;
                        }
                    }

                    .rm {
                        top: calc(50% - 3px);
                        right: 0;

                        &:hover {
                            cursor: w-resize;
                        }
                    }

                    .lb {
                        left: 0;
                        bottom: 0;

                        &:hover {
                            cursor: ne-resize;
                        }
                    }

                    .mb {
                        bottom: 0;
                        left: calc(50% - 3px);

                        &:hover {
                            cursor: s-resize;
                        }
                    }

                    .rb {
                        bottom: 0;
                        right: 0;

                        &:hover {
                            cursor: se-resize;
                        }
                    }
                }

                .canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 5;
                }

                .image-src {
                    width: 100%;
                    user-select: none;
                }


            }

            .write:hover {
                cursor: crosshair;
            }

            .action {
                display: flex;
                flex-direction: column;
                margin-left: 100px;

                .bug-button {
                    padding: 5px 10px;
                    border: 1px solid red;
                    color: red;
                    border-radius: 5px;
                    text-align: center;

                    &:hover {
                        color: #40a9ff;
                        border-color: #40a9ff;
                        cursor: pointer;
                    }
                }

                .action-button {
                    margin-bottom: 10px;
                }
            }
        }
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }

</style>
