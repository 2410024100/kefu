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
          <h1>多人聊天室（总人数：{{amount}}）</h1>
          <div class="chat-con clearfix" id="chat_con">
            <template v-for="item in msgList">
              <!-- {{item | json}} -->
              <template v-if="item.msgType==0">
                 <p >{{item.message}}</p><br/>
              </template>
             
              <template v-else>                                <!--自己发送的时候就在右边-->
                  <div class="chat-item item-right clearfix" v-if="uname == item.username ">
                    <span class="img fr"></span>
                    <span class="message fr">{{item.message}}</span>
                  </div>

                  <div class="chat-item item-left clearfix rela" v-else>
                    <span class="abs uname">{{item.username}}  ( {{item.msgDate | formatDate}} )</span>
                    <span @click="siliao(item.username)" class="img fl"></span>
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
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      amount: 0,          //聊天室总数人
      uname: Math.ceil(Math.random()*10000),    //定义用户名
      inputMsg: '',
      socket: null,       //定义socket实例
      isCheckin: false,
      msgList:[],         //服务端返回的信息列表
    }
  },
  mounted:function(){
    var vm = this;
    /*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/ 
    vm.socket = io('ws://39.109.122.23:8484');

    /*登录成功*/
    vm.socket.on('loginSuccess',function(data){
      if(data.username === vm.uname){
        // vm.checkin(data)
        vm.isCheckin = true;
      }else{
        alert('用户名不匹配，请重试')
      }
    })

    /*登录失败*/
    vm.socket.on('loginFail',function(){
      alert('昵称重复')
    })

    /*监听人数*/
    vm.socket.on('amountChange',function(data){
      vm.amount = data
    })

    

    /*接收消息*/
    vm.socket.on('receiveMessage',function(data){
      console.log('接收到服务端返回：',data)
      vm.msgList.push(data);


        setTimeout(function(){
          window.scrollTo(0, document.getElementById('chat_con').scrollHeight);
        },10);

     // window.scrollTo(0, document.getElementById('chat_con').scrollHeight);
      
      //console.log('----',document.getElementById('chat_con').scrollHeight)

      
    })

    /*新人加入提示*/
    // vm.socket.on('add',function(data){
    //   console.log(data)
  
    // })
    /*退出群聊提示*/
    // vm.socket.on('leave',function(name){
    //   console.log('退出===',name)
    //   if(name != null){
   
    //   }
    // })


  },
  filters:{
    formatDate:function(data){
      var date = data ? new Date(data) : new Date();
      var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
      return time;
    }
  },
  methods:{
    /*登录*/
    login:function(){
      var vm = this;

      if(vm.uname){
        /*向服务端发送登录事件*/
        vm.socket.emit('login',{username:vm.uname})
      }else{
        alert('请输入昵称')
      }
    },
   
    /*发送消息*/
    sendMessage:function(){
      var vm = this;
     
      if(vm.inputMsg){
        vm.socket.emit('sendMessage',{username:vm.uname,message:vm.inputMsg});
        vm.inputMsg = '';
      }else{
        alert('请输入……')
      }
    },
    //点击头像后私聊该用户
    siliao:function(name){
      console.log(name);
    var vm = this;
      var me=vm.uname;
     // vm.$router.push('/siliao');  //点击后路由跳转
      vm.$router.push({ name: 'Siliao', params: { ta: name,me:me }});
      //this.$route.params.id;
    }
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
