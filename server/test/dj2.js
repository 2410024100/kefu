var app = require('http').createServer();
var io = require('socket.io')(app);
var request = require('request');

var PORT = 8486;

app.listen(PORT);


var sj=Math.random();

 /*var options = {
    //url:'http://139.224.19.192:8080/Zhanghao/index?m=Login.adminIsLogin&_='+sj,
    url:'http://139.224.19.192:8080/Zhanghao/index?m=Admin.getFengzus2&_='+sj,
   //url:'http://139.224.19.192:8080/Zhanghao/index?m=Admin.getShebeis&_='+sj,
    method: 'POST',
    headers:{

  "Accept-Encoding": 'gzip, deflate',
 "Accept-Language": 'zh-CN,zh;q=0.9',
 "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
 "Connection": 'keep-alive',
 "Cookie": 'JSESSIONID=0BF51EF1F2F33DA4F11CF6260825E3D8; JSESSIONID=56CBFD0D2EC830F3796BC8B108BBE0CF',
 "Host": '139.224.19.192:8080',
 "Origin": 'http://139.224.19.192:8080',
 "Referer": 'http://139.224.19.192:8080/Zhanghao/adminmanage.html',
 "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
 "X-Requested-With": 'XMLHttpRequest'

    }
};*/


var options = {
    url:'https://www.lxapp.com/index.php?m=index&f=login',
    method: 'GET',
    headers:{
  "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
 "Accept-Encoding": 'gzip, deflate, br',
 "Accept-Language": 'zh-CN,zh;q=0.9',
 "Cache-Control": 'max-age=0',
 "Connection": 'keep-alive',
 "Cookie": 'lang=zh-cn; _UUID_UV=1527865028899669; sid=5ohnsn8nlah2grluiebs0pfqh7',
 "Host": 'www.lxapp.com',
 "Referer": 'https://www.lxapp.com/',
 "Upgrade-Insecure-Requests": 1,
 "User-Agent": 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Mobile Safari/537.36'
    }
};



setInterval(function(){
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //输出返回的内容
            console.log(body);
        }else{
            console.log(error);
        }
    });
},20);





  /*var url='http://139.224.19.192:8080/Zhanghao/index?m=Admin.getShebeis&_=0.2994662302955784';


setInterval(function(){

    request(url,function(error,response,body){
        if(!error && response.statusCode == 200){
            //输出返回的内容
            console.log(body);
        }else {
            console.log(error);
        }
    });

},10);  */

