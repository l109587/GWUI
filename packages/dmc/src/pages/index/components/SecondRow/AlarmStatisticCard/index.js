import React, { useEffect, useState } from 'react'
import { ProCard, ProTable } from '@ant-design/pro-components'
import { Divider, Progress, Select, Button, message } from 'antd'
import AlarmStatisTitle from '@/assets/dmc/indexIcon/AlarmStatisTitle.svg'
import { LeftOutlined } from '@ant-design/icons'
import './index.less'
import { post } from '@/services/https'
import { history } from 'umi'
import moment from 'moment'
import { language } from '@/utils/language'

const AlarmStatisticCard = (props) => {
  const [showDetails, setShowDetails] = useState(false)
  const [typeData, setTypeData] = useState([])
  const [detailData, setDetailData] = useState([])
  // const [selectTime, setSelectTme] = useState("month");
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [filters, setFilters] = useState('month')

  const onRowClick = (record) => {
    if (record.warn > 0) {
      setShowDetails(!showDetails)
      showDetail(record)
    }
  }

  useEffect(() => {
    if (!showDetails) {
      getTypeData()
    }
  }, [showDetails])

  const getTypeData = (selectTime = 'month') => {
    setLoading(true)
    post('/cfg.php?controller=sysHeader&action=showWarnCnt', {
      time: selectTime,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        setLoading(false)
        return false
      }
      setLoading(false)
      setTypeData(res)
    })
  }

  const showDetail = (record) => {
    setDetailLoading(true)
    post('/cfg.php?controller=sysHeader&action=showWarnCnt', {
      type: record.type,
      time: filters,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        setDetailLoading(false)
        return false
      }
      setDetailLoading(false)
      setDetailData(res.data)
    })
  }

  return (
    <ProCard
      ghost
      colSpan={8}
      title={
        <div className="titleDiv">
          <div className="imgDiv">
            <img src={AlarmStatisTitle} />
          </div>
          <span>{typeData.title}</span>
        </div>
      }
      extra={
        showDetails ? (
          <Button
            size="small"
            type="text"
            onClick={() => {
              setShowDetails(!showDetails)
            }}
            icon={<LeftOutlined style={{ color: '#1890ff' }} />}
          >
            {language('dmc.index.goback')}
          </Button>
        ) : (
          <Select
            size="small"
            defaultValue={'month'}
            options={[
              { label: language('dmc.index.time.month'), value: 'month' },
              { label: language('dmc.index.time.week'), value: 'week' },
              { label: language('dmc.index.time.day'), value: 'day' },
            ]}
            onChange={(e) => {
              getTypeData(e)
              setFilters(e)
            }}
          />
        )
      }
    >
      <Divider />
      <div style={{ height: props.height }}>
        {showDetails ? (
          <ProTable
            size="small"
            className="autoTable"
            columns={[
              {
                dataIndex: 'name',
                title: language('dmc.index.policy'),
                align: 'left',
                width: '60%',
                ellipsis: true,
              },
              {
                dataIndex: 'value',
                title: language('dmc.index.alarmnum'),
                align: 'center',
                width: '20%',
                ellipsis: true,
                render: (text, record) => {
                  return (
                    <Button
                      size="small"
                      type="link"
                      disabled={record.value > 0 ? false : true}
                      onClick={() => {
                        if (record.name == language('dmc.index.transfer')) {
                          history.push({
                            pathname: '/alarmdt/transfer',
                            state: { time: filters },
                          })
                        } else if (
                          record.name == language('dmc.index.filesift')
                        ) {
                          history.push({
                            pathname: '/alarmdt/filesift',
                            state: { time: filters },
                          })
                        } else if (
                          record.name == language('dmc.index.attacker.attack')
                        ) {
                          history.push({
                            pathname: '/alarmdt/attacker',
                            state: { key: '1', time: filters },
                          })
                        } else if (
                          record.name == language('dmc.index.attacker.penetra')
                        ) {
                          history.push({
                            pathname: '/alarmdt/attacker',
                            state: { key: '2', time: filters },
                          })
                        } else if (
                          record.name ==
                          language('dmc.index.attacker.malicious')
                        ) {
                          history.push({
                            pathname: '/alarmdt/attacker',
                            state: { key: '3', time: filters },
                          })
                        } else if (
                          record.name == language('dmc.index.attacker.abnormal')
                        ) {
                          history.push({
                            pathname: '/alarmdt/attacker',
                            state: { key: '4', time: filters },
                          })
                        } else if (
                          record.name ==
                          language('dmc.index.attacker.blacklist')
                        ) {
                          history.push({
                            pathname: '/alarmdt/attacker',
                            state: { key: '5', time: filters },
                          })
                        } else if (
                          record.name == language('dmc.index.targetadt.ipaduit')
                        ) {
                          history.push({
                            pathname: '/alarmdt/targetadt',
                            state: { key: '1' },
                          })
                        } else if (
                          record.name ==
                          language('dmc.index.targetadt.domainname')
                        ) {
                          history.push({
                            pathname: '/alarmdt/targetadt',
                            state: { key: '2' },
                          })
                        }
                      }}
                    >
                      {record.value}
                    </Button>
                  )
                },
              },
            ]}
            loading={detailLoading}
            rowKey="index"
            bordered={false}
            cardBordered={false}
            scroll={{ y: props.height - 60 }}
            dataSource={detailData}
            search={false}
            options={false}
            pagination={false}
          />
        ) : (
          <ProTable
            size="large"
            columns={[
              {
                dataIndex: 'name',
                title: language('dmc.index.alarmname'),
                align: 'left',
                ellipsis: true,
                width: '40%',
              },
              {
                dataIndex: 'rate',
                title: language('dmc.index.rate'),
                align: 'left',
                width: '40%',
                ellipsis: true,
                render: (text, record) => {
                  return (
                    <div className="percentDiv">
                      <Progress
                        percent={record.rate}
                        format={(percent) => `${percent + '%'}`}
                        strokeColor="#1890ff"
                      />
                    </div>
                  )
                },
              },
              {
                dataIndex: 'warn',
                title: language('dmc.index.alarmnum'),
                align: 'center',
                width: '20%',
                ellipsis: true,
                render: (text, record) => {
                  return <div style={{ color: '#5087EC' }}>{record.warn}</div>
                },
              },
            ]}
            rowKey="index"
            style={{ marginRight: -10 }}
            rowClassName={(record) =>
              record.warn > 0 ? 'clickRow' : 'disableRow'
            }
            loading={loading}
            onRow={(e) => {
              return {
                onClick: () => {
                  onRowClick(e)
                },
              }
            }}
            bordered={false}
            scroll={{ y: props.height - 60 }}
            dataSource={typeData.data}
            search={false}
            options={false}
            pagination={false}
          />
        )}
      </div>
    </ProCard>
  )
}

export default AlarmStatisticCard
