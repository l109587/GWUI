import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Input,
  message,
  Tabs,
  Switch,
  Tooltip,
  Col,
  TreeSelect,
  Space,
  Popconfirm,
} from "antd";
import { formleftLayout } from "@/utils/helper";
import { language } from "@/utils/language";
import Lkacfg from "./lkacfg";
import Reglist from "./reglist";
import Protectlist from "./protectlist";
import Blocklist from "./blocklist";

const { TabPane } = Tabs;

export default function () {
  return (
    <Tabs
      type="card"
      // activeKey={activeKey}
      destroyInactiveTabPane={true}
      // onChange={(key) => {
      //   setActiveKey(key);
      // }}
    >
      <TabPane tab='联动配置' key="lkacfg" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}><Lkacfg/></TabPane>
      <TabPane tab='注册信息列表' key="reglist" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}><Reglist/></TabPane>
      <TabPane tab='信任保护列表' key="protectlist" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}><Protectlist/></TabPane>
      <TabPane tab='无效阻断列表' key="stoplist" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}><Blocklist/></TabPane>
    </Tabs>
  );
}
