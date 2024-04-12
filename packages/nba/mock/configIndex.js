import Mock from "mockjs";
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
    if (getParam.controller == "netcrossEvent") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/illevent/netseriestable.json");
      } else if (getParam.action == "showDetails") {
        json = require("./json/illevent/netseriesdetails.json");
      }
      res.send(json);
    } else if (getParam.controller == "outlineEvent") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/illevent/illoutline.json");
      } else if (getParam.action == "showDetails") {
        json = require("./json/illevent/illoutlinedetails.json");
      }
      res.send(json);
    } else if (getParam.controller == "clientEvent") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/illevent/nacreporttable.json");
      }
      res.send(json);
    } else if (getParam.controller == "userOutlineConf") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/monconf/outmconftable.json");
      } else if (getParam.action == "showUserCombox") {
        json = require("./json/indexcharts/nbaUserList.json");
      }
      res.send(json);
    } else if (getParam.controller == "warnConf") {
      let json = "";
      if (getParam.action == "showSmsConf") {
        json = require("./json/monconf/showSmsConf.json");
      } else if (getParam.action == "showWarnConf") {
        json = require("./json/monconf/showWarnConf.json");
      } else if (getParam.action == "showSmsTypeList") {
        json = require("./json/monconf/showSmsTypeList.json");
      } else if (getParam.action == "showMailConf") {
        json = require("./json/monconf/alertnotice.json");
      } else if (getParam.action == "testMailSend") {
        json = require("./json/monconf/testmailsend.json");
      } else if (getParam.action == 'showFtpConf') {
				json = {
					"success": true,
					"state": "N",
					"stime": 60,
					"ftpaddr": "192.168.134.174",
					"ftpport": 21,
					"ftppath": "/log",
					"ftpuser": "ftproot",
					"ftppwd": "pwd"
				}
			}
      res.send(json);
    } else if (getParam.controller == "areaIpConf") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/monconf/iaddrmap.json");
      }
      res.send(json);
    } else if (getParam.controller == "offlineEvent") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/monconf/offoutline.json");
      }
      res.send(json);
    } else if (getParam.controller == "fileLeakEvent") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/monconf/fileleak.json");
      }
      res.send(json);
    } else if (getParam.controller == "cemsReportEvent") {
      let json = "";
      if (getParam.action == "show") {
        json = require("./json/illevent/edpreport.json");
      }
      res.send(json);
    } else if (getParam.controller == "whiteConf") {
      let json = "";
      if (getParam.action == "showConf") {
        json = require("./json/monconf/outwhite.json");
      }
      res.send(json);
    }
    // 公共
    else if (getParam.controller == "mtaConf") {
      matConf(getParam, postParam, res);
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
          if (postParam.env == "nba") {
            json = require("./json/login/nbaMenuTree.json");
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
    } else {
    }
  },
};
