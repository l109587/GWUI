import React, { useState, useMemo } from "react";
import { Tabs } from "antd";
import { RegList, DevList } from "./components";
// import "./index.less";
const { TabPane } = Tabs;
let H = document.body.clientHeight - 325;
var clientHeight = H;
export default (props) => {
  const [checkedTabKey, setCheckedTabKey] = useState("1");
  const onChange = (key) => {
    setCheckedTabKey(key);
  };

  return (
    <div >
     <Tabs
     type="card" size="Large"
        defaultActiveKey={checkedTabKey}
        onChange={onChange}
      >
        <TabPane tab={"设备列表"} key="1">
          <DevList clientHeight={clientHeight}  />
        </TabPane>
        <TabPane tab={"注册审核"} key="2">
          <RegList  clientHeight={clientHeight} />
        </TabPane>
      </Tabs>
    </div>
  );
};
