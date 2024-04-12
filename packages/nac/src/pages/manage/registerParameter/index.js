import React, { useRef, useState, useEffect } from "react";
import { Modal, Tabs } from "antd";
import { DrawerForm, ProDescriptions } from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import SaveSvg from "@/assets/nac/save.svg";
import { ReactComponent as WDel } from "@/assets/nac/security/wdel.svg";
import { regList, regUrlList } from "@/utils/regExp";
import { TableLayout, AmTag } from "@/components";
import { RegSur, RegField, AssetField, RegRoam } from "./components";
const { TabPane } = Tabs;
let H = document.body.clientHeight - 118;
var clientHeight = H;
export default () => {
  const formRef = useRef();
  const [activeKey, setActiveKey] = useState("bh");
  return (
    <div
      className="registerParameter"
      style={{ paddingTop: "15px", backgroundColor: "#FFFFFF" }}
    >
      <Tabs
        type="line"
        tabPosition="left"
        style={{ height: clientHeight }}
        activeKey={activeKey}
        destroyInactiveTabPane={true}
        onChange={(key) => {
          setActiveKey(key);
        }}
      >
        <TabPane tab={"注册保活配置"} key="bh">
          <RegSur clientHeight={clientHeight} />
        </TabPane>
        <TabPane tab={"注册字段配置"} key="zd">
          <RegField clientHeight={clientHeight} />
        </TabPane>
        <TabPane tab={"资产字段配置"} key="access">
          <AssetField clientHeight={clientHeight} />
        </TabPane>
        <TabPane tab={"注册漫游配置"} key="my">
          <RegRoam clientHeight={clientHeight} />
        </TabPane>
      </Tabs>
    </div>
  );
};
