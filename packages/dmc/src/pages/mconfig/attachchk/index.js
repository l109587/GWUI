import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { language } from '@/utils/language';
import './attachchk.less'
import { Troation, Vunabiltion, Malapgtion, FileHashWhiteRules, AccountBlackList, IpBlackList, DomainBlackList, UrlBlackList, IpWhiteRules  } from './components'
const { TabPane } = Tabs;

export default () => {

  return (<div className='attachchikbox'>
    <Tabs defaultActiveKey="1" type="card" size="Large">
      <TabPane tab={language('dmcoconfig.attachck.troation')} key='1'>
        <Troation />
      </TabPane>
      <TabPane tab={language('dmcoconfig.attachck.vunabiltion')} key='2'>
        <Vunabiltion />
      </TabPane>
      <TabPane tab={language('dmcoconfig.attachck.malapgtion')} key='3'>
        <Malapgtion />
      </TabPane>
      <TabPane tab={language('dmcoconfig.attachck.blacklistrules')} key='5'>
        <div className='blackbox'>
          <Tabs defaultActiveKey="a1" size="Large" tabPosition='left'>
            <TabPane tab={language('dmcoconfig.attachck.blacklist.ipblacklist')} key='a1'>
              <IpBlackList />
            </TabPane>
            <TabPane tab={language('dmcoconfig.attachck.blacklist.domainblacklist')} key='a2'>
              <DomainBlackList />
            </TabPane>
            <TabPane tab={language('dmcoconfig.attachck.blacklist.urlblacklist')} key='a3'>
              <UrlBlackList />
            </TabPane>
            <TabPane tab={language('dmcoconfig.attachck.blacklist.accountblacklist')} key='a4'>
              <AccountBlackList />
            </TabPane>
          </Tabs>
        </div>
      </TabPane>
      <TabPane tab={language('dmcoconfig.attachack.whitelist.whitefilterrules')} key='6'>
      <div className='blackbox'>
          <Tabs defaultActiveKey="b1" size="Large" tabPosition='left'>
            <TabPane tab={language('dmcoconfig.attachack.whitelist.ipwhiterules')} key='b1'>
              <IpWhiteRules />
            </TabPane>
            <TabPane tab={language('dmcoconfig.attachack.whitelist.filehashwhiterules')} key='b2'>
              <FileHashWhiteRules />
            </TabPane>
          </Tabs>
        </div>
      </TabPane>
      {/* <TabPane tab={language('dmcoconfig.attachck.builtinrulestartstop')} key='7'>
        <BuiltRule />
      </TabPane> */}
    </Tabs>
  </div>)
}