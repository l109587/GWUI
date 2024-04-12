import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import './index.less';
import { Devctl, Devterm, Dstaut, Net, System, Terminal, User, Visitor } from './components';
const { TabPane } = Tabs;
let H = document.body.clientHeight - 143
var clientHeight = H
export default () => {
  return (
    <>
      <div className="logaccessbox card-container" >
        <Tabs type="card">
          <TabPane tab={language('project.logmngt.devctl')} key="devctl">
            <Devctl />
          </TabPane>
          <TabPane tab={language('project.logmngt.dstaut')} key="dstaut">
            <Dstaut />
          </TabPane>
          <TabPane tab={language('project.logmngt.terminal')} key="terminal">
            <Terminal />
          </TabPane>
          <TabPane tab={language('project.logmngt.devterm')} key="devterm">
            <Devterm />
          </TabPane>
          <TabPane tab={language('project.logmngt.user')} key="user">
            <User />
          </TabPane>
          <TabPane tab={language('project.logmngt.visitor')} key="visitor">
            <Visitor />
          </TabPane>
          <TabPane tab={language('project.logmngt.net')} key="net">
            <Net />
          </TabPane>
          <TabPane tab={language('project.logmngt.system')} key="system">
            <System />
          </TabPane>
         
        </Tabs>
      </div>
    </>

  );
}