export default function probeManage(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showScriptCfg") {
    json = require("../json/temporary/scrproform.json");
  } else if (getParam.action == "showScriptDeploy") {
    json = require("../json/temporary/scrprotable.json");
  } else if (getParam.action == "showAgenCfg") {
    json = require("../json/temporary/terproform.json");
  } else if (getParam.action == "showAgentMakeList") {
    json = require("../json/temporary/terprotable.json");
  } else if (getParam.action == "showAgentProbeList") {
    json = require("../json/temporary/probelist.json");
  } else if (getParam.action == "getUninstallCode") {
    json = require("../json/temporary/uninstall.json");
  } else if (getParam.action == "downloadScript") {
    json = require("../json/temporary/down.json");
  } else if (getParam.action == "agentMakeOperate") {
    if (postParam.op === "getStatus") {
      json = require("../json/upload/nocode.json");
    } else {
      json = require("../json/temporary/down.json");
    }
  } else if (getParam.action == "agentPkgUpload") {
    json = require("../json/temporary/finish.json");
  } else if (getParam.action == "filterAgentProbeList") {
    json = require("../json/probers/teprobefillter.json");
  } else if (getParam.action == "showHrdprbCfg") {
    json = require("../json/probers/hdrprbCfg.json");
  } else if (getParam.action == "showHrdprbList") {
    json = require("../json/probers/hdprobelist.json");
  } else if (getParam.action == "showHrdprbUpgrade") {
    json = require("../json/probers/hdprobeuplist.json");
  } else if (getParam.action == "showRegisterCfg") {
    json = require("../json/prbmgt/devreg.json");
  } else if (getParam.action == "showHrdprbAssets") {
    json = require("../json/prbmgt/chkinfo.json");
  } else if (getParam.action == "filterHrdprbAssets") {
    json = require("../json/prbmgt/chkinfofilters.json");
  } else if (getParam.action == "setRegisterCfg") {
    json = require("../json/prbmgt/setRegisterCfg.json");
  } else if (getParam.action == "syncRegister") {
    json = require("../json/prbmgt/syncRegister.json");
  } else if (getParam.action == "showHrdprbOutlineCfg") {
    json = require("../json/prbmgt/getOutConfig.json");
  } else if (getParam.action == "showHrdprbMonitorCfg") {
    json = require("../json/prbmgt/showMonitorCfg.json");
  } else if (getParam.action == "showHrdprbBasic") {
    json = require("../json/prbmgt/hdprbbase.json");
  } else if (getParam.action == "showHrdprbConfInfo") {
    json = require("../json/probers/hrdprbConfInfo.json");
  } else if (getParam.action == "showHrdprbMonitorInfo") {
    json = require("../json/probers/hdprbmonData.json");
  } else if (getParam.action == "showAutoLoginInfo") {
    json = require("../json/prbmgt/historypush.json");
  } else if (getParam.action == "getRepairCode") {
    json = {
      success: true,
      msg: "操作成功",
      repairNetCode: "6a7dd8",
    };
  } else {
  }
  res.send(json);
}
