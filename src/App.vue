<template>
  <div id="app">
   <!--  如果发现切换路由组件后，不能被渲染新数据，就要使用下面方式，路由meta -->

      <keep-alive>

          <router-view v-if="$route.meta.keepAlive" :class="sty"></router-view>

      </keep-alive>

      <router-view v-if="!$route.meta.keepAlive" :class="sty"></router-view>


    <lg-preview></lg-preview>
  </div>
</template>

<script>
export default {
  name: 'app',
    data() {
        return {
            sty: ''
         }
    　　},

    watch: {
        '$route' (to, from) {
            if(to.path=='/web/'){
                this.sty='a-rotateinRB';
            }else  if(to.path=='/web/kan.xml'){
                 this.sty='a-rotatein';
            }else if(to.path=='/web/home.xml'){
                this.sty='a-flipinY';
            }

        }
    }

}
</script>

<style>




    /*#app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }*/
body{
    background: #e7e7e7;
    width: 100%;
    height: 100%;
    /*text-align: center;*/
}
</style>
