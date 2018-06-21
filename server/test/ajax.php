<?php

// 指定允许其他域名访问
header('Access-Control-Allow-Origin:*');
// 响应类型
header('Access-Control-Allow-Methods:POST');
// 响应头设置
header('Access-Control-Allow-Headers:x-requested-with,content-type');

 $arr=[
     '1:已经实现群聊，私聊，发送图片，添加好友 （传送文件就不做了）',
     '2：在群聊里面如果发送图片的话就不保存这个图片的记录，私聊无限制',
     '3：简单说就是 群聊不保存图片记录，刷新后就没有了。。只有当前在线用户能看到',
     '4:发送的图片支持点击预览',
     '5:更新发送图片的时候 显示图片发送中',
     '2018.6.13，下午4点更新'
      ];

echo json_encode($arr);
