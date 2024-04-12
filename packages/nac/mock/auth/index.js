export default function authMock(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "getAuthConfig") {
    json = require("../json/auth/getAuthConfig.json");
  } else if (getParam.action == "getPortalConfig") {
    json = require("../json/auth/getPortalConfig.json");
  } else if (getParam.action == "getCertType") {
    json = require("../json/auth/getCertType.json");
  } else if (getParam.action == "getCertConfig") {
    json = require("../json/auth/getCertConfig.json");
  }
  res.send(json);
}
