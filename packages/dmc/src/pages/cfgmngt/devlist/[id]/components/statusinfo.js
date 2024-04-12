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

  const { detailInfo, devTypeData } = props;

  //网卡状态
  const networkStatus = [
    {
      title: language('dmc.cfgmngt.devlist.networknumber'),
      dataIndex: 'interface_seq',
      width: 100,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.networkstatus'),
      dataIndex: 'interface_flag',
      width: 100,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.networkdescription'),
      dataIndex: 'interface_stat',
      width: 120,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.quantityflow'),
      dataIndex: 'interface_flow',
      width: 120,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.errormessagesnum'),
      dataIndex: 'interface_error',
      width: 120,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.packetslostnum'),
      dataIndex: 'interface_drop',
      width: 80,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.acquisitionduration'),
      dataIndex: 'duration_time',
      width: 130,
      ellipsis: true,
      align: 'left',
    },
  ];

  //异常状态
  const abnormalStatus = [
    {
      title: language('dmc.cfgmngt.devlist.exceptiontype'),
      dataIndex: 'event_type',
      width: 100,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.generationtime'),
      dataIndex: 'time',
      width: 130,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.alarmlevel'),
      dataIndex: 'risk',
      width: 100,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.exceptiondesc'),
      dataIndex: 'msg',
      width: 440,
      ellipsis: true,
      align: 'left',
    },
  ];

  //模块状态
  const modularStatus = [
    {
      title: language('dmc.cfgmngt.devlist.modulename'),
      dataIndex: 'name',
      width: 100,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.modulestatus'),
      dataIndex: 'status',
      width: 80,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.submodulename'),
      dataIndex: 'subname',
      width: 100,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.substate'),
      dataIndex: 'substatus',
      width: 80,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.notreporteddatanum'),
      dataIndex: 'record_delayednum',
      width: 130,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.notreportedfilenum'),
      dataIndex: 'file_delayednum',
      width: 130,
      ellipsis: true,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.policyversion'),
      dataIndex: 'version',
      width: 150,
      ellipsis: true,
      align: 'left',
    },
  ];

  //接入设备数量
  const device_num = [
    {
      title: '当前接入的检测器数量',
      dataIndex: 'jcq_num',
    },
    {
      title: '当前接入的管理系统数量',
      dataIndex: 'mc_num',
    },
  ]

  for (const key in device_num[0]) {
    device_num[0]['value'] = detailInfo?.device_num ? detailInfo?.device_num[key] ? detailInfo?.device_num[key] : '' : '';
  }

  //本级策略告警统计
  const local_policy = [
    {
      title: '由本级策略触发所接收到的告警数量',
      dataIndex: 'local_alarm_msg_count',
    },
    {
      title: '由本级策略触发所接收到的告警源文件数量',
      dataIndex: 'local_alarm_file_count',
    },
  ]

  for (const key in local_policy[0]) {
    local_policy[0]['value'] = detailInfo?.local_policy ? detailInfo?.local_policy[key] ? detailInfo?.local_policy[key] : '' : '';
  }

  //上级策略告警统计
  const super_policy = [
    {
      title: '由上级策略触发所接收到的告警数量',
      dataIndex: 'super_alarm_msg_count',
      width: 100,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '由上级策略触发所接收到的告警源文件数量',
      dataIndex: 'super_alarm_file_count',
      width: 100,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '本级管理系统当前上报给上级的告警数量',
      dataIndex: 'upload_alarm_msg_count',
      width: 100,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '本级管理系统当前上报给上级的告警源文件数量',
      dataIndex: 'upload_alarm_file_count',
      width: 100,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '本级管理系统当前从上级接收到的所有策略数量',
      dataIndex: 'total_pocliy_count',
      width: 100,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '本级管理系统当前从上级接收到的并成功解析的策略数量',
      dataIndex: 'success_pocliy_count',
      width: 100,
      ellipsis: true,
      align: 'left',
    },
  ]

  for (const key in super_policy[0]) {
    super_policy[0]['value'] = detailInfo?.super_policy ? detailInfo?.super_policy[key] ? detailInfo?.super_policy[key] : '' : '';
  }

  //自监管
  const zjgColumn = [
    {
      title: '自监管接入监测器数量',
      dataIndex: 'detector_num',
    },
    {
      title: '自监管本级策略产生的告警数量',
      dataIndex: 'local_warning_num',
    },
    {
      title: '自监管本级策略产生的文件数量',
      dataIndex: 'local_file_num',
    },
    {
      title: '自监管接入终端组件总数',
      dataIndex: 'terminal_total_num',
    },
    {
      title: '自监管接入终端组件在线数量',
      dataIndex: 'terminal_online_num',
    },
  ]

  for (const key in zjgColumn[0]) {
    zjgColumn[0]['value'] = detailInfo ? detailInfo[key] ? detailInfo[key] : '' : '';
  }

  const publicColumn = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 280,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '内容',
      dataIndex: 'value',
      width: 300,
      ellipsis: true,
      align: 'left',
    },
  ]

  const zpublicColumn = [
    {
      title: '类型',
      dataIndex: 'title',
      width: 300,
      ellipsis: true,
      align: 'left',
    },
    {
      title: '数量',
      dataIndex: 'value',
      width: 300,
      ellipsis: true,
      align: 'left',
    },
  ]

  return (
    <>
      <div className='dmcbasicinfo'>
        <ProCard ghost direction='column' >
          <ProCard ghost title={language('dmc.cfgmngt.devlist.statusinfo')}>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.acquisitiontime')}>{detailInfo.system_time ? detailInfo.system_time : ''} </ProDescriptions.Item>
              {detailInfo.type == 3 ?
              <ProDescriptions.Item label={"集群"}>{detailInfo.cluster_flag ? '启用' : '禁用'}</ProDescriptions.Item>
              : 
              <ProDescriptions.Item label={'堆叠数'}>{detailInfo.did ? detailInfo.did : ' '}</ProDescriptions.Item>
              }
              </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.momoryusage')}>{detailInfo.mem_status ? detailInfo.mem_status : ''}</ProDescriptions.Item>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.diskfreespace')}>{detailInfo.disk_status ? detailInfo.disk_status : ' '}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.cpuusage')}>{detailInfo.cpu_status ? detailInfo.cpu_status : ''}</ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
          <Divider className='dmcdevdivider' />
          <ProCard ghost title={language('dmc.cfgmngt.devlist.businessstatus')}>
            <ProDescriptions column={2}>
              <ProDescriptions.Item name='applicant' label={language('dmc.cfgmngt.devlist.acquisitiontime')}>{detailInfo.business_time ? detailInfo.business_time : ''}</ProDescriptions.Item>
              <ProDescriptions.Item label={language('cfgmngt.devlist.devtype')}>{detailInfo.type ? devTypeData.map((item) => {
                if (item.value == detailInfo.type) {
                  return item.label;
                }
              }) : ''}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item name='applicant' label={language('dmc.cfgmngt.devlist.runtime')}>{detailInfo.uptime ? detailInfo.uptime : ''}</ProDescriptions.Item>
              <ProDescriptions.Item name='applicant' label={language('dmc.cfgmngt.devlist.softwareversion')}>{detailInfo.soft_version ? detailInfo.soft_version : ''}</ProDescriptions.Item>
            </ProDescriptions>
            <div className='deeditlabel'>
              <ProDescriptions column={1}>
                <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.networkstatus')}>
                  <div style={{ width: '240px' }}>
                    <EditableProTable
                      rowKey="id"
                      size="small"
                      toolBarRender={false}
                      columns={networkStatus}
                      value={detailInfo.interface_status ? detailInfo.interface_status : []}
                      className='dmcdeveditable'
                      recordCreatorProps={false}
                      editable={false} />
                  </div>
                </ProDescriptions.Item>
              </ProDescriptions>
              <ProDescriptions column={1}>
                <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.abnormalstate')}>
                  <div style={{ width: '240px' }}>
                    <EditableProTable
                      rowKey="id"
                      size="small"
                      toolBarRender={false}
                      columns={abnormalStatus}
                      value={detailInfo.suspected ? detailInfo.suspected : []}
                      className='dmcdeveditable'
                      recordCreatorProps={false}
                      editable={false} />
                  </div>
                </ProDescriptions.Item>
              </ProDescriptions>
              {detailInfo.type == 1 ?
                <ProDescriptions column={1}>
                  <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.modulestatus')}>
                    <div style={{ width: '240px' }}>
                      <EditableProTable
                        rowKey="id"
                        size="small"
                        toolBarRender={false}
                        columns={modularStatus}
                        value={detailInfo.module_status ? detailInfo.module_status : []}
                        className='dmcdeveditable'
                        recordCreatorProps={false}
                        editable={false} />
                    </div>
                  </ProDescriptions.Item>
                </ProDescriptions>
                : <></>}
              {detailInfo.type == 3 ?
                <>
                  <ProDescriptions column={1}>
                    <ProDescriptions.Item label={'接入设备数量'}>
                      <div style={{ width: '240px' }}>
                        <EditableProTable
                          rowKey="id"
                          size="small"
                          toolBarRender={false}
                          columns={publicColumn}
                          value={device_num}
                          className='dmcdeveditable'
                          recordCreatorProps={false}
                          editable={false} />
                      </div>
                    </ProDescriptions.Item>
                  </ProDescriptions>
                  <ProDescriptions column={1}>
                    <ProDescriptions.Item label={'本级策略告警统计'}>
                      <div style={{ width: '240px' }}>
                        <EditableProTable
                          rowKey="id"
                          size="small"
                          toolBarRender={false}
                          columns={publicColumn}
                          value={local_policy}
                          className='dmcdeveditable'
                          recordCreatorProps={false}
                          editable={false} />
                      </div>
                    </ProDescriptions.Item>
                  </ProDescriptions>
                  <ProDescriptions column={1}>
                    <ProDescriptions.Item label={'上级策略告警统计'}>
                      <div style={{ width: '240px' }}>
                        <EditableProTable
                          rowKey="id"
                          size="small"
                          toolBarRender={false}
                          columns={publicColumn}
                          value={super_policy}
                          className='dmcdeveditable'
                          recordCreatorProps={false}
                          editable={false} />
                      </div>
                    </ProDescriptions.Item>
                  </ProDescriptions>
                </> : <></>}
              {detailInfo.type == 2 ?
                <ProDescriptions column={1}>
                  <ProDescriptions.Item label={'自监管'}>
                    <div style={{ width: '240px' }}>
                      <EditableProTable
                        rowKey="id"
                        size="small"
                        toolBarRender={false}
                        columns={zpublicColumn}
                        value={zjgColumn}
                        className='dmcdeveditable'
                        recordCreatorProps={false}
                        editable={false} />
                    </div>
                  </ProDescriptions.Item>
                </ProDescriptions>
                : <></>}
            </div>
          </ProCard>
        </ProCard>
      </div>
    </>
  )

}

// data: [{value: "1", label: "监测器"}, {value: "2", label: "自监管"}, {value: "3", label: "管理系统"},…]
// 0: {value: "1", label: "监测器"}
// 1: {value: "2", label: "自监管"}
// 2: {value: "3", label: "管理系统"}
// 3: {value: "4", label: "监测器集群管理"}
// 4: {value: "5", label: "终端组件"}
// success: true