import { mockMethod } from "../../src/utils/common";
import Mock, { mock } from "mockjs";

const showTerminalPolicyShow = {
  success: true,
  data: [
    {
      type: "xxx",
      id: "xxx",
      name: "xxx",
      rcvState: "xxx",
      rspState: "xxx",
      restResult: "xxx",
    },
  ],
};

const showTerminalCmdShow = {
  success: true,
  data: [
    {
      type: "xxx",
      content: "xxx",
      rcvState: "xxx",
      rspState: "xxx",
      restResult: "xxx",
    },
  ],
};
export default function confDevice(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showSynclist") {
    json = require("../json/confDevice/showSynclist.json");
  } else if (getParam.action == "showList") {
    json = require("../json/confDevice/devshowList.json");
  } else if (getParam.action == "detail") {
    json = require("../json/confDevice/detail.json");
  } else if (getParam.action == "regShowList") {
    json = require("../json/confDevice/regShowList.json");
  } else if (getParam.action == "showTerminalPolicy") {
    mockMethod("show", showTerminalPolicyShow, postParam, res);
    return false;
  } else if (getParam.action == "showTerminalCmd") {
    mockMethod("show", showTerminalCmdShow, postParam, res);
    return false;
  }
  res.send(json);
}
