export default function confUserList(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "show") {
    json = require("../json/confUserList/showUserList.json");
  }
  res.send(json);
}
