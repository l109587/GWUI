
import Tab from '@/components/Tabs'
import IpAudit from './ipaudit'
import DomAudit from './domaudit'
import { language } from '@/utils/language'

export default function Attacker() {
 
  const titles = [language('alarmdt.ipaudit'),language('alarmdt.domaudit')]
  const keys = [language('alarmdt.ipaudit'),language('alarmdt.domaudit')]
  const contents = [<IpAudit/>,<DomAudit/>]
  return (
    <>
      <Tab
        titles={titles}
        keys={keys}
        contents={contents}
      />
    </>
  )
}
