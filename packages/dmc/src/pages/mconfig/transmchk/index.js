import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { language } from '@/utils/language';
import { Keyword, Encryption, Compress, Picture, Format, Seal, FileHash, FileHashWidth } from './components'
import './transmchk.less'
const { TabPane } = Tabs;

export default () => {
  return (<>
    <Tabs type="card" size="Large">
      <TabPane tab={language('dmcoconfig.transmchk.keywordteringrules')} key='1'>
        <Keyword />
      </TabPane>
      <TabPane tab={language('dmcoconfig.transmchk.filehashesfilerules')} key='7'>
        <FileHash />
      </TabPane>
    </Tabs>
  </>)
}