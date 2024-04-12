import React from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { language } from '@/utils/language';
import { Target } from './components'
import './index.less'
const { TabPane } = Tabs;

export default () => {
  return (<>
    {/* <Tabs type="card" size="Large">
    <TabPane tab={language('dmcoconfig.targetidt.targetrecognition')} key='1'> */}
    <Target />
    {/* </TabPane>
    </Tabs> */}
  </>)
}