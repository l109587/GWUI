import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { language } from '@/utils/language';
import { AuditdomainWhiteRules, Interconnectivity, ApplicationBehavior, AbnormalBehavior, AuditipWhiteRules } from './components'
import './behavioradt.less'
const { TabPane } = Tabs;

export default () => {
  const [activeKey, setActiveKey] = useState('b7');
  return (<div className='mbehavioradtbox'>
    <Tabs type="card" size="Large"
      activeKey={activeKey} destroyInactiveTabPane={true} onChange={(key) => {
        setActiveKey(key);
      }}
    >
      {/* 通联关系审计结果上传配置 */}
      <TabPane tab={language('dmcoconfig.behavioradt.configauditresultsforconnectivity')} key='b7'>
        <Interconnectivity />
      </TabPane>
      {/* 应用行为审计结果上传配置 */}
      <TabPane tab={language('dmcoconfig.behavioradt.configapplicationbechaviorauditresults')} key='b8'>
        <ApplicationBehavior />
      </TabPane>
      {/* 审计白名单规则 */}
      <TabPane tab={language('dmcoconfig.behavioradt.auditwhiterules')} key='5'>
        <div className='bewhitebox'>
          <Tabs defaultActiveKey="b1" size="Large" tabPosition='left'>
            <TabPane tab={language('dmcoconfig.behavioradt.auditipwhiterules')} key='b1'>
              <AuditipWhiteRules />
            </TabPane>
            <TabPane tab={language('dmcoconfig.behavioradt.auditdomainwhiterules')} key='b2'>
              <AuditdomainWhiteRules />
            </TabPane>
                  {/* 应用行为审计结果上传配置 */}
            {/* <TabPane tab={language('dmcoconfig.behavioradt.abnormalbehavior')} key='b9'>
              <AbnormalBehavior />
            </TabPane> */}
          </Tabs>
        </div>
      </TabPane>
    </Tabs>
  </div>)
}