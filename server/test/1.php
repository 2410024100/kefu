/*
Navicat MySQL Data Transfer

Source Server         : 58.48.125.124(数据存储)
Source Server Version : 50714
Source Host           : 192.168.1.242:3306
Source Database       : yzm

Target Server Type    : MYSQL
Target Server Version : 50714
File Encoding         : 65001

Date: 2018-04-10 15:29:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for phone_catpool
-- ----------------------------
DROP TABLE IF EXISTS `phone_catpool`;
CREATE TABLE `phone_catpool` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`catpool` varchar(255) DEFAULT NULL,
`phone` varchar(255) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of phone_catpool
-- ----------------------------
INSERT INTO `phone_catpool` VALUES ('1', '01', '174016815');
INSERT INTO `phone_catpool` VALUES ('2', '01', '142427656');
INSERT INTO `phone_catpool` VALUES ('3', '01', '174827836');
INSERT INTO `phone_catpool` VALUES ('4', '01', '1112909013');
INSERT INTO `phone_catpool` VALUES ('5', '01', '174829610');
INSERT INTO `phone_catpool` VALUES ('6', '01', '1114490182');
INSERT INTO `phone_catpool` VALUES ('7', '01', '142480780');
INSERT INTO `phone_catpool` VALUES ('8', '01', '142438165');
INSERT INTO `phone_catpool` VALUES ('9', '01', '142437396');
INSERT INTO `phone_catpool` VALUES ('10', '01', '174829563');
INSERT INTO `phone_catpool` VALUES ('11', '01', '1114407094');
INSERT INTO `phone_catpool` VALUES ('12', '01', '173139599');
INSERT INTO `phone_catpool` VALUES ('13', '01', '142753187');
INSERT INTO `phone_catpool` VALUES ('14', '01', '142381138');
INSERT INTO `phone_catpool` VALUES ('15', '01', '174016815');
INSERT INTO `phone_catpool` VALUES ('16', '01', '142427656');
INSERT INTO `phone_catpool` VALUES ('17', '01', '174827836');
INSERT INTO `phone_catpool` VALUES ('18', '01', '1112909013');
INSERT INTO `phone_catpool` VALUES ('19', '01', '174829610');
INSERT INTO `phone_catpool` VALUES ('20', '01', '1114490182');
INSERT INTO `phone_catpool` VALUES ('21', '01', '142480780');
INSERT INTO `phone_catpool` VALUES ('22', '01', '142438165');
INSERT INTO `phone_catpool` VALUES ('23', '01', '142437396');
INSERT INTO `phone_catpool` VALUES ('24', '01', '174829563');
INSERT INTO `phone_catpool` VALUES ('25', '01', '1114407094');
INSERT INTO `phone_catpool` VALUES ('26', '01', '173139599');
INSERT INTO `phone_catpool` VALUES ('27', '01', '142753187');
INSERT INTO `phone_catpool` VALUES ('28', '01', '142381138');
INSERT INTO `phone_catpool` VALUES ('29', '01', '174016815');
INSERT INTO `phone_catpool` VALUES ('30', '01', '142427656');
INSERT INTO `phone_catpool` VALUES ('31', '01', '174827836');
INSERT INTO `phone_catpool` VALUES ('32', '01', '1112909013');
INSERT INTO `phone_catpool` VALUES ('33', '01', '174829610');
INSERT INTO `phone_catpool` VALUES ('34', '01', '1114490182');
INSERT INTO `phone_catpool` VALUES ('35', '01', '142480780');
INSERT INTO `phone_catpool` VALUES ('36', '01', '142438165');
INSERT INTO `phone_catpool` VALUES ('37', '01', '142437396');
INSERT INTO `phone_catpool` VALUES ('38', '01', '174829563');
INSERT INTO `phone_catpool` VALUES ('39', '01', '1114407094');
INSERT INTO `phone_catpool` VALUES ('40', '01', '173139599');
INSERT INTO `phone_catpool` VALUES ('41', '01', '142753187');
INSERT INTO `phone_catpool` VALUES ('42', '01', '142381138');
INSERT INTO `phone_catpool` VALUES ('43', '01', '174016815');
INSERT INTO `phone_catpool` VALUES ('44', '01', '142427656');
INSERT INTO `phone_catpool` VALUES ('45', '01', '174827836');
INSERT INTO `phone_catpool` VALUES ('46', '01', '1112909013');
INSERT INTO `phone_catpool` VALUES ('47', '01', '174829610');
INSERT INTO `phone_catpool` VALUES ('48', '01', '1114490182');
INSERT INTO `phone_catpool` VALUES ('49', '01', '142480780');
INSERT INTO `phone_catpool` VALUES ('50', '01', '142438165');
INSERT INTO `phone_catpool` VALUES ('51', '01', '142437396');
INSERT INTO `phone_catpool` VALUES ('52', '01', '174829563');
INSERT INTO `phone_catpool` VALUES ('53', '01', '1114407094');
INSERT INTO `phone_catpool` VALUES ('54', '01', '173139599');
INSERT INTO `phone_catpool` VALUES ('55', '01', '142753187');
INSERT INTO `phone_catpool` VALUES ('56', '01', '142381138');

-- ----------------------------
-- Table structure for phone_yzm
-- ----------------------------
DROP TABLE IF EXISTS `phone_yzm`;
CREATE TABLE `phone_yzm` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`catpool` varchar(255) DEFAULT NULL,
`phone` varchar(255) DEFAULT NULL,
`contant` varchar(255) DEFAULT NULL,
`send_time` varchar(255) DEFAULT NULL,
`send_user` varchar(255) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of phone_yzm
-- ----------------------------
INSERT INTO `phone_yzm` VALUES ('1', '01', '174016815', null, null, null);
INSERT INTO `phone_yzm` VALUES ('2', '01', '142427656', null, null, null);
INSERT INTO `phone_yzm` VALUES ('3', '01', '174827836', null, null, null);
INSERT INTO `phone_yzm` VALUES ('4', '01', '1112909013', null, null, null);
INSERT INTO `phone_yzm` VALUES ('5', '01', '174829610', null, null, null);
INSERT INTO `phone_yzm` VALUES ('6', '01', '1114490182', null, null, null);
INSERT INTO `phone_yzm` VALUES ('7', '01', '142480780', null, null, null);
INSERT INTO `phone_yzm` VALUES ('8', '01', '142438165', null, null, null);
INSERT INTO `phone_yzm` VALUES ('9', '01', '142437396', null, null, null);
INSERT INTO `phone_yzm` VALUES ('10', '01', '174829563', null, null, null);
INSERT INTO `phone_yzm` VALUES ('11', '01', '1114407094', null, null, null);
INSERT INTO `phone_yzm` VALUES ('12', '01', '173139599', null, null, null);
INSERT INTO `phone_yzm` VALUES ('13', '01', '142753187', null, null, null);
INSERT INTO `phone_yzm` VALUES ('14', '01', '142381138', null, null, null);
INSERT INTO `phone_yzm` VALUES ('15', null, null, null, null, null);
INSERT INTO `phone_yzm` VALUES ('16', null, null, null, null, null);
INSERT INTO `phone_yzm` VALUES ('17', null, null, null, null, null);
INSERT INTO `phone_yzm` VALUES ('18', null, null, null, null, null);
INSERT INTO `phone_yzm` VALUES ('19', null, null, null, null, null);
