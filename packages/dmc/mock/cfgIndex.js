import { json } from 'express';
import Mock from 'mockjs'
import matConf from './sysmain/matConf';
import sysSetting from './sysmain/sysSetting';
import sys from './sysmain/sys';
import mtaData from './sysmain/mtaData';
import mtaDebug from './sysmain/mtaDebug';
import mtaOPlog from './sysmain/mtaOPlog';
import confAuthority from './sysmain/confAuthority';
import netSetting from './sysmain/netSetting';
import confZoneManage from './sysmain/confZoneManage';
import sysHeader from './index/sysHeader';
import dmcmconfigFn from './dmc/dmcmconfig'
import ctrlcmd from './dmc/ctrlcmd'
import ruleinfo from './dmc/ruleinfo'
import alarmdt from './dmc/alarmdt'
import confDevice from './dmc/confDevice'

export default {
	'post /cfg.php': (req, res) => {
		//get 参数
		let getParam = req.query;
		//post 参数
		let postParam = req.body;
		if(getParam.controller == 'mtaConf'){
			matConf(getParam,postParam,res)
		}else if(getParam.controller == 'sysSetting'){
			sysSetting(getParam,postParam,res)
		}
		 else if(getParam.controller == 'sys') {
			sys(getParam,postParam,res)
		} else if(getParam.controller == 'netSetting') {
			netSetting(getParam,postParam,res)
		} else if(getParam.controller == 'adminAcc') {
			let json = '';
			if(getParam.action == 'showAdmin') {
				json = require('./json/sysmain/adminacc.json')
			} else {

			}
			res.send(json);
		} else if(getParam.controller == 'notice'){
			let json = ''
			if(getParam.action == 'getNotice'){
				json = require('./json/login/notice.json')
			}
			if(getParam.action == 'getNoticeList'){
				json = require('./json/login/noticeList.json')
			}
			if(getParam.action == 'changeMsgStatus'){
				json = require('./json/login/readed.json')
			}
			if(getParam.action == 'getNoticeHigh'){
				json = require('./json/login/noticeHigh.json')
			}
			if(getParam.action == 'getNoticeLow'){
				json = require('./json/login/noticeLow.json')
			}
			res.send(json);
		}
		else if(getParam.controller == 'confApiAuthorize') {
			let json = '';
			if(getParam.action == 'showApiAuthorize') {
				json = require('./json/sysmain/authorize.json');
			}
			res.send(json);
		}
		else if(getParam.controller == 'sysHeader') {
			sysHeader(getParam,getParam,res)
		}
		else if(getParam.controller == 'adminSet') {
			let json = '';
			if(getParam.action == 'showAdminConf') {
				json = require('./json/login/adminconf.json')
			}
			res.send(json);
		}
		else if(getParam.controller == 'menu') {
			let json = '';
			if(getParam.action == 'menuTree') {
				var admin = 'fa18c52981606ff872097d3118dac83c';
				var sec = '5b63abb4fc706cc5dnda8b4d3b50d15b';
				var adt = '5b73abb4fc706cc5d7da8b4d3b50d15b';
				if(postParam.token == admin) {
					json = require('./json/login/menuTree.json');
				} else if(postParam.token == sec) {
					json = require('./json/login/secTree.json');
				} else if(postParam.token == adt) {
					json = require('./json/login/adtTree.json');
				} else {
					return { success: false, msg: '请输入正确的用户名或密码！' }
				}
			}
			res.send(json);
		}
		else if(getParam.controller == 'confAuthority') {
			confAuthority(getParam,postParam,res)
		}
		else if(getParam.controller == 'mtaData') {
			mtaData(getParam,postParam,res)
		}
		else if(getParam.controller == 'mtaOPlog') {
			mtaOPlog(getParam,postParam,res)
		}
		else if(getParam.controller == 'mtaDebug'){
			mtaDebug(getParam,postParam,res)
		}
		else if(getParam.controller == 'confZoneManage'){
			confZoneManage(getParam,postParam,res)
		}
		else if(getParam.controller == 'confPolicy'){
			dmcmconfigFn(getParam, postParam, res)
		}
		else if(getParam.controller == 'confDevice'){
			confDevice(getParam, postParam, res)
		}
		else if(getParam.controller == 'confRemoteCmd'){
			ctrlcmd(getParam, postParam, res)
		}
		else if(getParam.controller == 'confCenterManage'){
			ruleinfo(getParam, postParam, res)
		}
		else if(getParam.controller == 'confAlarm'){
			alarmdt(getParam, postParam, res)
		}
		else {

		}

	},

}

