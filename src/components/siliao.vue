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

          <span v-if="new_xiaoxi_num<=0" id="fan"  @click="fan" ><返回</span>
          <span v-else="" id="fan"  @click="newxiaoxi" >新消息({{new_xiaoxi_num}})</span>

          <h1>{{ta}}</h1>

          <!--加载聊天记录-->
          <template v-if="loading==0">
            <p style="position: fixed;top: 46%;left: 32%; z-index: 666;">加载聊天记录中...</p>
            <img style="position: fixed;top: 40%;left: 41%; z-index: 666;"
                 src="../assets/img/loading.gif">
          </template>


          <!--图片发送中...-->
          <template v-if="imgloading==1">
            <p style="position: fixed;top: 46%;left: 31%; z-index: 666;color: red">图片发送中...</p>
            <img style="position: fixed;top: 40%;left: 37%; z-index: 666;"
                 src="../assets/img/loading.gif">
          </template>


          <div class="chat-con clearfix" id="chat_con">
            <template v-for="item in msgList">
              <!-- {{item | json}} -->
              <template v-if="item.msgType==0">
                 <p >{{item.message}}</p><br/>
              </template>
             
              <template v-else>                                <!--自己发送的时候就在右边-->
                  <div class="chat-item item-right clearfix" v-if="me == item.username ">
                    <span class="img fr"></span>

                    <!--这里是图片的显示-->
     <img  v-preview="item.message" preview-title-enable="true" preview-nav-enable="true"
                            style="height: 50%;width: 30%; max-width: 35%;max-height: 10rem;" class="img fr" v-if="item.img==1" :src=item.message>


                       <template>
                    <span v-if="item.weidu==0" class="message fr"><p style="position: absolute;left: -2rem;top: -0.3rem;padding: 0.08rem;font-size: 0.75rem;background:rgb(234, 213, 31);">送达</p>{{item.message}}</span>
                    <span v-else-if="item.weidu==1" class="message fr"><p style="position: absolute;left: -2rem;top: -0.3rem;padding: 0.08rem;font-size: 0.75rem;background:rgb(41, 215, 11);">已读</p>{{item.message}}</span>
                   <!--<span v-else class="message fr">{{item.message}}</span>-->
                        </template>
                  </div>

                  <div class="chat-item item-left clearfix rela" v-else>
                    <span class="abs uname">{{item.username}}  ( {{item.msgDate | formatDate}} )</span>
                    <span class="img fl"></span>

                    <!--这里其他人的图片显示-->
     <img    v-preview="item.message" preview-title-enable="true" preview-nav-enable="true"
                            style="margin-top: 1.1rem;height: 50%;width: 30%; max-width: 35%;max-height: 10rem;" class="img fl" v-if="item.img==1" :src=item.message>
                    <span v-else class="fl message">{{item.message}}</span>

                  </div>
              </template>
            </template>
          </div>
          <div class="bottom">

            <input @change="sendimg" style="position: absolute;width: 35px;left: 0; height: 50px;z-index: 66;opacity: 0;" type="file" id="tupian">
            <span  style="position: absolute;left: 0;font-size: 3rem;height: 50px; line-height: 43px;">+</span>
            <input style="background: #b8b3bcb5;width: 70%;display: inline-block;margin-left: 10%;" type="text" id="sendtxt" v-model.trim="inputMsg" @keyup.13="sendMessage">

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
      loading:0,//每次打开默认显示加载
      imgloading:0,//发送图片的时候才显示发送中...

      me:'',//我自己id
      ta:'',//别人其他id
      msg: 'Welcome to Your Vue.js App',
      amount: 0,          //聊天室总数人
     // uname: Math.ceil(Math.random()*10000),    //定义用户名
      inputMsg: '',
      socket: null,       //定义socket实例
      socket2: null,       //用来监听群聊的服务器端口

      isCheckin: true,  //登录成功就切换页面
      msgList:[],         //服务端返回的信息列表
      new_xiaoxi_num:0,  //左上角新消息条数
      who_xiaoxi:'',//谁发的新消息
      who_arr:[] //谁发的新消息数组 不同框时候的好友列表

    }
  },

  mounted:function(){
    var vm = this;

    vm.me=vm.$route.params.me;    vm.ta=vm.$route.params.ta; //路由参数
    if(vm.me=='undefined'|| vm.ta=='undefined'||vm.me==''||vm.ta=='null'){
      vm.$router.push({ name: 'HelloWorld', params:{ shua:1 }});
    }

    /*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/ 
    vm.socket = io('ws://45.195.203.158:8485');
    vm.socket2 = io('ws://45.195.203.158:8484');//群聊服务器端口

    /*点击头像的时候就当登录  传自己名字和别人名字过去*/
    vm.socket.emit('dj',{me:vm.me,ta:vm.ta});

    //页面刷新事件，防崩溃
    window.onload=function() {
      vm.$router.push({ name: 'HelloWorld', params:{ shua:1 }});
    };


    /*登录失败*/
    vm.socket.on('loginFail',function(data){

      if(data.go==1){
        vm.$router.push({ name: 'HelloWorld', params:{ shua:1 }});
      }else {
        alert('失败，刷新即可');
      }
    });





    /*loading 当读取完聊天记录的时候就不显示*/
    vm.socket.on('loading',function(data){
      vm.loading =1;
    });

    /*关闭图片发送中*/
    vm.socket.on('closeimgloading',function(data){
      vm.imgloading = 0;
    });
    

    /*接收消息*/
    vm.socket.on('Message',function(data){
      console.log('接收到私聊服务端返回：',data);
      vm.msgList.push(data);

        setTimeout(function(){
          window.scrollTo(0, document.getElementById('chat_con').scrollHeight);
        },10);
     // window.scrollTo(0, document.getElementById('chat_con').scrollHeight);
      //console.log('----',document.getElementById('chat_con').scrollHeight)

      
    });


    //用户从私聊端口过来，去群聊判断to那个的用户在不在
    vm.socket.on('send_qun',function(data){
      vm.socket2.emit('send_qun',data);//调用群聊的
    });



    //
    vm.socket.on('weidu',function(data){
         //未读消息  点击头像后的未读消息
      console.log('未读消息。。',data);
    });

    //在不同框来消息的，左上角显示几条。。
    vm.socket.on('newxiaoxi',function(data){
      console.log('左上角新消息：',data);
      //判断下每次发来的who是不是一样的。。。不是就要累加 5.28号
      //修改为每次都+1
      vm.new_xiaoxi_num+=1;
      vm.who_arr.push(data.who);
        /*if(vm.who_xiaoxi==''){
          vm.new_xiaoxi_num=data.num;
          vm.who_xiaoxi=data.who;
          vm.who_arr.push(data.who);

        }else if(vm.who_xiaoxi==data.who){
          vm.new_xiaoxi_num+=1;

        } else if(vm.who_xiaoxi!=data.who){
            if(data.who in vm.who_arr){
              vm.new_xiaoxi_num+=1;
            }else {
              vm.new_xiaoxi_num+=1;
              vm.who_arr.push(data.who);
            }

        }  */
         console.log(vm.who_arr);

    });



  },
  filters:{
    formatDate:function(data){
      var date = data ? new Date(data) : new Date();
      var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
      return time;
    }
  },
  methods:{

    //文件选择发生变化事件
    sendimg:function(){
      var vm=this;
      var img=''; var img2='';
      let Imginput = document.getElementById('tupian');
      let file = Imginput.files[0];       //得到该图片
      let reader = new FileReader();      //创建一个FileReader对象，进行下一步的操作
      reader.readAsDataURL(file);//通过readAsDataURL读取图片

      reader.onload =function () {            //读取完毕会自动触发，读取结果保存在result中
        let data = {img: this.result,me:vm.me,ta:vm.ta};
        //获取到图片src后，发送给后台
        vm.socket.emit('sendImg', data);

        //发送图片的时候显示 图片发送中...
        vm.imgloading=1;

      }


    },


    //返回
    fan:function(){
      var vm = this;
      //私聊里面跳转到首页好友列表
       vm.$router.push({ name: 'Home', params:{ me:vm.me }});
      // vm.$router.push({ name: 'HelloWorld', params:{ shua:1 }});
    },

    //不同框的时候，左上角新消息
    newxiaoxi:function(){
      var vm = this;
      //把who发的用户组传过去好友列表页，再把他自己的用户名传过去
      vm.$router.push({ name: 'Home', params:{friends:vm.who_arr,ta:vm.ta,me:vm.me}});
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
