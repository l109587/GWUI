import React, { useRef, useState, useEffect } from 'react'
import { Tabs } from 'antd'
import IpAudit from './ipaudit'
import DomAudit from './domaudit'
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
    <>
      <Tabs type="card" onChange={onChange} activeKey={checkedTabKey}>
      <TabPane tab={language('alarmdt.ipaudit')} key={'1'}>
        <IpAudit unit={props?.location?.state?.time} />
      </TabPane>
      <TabPane tab={language('alarmdt.domaudit')} key={'2'}>
        <DomAudit unit={props?.location?.state?.time} />
      </TabPane>
      </Tabs>
    </>
  )
}
