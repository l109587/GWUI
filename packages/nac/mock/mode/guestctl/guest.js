import { mockMethod } from "../../../src/utils/common";
import Mock, { mock } from "mockjs";

export default function (getParam, postParam, res) {
  if (getParam.action == "show_guest_info") {
    const data = mock({
      success: true,
      "data|5": [
        {
          id: "@id",
          status: '@pick(["Y", "N"])',
          name: "test",
          IDCard: "@id",
          company: "测试公司",
          department: "测试部门",
          phone: "13931489898",
          reason: "测试",
          receiver: "测试接待",
          expire: "2024-03-08 23:48:27",
          remaintime: "58分钟28秒",
        },
      ],
      total: 5,
    });
    res.json(data);
  }
  if (getParam.action == "guest_regfield_get") {
    let json = "";
    json = require("../../json/auth/guest_regfield_get.json");
    res.send(json);
  } else if (getParam.action == "guest_cfg_get") {
    let json = "";
    json = require("../../json/auth/guest_cfg_get.json");
    res.send(json);
  }
}
