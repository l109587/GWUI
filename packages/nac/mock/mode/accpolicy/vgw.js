import { mockMethod } from "../../../src/utils/common";
import Mock, { mock } from "mockjs";

const show = {
  success: true,
  total: "38",
  data: [
    { reason: "1", value: "终端未注册", sw: "1" },
    { reason: "2", value: "终端待审核", sw: "0" },
    { reason: "3", value: "终端审核不通过", sw: "0" },
    { reason: "5", value: "终端未完成认证", sw: "0" },
    { reason: "8", value: "终端安检不通过", sw: "1" },
    { reason: "10", value: "IP在黑名单中", sw: "1" },
    { reason: "12", value: "终端被阻断策略限制访问网络", sw: "0" },
    { reason: "23", value: "匹配交换机绑定MAC失败", sw: "0" },
    { reason: "24", value: "匹配交换机端口绑定设备失败", sw: "0" },
    { reason: "25", value: "匹配交换机端口绑定用户失败", sw: "0" },
    { reason: "26", value: "匹配交换机端口绑定阻断IP失败", sw: "0" },
    { reason: "27", value: "匹配交换机端口绑定IP/MAC/设备类型失败", sw: "0" },
    { reason: "28", value: "阻断HUB设备", sw: "0" },
    { reason: "38", value: "未处置设备", sw: "0" },
  ],
};

export default function (getParam, postParam, res) {
  if (getParam.action == "get_port_control_cond") {
    mockMethod("show", show, postParam, res);
  }
}
