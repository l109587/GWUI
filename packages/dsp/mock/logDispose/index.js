import Mock from "mockjs";
import { mockMethod } from "../../src/utils/common";

const showAttack = {
  success: true,
  total: 1,
  data: [
    {
      devid: "x",
      version: "x",
      id: "x",
      time: "x",
      ruleid: "x",
      rulename: "x",
      risk: "0",
      sip: "x",
      sport: "x",
      smac: "x",
      dip: "x",
      dport: "x",
      dmac: "x",
      transproto: "x",
      appproto: "x",
      attacker: "x",
      victim: "x",
      attackResult: "0",
      threatType: "0",
      attackClass: "0",
      attackGroup: "x",
      attackStage: "0",
      sessid: "x",
      desc: "x",
      payloadType: "0",
      payloadDetail: "{}",
      extend: "{}",
      domain: "x",
      processName: "x",
      processFilename: "x",
      processFilepath: "x",
      processFilemd5: "x",
      blacklistType: "x",
      facilityType: [1,2],
      num: "1",
      filetime: "x",
      filename: "x",
      isUpload: "0",
      checksum: "x",
      filetype: "x",
    },
  ],
};
export default function logDispose(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showSensitive") {
    json = require("../json/logDispose/showSensitive.json");
  } else if (getParam.action == "showAttack") {
    mockMethod("show", showAttack, postParam, res);
    return false;
  }
  res.send(json);
}
