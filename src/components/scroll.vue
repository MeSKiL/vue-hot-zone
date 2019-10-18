<template>
    <div ref="wrapper" style="position: relative">
        <slot />
    </div>
</template>

<script>
    import BScroll from 'better-scroll'

    export default {
        name: 'scroll',
        props: {
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            data: {
                type: Array,
                default: null
            },
            listenScroll: {
                type: Boolean,
                default: false
            },
        },
        mounted () {
            setTimeout(() => {
                this._initScroll()
            }, 20)
        },
        methods: {
            _initScroll () {
                if (!this.$refs.wrapper) { // 如果wrapper实例没被创建就return
                    return
                }
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click,
                    scrollbar:true,
                });

                if (this.listenScroll) {
                    let me = this // this.scroll.on的回调里，会把this.变成scroll对象
                    this.scroll.on('scroll', (pos) => {
                        me.$emit('scroll', pos)
                    })
                }
            },
            enable () { // 代理
                this.scroll && this.scroll.enable()
            },
            disable () {
                this.scroll && this.scroll.disable()
            },
            refresh () {
                this.scroll && this.scroll.refresh()
            },
            scrollTo () {
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments) // 方法的this为调用他的组件
            },
            scrollToElement () {
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments) // 方法的this为调用他的组件
            }
        },
        watch: {
            data () { // 当data改变时自动刷新
                setTimeout(() => {
                    this.refresh()
                }, 20)
            }
        }
    }
</script>

<style scoped>
    .zone{
        position: absolute;
        background-color: black;
        opacity: 0.5;
    }
</style>
