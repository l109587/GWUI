import React, { useEffect, useRef, useState } from "react";
import {
  ProCard,
} from "@ant-design/pro-components";
import "./pwdpath.less";
import Basecfg from "./components/basecfg";
import Advanced from "./components/advanced";
import Authser from "./components/authser";

export default () => {
  const [activeKey, setActiveKey] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  return (
    <ProCard
      className={"pwdpathCard"}
      tabs={{
        tabPosition: "left",
        onTabClick: (e) => {
          setActiveKey(e);
          setReloadKey((reloadKey) => reloadKey + 1);
        },
      }}
    >
      <ProCard.TabPane key="1" tab="基本配置">
        <Basecfg reloadKey={reloadKey} activeKey={activeKey} />
      </ProCard.TabPane>
      <ProCard.TabPane key="2" tab="高级配置">
        <Advanced reloadKey={reloadKey} activeKey={activeKey} />
      </ProCard.TabPane>
      <ProCard.TabPane key="3" tab="认证服务">
        <Authser reloadKey={reloadKey} activeKey={activeKey} />
      </ProCard.TabPane>
    </ProCard>
  );
};

