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
import device from './mconfig/device';
import confBlacklist from './mconfig/confBlacklist';
import confWhitelist from './mconfig/confWhitelist';
import log from './mconfig/log';
import confIPAddrManage from './mconfig/confIPAddrManage';
import confIPOrderManage from './mconfig/confIPOrderManage';
import confLog from './mconfig/confLog';
import assetMapping from './monitor/assetMapping';
import confResField from './mconfig/confResField';
import mtaConf from './temporary/mtaConf';
import confAssetManage from './mconfig/confAssetManage';
import analyze from './central/analyze';
import userSync from './mconfig/userSync';
import confAccessPolicy from './mconfig/confAccessPolicy';
import adminLog from './mconfig/adminLog';
import confSignature from './cfgmngt/confSignature';
import showUserInfo from './cfgmngt/showUserInfo';
import confDot1xPolicy from './temporary/confDot1xPolicy';
import sysDeploy from './temporary/sysDeploy';
import confCheckPolicy from './temporary/confCheckPolicy';
import confAdmissionPolicy from './temporary/confAdmissionPolicy';
import confregVerify from './temporary/confregVerify';

export default {
	'post /cfg.php': (req, res) => {
		//get 参数
		let getParam = req.query;
		//post 参数
		let postParam = req.body;
		/* 公共 */
		if (getParam.controller == "mtaConf") {
			matConf(getParam, postParam, res);
		} else if (getParam.controller == "sysSetting") {
			sysSetting(getParam, postParam, res);
		} else if (getParam.controller == "sys") {
			sys(getParam, postParam, res);
		} else if (getParam.controller == "netSetting") {
			netSetting(getParam, postParam, res);
		} else if (getParam.controller == "adminAcc") {
			let json = ""
			if (getParam.action == "showAdmin") {
				json = require("./json/sysmain/adminacc.json");
			} else {
			}
			res.send(json);
		} else if (getParam.controller == "notice") {
			let json = ""
			if (getParam.action == "getNotice") {
				json = require("./json/login/notice.json");
			}
			if (getParam.action == "getNoticeList") {
				json = require("./json/login/noticeList.json");
			}
			if (getParam.action == "changeMsgStatus") {
				json = require("./json/login/readed.json");
			}
			if (getParam.action == "getNoticeHigh") {
				json = require("./json/login/noticeHigh.json");
			}
			if (getParam.action == "getNoticeLow") {
				json = require("./json/login/noticeLow.json");
			}
			res.send(json);
		} else if (getParam.controller == "confApiAuthorize") {
			let json = ""
			if (getParam.action == "showApiAuthorize") {
				json = require("./json/sysmain/authorize.json");
			}
			res.send(json);
		} else if (getParam.controller == "sysHeader") {
			sysHeader(getParam, postParam, res);
		} else if (getParam.controller == "adminSet") {
			let json = ""
			if (getParam.action == "showAdminConf") {
				json = require("./json/login/adminconf.json");
			}
			res.send(json);
		} else if (getParam.controller == 'menu') {
			let json = '';
			if (getParam.action == 'menuTree') {
				var admin = 'fa18c52981606ff872097d3118dac83c';
				var sec = '5b63abb4fc706cc5dnda8b4d3b50d15b';
				var adt = '5b73abb4fc706cc5d7da8b4d3b50d15b';
				if (postParam.token == admin) {
					json = require('./json/login/menuTree.json');
				} else if (postParam.token == sec) {
					json = require('./json/login/secTree.json');
				} else if (postParam.token == adt) {
					json = require('./json/login/adtTree.json');
				} else {
					return { success: false, msg: '请输入正确的用户名或密码！' }
				}
			}
			res.send(json);
		} else if (getParam.controller == "confAuthority") {
			confAuthority(getParam, postParam, res);
		} else if (getParam.controller == "mtaData") {
			mtaData(getParam, postParam, res);
		} else if (getParam.controller == "mtaOPlog") {
			mtaOPlog(getParam, postParam, res);
		} else if (getParam.controller == "mtaDebug") {
			mtaDebug(getParam, postParam, res);
		} else if (getParam.controller == "confZoneManage") {
			confZoneManage(getParam, postParam, res);
		}
		else if (getParam.controller == 'device') {
			device(getParam, postParam, res);
		}
		else if (getParam.controller == 'confBlacklist') {
			confBlacklist(getParam, postParam, res);
		}
		else if (getParam.controller == 'confWhitelist') {
			confWhitelist(getParam, postParam, res);
		}
		else if (getParam.controller == 'log') {
			log(getParam, postParam, res);
		}
		else if (getParam.controller == 'confIPAddrManage') {
			confIPAddrManage(getParam, postParam, res);
		}
		else if (getParam.controller == 'confIPOrderManage') {
			confIPOrderManage(getParam, postParam, res);
		}
		else if (getParam.controller == 'confLog') {
			confLog(getParam, postParam, res);
		}
		else if (getParam.controller == 'assetMapping') {
			assetMapping(getParam, postParam, res);
		}
		else if (getParam.controller == 'confApiAuthorize') {
			let json = '';
			if (getParam.action == 'showApiAuthorize') {
				json = require('./json/admlog/authorize.json');
			} else {
			}
			res.send(json);
		}
		else if (getParam.controller == 'confResField') {
			confResField(getParam, postParam, res);
		}
		else if (getParam.controller == 'mtaConf') {
			mtaConf(getParam, postParam, res);
		}
		else if (getParam.controller == 'adminLog') {
			adminLog(getParam, postParam, res);
		}
		else if (getParam.controller == 'analyze') {
			analyze(getParam, postParam, res);
		}
		else if (getParam.controller == 'confAssetManage') {
			confAssetManage(getParam, postParam, res);
		}
		else if (getParam.controller == 'userSync') {
			userSync(getParam, postParam, res);
		}
		else if (getParam.controller == 'userList') {
			showUserInfo(getParam, postParam, res);
		}
		else if (getParam.controller == 'sysDeploy') {
			sysDeploy(getParam, postParam, res);
		}
		else if (getParam.controller == 'confDot1xPolicy') {
			confDot1xPolicy(getParam, postParam, res);
		}
		else if (getParam.controller == 'confregVerify') {
			confregVerify(getParam, postParam, res);
		}
		else if (getParam.controller == 'confAdmissionPolicy') {
			confAdmissionPolicy(getParam, postParam, res);
		}
		else if (getParam.controller == 'confCheckPolicy') {
			confCheckPolicy(getParam, postParam, res);
		}
		else if (getParam.controller == 'confAccessPolicy') {
			confAccessPolicy(getParam, postParam, res);
		}
		else if (getParam.controller == 'confSignature') {
			confSignature(getParam, postParam, res);
		}
		else if (getParam.controller == 'confHA') {
			if (getParam.action == 'show') {
				let json = ''
				json = require('./json/sysconf/show.json');
				res.send(json)
			}
		}
		else {

		}

	},

}

