<template>
  <div class="hello">
        <div class="login-wrap" v-if="!isCheckin">
          <div class="login-con">
            <h3>用户登录</h3>
            <input type="text" placeholder="请输入昵称" id="loginName" v-model.trim="uname" @keyup.13="login">
            <button class="login-btn" @click="login">登录</button>
          </div>

          <!--ajax做的一个公告-->
          <div style="    margin-top: 2rem;">
            <ul>
              <li v-for="item in gonggao">
                <span style="color: red" v-if="item.indexOf(2018)>=0">{{item}}</span>
                <span v-else>{{item}}</span>
              </li>
            </ul>
          </div>

        </div>


        
        <div class="chat-wrap " v-else>

          <span v-if="wd_num<=0" id="fan"  @click="fan" ><首页</span>
          <span v-else id="fan"  @click="newxiaoxi" >新消息({{wd_num}})</span>
          <span id="kan"  @click="kan" >...</span>

          <h1 style="padding-left: 1rem;font-size: 1rem;">多人聊天室（总人数：{{amount}}）</h1>

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


          <!--登录成功的进场特效...-->
          <template v-if="gif!=''">
            <div>
              <img style="position: fixed;top: 11%;left: -21%; z-index: 666;" :src="gif">
            </div>
          </template>


          <!--私聊发来的弹出框-->

          <div  class="send_qun"  v-if="send_qun.length!=0">
             <ul v-for="item in send_qun">
               <li>
                 <p style="color: red">{{item.who}}</p>
                 <p>发来了{{item.num}}条消息:</p>
     <p style=" margin-bottom: -0.59rem; width: 6rem;text-overflow: ellipsis;white-space: nowrap; overflow: hidden;">{{item.message}}</p>
    <p style="display: block;width: 23%;margin: 0 auto;color: white;
    background: #5cd361;float: right" @click="siliao2(item.who,item.to)">点击聊天</p>
               </li>
             </ul>
          </div>



          <div class="chat-con clearfix" id="chat_con">

            <template v-for="item in msgList">
              <!-- {{item | json}} -->
              <template v-if="item.msgType==0">
                 <p >{{item.message}}</p><br/>
              </template>
             
              <template v-else>                                <!--自己发送的时候就在右边-->
                  <div class="chat-item item-right clearfix" v-if="uname == item.username ">
                    <span class="img fr"></span>
               <!--这里是图片的显示-->
             <img  v-preview="item.message" preview-title-enable="true" preview-nav-enable="true"
                            style="height: 50%;width: 30%; max-width: 35%;max-height: 10rem;" class="img fr" v-if="item.img==1" :src=item.message>
                    <span v-else class="message fr">{{item.message}}</span>

                  </div>

                  <div class="chat-item item-left clearfix rela" v-else>
                    <span class="abs uname">{{item.username}}  ( {{item.msgDate | formatDate}} )</span>
                    <span v-on:click="siliao(item.username)" class="img fl"></span>

                    <!--这里其他人的图片显示-->
         <img  v-preview="item.message" preview-title-enable="true" preview-nav-enable="true"
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

/*
  import jwt from 'jwt-simple'
  //var jwt = require('jwt-simple');
  var payload = { foo: 'bar',exp:Date.now()+60000};
  var secret = 'xxx';//每个用户唯一的秘钥匙，服务器保存

  var time='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJleHAiOjE1Mjg1NDIzMTExNDl9.G9wCfq2JCnEAz5OINqMR-0qghGPhddfvDVFVBeD9QqA';
  // encode
  var token = jwt.encode(payload, secret);
  console.log(token);

  function formatDate(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
  }




  // decode


  try {
    var decoded = jwt.decode(time, secret);
    console.log('token验证成功');
    console.log('过期时间'+ formatDate(decoded.exp));
    console.log(decoded);

  } catch (err) {
    console.log('token错误或者该token过期');
     //  jwt会返回报错。。。所以要用catch
  }
*/

/***********************/

