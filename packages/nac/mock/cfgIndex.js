import { json } from "express";
import Mock from "mockjs";
import confZoneManage from "./sysmain/confZoneManage";
import exceptDev from "./mode/ecpmngt/exceptDev";
import radConfig from "./mode/ecpmngt/radConfig";
import radnas from "./mode/ecpmngt/radnas";
import radmac from "./mode/ecpmngt/radmac";
import portal from "./mode/ecpmngt/portal";
import devbind from "./mode/bindconf/devbind";
import devGroupControl from "./mode/plymngt/devGroupControl";
import upgradePolicy from "./mode/plymngt/upgradePolicy";
import securityDomain from "./mode/plymngt/securityDomain";
import userList from "./mode/plymngt/userList";
import userPush from "./mode/plymngt/userPush";
import checkPolicy from "./mode/plymngt/checkPolicy";
import securityRule from "./mode/plymngt/securityRule";
import agentCFGPolicy from "./mode/plymngt/agentCFGPolicy";
import webreg from "./mode/manage/webreg";
import admissionPolicy from "./mode/accpolicy/admissionPolicy";
import accessPolicy from "./mode/accpolicy/accessPolicy";
import access from "./mode/accpolicy/access";
import regVerify from "./mode/accpolicy/regVerify";
import timeObject from "./mode/accpolicy/timeObject";
import linkage from "./mode/linkage/linkage";
import sysHeader from "./index/sysHeader";
import guest from "./mode/guestctl/guest";
import authMock from "./auth/index";
import scanCodeMock from "./authScanCode";
import vgw from "./mode/accpolicy/vgw";
import bridge from "./mode/accpolicy/bridge";
import dot1xPolicy from './mode/temporary/dot1xPolicy';
import checkNotes from './mode/temporary/checkNotes';


export default {
  "post /cfg.php": (req, res) => {
    //get 参数
    let getParam = req.query;
    //post 参数
    let postParam = req.body;
    /* 公共 */
    if (getParam.controller == "menu") {
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
      } else if (getParam.action == "menuList") {
        json = require("./json/login/menuList.json");
      }
      res.send(json);
    } else if (getParam.controller == "adminSet") {
      let json = "";
      if (getParam.action == "showAdminConf") {
        json = require("./json/login/adminconf.json");
      }
      res.send(json);
    } else if (getParam.controller == "sysHeader") {
      sysHeader(getParam, postParam, res);
    } else if (getParam.controller == "confZoneManage") {
      confZoneManage(getParam, postParam, res);
    } else if (getParam.controller == "exceptDev") {
      exceptDev(getParam, postParam, res);
    } else if (getParam.controller == "radconfig") {
      radConfig(getParam, postParam, res);
    } else if (getParam.controller == "portal") {
      portal(getParam, postParam, res);
    } else if (getParam.controller == "radnas") {
      radnas(getParam, postParam, res);
    } else if (getParam.controller == "radmac") {
      radmac(getParam, postParam, res);
    } else if (getParam.controller == "devbind") {
      devbind(getParam, postParam, res);
    } else if (getParam.controller == "devGroupControl") {
      devGroupControl(getParam, postParam, res);
    } else if (getParam.controller == "upgradePolicy") {
      upgradePolicy(getParam, postParam, res);
    } else if (getParam.controller == "confTableHead") {
      if (getParam.action == "showTableHead") {
        const data = {
          success: true,
          data: {},
        };
        res.json(data);
      }
    } else if (getParam.controller == "admissionPolicy") {
      admissionPolicy(getParam, postParam, res);
    } else if (getParam.controller == "reg_verify") {
      regVerify(getParam, postParam, res);
    } else if (getParam.controller == "securityDomain") {
      securityDomain(getParam, postParam, res);
    } else if (getParam.controller == "timeObject") {
      timeObject(getParam, postParam, res);
    } else if (getParam.controller == "linkage") {
      linkage(getParam, postParam, res);
    } else if (getParam.controller == "userList") {
      userList(getParam, postParam, res);
    } else if (getParam.controller == "userPush") {
      userPush(getParam, postParam, res);
    } else if (getParam.controller == "checkPolicy") {
      checkPolicy(getParam, postParam, res);
    } else if (getParam.controller == "securityRule") {
      securityRule(getParam, postParam, res);
    } else if (getParam.controller == "agentCFGPolicy") {
      agentCFGPolicy(getParam, postParam, res);
    } else if (getParam.controller == "webreg") {
      webreg(getParam, postParam, res);
    } else if (getParam.controller == "auth") {
      authMock(getParam, postParam, res);
    } else if (getParam.controller == "accessPolicy") {
      accessPolicy(getParam, postParam, res);
    } else if (getParam.controller == "guest") {
      guest(getParam, postParam, res);
    } else if (getParam.controller == "authScanCode") {
      scanCodeMock(getParam, postParam, res);
    } else if (getParam.controller == "access") {
      access(getParam, postParam, res);
    } else if (getParam.controller == "vgw") {
      vgw(getParam, postParam, res);
    } else if (getParam.controller == "bridge") {
      bridge(getParam, postParam, res);
    } else if (getParam.controller == "dot1xPolicy") {
      dot1xPolicy(getParam, postParam, res);
    } else if (getParam.controller == "checkNotes") {
      checkNotes(getParam, postParam, res);
    } else {
    }
  },
};
