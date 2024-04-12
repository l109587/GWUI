export default function ctrlcmd(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "show") {
    json = require("../json/dmc/ctrlcmd/showCtrlData.json");
  } else if (getParam.action == "storeFirmware") {
    json = require("../json/dmc/ctrlcmd/storeFirmware.json");
  } else if (getParam.action == "storePolicyFile") {
    json = require("../json/dmc/ctrlcmd/storePolicyFile.json");
  } else if (getParam.action == "getModuleNames") {
    json = require("../json/dmc/ctrlcmd/getModuleNames.json");
  } else if (getParam.action == "getCommandTypes") {
    json = {
      success: true,
      total: 17,
      data: [
        {value: "reboot", label:"系统重启"},
        {value:"startm", label:"模块启动"},
        {value:"stopm", label:"模块停止"},
        {value:"startm_inner", label:"内置模块策略开启"},
        {value:"stopm_inner", label:"内置模块策略关闭"},
        {value:"sync_time", label:"时间同步"},
        {value:"update", label:"固件升级"},
        {value:"version_check", label:"版本检查"},
        {value:"passwd", label:"密码重置"},
        {value:"dropdata", label:"数据删除"},
        {value:"report_policy", label:"策略上报"},
        {value:"cert_update", label:"证书更新"},
        {value:"inner_policy_update", label:"内置规则更新"},
        {value:"ctrl_inner_policy", label:"内置策略启停"},
        {value:"warning_dispose", label:"威胁预警处置"},
        {value:"device_report", label:"设备信息上报"}
      ],
    }
  }
  res.send(json);
}
