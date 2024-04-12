export default function netSetting(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showInterface") {
    json = require("../json/sysmain/network.json");
  } else if (getParam.action == "getIFTypeList") {
    json = require("../json/sysmain/typeList.json");
  } else if (getParam.action == "clearIFeth") {
    json = require("../json/sysconf/clearIFeth.json");
  } else if (getParam.action == "showRouteInterface") {
    json = require("../json/monitor/trunklist.json");
  }	else if(getParam.action == 'showDNS') {
    json = require('../json/sysconf/showDNS.json')
  } else if(getParam.action == 'showRoute') {
    json = require('../json/sysconf/networkRote.json');
  } else if(getParam.action == 'showSingleMGT') {
    json = require('../json/sysconf/netconfdata.json')
  } 
  res.send(json);
}
