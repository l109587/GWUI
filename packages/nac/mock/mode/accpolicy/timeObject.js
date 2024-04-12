import { mockMethod } from "../../../src/utils/common";
import Mock, { mock } from "mockjs";
const timeObj = [
  { text: "工作时间", value: "工作时间" },
  { text: "加班时间", value: "加班时间" },
  { text: "一直生效", value: "一直生效" },
]
export default function (getParam, postParam, res) {
  if (getParam.action == "get_timeObject") {
    const data = mock({
      success: true,
      "data|5": [
        {
          id: "@id",
          name: "@name",
          week: "monday;tuesday;wednesday",
          start: "2024-02-01",
          end: "2024-02-01",
        },
      ],
      total: 5,
    });
    res.json(data);
  }
  
  if (getParam.action == "get_timeObject_combox") {
    const data = mock({
      success: true,
      data: timeObj,
      total: 5,
    });
    res.json(data);
  }
  if (getParam.action == "add_timeObject") {
    timeObj.push({text:postParam.name,value:postParam.name})
    const data = {
      success: true,
      msg: "添加成功",
      id: "001",
      name: postParam.name,
    }
    res.json(data);
  }
}
