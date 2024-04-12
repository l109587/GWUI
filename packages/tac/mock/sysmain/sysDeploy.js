export default function sysDeploy(getParam, postParam, res) {
  let json = "";
  //系统设置
  if (getParam.action == "showSysCert") {
    json = require("../json/sysconf/showsyscert.json");
  } else if (getParam.action == "uploadSysCert") {
    json = require("../json/temporary/finish.json");
  } else if (getParam.action == "getRegistPageContent") {
    json = require("../json/sysDeploy/getRegistPageContent.json");
  } else if (getParam.action == "showDepartment") {
    json = require("../json/sysDeploy/showDepartment.json");
  } else if (getParam.action == "showDevRegist") {
    json = require("../json/sysDeploy/showDevRegist.json");
  }
  res.send(json);
}
