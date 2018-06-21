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

client.expire('yue', 430000);

function se(key,val){
   var q= redis.createClient(6379,'127.0.0.1');
    q.hmset(key, val);  //设置键值，然后会马上打印ok表示成功
}

function ge(key){

    var w= redis.createClient(6379,'127.0.0.1');
    w.hgetall(key, function(err,res){
       // console.dir(res);
       // sockets.emit('receiveMessage',res);

    });

}

//client.flushdb();	//清空当前数据库


var PORT = 8484;
/*定义用户数组*/
var users = [];  var bb;  var name='';

app.listen(PORT);
/*
 *新手必读
 *function中的socket为每个客户端单独连接的socket实例，只通知当前连接用户
 *io.sockets 通知所有连接用户
 *socket.broadcast 给除了自己以外的客户端广播消息
 */
io.on('connection', function (socket) {
    console.log("sock.id1:", socket.id);
    /*是否是新用户标识*/
    var isNewPerson = true;
    /*当前登录用户*/
    var username = null;
    /*监听登录*/
    socket.on('login',function(data){
        for(var i=0;i<users.length;i++){
            if(users[i].username === data.username){
               //判断用户名重复的。。。
                isNewPerson = false;
                break;
            }else{
                isNewPerson = true;
            }
        }
        if(isNewPerson){
            username = data.username;
            users.push({
                username:data.username
            })



            let resdata = {
                //username: data.username,	/*发送方用户名*/
                msgType: 0, 	/*信息类型：0为系统消息，1为客户端消息*/
                msgDate:  new Date(), 	/*植入服务器时间*/
                message: '系统消息：'+data.username+'已加入群聊',

            };

            /**每次登录的时候读取redis的聊天记录**/

                var bc='';
            var w= redis.createClient(6379,'127.0.0.1');
            w.lrange('yue', 0, -1, function(err, resp) {
                console.log(err);
               // console.log("全部聊天记录为:", resp);
                /*for(var i=resp.length- Math.ceil(resp.length/3);i<resp.length;i++){
                    socket.emit('receiveMessage',JSON.parse(resp[i]));
                }*/
                for(var i=0;i<resp.length;i++){
                    socket.emit('receiveMessage',JSON.parse(resp[i]));
                }

            });
          //  socket.emit('receiveMessage',bb);

           // console.log('打印的：'+bc );
            /***************/


            /*****每次登录的时候读取redis未读消息*********/
            var wd= redis.createClient(6379,'127.0.0.1');
            wd.lrange('wd'+data.username, 0, -1, function(err, respp) {
                    if(err){
                        console.log(err);
                    }else {
                        socket.emit('weidu',respp);
                        console.log('++++++++未读',respp);
                    }
                }
            );
            /**************/


            /*登录成功*/
            socket.emit('loginSuccess',{username:data.username});

            /*向所有连接的客户端广播add事件*/
            io.sockets.emit('receiveMessage',resdata);

            //io.sockets.emit('add',resdata);
            console.log('登录成功:',resdata)

            /*给除了自己以外的客户端广播消息 2017-12-20*/
            // socket.broadcast.emit('add',resdata);

            /*人数变更，广播给所有连接用户*/
            console.log('当前连接的用户为：',users);
            io.sockets.emit('amountChange',users.length);
        }else{
            /*登录失败*/
            socket.emit('loginFail','');
        }
    })

    /*监听发送消息  发送消息的时候保存到 redis数据库*/
    socket.on('sendMessage',function(data){

       var qb={};
        var qc={};




           let resdata = {
                username: data.username,		/*发送方用户名*/
                msgType: 1, 			/*信息类型：0为系统消息，1为客户端消息*/
                msgDate:  new Date(), 	/*植入服务器时间*/
                message: data.message,
   // message: "<img src='"+data.message+"' />",
            }

        /***qc是个json对象，520进去后表示 有个520的属性代表一个用户 520：值就是socket******/
            //520这个用户有它自己的专属 qc['520'] socket对象
       // var ck='520';
        //qc[ck]=socket;
        /*********/
        //console.log("sock.id222:", socket);


        io.sockets.emit('receiveMessage',resdata);
       // var q={'js':'javascript','C#':'C Sharp'};
      //  se(data.username,resdata); //存到redis
        var q= redis.createClient(6379,'127.0.0.1');
      //  q.hmset(data.username, resdata,redis.print);
        var dd=JSON.stringify(resdata);
        q.rpush("yue", dd, function(err, res) {
            console.log(err);

        });


        console.log('接受到信息======:',resdata)
    })

    /*退出登录*/
    socket.on('disconnect',function(){

        //username  为13行的当前登录用户。也可前端传参进来主动触发
        let resdata = {
            // username: username,
            msgType: 0,
            msgDate:  new Date(),
            message: '系统消息：'+username+'已退出群聊',

        };
        io.sockets.emit('receiveMessage',resdata);

        console.log('退出===',username)


        /*向所有连接的客户端广播leave事件*/
        io.sockets.emit('leave',username);
        users.map(function(val,index){
            if(val.username === username){
                users.splice(index,1);
            }
            /*人数变更，广播给所有连接用户*/
            console.log('当前连接的用户为：',users);
            io.sockets.emit('amountChange',users.length);


        })
    })
})

console.log('app listen at：'+PORT);

client.quit();