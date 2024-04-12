import confZoneManage from "./confZoneManage";
import confUserList from "./confUserlist";
import confResField from "./confResField";
import confPolicy from "./confPolicy";
import confDevice from "./confDevice";
import ctrlcmd from "./policy/ctrlcmd";
import confTerminal from './confTerminal';
import confDispose from './evthandle/confDispose';
import logDispose from "./logDispose";
import sysAnalyse from "./sysAnalyse";

export default {
  "post /cfg.php": (req, res) => {
    //get 参数
    let getParam = req.query;
    //post 参数
    let postParam = req.body;
    if (getParam.controller == "notice") {
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
      res.send(json);
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
          json = require("./json/login/menuTree.json");
        } else if (postParam.token == sec) {
          json = require("./json/login/secTree.json");
        } else if (postParam.token == adt) {
          json = require("./json/login/adtTree.json");
        } else {
          return { success: false, msg: "请输入正确的用户名或密码！" };
        }
      }
      res.send(json);
    } else if (getParam.controller == "confZoneManage") {
      confZoneManage(getParam, postParam, res);
    } else if (getParam.controller == "confUserlist") {
      confUserList(getParam, postParam, res);
    } else if (getParam.controller == "confResField") {
      confResField(getParam, postParam, res);
    } else if (getParam.controller == "confPolicy") {
      confPolicy(getParam, postParam, res);
    } else if (getParam.controller == "confDevice") {
      confDevice(getParam, postParam, res);
    } else if (getParam.controller == "confRemoteCmd") {
      ctrlcmd(getParam, postParam, res);
    } else if (getParam.controller == "confTableHead") {
      if (getParam.action == "showTableHead") {
        const data = {
          success: true,
          data: {},
        };
        res.json(data);
      }
    }
    else if (getParam.controller == "confTerminal") {
      confTerminal(getParam, postParam, res)
    }
    else if (getParam.controller == "confDispose") {
      confDispose(getParam, postParam, res)
    }
    else if (getParam.controller == "logDispose") {
      logDispose(getParam, postParam, res)
    }
    else if (getParam.controller == "sysAnalyse") {
      sysAnalyse(getParam, postParam, res)
    }
  },
};
