import React from 'react'
import Tab from '@/components/Tabs'
import Equipment from './equipment'
import Application from './application'
import Account from './account'
import { language } from '@/utils/language'
export default function Attacker() {
  const titles = [language('netaudit.activeobj.equipmentactivity'), language('netaudit.activeobj.applicationactivity'), language('netaudit.activeobj.accountactivity'),]
  const keys = ['Equipment', 'Application', 'Account']
  const contents = [<Equipment />, <Application />, <Account />]
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