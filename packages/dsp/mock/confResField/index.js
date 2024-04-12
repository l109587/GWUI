export default function confResField(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showResField") {
    json = require("../json/confResField/showResField.json");
  }
  res.send(json);
}
