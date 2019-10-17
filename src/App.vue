<template>
    <div id="app">
        <hot-zone />
    </div>
</template>

<script>
    import HotZone from './components/HotZone';

    export default {
        name: 'app',
        components: {
            HotZone
        },
        created() {
            if (sessionStorage.getItem('store')) {
                this.$store.replaceState(
                    Object.assign(
                        {},
                        this.$store.state,
                        JSON.parse(sessionStorage.getItem('store'))
                    )
                )
            }
            // 在页面刷新时将vuex里的信息保存到sessionStorage里
            window.addEventListener('beforeunload', () => {
                sessionStorage.setItem('store', JSON.stringify(this.$store.state))
            })
        }
    }
</script>

<style lang="less">
    #app {
        width:100%;
        height:100%;

    }
</style>
