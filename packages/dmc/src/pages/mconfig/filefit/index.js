import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { language } from '@/utils/language';
import { KeyWord, Account, EncryptFiles } from './components'
import './index.less'
const { TabPane } = Tabs;

export default () => {
  return (<>
    <Tabs type="card" size="Large">
      <TabPane tab={language('dmcoconfig.filefit.keywordfilteringrules')} key='3'>
        <KeyWord />
      </TabPane>
      <TabPane tab={language('dmcoconfig.filefit.accountscreeningrules')} key='4'>
        <Account />
      </TabPane>
      <TabPane tab={language('dmcoconfig.filefit.encryptedfilefilterrules')} key='5'>
        <EncryptFiles />
      </TabPane>
    </Tabs>
  </>)  
}