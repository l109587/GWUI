import { Tabs } from 'antd'
import EventCfg from './eventcfg'
import EmailAlarm from './emailAlarm'
import MsgAlarm from './msgAlarm'
import styles from './index.less'
import { language } from '@/utils/language'

export default function Alarmcfg() {
  return (
    <>
      <div className={styles.tabs}>
        <Tabs defaultActiveKey="1" type="card" size="Large">
          <Tabs.TabPane tab={language('project.evtlog.alarmcfg.evtcfg')} key="1">
            <EventCfg />
          </Tabs.TabPane>
          <Tabs.TabPane tab={language('project.evtlog.alarmcfg.emailalarm')} key="2">
            <EmailAlarm />
          </Tabs.TabPane>
          <Tabs.TabPane tab={language('project.evtlog.alarmcfg.msgalarm')} key="3">
            <MsgAlarm />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
}
