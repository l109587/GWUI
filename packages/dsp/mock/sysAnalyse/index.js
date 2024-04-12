import { mockMethod } from "../../src/utils/common";

const showCountStatistic = {
  success: true,
  count: {
    title: "数量统计",
    data: [
      { key: "告警总数", value: 90 },
      { key: "攻击总数", value: 90 },
      { key: "泄密总数", value: 90 },
    ],
  },
  dispose: {
    title: "处置统计",
    data: [
      { key: "告警总数", value: 90 },
      { key: "攻击总数", value: 90 },
      { key: "泄密总数", value: 90 },
    ],
  },
};
const showTopChart = {
  success: true,
  title: "告警排名",
  total: 5,
  data: [
    { key: "部门一", value: 90 },
    { key: "部门二", value: 80 },
    { key: "部门三", value: 70 },
    { key: "部门四", value: 60 },
    { key: "部门五", value: 50 },
  ],
};

const showAlarmChart = {
  title: "告警趋势",
  xstep: 20,
  count: 2,
  lines: [
    { name: "涉密信息告警", time: "11:41:50", value: 3373692 },
    { name: "攻击窃密告警", time: "11:41:54", value: 4722900 },
  ],
};
export default function sysAnalyse(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showCountStatistic") {
    mockMethod("show", showCountStatistic, postParam, res);
    return false;
  } else if (getParam.action == "showTopChart") {
    mockMethod("show", showTopChart, postParam, res);
    return false;
  } else if (getParam.action == "showAlarmChart") {
    mockMethod("show", showAlarmChart, postParam, res);
    return false;
  }
  res.send(json);
}
