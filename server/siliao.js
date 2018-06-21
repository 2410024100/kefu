var app = require('http').createServer();
var io = require('socket.io')(app);
var redis = require("redis"),
    client = redis.createClient(6379,'127.0.0.1');

client.on("error", function (err) {
    console.log("Error " + err);
});
client.on('ready',function(res){
    console.log('redis连接了');
});



//client.flushdb();	//清空当前数据库


var PORT = 8485;
/*定义用户数组*/
var users = [];  var bb;  var name='';
var joinuser=[];//这个表示每次点击头像时，会把me和ta保存为数组对象



app.listen(PORT);
/*
 *新手必读
 *function中的socket为每个客户端单独连接的socket实例，只通知当前连接用户
 *io.sockets 通知所有连接用户
 *socket.broadcast 给除了自己以外的客户端广播消息
 */
io.on('connection', function (socket) {
    console.log("siliao——sock.id1:", socket.id);
    /*是否是新用户标识*/
    var isNewPerson = true;
    /*当前登录用户*/
    var username = null;
    var bieren=null;
    /*监听登录*/
    socket.on('dj',function(data){
        console.log('me+++++++++++++++++'+data.me);
        console.log('ta+++++++++++++++++'+data.ta);
        if(data.me=='undefined'||data.me=='' || data.me=='null'|| data.ta=='undefined'||data.ta=='' || data.ta=='null'  ){
            socket.emit('loginFail',{go:1});
        }
        /*  for(var i=0;i<users.length;i++){

         if(users[i].me == data.me){

         //判断wo当前用户名是否在数组中
         isNewPerson = false; //表示在数组中
         break;
         }else{
         isNewPerson = true;
         }
         }  */
        var q=true;
        if(q){
            //数组中没有就把自己的json传到 users{}
            username = JSON.stringify(data.me);
            bieren = JSON.stringify(data.ta);
            // var ck='520';
            //qc[ck]=socket;
            users[username]=socket;
            users.push({
                me:data.me

            });//这个可有可无
            joinuser.push({
                me:data.me,
                ta:data.ta
            });//这个必须要，每次都放进去


            /*****对方不在线**********/
            let lixian = {
                //username: data.username,	/*发送方用户名*/
                msgType: 0, 	/*信息类型：0为系统消息，1为客户端消息*/
                msgDate:  new Date(), 	/*植入服务器时间*/
                message: '该用户离线中..',

            }
            if(!(bieren in users)){
                //表示对方不在线
                users[JSON.stringify(data.me)].emit('Message',lixian);
            }
            /***************/

            let resdata = {
                //username: data.username,	/*发送方用户名*/
                msgType: 0, 	/*信息类型：0为系统消息，1为客户端消息*/
                msgDate:  new Date(), 	/*植入服务器时间*/
                message: '您正在跟'+data.ta+'私聊',

            };



            /**每次登录的时候读取redis的聊天记录**/

            var bc='';
            var w= redis.createClient(6379,'127.0.0.1');
            w.lrange(data.me+'_'+data.ta, 0, -1, function(err, resp) {
                //   console.log("全部聊天记录为:", resp);
                   if(err){
                       console.log(err);
                   }else {
                       if(resp.length<=3 || resp.length=='' || resp.length==null){
                           socket.emit('loading',{});
                       }

                       for(var i=0;i<resp.length;i++){
                           //io.sockets.emit('receiveMessage',JSON.parse(resp[i]));
                           socket.emit('Message',JSON.parse(resp[i]));

                           if(i==resp.length-1 || i+1>=resp.length){
                               socket.emit('loading',{});
                           }
                   }

                }
            });


            /* w.lrange(data.ta+'_'+data.me, 0, -1, function(err, resp) {
             console.log(err);
             console.log("全部聊天记录为:", resp);
             for(var i=0;i<resp.length;i++){
             //io.sockets.emit('receiveMessage',JSON.parse(resp[i]));
             socket.emit('Message',JSON.parse(resp[i]));

             }

             });*/
            /***************/



            /*向自己发送提醒*/
            socket.emit('Message',resdata);
            // io.sockets.emit('receiveMessage',resdata);



            /*给除了自己以外的客户端广播消息 2017-12-20*/
            // socket.broadcast.emit('add',resdata);

            /*人数变更，广播给所有连接用户*/
            // console.log('当前连接的用户为：',users);
            // io.sockets.emit('amountChange',users.length);
        }else{
            /*登录失败*/
            socket.emit('loginFail','');
        }
    });

    /***********监听点击好友后发来的 要删除谁的 redis*****************/
    socket.on('del',function(data){
          //data.ta .me
     /*   var arr=[]; var arr2=[];  var str;
        var q= redis.createClient(6379,'127.0.0.1');
        q.lrange('wd'+data.me, 0, -1, function(err, ok) {
            //查找我的未读好友
            if(err){
                console.log(err);
            }else{


                // [ '{"me":"游客3337"}', '{"me":"游客2375"}' ]
                console.log('未读好友的记录+++++++',ok);//是一个对象
                //首先对这个数组对象去重，再删除该用户，再存进去redis
                  arr=ok;
                str={"me":""+data.ta+""};
                for(var i=0;i<arr.length;i++){
                    if(arr[i]==JSON.stringify(str)){
                        //如果==就不管
                    }else {

                        //否则就存到新数组
                        arr2.push(arr[i]);

                    }
                }
                //先把 key删除再存redis
                  q.del('wd'+data.me,function(err,ok){
                 if(err){
                 console.log(err);
                 }else{
                 console.log('删除群聊首页好友记录消息数成功..',ok);
                 }
                 });

                //  然后重新存到redis
                var dd=JSON.stringify(arr2);
                q.rpush('wd'+data.me, dd, function(err, resqq) {
                    if(err){
                        console.log(err);
                    }else {
                        console.log('记录未读222',resqq);
                    }
                });

                console.log('未读好友服务器去重后+++++++',arr2);
            }
        });*/

        var q= redis.createClient(6379,'127.0.0.1');
       q.del('wd'+data.me,function(err,ok){
            if(err){
                console.log(err);
            }else{
                console.log('删除群聊首页好友记录消息数成功..',ok);
            }
        });
     // 删除redis 记录
    });


    /*用户发送图片消息的时候。*/
    socket.on('sendImg',function(data){

        let resdata = {
            username: data.me,		/*发送方用户名*/
            msgType: 1, 			/*信息类型：0为系统消息，1为客户端消息*/
            msgDate:  new Date(), 	/*植入服务器时间*/
            img:1,
            message: data.img
        };

        /*****存私聊的聊天记录******/
        function redis_jilu(resdata){

            var q= redis.createClient(6379,'127.0.0.1');
            //  q.hmset(data.username, resdata,redis.print);
            q.expire(data.me+'_'+data.ta, 430000);
            q.expire(data.ta+'_'+data.me, 430000);//私人聊天记录统一保存7天

            var dd=JSON.stringify(resdata);
            q.rpush(data.me+'_'+data.ta, dd, function(err, res) {
                console.log(err);

            });
            q.rpush(data.ta+'_'+data.me, dd, function(err, res) {
                console.log(err);

            });
        }

        //存的谁给谁发的未读消息
        function redis_weidu(resdata){

            var q= redis.createClient(6379,'127.0.0.1');
            //  q.hmset(data.username, resdata,redis.print);
            q.expire('wd'+data.ta, 430000);

            var dd=JSON.stringify(resdata);
            q.rpush('wd'+data.ta, dd, function(err, resqq) {
                console.log(err);
                //console.log('记录未读1111',resqq);
            });

        }
        /***********/
       // console.log('发送图片的时候————所有用户',users);

        if(JSON.stringify(data.ta) in users){
            //如果那个用户存在数组里，   //只有两个人同时在线才能发2个
            redis_jilu(resdata);//存聊天记录

           users[JSON.stringify(data.me)].emit('Message',resdata);//用来发给自己可见的
           users[JSON.stringify(data.ta)].emit('Message',resdata);//用来发给他的
           users[JSON.stringify(data.me)].emit('closeimgloading',{});//关闭图片发送中..

        }else {
            redis_jilu(resdata);//存聊天记录
            redis_weidu(resdata);//未读
            users[JSON.stringify(data.me)].emit('Message',resdata);//用来发给自己可见的
            users[JSON.stringify(data.me)].emit('closeimgloading',{});//关闭图片发送中..

        }







    });


    /*监听发送消息  发送消息的时候保存到 redis数据库*/
    socket.on('sendtoMessage',function(data){

        if(data.me=='undefined'||data.me=='' || data.me=='null'|| data.ta=='undefined'||data.ta=='' || data.ta=='null'  ){
            socket.emit('loginFail',{go:1});
        }


        /*****存私聊的聊天记录******/
        function redis_jilu(resdata){

            var q= redis.createClient(6379,'127.0.0.1');
            //  q.hmset(data.username, resdata,redis.print);
            q.expire(data.me+'_'+data.ta, 430000);
            q.expire(data.ta+'_'+data.me, 430000);//私人聊天记录统一保存7天

            var dd=JSON.stringify(resdata);
            q.rpush(data.me+'_'+data.ta, dd, function(err, res) {
                console.log(err);

            });
            q.rpush(data.ta+'_'+data.me, dd, function(err, res) {
                console.log(err);

            });
        }

        //存的谁给谁发的未读消息
        function redis_weidu(resdata){

            var q= redis.createClient(6379,'127.0.0.1');
            //  q.hmset(data.username, resdata,redis.print);
            q.expire('wd'+data.ta, 430000);

            var dd=JSON.stringify(resdata);
            q.rpush('wd'+data.ta, dd, function(err, resqq) {
                console.log(err);
                  //console.log('记录未读1111',resqq);
            });

        }
        /***********/



        let yidudata = {
            username: data.me,		/*发送方用户名*/
            ta      :data.ta,      //需要发送给谁
            msgType: 1, 			/*信息类型：0为系统消息，1为客户端消息*/
            msgDate:  new Date(), 	/*植入服务器时间*/
            message: data.message,
            weidu:1 //1表示已读，0表示送达
        }
        let songdadata = {
            username: data.me,		/*发送方用户名*/
            ta      :data.ta,      //需要发送给谁
            msgType: 1, 			/*信息类型：0为系统消息，1为客户端消息*/
            msgDate:  new Date(), 	/*植入服务器时间*/
            message: data.message,
            weidu:0 //1表示已读，0表示送达 2表示存的聊天记录
        }

        let resdata = {
            username: data.me,		/*发送方用户名*/
            ta      :data.ta,      //需要发送给谁
            msgType: 1, 			/*信息类型：0为系统消息，1为客户端消息*/
            msgDate:  new Date(), 	/*植入服务器时间*/
            message: data.message,
            weidu:2 //1表示已读，0表示送达 2是聊天记录 不带样式
        }
        /***qc是个json对象，520进去后表示 有个520的属性代表一个用户 520：值就是socket******/
        //520这个用户有它自己的专属 qc['520'] socket对象
        // var ck='520';
        //qc[ck]=socket;
        /*********/

        /******in_array() 定义函数判断在不在同一个框*******/
        function in_array(joinuser){
            //for判断是否正在和me  ta的聊天界面，不是就不用显示，弹个消息就行。提醒
            for(var i=0;i<joinuser.length;i++){
                if(joinuser[i].me===data.ta){
                    //这步检测ta在不在用户组里面
                    return true;
                }
            }
            return false;
        }
        function in_array_2(joinuser){
            //for判断是否正在和me  ta的聊天界面，不是就不用显示，弹个消息就行。提醒
            for(var i=0;i<joinuser.length;i++){
                if(joinuser[i].ta===data.me){
                    //这步检测ta在不在用户组里面
                    return true;
                }
            }
            return false;
        }

        /************/

        console.log("正式进入消息监听users————",JSON.stringify(users));
        console.log("正式进入消息监听joinuser————",JSON.stringify(joinuser));


        if(JSON.stringify(data.ta) in users){
            console.log("data.ta存在——————进入",data.ta);
            console.log("users——————进入",JSON.stringify(users));

            /********************/

            //  arr[0].me==123 //  arr[0].ta==789
            console.log("进入for循环了——————————");
            if(in_array(joinuser)){
                //这步检测ta在不在用户组里面
                console.log("进入第一个if了——————————————",data.ta);
                if(in_array_2(joinuser)){
                    console.log("在框当前me：",data.me,"-------当前ta：",data.ta );
                    //me是否在ta的对象里面，在就表示 正在同一个聊天框

                    redis_jilu(yidudata);
                    users[JSON.stringify(data.ta)].emit('Message',resdata);//发给别人看见的
                    users[JSON.stringify(data.me)].emit('Message',yidudata);//用来发给自己可见的

                }else {
                    console.log("不在聊天框当前me：",data.me,"-------当前ta：",data.ta );
                    //如果不同聊天框。。就随便发个消息提醒
                    var new_xiaoxi = {
                        msgType: 0, 	/*信息类型：0为系统消息，1为客户端消息*/
                        msgDate:  new Date(), 	/*植入服务器时间*/
                        message: '您有新消息，请查看喔'
                    };
                    /******当不在一个框的时候，顺便记录哪些用户发了消息，发了多少条。。*************/
                        //用redis来记录发了多少条


                    var num= redis.createClient(6379,'127.0.0.1');
                    //  q.hmset(data.username, resdata,redis.print);
                    num.expire(data.me+'_jilu'+data.ta, 430000);//发送记录保存7天
                    num.expire(data.ta+'_jilu'+data.me, 430000);//发送记录保存7天
                    num.expire(data.ta+'_num'+data.me, 430000);//发送条数保存7天
                    num.expire(data.me+'_num'+data.ta, 430000);//发送条数保存7天

                    num.get(data.me+'_num'+data.ta,  function (err, resq){
                            //先取后存
                             if(err){
                                 console.log('不存在');
                                 //不存在就赋值
                                 num.set(data.ta+'_num'+data.me, '1', function (err, resk){
                                     console.log(err);
                                 });
                                 num.set(data.me+'_num'+data.ta, '1', function (err, respp){

                                     var faa={
                                         who:data.me,//谁发的
                                         num:1, //发了多少条
                                         to:data.ta //要发给谁的

                                     };

                                     /*************/
                                     var dd_numa=JSON.stringify(faa);
                                     num.set(data.me+'_jilu'+data.ta, dd_numa, function(err, resop) {
                                         console.log(err);
                                     });
                                     num.set(data.ta+'_jilu'+data.me, dd_numa, function(err, resjj) {
                                         console.log(err);
                                     });

                                 });

                             }else {
                                  //第二次发的时候取出来再存
                                 var num_res=Number(resq);
                                 num_res+=1;

                                 num.set(data.me+'_num'+data.ta, num_res, function (err, resk){
                                     console.log(err);
                                 });
                                 num.set(data.ta+'_num'+data.me, num_res, function (err, resk){
                                     console.log(err);
                                 });

                                 console.log(data.me+'发了多少条————',num_res);

                                 var fa={
                                     who:data.me,//谁发的
                                     num:num_res+1, //发了多少条
                                     to:data.ta //要发给谁的
                                 };

                                 /*************/
                                 var dd_num=JSON.stringify(fa);
                                 num.set(data.me+'_jilu'+data.ta, dd_num, function(err, reso) {
                                     console.log(err);
                                     console.log('成功了111',reso);
                                 });
                                 num.set(data.ta+'_jilu'+data.me, dd_num, function(err, resj) {
                                     console.log(err);
                                 });
                                 /*************/

                             }
                    });

                    /****这里取的是当同时还有其他人在发给同一个人的时候监控 总共多少个消息*********/
                    num.get(data.me+'_jilu'+data.ta, function(err, resp) {
                        if(err){
                            console.log('取记录出错',err);
                        }else {
                      //这里是提示消息来的时候弹个数字 ，几条数字
                            num.get(data.me+'_num'+data.ta, function (err, reskk){
                                console.log('打印的记录为————',resp);//第一次发送的时候为空null
                                console.log('打印的发送次数————',reskk);
                                //{"who":"游客4470","num":1,"to":"456"}
                                if(!resp) {
                                    //第一次有个bug。。
                       var new_fa={ who:data.me, num:1, to:data.ta  };
                      users[JSON.stringify(data.ta)].emit('newxiaoxi',new_fa);//发给别人看见的
                                }else {
                                    users[JSON.stringify(data.ta)].emit('newxiaoxi',JSON.parse(resp));//发给别人看见的
                                }

                            });

                        }
                    });
                    /*************/



                    /*******主要用在好友列表，显示这些好友************/



                    redis_jilu(songdadata);
                    users[JSON.stringify(data.ta)].emit('Message',new_xiaoxi);//发给别人看见的
                    users[JSON.stringify(data.me)].emit('Message',songdadata);//用来发给自己可见的

                }
            }else{
                console.log('已经从数组中删除了。。。。。',data.ta);
                //到这步就表示不在 用户数组中了    顺便存储这个未读消息
                var lixianl = {
                    //username: data.username,	/*发送方用户名*/
                    msgType: 0, 	/*信息类型：0为系统消息，1为客户端消息*/
                    msgDate:  new Date(), 	/*植入服务器时间*/
                    message: '该用户已下线...上线后将看到您的留言'
                };
                //下线后的 未读消息  谁发的要知道，怎么存，每次点击头像登录的时候。。触发这个未读消息
                 //   [{me123 ta456}  {me789 ta456}  {me8520 ta456} ]
             var weidu={
                 me:data.me
                 //ta:data.ta  //要发送给谁的。。
             };

                redis_weidu(weidu);//记录未读消息
                redis_jilu(songdadata);

                //这2行，在群聊里面可以直接弹出私聊发来的消息，实时显示
                var new_fa={ who:data.me, num:1, to:data.ta, message: data.message };
                users[JSON.stringify(data.me)].emit('send_qun',new_fa);//发给自己再转发群聊

                users[JSON.stringify(data.me)].emit('Message',lixianl);//用来发给自己可见的
                users[JSON.stringify(data.me)].emit('Message',songdadata);//用来发给自己可见的

            }


            /********************/

            //这里判断别人是否在线，在的话就两个都可以发送
            // users[JSON.stringify(data.ta)].emit('Message',resdata);//发给别人看见的
            //users[JSON.stringify(data.me)].emit('Message',resdata);//用来发给自己可见的
        }else {
            //离线的时候发送一个事件回去，然后再由前端发送一个事件给群聊端口那边

            let lixian = {
                //username: data.username,	/*发送方用户名*/
                msgType: 0, 	/*信息类型：0为系统消息，1为客户端消息*/
                msgDate:  new Date(), 	/*植入服务器时间*/
                message: '该用户处于：离线中..上线后将看到您的留言',

            };
            var weidu ={
                me:data.me
                //ta:data.ta  //要发送给谁的。。
            };



            redis_weidu(weidu);//记录未读消息
            redis_jilu(songdadata);

            //这2行，在群聊里面可以直接弹出私聊发来的消息，实时显示
            var new_fa={ who:data.me, num:1, to:data.ta, message: data.message };
            users[JSON.stringify(data.me)].emit('send_qun',new_fa);//发给自己再转发群聊

            users[JSON.stringify(data.me)].emit('Message',lixian);//用来发给自己可见的
            users[JSON.stringify(data.me)].emit('Message',songdadata);//用来发给自己可见的
        }

        /*****存私聊的聊天记录******/
        /*   var q= redis.createClient(6379,'127.0.0.1');
         //  q.hmset(data.username, resdata,redis.print);
         q.expire(data.me+'_'+data.ta, 430000);
         q.expire(data.ta+'_'+data.me, 430000);//私人聊天记录统一保存7天

         var dd=JSON.stringify(resdata);
         q.rpush(data.me+'_'+data.ta, dd, function(err, res) {
         console.log(err);

         });
         q.rpush(data.ta+'_'+data.me, dd, function(err, res) {
         console.log(err);

         });*/
        /***********/

        // io.sockets.emit('Message',resdata);

        //  se(data.username,resdata); //存到redis
        /*  var q= redis.createClient(6379,'127.0.0.1');
         //  q.hmset(data.username, resdata,redis.print);
         var dd=JSON.stringify(resdata);
         q.rpush("yue", dd, function(err, res) {
         console.log(err);
         });*/


        // console.log('接受到信息======:',resdata)
    });

    /*退出登录*/
    socket.on('disconnect',function(){

        //username  为13行的当前登录用户。也可前端传参进来主动触发
        let resdata = {
            // username: username,
            msgType: 0,
            msgDate:  new Date(),
            message: '系统消息：'+username+'已下线',

        };

        if(bieren in users){
            //存在才发送
            users[bieren].emit('Message',resdata);
        }


        for(var q=0; q<joinuser.length;q++){
            if(joinuser[q].me==JSON.parse(username)){
                joinuser.splice(q,1);
                console.log('删除了22222:____'+JSON.stringify(joinuser));

                q=q-1;
            }
        }
        for(var i=0; i<users.length;i++){
            if(JSON.stringify(users[i].me)==username){
                users.splice(i,1);
                console.log('删除了111:____'+JSON.stringify(users));

                i=i-1;
            }
        }
        // io.sockets.emit('Message',resdata);

        console.log('退出===',username);


        /*向所有连接的客户端广播leave事件*/
        //io.sockets.emit('leave',username);
        /*  users.map(function(val,index,arr){
         if(val.me == username){
         arr.splice(index,1);
         console.log('999999:____'+JSON.stringify(users));
         }*/
        /*人数变更，广播给所有连接用户*/
        //  console.log('当前连接的用户为：',users);
        //  io.sockets.emit('amountChange',users.length);
        // })
        console.log('users:____'+JSON.stringify(users));
        console.log('jionuser:____'+JSON.stringify(joinuser));
    })
})

console.log('app listen at：'+PORT);

client.quit();

