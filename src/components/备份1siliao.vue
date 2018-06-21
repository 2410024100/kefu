<template>
  <div class="hello">
    <div class="login-wrap" v-if="!isCheckin">
      <div class="login-con">
        <h3>用户登录</h3>
        <input type="text" placeholder="请输入昵称" id="loginName" v-model.trim="uname" @keyup.13="login">
        <button class="login-btn" @click="login">登录</button>
      </div>
    </div>

    <div class="chat-wrap " v-else>
      <span id="fan"  @click="fan" ><返回</span>
      <h1>{{ta}}</h1>
      <div class="chat-con clearfix" id="chat_con">
        <template v-for="item in msgList">
          <!-- {{item | json}} -->
          <template v-if="item.msgType==0">
            <p >{{item.message}}</p><br/>
          </template>

          <template v-else>                                <!--自己发送的时候就在右边-->
            <div class="chat-item item-right clearfix" v-if="me == item.username ">
              <span class="img fr"></span>
              <span class="message fr">{{item.message}}</span>
            </div>

            <div class="chat-item item-left clearfix rela" v-else>
              <span class="abs uname">{{item.username}}  ( {{item.msgDate | formatDate}} )</span>
              <span class="img fl"></span>
              <span class="fl message">{{item.message}}</span>
            </div>
          </template>
        </template>
      </div>
      <div class="bottom">
        <input type="text" id="sendtxt" v-model.trim="inputMsg" @keyup.13="sendMessage">
        <button class="sendBtn" @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'siliao',
    data () {
      return {
        me:'',//我自己id
        ta:'',//别人其他id
        msg: 'Welcome to Your Vue.js App',
        amount: 0,          //聊天室总数人
        // uname: Math.ceil(Math.random()*10000),    //定义用户名
        inputMsg: '',
        socket: null,       //定义socket实例
        isCheckin: true,  //登录成功就切换页面
        msgList:[],         //服务端返回的信息列表
      }
    },

    mounted:function(){
      var vm = this;

      vm.me=vm.$route.params.me;    vm.ta=vm.$route.params.ta; //路由参数


      /*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/
      vm.socket = io('ws://39.109.122.23:8485');

      /*点击头像的时候就当登录  传自己名字和别人名字过去*/
      vm.socket.emit('dj',{me:vm.me,ta:vm.ta});




      /*登录失败*/
      vm.socket.on('loginFail',function(){
        alert('失败，刷新即可')
      })





      /*接收消息*/
      vm.socket.on('Message',function(data){
        console.log('接收到服务端返回：',data)
        vm.msgList.push(data);


        setTimeout(function(){
          window.scrollTo(0, document.getElementById('chat_con').scrollHeight);
        },10);

        // window.scrollTo(0, document.getElementById('chat_con').scrollHeight);

        //console.log('----',document.getElementById('chat_con').scrollHeight)


      })




    },
    filters:{
      formatDate:function(data){
        var date = data ? new Date(data) : new Date();
        var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
        return time;
      }
    },
    methods:{
      //返回
      fan:function(){
        var vm = this;
        vm.$router.push({ name: 'HelloWorld', params:{ shua:1 }});
      },

      /*发送消息*/
      sendMessage:function(){
        var vm = this;

        if(vm.inputMsg){
          vm.socket.emit('sendtoMessage',{me:vm.me,ta:vm.ta,message:vm.inputMsg});
          vm.inputMsg = '';
        }else{
          alert('请输入……')
        }
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chat-wrap #fan{
    color: white;
    z-index: 99999999999;
    position: fixed;
    left: 0;
    line-height: 3rem;
  }

  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
