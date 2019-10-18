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
                <Scroll class="phone" ref="phone" :probeType="3" :listen-scroll="true" @scroll="scroll">
                    <div ref="dom" style="position: relative">
                        <img v-for="item in fileList" class="image-src" :src="item.thumbUrl" />
                        <div class="hot-zone" v-for="(item,index) in innerZoneList" :key="index"
                             :style="{
                         top:item.top+'px',
                         left:item.left+'px',
                         width:item.width+'px',
                         height:item.height+'px'}">
                            >
                        </div>
                    </div>
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
                <a-button @click="_handleClick" :type="primary">{{write?'确定':'设置'}}</a-button>
                <a-button @click="_handleClean">重置热区</a-button>
            </div>
        </div>
    </div>

</template>

<script>
    import AButton from 'ant-design-vue/lib/button'
    import Upload from 'ant-design-vue/lib/upload'
    import Modal from 'ant-design-vue/lib/modal'
    import Icon from 'ant-design-vue/lib/icon'
    import {mapMutations, mapGetters} from 'vuex'
    import Scroll from './scroll'
    // import

    export default {
        name: "HotZone",
        components: {
            AButton, Upload, Modal, Icon, Scroll
        },
        data() {
            return {
                previewVisible: false,
                previewImage: '',
                write: false,
                hotZoneList: [],
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
        },
        mounted() {
            this.phoneWidth = this.$refs.phone.$el.offsetWidth;
            this.phoneHeight = this.$refs.phone.$el.offsetHeight;
        },
        methods: {
            ...mapMutations({
                setFileList: 'SET_FILE',
                setZoneList: 'SET_ZONE',
                cleanZone: 'CLEAN_ZONE'
            }),
            scroll(val) {
                this.scrollY = val.y;
            },
            mouseStart(e) {
                this.type = 'rb'
                if (!this.write) return;
                this.touch = true;
                console.log('mouseStart', e);
                this.hotZoneList.push({
                    top: e.layerY,
                    left: e.layerX,
                    width: 0,
                    height: 0
                })
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
            },

            handleCancel() {
                this.previewVisible = false;
            },
            handlePreview(file) {
                this.previewImage = file.url || file.thumbUrl;
                this.previewVisible = true;
            },
            handleChange({fileList}) {
                this.setFileList(fileList);
                this.$forceUpdate();
            },
            _handleClick() {
                this.write = !this.write;
                if (this.write) { // 可写就不能动
                    this.$refs.phone.disable()
                } else {
                    this.setZoneList(this.hotZoneList.map(item => {
                        if (!item.top) {
                            item.top = this.phoneHeight - item.bottom - item.height
                        }
                        item.top -= this.scrollY;
                        if (!item.left) {
                            console.log(this.phoneWidth, item.right, item.width)
                            item.left = this.phoneWidth - item.right - item.width
                        }
                        return item
                    }));
                    this.hotZoneList = [];
                    console.log(this.innerZoneList);
                    this.$refs.phone.enable()
                }
            },
            _handleClean() {
                this.cleanZone();
            },
            _rbMove(e, zone) {
                console.log('_rb');
                let width = e.layerX - zone.left;
                let height = e.layerY - zone.top;
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
                console.log('_rt');
                let width = e.layerX - zone.left;
                let height = this.phoneHeight - zone.bottom - e.layerY;
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
                console.log('_lb');
                let width = this.phoneWidth - zone.right - e.layerX;
                let height = e.layerY - zone.top;
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
                console.log('_lt');
                let width = this.phoneWidth - zone.right - e.layerX;
                let height = this.phoneHeight - zone.bottom - e.layerY;
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
            width: 100%;
            padding: 50px;

            .phone {
                position: relative;
                width: 375px;
                height: 667px;
                overflow: hidden;

                .hot-zone {
                    position: absolute;
                    background-color: black;
                    opacity: 0.5;
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
                }
            }

            .action {
                margin-left: 100px;
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
