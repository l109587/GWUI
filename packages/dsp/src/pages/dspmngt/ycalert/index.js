import React, { useState, useMemo } from "react";
import { Tabs } from "antd";
import { Devunit, Equipment } from "./components";
// import "./index.less";
const { TabPane } = Tabs;
let H = document.body.clientHeight - 325;
var clientHeight = H;
export default (props) => {
  const [checkedTabKey, setCheckedTabKey] = useState("1");
  const onChange = (key) => {
    setCheckedTabKey(key);
  };

  //规则告警级别
  const riskObj = {
    0: "无风险",
    1: "一般级",
    2: "关注级",
    3: "严重级",
    4: "紧急级",
  };

  //攻击结果
  const attackResultObj = {
    0: "企图",
    1: "成功",
    2: "失陷",
  };

  //威胁类型
  const threatTypeObj = {
    1: "恶意文件",
    2: "渗透攻击",
    3: "木马活动",
    4: "异常行为",
    5: "黑名单通信",
  };

  //攻击分类
  const attackClassObj = {
    1: "窃密攻击",
    2: "远控木马",
    3: "电脑病毒",
    4: "僵尸网络",
    5: "网络蠕虫",
    6: "间谍软件",
    7: "挖矿木马",
    9: "勒索软件",
    11: "后门程序",
    99: "其它",
  };

  //攻击阶段
  const attackStageObj = {
    1: "侦察扫描",
    2: "攻击渗透",
    3: "样本投递",
    4: "持续控制",
    5: "横向移动",
    6: "数据窃取",
    99: "其它",
  };

  //负载类型
  const payloadTypeObj = {
    1: "Web 相关协议",
    2: "Dns 协议",
    3: "电子邮件类应用",
    4: "网盘类应用",
    5: "文件传输类应用",
    6: "即时通信类应用",
    99: "其它类型负载",
  };

  //攻击设施类型
  const facilityTypeObj = {
    1: "密码爆破",
    2: "漏洞扫描",
    3: "样本分发",
    4: "恶意发邮",
    5: "钓鱼网站",
    6: "信息搜集",
    7: "数据窃取",
    8: "指令控制",
    99: "其它",
  };

  return (
    <div>
      <Tabs
        type="card"
        size="Large"
        defaultActiveKey={checkedTabKey}
        onChange={onChange}
      >
        <TabPane tab={"终端组件"} key="1">
          <Devunit
            clientHeight={clientHeight}
            riskObj={riskObj}
            attackResultObj={attackResultObj}
            threatTypeObj={threatTypeObj}
            attackClassObj={attackClassObj}
            attackStageObj={attackStageObj}
            payloadTypeObj={payloadTypeObj}
            facilityTypeObj={facilityTypeObj}
          />
        </TabPane>
        <TabPane tab={"监测设备"} key="2">
          <Equipment
            clientHeight={clientHeight}
            riskObj={riskObj}
            attackResultObj={attackResultObj}
            threatTypeObj={threatTypeObj}
            attackClassObj={attackClassObj}
            attackStageObj={attackStageObj}
            payloadTypeObj={payloadTypeObj}
            facilityTypeObj={facilityTypeObj}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
