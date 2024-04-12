import React, { useEffect, useState } from 'react'
import DevState from '@/assets/dmc/indexIcon/DevState.svg'
import { ProCard } from '@ant-design/pro-components'
import { Divider, Space, message, Skeleton } from 'antd'
import { Column } from '@ant-design/plots'
import { post } from '@/services/https'
import { LoadingOutlined } from '@ant-design/icons'
import { language } from '@/utils/language'

const DevStateCard = () => {
  const [stateData, setStateData] = useState([])
  const [stateTitle, setStateTitle] = useState('')

  useEffect(() => {
    getDevState()
  }, [])

  const getDevState = () => {
    post('/cfg.php?controller=sysHeader&action=showDev').then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setStateTitle(res.title)
      setStateData(res.data)
    })
  }

  const config = {
    appendPadding: [12, 12, 0, 12],
    data: stateData,
    xField: 'type',
    yField: 'value',
    seriesField: 'name',
    isGroup: true,
    color: ['#2B6AFD', '#6DC8EC', '#5BD9A7'],
    animation: false,
    legend: false,
    minColumnWidth: 20,
    maxColumnWidth: 35,
    doogePadding: 0,
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: '#F2F2F2',
          },
        },
      },
    },
  }

  return (
    <ProCard
      ghost
      className="statisCard"
      title={
        <Space>
          <div className="devStateTitle headerBg">
            <img src={DevState} style={{ marginBottom: 3 }} />
          </div>
          <span>{stateTitle}</span>
        </Space>
      }
      extra={
        <Space>
          <div span={8} className="legendDiv">
            <div className="onlineColor" />
            <div>{language('dmc.index.online')}</div>
          </div>
          <div span={8} className="legendDiv">
            <div className="regisColor" />
            <div>{language('dmc.index.regise')}</div>
          </div>
          <div span={8} className="legendDiv">
            <div className="authColor" />
            <div>{language('dmc.index.auth')}</div>
          </div>
        </Space>
      }
    >
      <Divider />
      <div className="cascCardBody">
        {stateData.length < 1 ? (
          <Skeleton.Input
            style={{ height: 130, minHeight: 130, width: '100%' }}
          />
        ) : (
          <Column {...config} style={{ height: 130, minHeight: 130 }} />
        )}
      </div>
    </ProCard>
  )
}

export default DevStateCard