export default {
  name: 'HelloWorld',
  data () {
    return {
      qun_height:'', //聊天框的高度
      send_qun:[], //从私聊发到群聊的，会弹出一个小框
      gif:'',//进场特效
      gonggao:[],//ajax的公告
      imgloading:0,//发送图片的时候才显示发送中...
      msg: 'Welcome to Your Vue.js App',
      loading:0,//每次打开默认显示加载
      amount: 0,          //聊天室总数人
      uname: '游客'+Math.ceil(Math.random()*10000),    //定义用户名
      inputMsg: '',
      socket: null,       //定义socket实例
      socket2: null,       //用来监听私聊的服务器端口
      isCheckin: false,
      msgList:[],         //服务端返回的信息列表
      wd_friends:[],  //未读消息的好友列表
       wd_num:0  //未读消息默认0
    }
  },

  /****histror模式下，必须设置离开导航前设置高度******/
  beforeRouteLeave(to, from, next){
  from.meta.savedPosition = document.getElementById('chat_con').scrollHeight;
  next();
},

  mounted:function(){
    var vm = this;
    /*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/ 
    vm.socket = io('ws://45.195.203.158:8484');

    /****axios请求接口获取更新公告*********/
    vm.$ajax.post('http://cxla.net/server/ajax.php', {
              id: '2',
              lastName: '1'
            })
            .then(function (res) {
             vm.gonggao=res.data;
            })
            .catch(function (error) {
              console.log(error);
            });
    /****axios请求接口 end *********/

    //从Home进入的默认群聊 qun==1
    var flag=vm.$route.params.qun;
    if(flag==1){
      vm.uname=vm.$route.params.me;
      vm.loading=1;//关掉loading
      //表示从home的默认群聊进来的
      vm.isCheckin=true;
      vm.socket.emit('user_num',{});//发送人数变更请求
      //并且带上聊天记录


     console.log('——————————————',vm.send_qun);
    }

    /*******私聊的未读消息*******/
    vm.socket.on('weidu',function(data){
      //未读消息  点击头像后的未读消息
      var arr=[];
      console.log('未读消息。。',data);
      //var arr = array.concat(arr_fri);
      let new_arr = [...new Set(data)];//数组去重
      //console.log('去重后。。',JSON.parse(new_arr[0]).me);
      //console.log('去重后。。',new_arr.length);
      vm.wd_num=new_arr.length;
      for(var i=0;i<new_arr.length;i++){
           arr.push(JSON.parse(new_arr[i]) );
      }
        vm.wd_friends=arr;
      console.log('去重后。。',vm.wd_friends);


    });

    //localStorage.clear();
 /*   var q=['qqq','1223','32324555'];
     console.log(JSON.stringify(q));
    console.log(JSON.stringify(q).length);

    console.log(q);
var arr=[];
    localStorage.setItem('221',q);
    console.log('转成');
    console.log(arr=localStorage.getItem('221').split(','));*/
  //  console.log(JSON.stringify(localStorage.getItem('221')));


    var shua=vm.$route.params.shua;
    if(shua==1){
      //返回的时候强制刷新下
      window.location.reload();
    }

    /*登录成功*/
    vm.socket.on('loginSuccess',function(data){
      if(data.username === vm.uname){
        // vm.checkin(data)
        localStorage.setItem('user_'+vm.uname,vm.uname);//本地存储自己的用户名
        vm.isCheckin = true;

        //爱心进场开场动画
        var pic=[
          'http://cxla.net/server/img/0.png','http://cxla.net/server/img/1.png',
          'http://cxla.net/server/img/2.png','http://cxla.net/server/img/3.png',
          'http://cxla.net/server/img/4.png','http://cxla.net/server/img/5.png',
          'http://cxla.net/server/img/6.png','http://cxla.net/server/img/7.png',

          'http://cxla.net/server/img/8.png','http://cxla.net/server/img/9.png',
          'http://cxla.net/server/img/10.png','http://cxla.net/server/img/11.png',
          'http://cxla.net/server/img/12.png', ''
        ];
        var i=0;
        var q=setInterval(function(){
          vm.gif=pic[i++];
          if(i>=14){
            clearInterval(q);
           // vm.gif='';
          }
        },100);

      }else{
        alert('用户名不匹配，请重试')
      }
    });

    /*登录失败*/
    vm.socket.on('loginFail',function(){
      alert('昵称重复')
    })

    /*监听人数*/
    vm.socket.on('amountChange',function(data){
      vm.amount = data
    })

    /*关闭图片发送中*/
    vm.socket.on('closeimgloading',function(data){
      vm.imgloading = 0;
    });


    //从私聊端口过来，发送给当前用户的消息
    vm.socket.on('send_qun',function(data){
      //每次从私聊发来的信息data，不取重复用户，有重复就赋值消息就行
      if(vm.send_qun.length==0){
         vm.send_qun.push(data);  //空数组直接加入
      }else{
           // 下面取到的用户都是不重复的，取用户最新的消息
          function js(vm,data){

            for(var i=0; i<vm.send_qun.length;i++){
              if(vm.send_qun[i].who==data.who){
                vm.send_qun[i].message=data.message;
                vm.send_qun[i].num+=1;
                return true;
              }
            }
            return false;
          }

              if(js(vm,data)){
                     //已经在函数里面执行了
              }else {
                vm.send_qun.push(data);  //新用户直接加入
              }
      }

      console.log('2——————————————',vm.send_qun);

    });


    /*loading 当读取完聊天记录的时候就不显示*/
    vm.socket.on('loading',function(data){
      vm.loading =1;
    });

    /*接收消息*/
    vm.socket.on('receiveMessage',function(data){
      //console.log('接收到服务端返回：',data)
      vm.msgList.push(data);


        setTimeout(function(){
          window.scrollTo(0, document.getElementById('chat_con').scrollHeight);
        },10);

        vm.qun_height=document.getElementById('chat_con').scrollHeight;
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

    //文件选择发生变化事件
    sendimg:function(){
      var vm=this;
      var img=''; var img2='';
      let Imginput = document.getElementById('tupian');
      let file = Imginput.files[0];       //得到该图片
      let reader = new FileReader();      //创建一个FileReader对象，进行下一步的操作
      reader.readAsDataURL(file);//通过readAsDataURL读取图片

      reader.onload =function () {            //读取完毕会自动触发，读取结果保存在result中
        let data = {img: this.result,me:vm.uname};
        //获取到图片src后，发送给后台
        vm.socket.emit('sendImg', data);

        //发送图片的时候显示 图片发送中...
        vm.imgloading=1;
      }


    },


    //首页
    fan:function(){
      var vm = this;
      vm.$router.push({ name: 'Home', params:{ qun:1,me:vm.uname }});
    },

    // 查看群聊成员，点击可以私聊
    kan:function(){
      this.$router.push({ name: 'kan', params:{me:this.uname}});
    },

    //在群聊里面点击左上角新消息的时候。。跳好友列表就是首页
    newxiaoxi:function(){
      var vm = this;
      //把who发的用户组传过去好友列表页，再把他自己的用户名传过去
      vm.$router.push({ name: 'Home', params:{friends:vm.wd_friends,me:vm.uname,qun:2}});
    },

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
    },

    //点击 立即聊天消息框
    siliao2:function(ta,me){
      var vm = this;
      //who=ta   to=me
     // 点击的时候顺便把对应的用户删除，就不会继续显示了，没点的，继续显示
      var q=vm.send_qun;
      for(var i=0;i< q.length;i++){
         if(q[i].who==ta){
           q.splice(i,1);
           q=q-1;
         }
      }

      vm.$router.push({ name: 'Siliao', params: { ta: ta,me:me }});

    }



  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .send_qun p{
    display: inline-block;
    padding: 5px 10px;
    background: #999;
    border-radius: 5px;
    color: #fff;
    margin: 5px 0;
  }

  .send_qun{
    position: fixed;
    top: 10%;
    z-index: 66;
  }

  .chat-wrap #fan{
    color: white;
    z-index: 99999999999;
    position: fixed;
    left: 0;
    line-height: 3rem;
  }

  .chat-wrap #kan{
    color: #fff;
    z-index: 99999999999;
    position: fixed;
    right: 0;
    line-height: 1.4rem;
    font-size: 2.8rem;
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
