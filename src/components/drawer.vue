<template>
    <div>
        <a-drawer
                title="热区设置"
                placement="right"
                @close="_onClose"
                :visible="visible"
                :maskClosable="false"
                width="400"
        >
            <div class="drawer-content">
                <div class="action-item" v-if="!dataProp.other">
                    <!--有其他属性的热区不可修改-->
                    <p class="title">url</p>
                    <div class="url-link">
                        <a-input placeholder="url链接" v-model="url"/>
                        <a-input class="remark" style="margin-top:10px" placeholder="备注" v-model="remark"/>
                    </div>
                    <div class="button-list">
                        <a-button class="action-button" @click="_onCancel">取消</a-button>
                        <a-button class="action-button" type="primary" @click="_onConfirm">确定</a-button>
                    </div>
                </div>
                <div class="action-item">
                    <p class="title">删除热区</p>
                    <div style="width:100%;display: flex;justify-content: flex-end">
                        <a-button class="action-button" @click="_delete">删除</a-button>
                    </div>

                </div>
                <div class="action-item">
                    <p class="title">其他操作</p>
                    <a-button type="primary" @click="_backToTop">回到顶部</a-button>
                </div>
            </div>

        </a-drawer>
    </div>

</template>

<script>
    import ADrawer from 'ant-design-vue/lib/drawer'
    import AInput from 'ant-design-vue/lib/input'
    import AButton from 'ant-design-vue/lib/button'

    export default {
        props: {
            visible: {
                type: Boolean,
                default: true,
            },
            dataProp: {
                type: Object,
                default: null
            }
        },
        name: "drawer",
        components: {
            ADrawer, AInput, AButton
        },
        data() {
            let url = this.dataProp.url;
            let remark = this.dataProp.remark;
            // props在data之前init
            return {
                url,
                remark
            };
        },
        mounted() {
        },
        methods: {
            _onClose() {
                this.$emit('drawerEvent', 'close');
            },
            _onConfirm(other={}){
                this.$emit('drawerEvent','confirm',{...this.dataProp,url:this.url,remark:this.remark,...other})
            },
            _onCancel(){
                this.$emit('drawerEvent','cancel')
            },
            _delete(){
                this.$emit('drawerEvent','delete',this.dataProp)
            },
            _backToTop(){
                this._onConfirm({other:'backToTop',remark:'回到顶部'})
            }
        }
    }
</script>

<style scoped lang="less">
    .drawer-content {
        display: flex;
        flex-direction: column;

        .action-item {
            margin-bottom: 30px;

            .url-link {
                .remark /deep/ .ant-input {
                    width: 200px;
                }
            }

            .title {
                font-size: 22px;
            }

            .action-button {
                width: 100px;
            }

            .button-list {
                display: flex;
                justify-content: space-between;
                width: 100%;
                box-sizing: border-box;
                margin-top: 30px;
            }
        }


    }
</style>
