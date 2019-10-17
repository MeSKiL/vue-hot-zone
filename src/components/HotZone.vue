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
            <!--<Scroll :data="fileList" class="phone-list">-->
            <div class="phone" ref="phone">
                <div>
                    <img v-for="item in fileList" class="image-src" :src="item.thumbUrl" />
                </div>
            </div>
            <!--</Scroll>-->

        </div>
    </div>
</template>

<script>
    import Button from 'ant-design-vue/lib/button'
    import Upload from 'ant-design-vue/lib/upload'
    import Modal from 'ant-design-vue/lib/modal'
    import Icon from 'ant-design-vue/lib/icon'
    import {mapMutations, mapGetters} from 'vuex'
    // import Scroll from './scroll'
    import BScroll from '@better-scroll/core'

    export default {
        name: "HotZone",
        components: {
            Button, Upload, Modal, Icon
        },
        data() {
            return {
                previewVisible: false,
                previewImage: '',
            }
        },
        computed: {
            ...mapGetters(["fileList"])
        },
        mounted() {
            console.log(this.$refs.phone)
            let bs = new BScroll(this.$refs.phone, {
                scrollY:true
            });
            console.log(bs)
        },
        methods: {
            ...mapMutations({
                setFileList: 'SET_FILE'
            }),
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


        .phone {
            width: 375px;
            height: 667px;
            background-color: bisque;
            overflow: hidden;

            .image-src {
                width: 100%;
            }
        }


        .content {
            width: 100%;
            padding: 50px;
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
