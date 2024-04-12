import React, { useEffect, useState } from 'react'
import { ProCard } from '@ant-design/pro-components'
import { Divider, Skeleton, message } from 'antd'
import PoliStatisTitle from '@/assets/dmc/indexIcon/PoliStatisTitle.svg'
import {
  Chart,
  Interval,
  Tooltip,
  Legend,
  View,
  Axis,
  Coordinate,
} from 'bizcharts'
import { DataView } from '@antv/data-set'
import { post } from '@/services/https'
import { language } from '@/utils/language'

const NestPie = (props) => {
  const [pieData, setPieData] = useState([])
  const [pieTitle, setPieTitle] = useState('')
  const [total, setTotal] = useState(0)
  useEffect(() => {
    getNestPieData()
  }, [])
  const getNestPieData = () => {
    post('/cfg.php?controller=sysHeader&action=showPolicyCnt').then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      res.data.map((item) => {
        item.name = item.name + '\xa0' + item.value
        // item.name = item.name;
      })
      setPieData(res.data)
      setPieTitle(res.title)
      setTotal(res.total)
    })
  }
  const dv = new DataView()
  dv.source(pieData).transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    as: 'percent',
  })
  const newdv = new DataView()
  newdv.source(pieData).transform({
    type: 'percent',
    field: 'value',
    dimension: 'name',
    as: 'percent',
  })
  return (
    <ProCard
      ghost
      title={
        <div className="titleDiv">
          <div className="imgDiv">
            <img src={PoliStatisTitle} />
          </div>
          <span>{pieTitle}</span>
        </div>
      }
      extra={
        <div>
          {language('dmc.index.policyToal')} {total}
        </div>
      }
    >
      <Divider />

      <div style={{ height: props.height }} id="container">
        {pieData.length == 0 ? (
          <Skeleton.Avatar
            style={{ height: props.height, width: props.height }}
          />
        ) : (
          <>
            <Chart
              height={props.height}
              data={dv.rows}
              autoFit
              scale={{
                percent: {
                  formatter: (val, key) => {
                    val = (val * 100).toFixed(2) + '%'
                    return val
                  },
                },
              }}
              onIntervalClick={(e) => {
                const states = e.target.cfg.element.getStates()
              }}
            >
              <Coordinate type="theta" radius={0.5} />
              <Axis visible={false} />
              <Legend visible={false} />
              <Tooltip showTitle={false} />
              <Interval
                position="percent"
                adjust="stack"
                color="type"
                element-single-selected
                style={{
                  lineWidth: 1,
                  stroke: '#fff',
                }}
                label={[
                  'type',
                  (item) => {
                    return {
                      offset: -5,
                      content: (data) => {
                        if (item.length * 12 > 48) {
                          return item.substr(0, 4) + '...'
                        } else {
                          return item
                        }
                      },
                    }
                  },
                ]}
              />
              <View data={newdv.rows}>
                <Coordinate
                  type="theta"
                  radius={0.75}
                  innerRadius={0.5 / 0.75}
                />
                <Interval
                  position="percent"
                  adjust="stack"
                  color={[
                    'name',
                    [
                      '#BAE7FF',
                      '#7FC9FE',
                      '#71E3E3',
                      '#ABF5F5',
                      '#8EE0A1',
                      '#BAF5C4',
                    ],
                  ]}
                  element-single-selected
                  style={{
                    lineWidth: 1,
                    stroke: '#fff',
                  }}
                  label="name"
                />
              </View>
            </Chart>
          </>
        )}
      </div>
    </ProCard>
  )
}

export default NestPie
