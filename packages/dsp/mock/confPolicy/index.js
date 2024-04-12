export default function confPolicy(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "show") {
    json = require("../json/confPolicy/showMgcheck.json");
  } else if (getParam.action == "showDevice") {
    json = require("../json/confPolicy/showDevice.json");
  }
  res.send(json);
}
