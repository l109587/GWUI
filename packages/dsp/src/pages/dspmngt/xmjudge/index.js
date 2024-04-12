import React, { useRef, useState, useEffect } from "react";
import { Card, Tabs } from "antd";
import { Terminal, Monequip } from "./components";
import "./xmjudge.less"
const { TabPane } = Tabs;

export default () => {
  return (
    <Tabs type="card" className="xmjudgeTab">
      <TabPane tab={"终端组件"} key="1">
        <Terminal />
      </TabPane>
      <TabPane tab={"监测设备"} key="2">
        <Monequip />
      </TabPane>
    </Tabs>
  );
};
