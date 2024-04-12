import { mockMethod } from "../../../src/utils/common";
import Mock, { mock } from "mockjs";
let regverData = mock({
  success: true,
  "data|5": [
    {
      id: "@id",
      name: "@name",
      reg_type: '@pick(["1", "2"])', //注册方式
      verify_type: '@pick(["0", "1", "2"])', //注册方式
      deal_type: '@pick(["0", "1"])', //处理方式
      agent_url: "www.1231123.com", //下载地址
    },
  ],
  total: 5,
});
export default function (getParam, postParam, res) {
  if (getParam.action == "reg_verify_policy_show") {
    res.json(regverData);
  }
  if (getParam.action == "reg_verify_policy_add") {
    regverData.data.push({
      id:Mock.mock('@id'),
      name: postParam.name,
      reg_type: postParam.reg_type,
      verify_type: postParam.verify_type,
      deal_type: postParam.deal_type||'',
      agent_url: postParam.agent_url||'',
    });
    regverData.total = regverData.total + 1
    const data = {
      success: true,
      msg: "添加成功",
      id: "001",
      name: postParam.name,
    };
    res.json(data);
  }
}
