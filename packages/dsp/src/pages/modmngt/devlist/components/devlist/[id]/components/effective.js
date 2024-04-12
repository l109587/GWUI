import React, { useRef, useState, useEffect } from 'react';
import { Divider, Input, Tabs } from 'antd';
import { ProCard, ProDescriptions, EditableProTable } from '@ant-design/pro-components';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './basicinfo.less';

let H = document.body.clientHeight - 105
var clientHeight = H
export default (props) => {

  const { detailInfo } = props;
  const effectPolicyColumn = [
    {
      title: '时间',
      dataIndex: 'time',
      width: 150,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '来源',
      dataIndex: 'devid',
      width: 120,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '命令ID ',
      dataIndex: 'cmdid',
      width: 120,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '策略状态',
      dataIndex: 'policy_status',
      ellipsis: true,
      align: 'left',
    },
  ]

  return (
    <>
      <div className='effective'>
        <ProCard ghost direction='column' >
          <ProCard ghost title={'策略信息'}>
          <div className='seeapiinfobox ' style={{ width: '735px' }}>
              <EditableProTable
                rowKey="id"
                size="small"
                toolBarRender={false}
                columns={effectPolicyColumn}
                value={detailInfo.effect_policy && detailInfo.effect_policy.length >= 1 ? detailInfo.effect_policy : []}
                className='dmcdeveditable'
                recordCreatorProps={false} editable={false} />
            </div>
          </ProCard>
        </ProCard>
      </div>
    </>
  )

}