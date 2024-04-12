import Mock from "mockjs";
import { mockMethod } from "../../src/utils/common";
export default function monitorManage(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showGlobalPortConf") {
    json = require("../json/temporary/outtoptable.json");
    res.send(json);
  } else if (getParam.action == "showOutlineConf") {
    json = require("../json/temporary/outableother.json");
    res.send(json);
  } else if (getParam.action == "showNetcrossCfg") {
    json = require("../json/temporary/serialine.json");
    res.send(json);
  } else if (getParam.action == "showMonitorCfg") {
    json = require("../json/temporary/violation.json");
    res.send(json);
  } else if (getParam.action == "getOutlineAllCfg") {
    json = require("../json/temporary/setselect.json");
    res.send(json);
  } else if (getParam.action == "getPortsListName") {
    json = require("../json/temporary/protslist.json");
    res.send(json);
  } else if (getParam.action == "getPortsListFilter") {
    json = require("../json/temporary/protslist.json");
    res.send(json);
  } else if (getParam.action == "getNcInfList") {
    json = require("../json/monitor/trunklist.json");
    res.send(json);
  } else if (getParam.action == "getOobInfList") {
    json = require("../json/monitor/getOobInfList.json");
    res.send(json);
  } else if (getParam.action == "showOobConf") {
    json = require("../json/monitor/showOobConf.json");
    res.send(json);
  } else {
  }
}
