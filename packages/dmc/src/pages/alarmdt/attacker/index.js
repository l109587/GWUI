import React, { useRef, useState, useEffect } from 'react'
import { Tabs } from 'antd'
import Trojan from './trojan'
import Malice from './malice'
import Permeate from './permeate'
import Abnormal from './abnormal'
import Blacklist from './blacklist'
import { language } from '@/utils/language'
const { TabPane } = Tabs
export default function Attacker(props) {
  const [checkedTabKey, setCheckedTabKey] = useState('1')

  const onChange = (key) => {
    setCheckedTabKey(key)
  }

  useEffect(() => {
    setCheckedTabKey(
      props?.location?.state?.key ? props?.location?.state?.key : '1'
    )
  }, [props?.location?.state?.key])

  return (
    <div>
      <Tabs
        type="card"
        onChange={onChange}
        activeKey={checkedTabKey}
      >
        <TabPane tab={language('alarmdt.trojanattack')} key={'1'}>
          <Trojan unit={props?.location?.state?.time} />
        </TabPane>
        <TabPane tab={language('alarmdt.infiltrationattack')} key={'2'}>
          <Permeate unit={props?.location?.state?.time} />
        </TabPane>
        <TabPane tab={language('alarmdt.maliciousfiles')} key={'3'}>
          <Malice unit={props?.location?.state?.time} />
        </TabPane>
        <TabPane tab={language('alarmdt.abnormalbehavior')} key={'4'}>
          <Abnormal unit={props?.location?.state?.time} />
        </TabPane>
        <TabPane tab={language('alarmdt.blicklistpage')} key={'5'}>
          <Blacklist unit={props?.location?.state?.time} />
        </TabPane>
      </Tabs>
    </div>
  )
}
