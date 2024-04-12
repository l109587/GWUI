import React, { useEffect, useState } from 'react'
import { ProCard, ProTable } from '@ant-design/pro-components'
import { Button, Divider, Skeleton, message } from 'antd'
import { DualAxes } from '@ant-design/plots'
import { LeftOutlined } from '@ant-design/icons'
import { post, postAsync } from '@/services/https'
import { language } from '@/utils/language'

const PolicyStatisticCard = (props) => {
  const [isTable, setIsTable] = useState(false)
  const [warnData, setWarnData] = useState([])
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    if (!isTable) {
      showDevWarn()
    }
  }, [isTable])

  const showDevWarn = () => {
    post('/cfg.php?controller=sysHeader&action=showDevWarn').then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setWarnData(res.data)
    })
  }

  const showDetails = (type) => {
    post('/cfg.php?controller=sysHeader&action=showDevWarn', {
      type: type,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setDataSource(res.data)
    })
  }

  const config = {
    data: [warnData, warnData],
    xField: 'name',
    yField: ['dev', 'warn'],
    yAxis: {
      warn: {
        grid: {
          line: {
            type: 'line',
            style: {
              lineDash: [3, 5],
            },
          },
        },
        label: false,
      },
      dev: {
        grid: {
          line: {
            type: 'line',
            style: {
              lineDash: [3, 5],
            },
          },
        },
      },
    },
    geometryOptions: [
      {
        geometry: 'line',
        color: '#5087EC',
        point: {
          size: 2,
          style: {
            fill: 'white',
            stroke: '#5087EC',
            lineWidth: 2,
          },
        },
        lineStyle: {
          lineWidth: 2,
        },
      },
      {
        geometry: 'column',
        color: '#EE752F',
        columnStyle: {
          cursor: 'pointer',
        },
        maxColumnWidth: 25,
      },
    ],
    meta: {
      warn: {
        alias: language('dmc.index.alarm'),
      },
      dev: {
        alias: language('dmc.index.dev'),
      },
    },
    legend: {
      position: 'top',
    },
  }

  return (
    <ProCard
      ghost
      colSpan={8}
      title={<div style={{ height: 24 }}></div>}
      extra={
        isTable ? (
          <Button
            size="small"
            type="text"
            onClick={() => {
              setIsTable(!isTable)
            }}
            icon={<LeftOutlined style={{ color: '#1890ff' }} />}
          >
            {language('dmc.index.goback')}
          </Button>
        ) : (
          <></>
        )
      }
    >
      <Divider />
      {warnData.length == 0 ? (
        <Skeleton.Input
          style={{
            height: props.height - 30,
            paddingBottom: 10,
            width: '100%',
          }}
        />
      ) : (
        <div style={{ height: props.height, paddingBottom: 10 }}>
          {isTable ? (
            <ProTable
              size="small"
              columns={[
                {
                  dataIndex: 'devID',
                  title: language('dmc.index.devID'),
                  align: 'left',
                  width: '40%',
                },
                {
                  dataIndex: 'module',
                  title: language('dmc.index.module'),
                  align: 'left',
                  width: '40%',
                },
                {
                  dataIndex: 'count',
                  title: language('dmc.index.alarmnum'),
                  align: 'center',
                  width: '20%',
                },
              ]}
              rowKey="index"
              className="autoTable"
              bordered={false}
              cardBordered={false}
              scroll={{ y: props.height - 60 }}
              dataSource={dataSource}
              search={false}
              options={false}
              pagination={false}
            />
          ) : (
            <DualAxes
              {...config}
              style={{
                minHeight: props.height - 20,
                height: props.height - 20,
              }}
              onReady={(plot) => {
                plot.on('click', (e) => {
                  if (e.data?.shape && e.data.shape === 'rect') {
                    showDetails(e.data.data.type)
                    setIsTable(!isTable)
                  }
                })
              }}
            />
          )}
        </div>
      )}
    </ProCard>
  )
}

export default PolicyStatisticCard
