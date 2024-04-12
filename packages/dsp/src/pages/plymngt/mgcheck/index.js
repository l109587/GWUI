import React, { useRef, useState, useEffect } from "react";
import { Card, Tabs } from "antd";
import { Keyword, Filehash } from "./components";
const { TabPane } = Tabs;

export default () => {
  return (
    <>
      <Tabs type="card">
        <TabPane tab={"关键词检测"} key="1">
          <Keyword />
        </TabPane>
        <TabPane tab={"文件MD5检测"} key="2">
          <Filehash />
        </TabPane>
      </Tabs>
    </>
  );
};
