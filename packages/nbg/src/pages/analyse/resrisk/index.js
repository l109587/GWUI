import React, { useState } from "react";
import { Tabs } from "antd";
import SysFlaw from "./components/sysflaw";
import Weakpwd from "./components/weakpwd";
import Portopen from "./components/portopen";
import { language } from "@/utils/language";
const { TabPane } = Tabs;
export default (props) => {
  let value = props.location?.value;
  const [checkedTabKey, setCheckedTabKey] = useState(value ? value : "1");
  const onChange = (key) => {
    setCheckedTabKey(key);
  };
  return (
    <Tabs type="card" defaultActiveKey={checkedTabKey} onChange={onChange}>
      <TabPane tab={language("analyse.resrisk.sysflaw")} key="1">
        <SysFlaw />
      </TabPane>
      <TabPane tab={language("analyse.resrisk.weakpwd")} key="2">
        <Weakpwd />
      </TabPane>
      <TabPane tab={language("analyse.resrisk.portopen")} key="3">
        <Portopen />
      </TabPane>
    </Tabs>
  );
};
