<template>
  <div class="hello">
    <div class="chat-wrap ">

      <span  id="fan"  @click="fan" ><返回</span>

      <h1 style="padding-left: 1rem;font-size: 1rem;">成员信息({{amount}})</h1>

      <div class="send_qun">

        <ul>
          <li v-for="u in users">
                  <!--判断自己，不能自己和自己聊天-->
              <dt>
                <img v-if="me==u.username"   class="dtimg" :src="u.img">
                <img v-else  @click="siliao(u.username)" class="dtimg" :src="u.img">
              </dt>

              <dd v-if="me==u.username" style="color: red">{{u.username}}</dd>
              <dd v-else >{{u.username}}</dd>

          </li>
        </ul>



      </div>


    </div>

  </div>
</template>

<script>

  export default {
    name: 'kan',
    data () {
      return {
        me:'',//我的用户名
        amount: 0,          //聊天室总数人
        socket: null,       //定义socket实例
        users:[]//用户数组
      }
    },

    mounted:function(){
      var vm = this;
      /*建立socket连接，使用websocket协议，端口号是服务器端监听端口号*/
      vm.socket = io('ws://45.195.203.158:8484');
      vm.me=vm.$route.params.me;


      //发送获取用户数组信号
      vm.socket.emit('getusers',{});

      /*获取用户数组*/
      vm.socket.on('userarr',function(data){
        vm.amount=data.length;//成员人数
        // [{},{}]
        var txarr=[
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1590662363,713073460&fm=27&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3362427573,2914693748&fm=27&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=347606072,2010262439&fm=27&gp=0.jpg',
       'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=17202515,2068320275&fm=27&gp=0.jpg',
         'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3975747624,1735186794&fm=27&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2794644718,4271603659&fm=27&gp=0.jpg',
       'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3751412116,3347067996&fm=27&gp=0.jpg',
       'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=49178710,3233021757&fm=27&gp=0.jpg'
        ];
        //设置随机头像
        for(var i=0;i<data.length;i++){
          if(i>=7){
            var n=Math.floor(Math.random()*7+1);
            data[i].img=txarr[n];
          }else {
            data[i].img=txarr[i];
          }
        }

        vm.users=data;
      })



    },

    methods:{
      //返回
      fan:function(){
        var vm = this;
        vm.$router.push({ name: 'HelloWorld', params:{ shua:1 }});
      },

      siliao:function(ta){
        var vm = this;
        var me=vm.me;
        if(ta==me){
          alert('不能和自己聊天');
        }else {
          vm.$router.push({ name: 'Siliao', params: { ta: ta,me:me }});
        }


      }


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /***dd用户名溢出隐藏****/
  dd{
    word-wrap: break-word;
    width: 4rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .dtimg{
    width: 3.5rem;
    max-width: 3.5rem;
    min-width: 3.5rem;
  }

  .send_qun p{
    display: inline-block;
    padding: 5px 10px;
    background: #999;
    border-radius: 5px;
    color: #fff;
    margin: 5px 0;
  }

  .send_qun{
    position: absolute;
    top: 10%;
  }

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
    margin: 0 0.5rem;
    float: left;
    margin-bottom: 1rem;
  }
  a {
    color: #42b983;
  }
</style>
