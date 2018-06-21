<template>
  <div class="hello">

        
        <div class="chat-wrap " >
          <span id="fan"  @click="add_friend" >+</span>
          <h1>好友列表</h1>
          <div class="chat-con clearfix" id="chat_con">
            <p ></p>
          </div>
        </div>

      <!--添加好友弹窗-->
      <div class="login-wrap"  v-if="is_add==true">
          <div class="login-con add_friend">
              <h3>添加好友</h3>
              <input type="text" placeholder="请输入您好友的名称" id="loginName" v-model.trim="add_name" >
              <button class="login-btn" @click="add">添加</button>
          </div>
      </div>





    <ul   style="margin-top: -5.5rem" class="mui-table-view">
        <!--默认的群聊-->
        <template>
            <p>多人聊天室</p>
            <li @click="djql()" class="mui-table-view-cell mui-media">
                <a href="javascript:;">
                    <img class="mui-media-object mui-pull-left imgs" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3838013656,665916030&fm=27&gp=0.jpg">
                    <div  style="color: red" class="mui-media-body">
                        进入多人群聊
                        <p class='pp mui-ellipsis'>这里是多人聊天室，自带聊天记录喔.....ok 点击即可群聊</p>
                    </div>
                </a>
            </li>

            <hr>
        </template>



      <template v-if="wd_friends!='' && wd_friends!=undefined">

        <p>未读好友</p>
      <li v-for="item in wd_friends" @click="dj(item)" v-if="item!=''&& item!=undefined" class="mui-table-view-cell mui-media">
        <a href="javascript:;">
          <img class="mui-media-object mui-pull-left imgs" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=105763133,1055479016&fm=27&gp=0.jpg">
          <div  style="color: red" class="mui-media-body  shake shake-slow shake-constant">
            {{item}}
            <p class='pp mui-ellipsis'>能和心爱的人一起睡觉，是件幸福的事情；点击即可聊天</p>
          </div>
        </a>
      </li>

      <hr>
      </template>

     <template v-if="friends!=''">
      <p>好友列表</p>
      <li v-for="item in friends" @click="dj(item)" v-if="item!=''&& item!=undefined" class="mui-table-view-cell mui-media">
        <a href="javascript:;">
          <img class="mui-media-object mui-pull-left imgs" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=105763133,1055479016&fm=27&gp=0.jpg">
          <div class="mui-media-body">
            {{item}}
            <p class='pp mui-ellipsis'>能和心爱的人一起睡觉，是件幸福的事情；点击即可聊天</p>
          </div>
        </a>
      </li>
     </template>

    </ul>

  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',

      amount: 0,          //聊天室总数人
      uname: '游客'+Math.ceil(Math.random()*10000),    //定义用户名
      inputMsg: '',
      socket: null,       //定义socket实例
      isCheckin: true,
      msgList:[],         //服务端返回的信息列表
      friends:[],   //传过来的所有好友列表
      wd_friends:[],  //未读好友列表。。临时存，红色名字，抖动
      add_name:'',  // 要添加好友的名字。。
        is_add:false, //是否显示添加好友界面
      me:''    //我自己的用户名
    }
  },
 created:function(){
    var vm = this;
    /*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/ 
    vm.socket = io('ws://45.195.203.158:8485');


    //好友列表不需要滚动
    setTimeout(function(){
     window.scrollTo(0, 0);
     },10);

    /*****点击过来的时候带的参数*************/


    var array=[];var array2=[];  var duiarr=[]; var array22=[];//红名
    var arr_fri; //每次传过来的好友数组
    var flag=vm.$route.params.qun;//从群聊跳过来的
        if(flag==1){
          vm.me=vm.$route.params.me;
          console.log('首页  群聊过来的。。',vm.me);
         console.log('好友列表。。。',localStorage.getItem(vm.me));
          array2=localStorage.getItem(vm.me).split(',');
          vm.friends=array2;//从本地存储赋值给好友数组

          /***直接读是否有未读好友****/
          if(localStorage.getItem('wd'+vm.me)!=null){
            array22=localStorage.getItem('wd'+vm.me).split(',').reverse();
            vm.wd_friends=array22;
          }

          /*******/


        }else if(flag==2){
          //==2的时候表示从群聊的新消息过来的
   //每次进来都存一次在红名未读消息，和friends

          vm.me=vm.$route.params.me;
          arr_fri=vm.$route.params.friends;  //去重后的数组
          console.log('首页  群聊过来的2。。',vm.me);

              for(var q=0;q<arr_fri.length;q++){
                  duiarr.push(arr_fri[q].me);  //每个元素另外存
              }
          //每次进来都存一次在红名未读消息，和friends
          /********这里存红名未读**************/
         this.weidu(vm.me,duiarr);
          /*********************/


          /*************这里存所有好友列表******************/
          //console.log('好友列表22222。。。',vm.$route.params.friends);
         // array2=localStorage.getItem(vm.me).split(','); //先获取本地存储的数组
          //先查看之前有没有好友，有就合并
          if(localStorage.getItem(vm.me)==null){
             //如果本地的数组为空就是没有任何消息。。可以随便存
           // let new_arr2 = [...new Set(arr_fri)];
            localStorage.setItem(vm.me,duiarr);//以自己用户名为键值，本地存储自己的好友。。
            vm.friends=duiarr;
            console.log('没有合并的数组。。',duiarr);
          }else{
            array2=localStorage.getItem(vm.me).split(',');
            var arr222 = array2.concat(duiarr);
            let new_arr = [...new Set(arr222)];//数组去重
            vm.friends=new_arr;//再重新给vue
            localStorage.setItem(vm.me,new_arr);//以自己用户名为键值，本地存储自己的好友。。
            console.log('合并后的数组22222',new_arr);
          }
         // vm.friends=array2;//从本地存储赋值给好友数组


        }else {
          //否则就是从私聊那边跳过来的,或者是刷新后触发的本地存储
         // var name=localStorage.getItem('user_'+vm.me);
              arr_fri=vm.$route.params.friends;
              vm.me=vm.$route.params.me;
          console.log(vm.me,localStorage.getItem('user_'+vm.me));
    /********************************/
          if(vm.me==undefined || localStorage.getItem('user_'+vm.me)==null){
            //防止直接打/home 进来  回到登录页
            vm.$router.push({ name: 'HelloWorld', params:{ shua:1 }});

  }else if(arr_fri=='' || arr_fri==null){
            //这里表示从跟好友聊天的时候跳的 返回
            array2=localStorage.getItem(vm.me).split(',');
            vm.friends=array2;//从本地存储赋值给好友数组
            //读未读好友
            if(localStorage.getItem('wd'+vm.me)!=null){
              vm.wd_friends=localStorage.getItem('wd'+vm.me).split(',').reverse();

            }

   }else if(vm.me!=undefined  && localStorage.getItem(vm.me)!=null && (array=localStorage.getItem(vm.me).split(',')).length>0 ){
            array=localStorage.getItem(vm.me).split(',');//本地存储要转成数组
            var arr = array.concat(arr_fri);
            let new_arr = [...new Set(arr)];//数组去重
            vm.friends=new_arr;//再重新给vue
            localStorage.setItem(vm.me,new_arr);//以自己用户名为键值，本地存储自己的好友。。
            console.log('合并后的数组',new_arr);
          }else {
            //第一次进来  确保再次去重
            let new_arr2 = [...new Set(arr_fri)];
            localStorage.setItem(vm.me,new_arr2);//以自己用户名为键值，本地存储自己的好友。。
            vm.friends=new_arr2;
            // localStorage.getItem("temp")
            console.log('=0的时候的数组',vm.friends);
          }
                   /**********/
        }




   // localStorage.clear();



    /******************/

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


      //好友列表不需要滚动
       /*setTimeout(function(){
          window.scrollTo(0, document.getElementById('chat_con').scrollHeight);
        },10);*/

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

      //把未读列表做一个函数调用
     weidu:function(me,duiarr){
       var vm=this;
       var array22=[];
       /********这里存红名未读**************/
       if(localStorage.getItem('wd'+me)==null){
         //如果本地的数组为空就是没有任何消息。。可以随便存
         // let new_arr2 = [...new Set(arr_fri)];
         localStorage.setItem('wd'+me,duiarr.reverse());//以自己用户名为键值，本地存储自己的好友。。
         vm.wd_friends=duiarr.reverse();//把转成数组的赋值
         console.log('第一次的未读',duiarr);

       }else{
         //第二次进来的时候，发现已有未读，再合并添加
           var arr2=[];
         array22=localStorage.getItem('wd'+me).split(',');
         var arr2222 = array22.concat(duiarr);
         let new_arr2 = [...new Set(arr2222)].reverse();//数组去重
           //这里有点小问题，需要判断下数组里面是否有undifined 和 空
           for(var i=0;i<new_arr2.length;i++){
               if(new_arr2[i]==" " || new_arr2[i]==undefined){

               }else{
                   arr2.push(new_arr2[i]);
               }
           }
         vm.wd_friends=arr2;//再重新给vue
         localStorage.setItem('wd'+me,arr2);//以自己用户名为键值，本地存储自己的好友。。
         console.log('合并后的未读',arr2);
       }
       /*********************/
     },

      djql:function(){
          //点击进入默认群聊
          var vm=this;
          //从home进入多人聊天的时候应该再发送一个socket 推送一个人数显示
          vm.$router.push({ name: 'HelloWorld', params:{ qun:1 ,me:vm.me}});
      },

    //点击该好友列表 ，同时把该用户在未读数组中删除。。
    dj:function(ta){
      var vm = this;
        console.log('点击的好友是：',ta);//该好友
        console.log('我的id是：',vm.me);
        var me=vm.me;
        var arr=[];  var arr2=[];
        /*******从本地存储读取该好友 并删除*****/
        //1首先判断有没有未读数组，2是否该用户是不是未读数组里面的
        //最后发送 socket emit 告诉redis把该用户从缓存中删除。。。
    if(localStorage.getItem('wd'+me)==null){
        //表示不存在未读数组
          //return 0;
    }else {
        arr = localStorage.getItem('wd'+me).split(',');
            //如果存在该好友   //从该数组中删除
        function iszai(){
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == ta) {
                    return true;
                }
            }
        }
                   if(iszai()){
                       for (var i = 0; i < arr.length; i++) {
                           if (arr[i] == ta) {
                               arr.splice(i, 1);
                               i = i - 1;
                           }
                       }
            //发送 socket  告诉redis要删除谁
              vm.socket.emit('del',{ta:ta,me:me});
                       localStorage.setItem('wd'+ me, arr);
                       vm.wd_friends = arr;//再重新给vue
                   }



    }

        /*******************/


      //跳转到私聊服务器路由
      vm.$router.push({ name: 'Siliao', params: { ta: ta,me:vm.me }});

    },

    //添加好友到当前页面
    add_friend:function(){
      var vm=this;
        vm.is_add=!vm.is_add;
     // vm.$router.push({ name: 'HelloWorld', params:{ shua:1 }});
    },
      add:function(){
         var vm=this;
          var fri=vm.add_name;
          //把该用户添加到本地存储
          var arr=[];  var array2=[];
          if(fri==''|| fri==undefined){
              alert('用户名不能为空');
          }else if(localStorage.getItem(vm.me)==null){
              //如果本地的数组为空就是没有任何消息。。可以随便存
              arr.push(fri);
              localStorage.setItem(vm.me,arr);//以自己用户名为键值，本地存储自己的好友。。
              vm.friends=arr;
              vm.is_add=false;
              console.log('没有任何好友的时候——',arr);
          }else{
              array2=localStorage.getItem(vm.me).split(',');
              array2.push(fri);
              //var arr222 = array2.concat(duiarr);
              let new_arr = [...new Set(array2)];//数组去重
              vm.friends=new_arr;//再重新给vue
              vm.is_add=false;
              localStorage.setItem(vm.me,new_arr);//以自己用户名为键值，本地存储自己的好友。。
              console.log('第二次以后添加好友的时候',new_arr);
          }
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
    }
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .add_friend{
        border: 1px solid #706565;
        background: #eddbbe94;
        border-radius: 2rem;
        width: 80%;
        margin: 0 auto;
        position: absolute;
        left: 10%;
        z-index: 10;
    }

    .shake,.shake-little,.shake-slow,.shake-hard,.shake-horizontal,.shake-vertical,.shake-rotate,.shake-opacity,.shake-crazy,.shake-chunk {
        display: inherit;
        transform-origin: center center
    }

    .shake-freeze,.shake-constant.shake-constant--hover:hover,.shake-trigger:hover .shake-constant.shake-constant--hover {
        animation-play-state: paused
    }

    .shake-freeze:hover,.shake-trigger:hover .shake-freeze,.shake:hover,.shake-trigger:hover .shake,.shake-little:hover,.shake-trigger:hover .shake-little,.shake-slow:hover,.shake-trigger:hover .shake-slow,.shake-hard:hover,.shake-trigger:hover .shake-hard,.shake-horizontal:hover,.shake-trigger:hover .shake-horizontal,.shake-vertical:hover,.shake-trigger:hover .shake-vertical,.shake-rotate:hover,.shake-trigger:hover .shake-rotate,.shake-opacity:hover,.shake-trigger:hover .shake-opacity,.shake-crazy:hover,.shake-trigger:hover .shake-crazy,.shake-chunk:hover,.shake-trigger:hover .shake-chunk {
        animation-play-state: running
    }

    @keyframes shake {
        2% {
            transform: translate(.5px, 2.5px) rotate(1.5deg)
        }

        4% {
            transform: translate(2.5px, 1.5px) rotate(1.5deg)
        }

        6% {
            transform: translate(1.5px, .5px) rotate(.5deg)
        }

        8% {
            transform: translate(-1.5px, -1.5px) rotate(-.5deg)
        }

        10% {
            transform: translate(-1.5px, 2.5px) rotate(1.5deg)
        }

        12% {
            transform: translate(-1.5px, .5px) rotate(.5deg)
        }

        14% {
            transform: translate(-1.5px, -1.5px) rotate(-.5deg)
        }

        16% {
            transform: translate(1.5px, 2.5px) rotate(1.5deg)
        }

        18% {
            transform: translate(1.5px, -.5px) rotate(1.5deg)
        }

        20% {
            transform: translate(1.5px, -.5px) rotate(1.5deg)
        }

        22% {
            transform: translate(-1.5px, .5px) rotate(-.5deg)
        }

        24% {
            transform: translate(.5px, -1.5px) rotate(-.5deg)
        }

        26% {
            transform: translate(-1.5px, 2.5px) rotate(1.5deg)
        }

        28% {
            transform: translate(-.5px, .5px) rotate(-.5deg)
        }

        30% {
            transform: translate(-1.5px, 2.5px) rotate(.5deg)
        }

        32% {
            transform: translate(.5px, -1.5px) rotate(1.5deg)
        }

        34% {
            transform: translate(.5px, -1.5px) rotate(1.5deg)
        }

        36% {
            transform: translate(2.5px, .5px) rotate(.5deg)
        }

        38% {
            transform: translate(-.5px, .5px) rotate(-.5deg)
        }

        40% {
            transform: translate(.5px, .5px) rotate(1.5deg)
        }

        42% {
            transform: translate(.5px, 1.5px) rotate(1.5deg)
        }

        44% {
            transform: translate(.5px, 2.5px) rotate(.5deg)
        }

        46% {
            transform: translate(1.5px, 1.5px) rotate(-.5deg)
        }

        48% {
            transform: translate(2.5px, .5px) rotate(-.5deg)
        }

        50% {
            transform: translate(1.5px, 1.5px) rotate(1.5deg)
        }

        52% {
            transform: translate(1.5px, 2.5px) rotate(1.5deg)
        }

        54% {
            transform: translate(1.5px, 1.5px) rotate(.5deg)
        }

        56% {
            transform: translate(.5px, -.5px) rotate(.5deg)
        }

        58% {
            transform: translate(-1.5px, .5px) rotate(.5deg)
        }

        60% {
            transform: translate(2.5px, 1.5px) rotate(1.5deg)
        }

        62% {
            transform: translate(1.5px, 2.5px) rotate(-.5deg)
        }

        64% {
            transform: translate(.5px, -1.5px) rotate(1.5deg)
        }

        66% {
            transform: translate(-1.5px, 2.5px) rotate(-.5deg)
        }

        68% {
            transform: translate(-1.5px, 1.5px) rotate(-.5deg)
        }

        70% {
            transform: translate(1.5px, -1.5px) rotate(.5deg)
        }

        72% {
            transform: translate(-.5px, 1.5px) rotate(.5deg)
        }

        74% {
            transform: translate(-.5px, .5px) rotate(-.5deg)
        }

        76% {
            transform: translate(2.5px, 1.5px) rotate(-.5deg)
        }

        78% {
            transform: translate(1.5px, .5px) rotate(1.5deg)
        }

        80% {
            transform: translate(-1.5px, .5px) rotate(1.5deg)
        }

        82% {
            transform: translate(2.5px, 1.5px) rotate(1.5deg)
        }

        84% {
            transform: translate(-.5px, .5px) rotate(-.5deg)
        }

        86% {
            transform: translate(-1.5px, 2.5px) rotate(-.5deg)
        }

        88% {
            transform: translate(1.5px, -.5px) rotate(-.5deg)
        }

        90% {
            transform: translate(-1.5px, 2.5px) rotate(-.5deg)
        }

        92% {
            transform: translate(-1.5px, 2.5px) rotate(.5deg)
        }

        94% {
            transform: translate(-.5px, .5px) rotate(-.5deg)
        }

        96% {
            transform: translate(.5px, -1.5px) rotate(.5deg)
        }

        98% {
            transform: translate(.5px, .5px) rotate(1.5deg)
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake:hover,.shake-trigger:hover .shake,.shake.shake-freeze,.shake.shake-constant {
        animation-name: shake;
        animation-duration: 100ms;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-little {
        2% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        4% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        6% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        8% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        10% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        12% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        14% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        16% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        18% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        20% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        22% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        24% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        26% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        28% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        30% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        32% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        34% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        36% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        38% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        40% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        42% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        44% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        46% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        48% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        50% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        52% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        54% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        56% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        58% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        60% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        62% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        64% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        66% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        68% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        70% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        72% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        74% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        76% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        78% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        80% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        82% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        84% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        86% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        88% {
            transform: translate(0px, 0px) rotate(.5deg)
        }

        90% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        92% {
            transform: translate(1px, 1px) rotate(.5deg)
        }

        94% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        96% {
            transform: translate(1px, 0px) rotate(.5deg)
        }

        98% {
            transform: translate(0px, 1px) rotate(.5deg)
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-little:hover,.shake-trigger:hover .shake-little,.shake-little.shake-freeze,.shake-little.shake-constant {
        animation-name: shake-little;
        animation-duration: 100ms;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-slow {
        2% {
            transform: translate(7px, -8px) rotate(.5deg)
        }

        4% {
            transform: translate(-6px, 4px) rotate(3.5deg)
        }

        6% {
            transform: translate(0px, -9px) rotate(-.5deg)
        }

        8% {
            transform: translate(3px, 5px) rotate(1.5deg)
        }

        10% {
            transform: translate(7px, -4px) rotate(-2.5deg)
        }

        12% {
            transform: translate(-2px, 9px) rotate(.5deg)
        }

        14% {
            transform: translate(7px, -9px) rotate(-1.5deg)
        }

        16% {
            transform: translate(-3px, 6px) rotate(-1.5deg)
        }

        18% {
            transform: translate(-2px, -5px) rotate(-1.5deg)
        }

        20% {
            transform: translate(7px, 5px) rotate(2.5deg)
        }

        22% {
            transform: translate(7px, 5px) rotate(.5deg)
        }

        24% {
            transform: translate(10px, -2px) rotate(.5deg)
        }

        26% {
            transform: translate(7px, -4px) rotate(.5deg)
        }

        28% {
            transform: translate(6px, 0px) rotate(-1.5deg)
        }

        30% {
            transform: translate(-8px, -6px) rotate(-.5deg)
        }

        32% {
            transform: translate(8px, 6px) rotate(-2.5deg)
        }

        34% {
            transform: translate(6px, 2px) rotate(2.5deg)
        }

        36% {
            transform: translate(0px, 2px) rotate(2.5deg)
        }

        38% {
            transform: translate(1px, 1px) rotate(2.5deg)
        }

        40% {
            transform: translate(4px, 5px) rotate(-1.5deg)
        }

        42% {
            transform: translate(2px, 8px) rotate(-2.5deg)
        }

        44% {
            transform: translate(-9px, 8px) rotate(-2.5deg)
        }

        46% {
            transform: translate(0px, -3px) rotate(.5deg)
        }

        48% {
            transform: translate(-2px, 7px) rotate(2.5deg)
        }

        50% {
            transform: translate(-8px, 5px) rotate(-2.5deg)
        }

        52% {
            transform: translate(-3px, -5px) rotate(-1.5deg)
        }

        54% {
            transform: translate(7px, -8px) rotate(-.5deg)
        }

        56% {
            transform: translate(10px, 10px) rotate(-1.5deg)
        }

        58% {
            transform: translate(9px, 8px) rotate(-2.5deg)
        }

        60% {
            transform: translate(5px, -3px) rotate(.5deg)
        }

        62% {
            transform: translate(-6px, 0px) rotate(1.5deg)
        }

        64% {
            transform: translate(-7px, 5px) rotate(-1.5deg)
        }

        66% {
            transform: translate(1px, 4px) rotate(2.5deg)
        }

        68% {
            transform: translate(-1px, -5px) rotate(1.5deg)
        }

        70% {
            transform: translate(-6px, 5px) rotate(-.5deg)
        }

        72% {
            transform: translate(-8px, 5px) rotate(1.5deg)
        }

        74% {
            transform: translate(2px, 0px) rotate(3.5deg)
        }

        76% {
            transform: translate(10px, -4px) rotate(3.5deg)
        }

        78% {
            transform: translate(-8px, 7px) rotate(1.5deg)
        }

        80% {
            transform: translate(2px, 5px) rotate(.5deg)
        }

        82% {
            transform: translate(3px, 3px) rotate(-1.5deg)
        }

        84% {
            transform: translate(3px, -6px) rotate(2.5deg)
        }

        86% {
            transform: translate(-1px, 6px) rotate(-2.5deg)
        }

        88% {
            transform: translate(6px, 2px) rotate(1.5deg)
        }

        90% {
            transform: translate(5px, 5px) rotate(.5deg)
        }

        92% {
            transform: translate(2px, -8px) rotate(3.5deg)
        }

        94% {
            transform: translate(3px, 8px) rotate(-1.5deg)
        }

        96% {
            transform: translate(-7px, -5px) rotate(2.5deg)
        }

        98% {
            transform: translate(-3px, -9px) rotate(3.5deg)
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-slow:hover,.shake-trigger:hover .shake-slow,.shake-slow.shake-freeze,.shake-slow.shake-constant {
        animation-name: shake-slow;
        animation-duration: 5s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-hard {
        2% {
            transform: translate(9px, -2px) rotate(2.5deg)
        }

        4% {
            transform: translate(8px, 5px) rotate(3.5deg)
        }

        6% {
            transform: translate(-3px, 1px) rotate(-1.5deg)
        }

        8% {
            transform: translate(0px, -2px) rotate(2.5deg)
        }

        10% {
            transform: translate(3px, -4px) rotate(-2.5deg)
        }

        12% {
            transform: translate(-1px, 10px) rotate(-.5deg)
        }

        14% {
            transform: translate(0px, 10px) rotate(-1.5deg)
        }

        16% {
            transform: translate(7px, -1px) rotate(3.5deg)
        }

        18% {
            transform: translate(1px, 10px) rotate(3.5deg)
        }

        20% {
            transform: translate(1px, -5px) rotate(3.5deg)
        }

        22% {
            transform: translate(2px, 1px) rotate(3.5deg)
        }

        24% {
            transform: translate(2px, 0px) rotate(2.5deg)
        }

        26% {
            transform: translate(2px, 6px) rotate(2.5deg)
        }

        28% {
            transform: translate(-7px, 3px) rotate(3.5deg)
        }

        30% {
            transform: translate(1px, -1px) rotate(1.5deg)
        }

        32% {
            transform: translate(3px, 5px) rotate(-1.5deg)
        }

        34% {
            transform: translate(-2px, 1px) rotate(-.5deg)
        }

        36% {
            transform: translate(8px, 6px) rotate(.5deg)
        }

        38% {
            transform: translate(-2px, 2px) rotate(-2.5deg)
        }

        40% {
            transform: translate(7px, -5px) rotate(2.5deg)
        }

        42% {
            transform: translate(9px, -9px) rotate(2.5deg)
        }

        44% {
            transform: translate(-7px, 0px) rotate(-2.5deg)
        }

        46% {
            transform: translate(-5px, -6px) rotate(.5deg)
        }

        48% {
            transform: translate(6px, 7px) rotate(.5deg)
        }

        50% {
            transform: translate(3px, -9px) rotate(-2.5deg)
        }

        52% {
            transform: translate(3px, 9px) rotate(.5deg)
        }

        54% {
            transform: translate(-8px, -2px) rotate(-2.5deg)
        }

        56% {
            transform: translate(2px, -2px) rotate(-.5deg)
        }

        58% {
            transform: translate(-3px, -4px) rotate(3.5deg)
        }

        60% {
            transform: translate(0px, 5px) rotate(-2.5deg)
        }

        62% {
            transform: translate(-7px, 8px) rotate(.5deg)
        }

        64% {
            transform: translate(10px, 6px) rotate(1.5deg)
        }

        66% {
            transform: translate(-2px, -6px) rotate(-.5deg)
        }

        68% {
            transform: translate(10px, -6px) rotate(2.5deg)
        }

        70% {
            transform: translate(0px, 7px) rotate(3.5deg)
        }

        72% {
            transform: translate(1px, -8px) rotate(-2.5deg)
        }

        74% {
            transform: translate(5px, -1px) rotate(3.5deg)
        }

        76% {
            transform: translate(-3px, 9px) rotate(-.5deg)
        }

        78% {
            transform: translate(-2px, 8px) rotate(.5deg)
        }

        80% {
            transform: translate(7px, 7px) rotate(3.5deg)
        }

        82% {
            transform: translate(-2px, -8px) rotate(3.5deg)
        }

        84% {
            transform: translate(6px, 5px) rotate(1.5deg)
        }

        86% {
            transform: translate(8px, 9px) rotate(2.5deg)
        }

        88% {
            transform: translate(10px, 1px) rotate(-2.5deg)
        }

        90% {
            transform: translate(9px, -4px) rotate(2.5deg)
        }

        92% {
            transform: translate(-8px, -4px) rotate(1.5deg)
        }

        94% {
            transform: translate(0px, 8px) rotate(1.5deg)
        }

        96% {
            transform: translate(0px, 10px) rotate(1.5deg)
        }

        98% {
            transform: translate(-4px, 5px) rotate(2.5deg)
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-hard:hover,.shake-trigger:hover .shake-hard,.shake-hard.shake-freeze,.shake-hard.shake-constant {
        animation-name: shake-hard;
        animation-duration: 100ms;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-horizontal {
        2% {
            transform: translate(-7px, 0) rotate(0)
        }

        4% {
            transform: translate(-5px, 0) rotate(0)
        }

        6% {
            transform: translate(4px, 0) rotate(0)
        }

        8% {
            transform: translate(-4px, 0) rotate(0)
        }

        10% {
            transform: translate(-6px, 0) rotate(0)
        }

        12% {
            transform: translate(2px, 0) rotate(0)
        }

        14% {
            transform: translate(-5px, 0) rotate(0)
        }

        16% {
            transform: translate(-3px, 0) rotate(0)
        }

        18% {
            transform: translate(2px, 0) rotate(0)
        }

        20% {
            transform: translate(3px, 0) rotate(0)
        }

        22% {
            transform: translate(-2px, 0) rotate(0)
        }

        24% {
            transform: translate(-3px, 0) rotate(0)
        }

        26% {
            transform: translate(-9px, 0) rotate(0)
        }

        28% {
            transform: translate(2px, 0) rotate(0)
        }

        30% {
            transform: translate(7px, 0) rotate(0)
        }

        32% {
            transform: translate(2px, 0) rotate(0)
        }

        34% {
            transform: translate(0px, 0) rotate(0)
        }

        36% {
            transform: translate(-1px, 0) rotate(0)
        }

        38% {
            transform: translate(6px, 0) rotate(0)
        }

        40% {
            transform: translate(-7px, 0) rotate(0)
        }

        42% {
            transform: translate(0px, 0) rotate(0)
        }

        44% {
            transform: translate(-1px, 0) rotate(0)
        }

        46% {
            transform: translate(-2px, 0) rotate(0)
        }

        48% {
            transform: translate(10px, 0) rotate(0)
        }

        50% {
            transform: translate(-8px, 0) rotate(0)
        }

        52% {
            transform: translate(-9px, 0) rotate(0)
        }

        54% {
            transform: translate(9px, 0) rotate(0)
        }

        56% {
            transform: translate(-2px, 0) rotate(0)
        }

        58% {
            transform: translate(-5px, 0) rotate(0)
        }

        60% {
            transform: translate(2px, 0) rotate(0)
        }

        62% {
            transform: translate(-4px, 0) rotate(0)
        }

        64% {
            transform: translate(1px, 0) rotate(0)
        }

        66% {
            transform: translate(-3px, 0) rotate(0)
        }

        68% {
            transform: translate(10px, 0) rotate(0)
        }

        70% {
            transform: translate(4px, 0) rotate(0)
        }

        72% {
            transform: translate(-6px, 0) rotate(0)
        }

        74% {
            transform: translate(-6px, 0) rotate(0)
        }

        76% {
            transform: translate(2px, 0) rotate(0)
        }

        78% {
            transform: translate(-2px, 0) rotate(0)
        }

        80% {
            transform: translate(-6px, 0) rotate(0)
        }

        82% {
            transform: translate(-1px, 0) rotate(0)
        }

        84% {
            transform: translate(-6px, 0) rotate(0)
        }

        86% {
            transform: translate(-5px, 0) rotate(0)
        }

        88% {
            transform: translate(-1px, 0) rotate(0)
        }

        90% {
            transform: translate(-1px, 0) rotate(0)
        }

        92% {
            transform: translate(-1px, 0) rotate(0)
        }

        94% {
            transform: translate(-3px, 0) rotate(0)
        }

        96% {
            transform: translate(-6px, 0) rotate(0)
        }

        98% {
            transform: translate(-6px, 0) rotate(0)
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-horizontal:hover,.shake-trigger:hover .shake-horizontal,.shake-horizontal.shake-freeze,.shake-horizontal.shake-constant {
        animation-name: shake-horizontal;
        animation-duration: 100ms;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-vertical {
        2% {
            transform: translate(0, 0px) rotate(0)
        }

        4% {
            transform: translate(0, 7px) rotate(0)
        }

        6% {
            transform: translate(0, 10px) rotate(0)
        }

        8% {
            transform: translate(0, -5px) rotate(0)
        }

        10% {
            transform: translate(0, 0px) rotate(0)
        }

        12% {
            transform: translate(0, 1px) rotate(0)
        }

        14% {
            transform: translate(0, -8px) rotate(0)
        }

        16% {
            transform: translate(0, 6px) rotate(0)
        }

        18% {
            transform: translate(0, 10px) rotate(0)
        }

        20% {
            transform: translate(0, 6px) rotate(0)
        }

        22% {
            transform: translate(0, -9px) rotate(0)
        }

        24% {
            transform: translate(0, -6px) rotate(0)
        }

        26% {
            transform: translate(0, -2px) rotate(0)
        }

        28% {
            transform: translate(0, 9px) rotate(0)
        }

        30% {
            transform: translate(0, -8px) rotate(0)
        }

        32% {
            transform: translate(0, 6px) rotate(0)
        }

        34% {
            transform: translate(0, 0px) rotate(0)
        }

        36% {
            transform: translate(0, -4px) rotate(0)
        }

        38% {
            transform: translate(0, 1px) rotate(0)
        }

        40% {
            transform: translate(0, 4px) rotate(0)
        }

        42% {
            transform: translate(0, -3px) rotate(0)
        }

        44% {
            transform: translate(0, 9px) rotate(0)
        }

        46% {
            transform: translate(0, -1px) rotate(0)
        }

        48% {
            transform: translate(0, -3px) rotate(0)
        }

        50% {
            transform: translate(0, 9px) rotate(0)
        }

        52% {
            transform: translate(0, -2px) rotate(0)
        }

        54% {
            transform: translate(0, -1px) rotate(0)
        }

        56% {
            transform: translate(0, -7px) rotate(0)
        }

        58% {
            transform: translate(0, -3px) rotate(0)
        }

        60% {
            transform: translate(0, 0px) rotate(0)
        }

        62% {
            transform: translate(0, 1px) rotate(0)
        }

        64% {
            transform: translate(0, -8px) rotate(0)
        }

        66% {
            transform: translate(0, 3px) rotate(0)
        }

        68% {
            transform: translate(0, 9px) rotate(0)
        }

        70% {
            transform: translate(0, 8px) rotate(0)
        }

        72% {
            transform: translate(0, -9px) rotate(0)
        }

        74% {
            transform: translate(0, 1px) rotate(0)
        }

        76% {
            transform: translate(0, -2px) rotate(0)
        }

        78% {
            transform: translate(0, -6px) rotate(0)
        }

        80% {
            transform: translate(0, 6px) rotate(0)
        }

        82% {
            transform: translate(0, 4px) rotate(0)
        }

        84% {
            transform: translate(0, 5px) rotate(0)
        }

        86% {
            transform: translate(0, 10px) rotate(0)
        }

        88% {
            transform: translate(0, -1px) rotate(0)
        }

        90% {
            transform: translate(0, 7px) rotate(0)
        }

        92% {
            transform: translate(0, 0px) rotate(0)
        }

        94% {
            transform: translate(0, -5px) rotate(0)
        }

        96% {
            transform: translate(0, 8px) rotate(0)
        }

        98% {
            transform: translate(0, -3px) rotate(0)
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-vertical:hover,.shake-trigger:hover .shake-vertical,.shake-vertical.shake-freeze,.shake-vertical.shake-constant {
        animation-name: shake-vertical;
        animation-duration: 100ms;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-rotate {
        2% {
            transform: translate(0, 0) rotate(6.5deg)
        }

        4% {
            transform: translate(0, 0) rotate(3.5deg)
        }

        6% {
            transform: translate(0, 0) rotate(-3.5deg)
        }

        8% {
            transform: translate(0, 0) rotate(5.5deg)
        }

        10% {
            transform: translate(0, 0) rotate(-4.5deg)
        }

        12% {
            transform: translate(0, 0) rotate(-4.5deg)
        }

        14% {
            transform: translate(0, 0) rotate(-6.5deg)
        }

        16% {
            transform: translate(0, 0) rotate(2.5deg)
        }

        18% {
            transform: translate(0, 0) rotate(-5.5deg)
        }

        20% {
            transform: translate(0, 0) rotate(.5deg)
        }

        22% {
            transform: translate(0, 0) rotate(-3.5deg)
        }

        24% {
            transform: translate(0, 0) rotate(-6.5deg)
        }

        26% {
            transform: translate(0, 0) rotate(6.5deg)
        }

        28% {
            transform: translate(0, 0) rotate(1.5deg)
        }

        30% {
            transform: translate(0, 0) rotate(-5.5deg)
        }

        32% {
            transform: translate(0, 0) rotate(7.5deg)
        }

        34% {
            transform: translate(0, 0) rotate(-3.5deg)
        }

        36% {
            transform: translate(0, 0) rotate(7.5deg)
        }

        38% {
            transform: translate(0, 0) rotate(-5.5deg)
        }

        40% {
            transform: translate(0, 0) rotate(3.5deg)
        }

        42% {
            transform: translate(0, 0) rotate(6.5deg)
        }

        44% {
            transform: translate(0, 0) rotate(1.5deg)
        }

        46% {
            transform: translate(0, 0) rotate(3.5deg)
        }

        48% {
            transform: translate(0, 0) rotate(-.5deg)
        }

        50% {
            transform: translate(0, 0) rotate(-4.5deg)
        }

        52% {
            transform: translate(0, 0) rotate(4.5deg)
        }

        54% {
            transform: translate(0, 0) rotate(-3.5deg)
        }

        56% {
            transform: translate(0, 0) rotate(4.5deg)
        }

        58% {
            transform: translate(0, 0) rotate(-3.5deg)
        }

        60% {
            transform: translate(0, 0) rotate(5.5deg)
        }

        62% {
            transform: translate(0, 0) rotate(6.5deg)
        }

        64% {
            transform: translate(0, 0) rotate(3.5deg)
        }

        66% {
            transform: translate(0, 0) rotate(-3.5deg)
        }

        68% {
            transform: translate(0, 0) rotate(-4.5deg)
        }

        70% {
            transform: translate(0, 0) rotate(-6.5deg)
        }

        72% {
            transform: translate(0, 0) rotate(6.5deg)
        }

        74% {
            transform: translate(0, 0) rotate(-5.5deg)
        }

        76% {
            transform: translate(0, 0) rotate(-6.5deg)
        }

        78% {
            transform: translate(0, 0) rotate(5.5deg)
        }

        80% {
            transform: translate(0, 0) rotate(-6.5deg)
        }

        82% {
            transform: translate(0, 0) rotate(.5deg)
        }

        84% {
            transform: translate(0, 0) rotate(4.5deg)
        }

        86% {
            transform: translate(0, 0) rotate(5.5deg)
        }

        88% {
            transform: translate(0, 0) rotate(-6.5deg)
        }

        90% {
            transform: translate(0, 0) rotate(-5.5deg)
        }

        92% {
            transform: translate(0, 0) rotate(4.5deg)
        }

        94% {
            transform: translate(0, 0) rotate(2.5deg)
        }

        96% {
            transform: translate(0, 0) rotate(-5.5deg)
        }

        98% {
            transform: translate(0, 0) rotate(2.5deg)
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-rotate:hover,.shake-trigger:hover .shake-rotate,.shake-rotate.shake-freeze,.shake-rotate.shake-constant {
        animation-name: shake-rotate;
        animation-duration: 100ms;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-opacity {
        10% {
            transform: translate(-1px, -2px) rotate(-.5deg);
            opacity: .98
        }

        20% {
            transform: translate(-4px, 0px) rotate(1.5deg);
            opacity: .69
        }

        30% {
            transform: translate(0px, 2px) rotate(-1.5deg);
            opacity: .39
        }

        40% {
            transform: translate(4px, 0px) rotate(1.5deg);
            opacity: .47
        }

        50% {
            transform: translate(-1px, -1px) rotate(2.5deg);
            opacity: .02
        }

        60% {
            transform: translate(3px, 3px) rotate(.5deg);
            opacity: .29
        }

        70% {
            transform: translate(0px, 2px) rotate(2.5deg);
            opacity: .44
        }

        80% {
            transform: translate(-1px, 4px) rotate(1.5deg);
            opacity: .04
        }

        90% {
            transform: translate(2px, 2px) rotate(1.5deg);
            opacity: .81
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-opacity:hover,.shake-trigger:hover .shake-opacity,.shake-opacity.shake-freeze,.shake-opacity.shake-constant {
        animation-name: shake-opacity;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-crazy {
        10% {
            transform: translate(11px, -15px) rotate(-7deg);
            opacity: .57
        }

        20% {
            transform: translate(18px, -11px) rotate(-6deg);
            opacity: .63
        }

        30% {
            transform: translate(1px, -12px) rotate(0deg);
            opacity: .33
        }

        40% {
            transform: translate(-5px, -10px) rotate(4deg);
            opacity: .76
        }

        50% {
            transform: translate(7px, -18px) rotate(4deg);
            opacity: .8
        }

        60% {
            transform: translate(-5px, -11px) rotate(9deg);
            opacity: .43
        }

        70% {
            transform: translate(10px, -2px) rotate(-5deg);
            opacity: .93
        }

        80% {
            transform: translate(3px, 13px) rotate(5deg);
            opacity: .81
        }

        90% {
            transform: translate(14px, 7px) rotate(4deg);
            opacity: .92
        }

        0%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-crazy:hover,.shake-trigger:hover .shake-crazy,.shake-crazy.shake-freeze,.shake-crazy.shake-constant {
        animation-name: shake-crazy;
        animation-duration: 100ms;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }

    @keyframes shake-chunk {
        2% {
            transform: translate(7px, 13px) rotate(0deg)
        }

        4% {
            transform: translate(9px, -6px) rotate(0deg)
        }

        6% {
            transform: translate(-1px, -4px) rotate(2deg)
        }

        8% {
            transform: translate(-13px, 15px) rotate(12deg)
        }

        10% {
            transform: translate(-1px, 5px) rotate(-8deg)
        }

        12% {
            transform: translate(-4px, 5px) rotate(-8deg)
        }

        14% {
            transform: translate(4px, -2px) rotate(10deg)
        }

        16% {
            transform: translate(8px, -6px) rotate(12deg)
        }

        18% {
            transform: translate(11px, -3px) rotate(7deg)
        }

        20% {
            transform: translate(6px, 7px) rotate(7deg)
        }

        22% {
            transform: translate(9px, 5px) rotate(11deg)
        }

        24% {
            transform: translate(1px, -5px) rotate(-14deg)
        }

        26% {
            transform: translate(2px, 8px) rotate(8deg)
        }

        28% {
            transform: translate(-12px, -12px) rotate(-11deg)
        }

        30% {
            transform: translate(1px, 14px) rotate(-8deg)
        }

        32% {
            transform: translate(-4px, -9px) rotate(14deg)
        }

        34% {
            transform: translate(0px, 9px) rotate(5deg)
        }

        36% {
            transform: translate(8px, -12px) rotate(1deg)
        }

        38% {
            transform: translate(-8px, -6px) rotate(6deg)
        }

        0%,40%,100% {
            transform: translate(0, 0) rotate(0)
        }
    }

    .shake-chunk:hover,.shake-trigger:hover .shake-chunk,.shake-chunk.shake-freeze,.shake-chunk.shake-constant {
        animation-name: shake-chunk;
        animation-duration: 4s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite
    }


    .pp{
    color: #b6b6b6;
  }
  .mui-media-body{
    float: right;
    position: relative;
    margin-left: 5.2rem;
    top: -5rem;
    color: #1b1b1b;
  }

  .imgs{
    width: 75px;
  }

  .mui-table-view-cell{
    height: 5rem;
    background: white;
  }

  .chat-wrap #fan{
    color: white;
    z-index: 99999999999;
    position: fixed;
    right: 0.8rem;
    line-height: 3rem;
    font-size: 1.8rem;
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

}
a {
  color: #42b983;
}
</style>
