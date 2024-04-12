import React from 'react'
import Tab from '@/components/Tabs'
import Webvisit from './webvisit'
import Domainreq from './domainreq'
import Email from './email'
import Filetrans from './filetrans'
import Sslvisit from './sslvisit'
import Database from './database'
import LoginBehavior from './loginbehavior'
import ControlBehavior from './controlbehavior'
import { language } from '@/utils/language'

export default function Attacker() {
  const titles = [language('netaudit.webvisit.tabname'),language('netaudit.domainreq.tabname'), language('netaudit.email.tabname'), language('netaudit.filetrans.tabname'), language('netaudit.sslvisit.tabname'), language('netaudit.database.tabname'), language('netaudit.loginbehavior.tabname'), language('netaudit.controlbehavior.tabname'),]
  const keys = ['webvisit','domainreq','email','filetrans','sslvisit' , 'database', 'loginbehavior', 'controlbehavior']
  const contents = [<Webvisit/>,<Domainreq/>,<Email/>,<Filetrans/>,<Sslvisit/>,<Database/>,<LoginBehavior/>,<ControlBehavior/>]
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