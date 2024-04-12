export default function scanCodeMock(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "show") {
    json = require("../json/auth/showauthScanCode.json");
  }
  res.send(json);
}
