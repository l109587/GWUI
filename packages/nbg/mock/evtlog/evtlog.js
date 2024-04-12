import Mock from "mockjs";
export default function evtlog(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showEvtViolationsList") {
    json = require("../json/nbgevtlog/showEvtViolationsList.json");
  } else if (getParam.action == "showEvtViolationsChart") {
    json = require("../json/nbgevtlog/showEvtViolationsChart.json");
  }
  res.send(json);
}
