import Mock from "mockjs";
import assetMapping from "./analyse/assetMapping";
import monitorManage from "./monitot/monitorManage";
import probeManage from "./probers/probeManage";
import evtlog from "./evtlog/evtlog";

import login from "./login";
import matConf from "./sysmain/matConf";
import sysSetting from "./sysmain/sysSetting";
import sys from "./sysmain/sys";
import mtaData from "./sysmain/mtaData";
import mtaDebug from "./sysmain/mtaDebug";
import mtaOPlog from "./sysmain/mtaOPlog";
import confAuthority from "./sysmain/confAuthority";
import netSetting from "./sysmain/netSetting";
import confZoneManage from "./sysmain/confZoneManage";
import sysHeader from "./index/sysHeader";
import sysDeploy from "./sysmain/sysDeploy";

export default {
  "post /login.php": (req, res) => {
    //get 参数
    let getParam = req.query;
    //post 参数
    let postParam = req.body;
    login(getParam, postParam, res);
  },
  "post /cfg.php": (req, res) => {
    //get 参数
    let getParam = req.query;
    //post 参数
    let postParam = req.body;
    if (getParam.controller == "assetMapping") {
      assetMapping(getParam, postParam, res)
    } else if (getParam.controller == "monitorManage") {
      monitorManage(getParam, postParam, res)
    } else if (getParam.controller == "confResField") {
      let json = "";
      if (getParam.action == "showResField") {
        json = require("./json/sysconf/showResField.json");
      }
      res.send(json);
    } else if (getParam.controller == "probeManage") {
      probeManage(getParam, postParam, res)
    } 

    // 公共
    else if (getParam.controller == "mtaConf") {
      matConf(getParam, postParam, res);
    } else if (getParam.controller == "confTableHead") {
      if(getParam.action == "showTableHead"){
        const data = {
          success:true,
          data:{}
        }
        res.json(data)
      }
    } else if (getParam.controller == "sysSetting") {
      sysSetting(getParam, postParam, res);
    } else if (getParam.controller == "sys") {
      sys(getParam, postParam, res);
    } else if (getParam.controller == "netSetting") {
      netSetting(getParam, postParam, res);
    } else if (getParam.controller == "adminAcc") {
      let json = "";
      if (getParam.action == "showAdmin") {
        json = require("./json/sysmain/adminacc.json");
      } else {
      }
      res.send(json);
    } else if (getParam.controller == "notice") {
      let json = "";
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
      let json = "";
      if (getParam.action == "showApiAuthorize") {
        json = require("./json/sysmain/authorize.json");
      }
      res.send(json);
    } else if (getParam.controller == "sysHeader") {
      sysHeader(getParam, postParam, res);
    } else if (getParam.controller == "adminSet") {
      let json = "";
      if (getParam.action == "showAdminConf") {
        json = require("./json/login/adminconf.json");
      }
      res.send(json);
    } else if (getParam.controller == "menu") {
      let json = "";
      if (getParam.action == "menuTree") {
        var admin = "fa18c52981606ff872097d3118dac83c";
        var sec = "5b63abb4fc706cc5dnda8b4d3b50d15b";
        var adt = "5b73abb4fc706cc5d7da8b4d3b50d15b";
        if (postParam.token == admin) {
          // json = require('./json/login/menuTree.json');
          if (postParam.env == "nbg") {
            json = require("./json/login/nbgMenuTree.json");
          }
        } else if (postParam.token == sec) {
          json = require("./json/login/secTree.json");
        } else if (postParam.token == adt) {
          json = require("./json/login/adtTree.json");
        } else {
          return { success: false, msg: "请输入正确的用户名或密码！" };
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
    } else if (getParam.controller == "adminLog") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/admlog/action.json");
      } else {
      }
      res.send(json);
    } else if (getParam.controller == "sysDeploy") {
      sysDeploy(getParam, postParam, res);
    } else if (getParam.controller == "confHA") {
      if (getParam.action == "show") {
        let json = "";
        json = require("./json/sysconf/show.json");
        res.send(json);
      }
    } else if(getParam.controller == 'evtViolations'){
			evtlog(getParam,postParam,res)
		} else if(getParam.controller == 'alaSetting'){
      let json = "";
			if (getParam.action == "getEventList") {
        json = {
          success: true,
          data: [
            {
              text: '系统事件',
              value: 1,
              child: [
                { text: '管理员登录', value: 'login' },
                { text: '系统重启', value: 'restart' },
              ],
            },
            {
              text: '资产事件',
              value: 2,
              child: [
                { text: '资产发现', value: 'find' },
                { text: '资产识别', value: 'identify' },
              ],
            },
          ],
        }
      }
      res.send(json);
		} else if(getParam.controller == 'evtSystem'){
      if (getParam.action == "showEvtSystemChart") {
        let json = "";
        json = require("./json/nbgevtlog/showEvtSystemChart.json");
        res.send(json);
      }
    } else {
    }
  },
};
