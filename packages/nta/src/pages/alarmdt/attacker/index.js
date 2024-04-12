
import Tab from '@/components/Tabs'
import Trojan from './trojan'
import Malice from './malice'
import Permeate from './permeate'
import Abnormal from './abnormal'
import Blacklist from './blacklist'
import { language } from '@/utils/language'

export default function Attacker() {
 
  const titles = [language('alarmdt.trojanattack'),language('alarmdt.infiltrationattack'),language('alarmdt.maliciousfiles'),language('alarmdt.abnormalbehavior'),language('alarmdt.blicklistpage')]
  const keys = [language('alarmdt.trojanattack'),language('alarmdt.infiltrationattack'),language('alarmdt.maliciousfiles'),language('alarmdt.abnormalbehavior'),language('alarmdt.blicklistpage')]
  const contents = [<Trojan/>,<Permeate/>,<Malice/>,<Abnormal/>,<Blacklist/>]
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
