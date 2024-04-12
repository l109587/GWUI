import React, { useEffect, useState } from 'react'
import DevStatis from '@/assets/dmc/indexIcon/DevStatis.svg'
import { ProCard } from '@ant-design/pro-components'
import { Divider, Skeleton, Space, message } from 'antd'
import { Bar } from '@ant-design/plots'
import './index.less'
import { useSelector } from 'umi'
import { post, postAsync } from '@/services/https'
import { language } from '@/utils/language'

const DevStatisticCard = () => {
  let clientWidth = document.body.clientWidth - 262
  let cardWidth = clientWidth / 3
  const [typeData, setTypeData] = useState([])
  const [faData, setFaData] = useState([])
  const [zoneData, setZoneData] = useState([])
  const [statisTitle, setStatisTitle] = useState('')
  const [statisData, setStatisData] = useState({})
  const [typePadding, setTypePadding] = useState(0)
  const [faPadding, setFaPadding] = useState(0)
  const [zonePadding, setZonePadding] = useState(0)
  useEffect(() => {
    showStatistic()
  }, [])

  const showStatistic = () => {
    post('/cfg.php?controller=sysHeader&action=showDevCnt').then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setStatisData(res)
      setTypeData(res.type)
      setFaData(res.factory)
      setZoneData(res.zone)
      setStatisTitle(res.title)
      let typeArr = []
      res.type.map((item) => {
        typeArr.push(item.name.length)
      })
      let typeMax = Math.max.apply(null, typeArr)
      let faArr = []
      res.factory.map((item) => {
        faArr.push(item.name.length)
      })
      let faMax = Math.max.apply(null, faArr)
      let zoneArr = []
      res.zone.map((item) => {
        zoneArr.push(item.name?.length)
      })
      let zoneMax = Math.max.apply(null, zoneArr)
      let arr = [typeMax, faMax, zoneMax]
      let max = Math.max.apply(null, arr)
      let min = Math.min.apply(null, arr)
      let maxKey = ''
      let minKey = ''
      if (max === typeMax) {
        maxKey = 'type'
      } else if (max === faMax) {
        maxKey = 'fa'
      } else if (max === zoneMax) {
        maxKey = 'zone'
      }

      if (min === typeMax) {
        minKey = 'type'
      } else if (min === faMax) {
        minKey = 'fa'
      } else if (min === zoneMax) {
        minKey = 'zone'
      }
      let medianKey = ''
      if (maxKey === 'type' && minKey === 'zone') {
        medianKey = 'fa'
      } else if (maxKey === 'type' && minKey === 'fa') {
        medianKey = 'zone'
      } else if (maxKey === 'fa' && minKey === 'type') {
        medianKey = 'zone'
      } else if (maxKey === 'fa' && minKey === 'zone') {
        medianKey = 'type'
      } else if (maxKey === 'zone' && minKey === 'type') {
        medianKey = 'fa'
      } else if (maxKey === 'zone' && minKey === 'fa') {
        medianKey = 'type'
      }
      let num = max - min // 2 * 13
      let maxMnm
      let medianNum
      if (maxKey === 'type' && minKey === 'fa' && medianKey === 'zone') {
        maxMnm = typeMax - faMax
        medianNum = typeMax - zoneMax
        setTypePadding(0)
        setFaPadding(maxMnm * 12)
        setZonePadding(medianNum * 12)
      } else if (maxKey === 'type' && minKey === 'zone' && medianKey === 'fa') {
        maxMnm = typeMax - zoneMax
        medianNum = typeMax - faMax
        setTypePadding(0)
        setFaPadding(medianNum * 12)
        setZonePadding(maxMnm * 12)
      } else if (maxKey === 'fa' && minKey === 'type' && medianKey === 'zone') {
        maxMnm = faMax - typeMax
        medianNum = faMax - zoneMax
        setFaPadding(0)
        setTypePadding(maxMnm * 12)
        setZonePadding(medianNum * 12)
      } else if (maxKey === 'fa' && minKey === 'zone' && medianKey === 'type') {
        maxMnm = faMax - zoneMax
        medianNum = faMax - typeMax
        setFaPadding(0)
        setTypePadding(medianNum * 12)
        setZonePadding(maxMnm * 12)
      } else if (maxKey === 'zone' && minKey === 'type' && medianKey === 'fa') {
        maxMnm = zoneMax - typeMax
        medianNum = zoneMax - faMax
        setZonePadding(0)
        setTypePadding(maxMnm * 12)
        setFaPadding(medianNum * 12)
      } else if (maxKey === 'zone' && minKey === 'fa' && medianKey === 'type') {
        maxMnm = zoneMax - faMax
        medianNum = zoneMax - typeMax
        setZonePadding(0)
        setTypePadding(medianNum * 12)
        setFaPadding(maxMnm * 12)
      }
    })
  }

  const config = {
    data: typeData,
    xField: 'value',
    yField: 'name',
    autoFit: true,
    maxBarWidth: 10,
    color: (e) => {
      let color = ''
      typeData.map((item) => {
        if (item.name === e.name) {
          color = item.color
        }
      })
      return color
    },
    appendPadding: [0, 40, 0, 12 + typePadding],
    label: {
      position: 'right',
    },
    tooltip: false,
    xAxis: false,
    yAxis: {
      line: false,
      label: {
        innerWidth: '30px',
        width: '30px',
      },
    },
  }

  const faConfig = {
    appendPadding: [0, 40, 0, 12 + faPadding],
    data: faData,
    xField: 'value',
    yField: 'name',
    autoFit: true,
    maxBarWidth: 10,
    tooltip: false,
    label: {
      position: 'right',
    },
    color: (e) => {
      let color = ''
      faData.map((item) => {
        if (item.name === e.name) {
          color = item.color
        }
      })
      return color
    },
    xAxis: false,
    yAxis: {
      line: false,
      label: {
        innerWidth: '30px',
        width: '30px',
      },
    },
  }

  const zoneConfig = {
    data: zoneData,
    color: (e) => {
      let color = ''
      zoneData.map((item) => {
        if (item.name === e.name) {
          color = item.color
        }
      })
      return color
    },
    xField: 'value',
    yField: 'name',
    appendPadding: [0, 40, 0, 12 + zonePadding],
    maxBarWidth: 10,
    autoFit: true,
    tooltip: false,
    label: {
      position: 'right',
    },
    xAxis: false,
    yAxis: {
      line: false,
    },
  }

  return (
    <ProCard
      colSpan={8}
      ghost
      className="statisCard"
      id="mountNodeCard"
      title={
        <Space>
          <div className="devStatisTitle headerBg">
            <img src={DevStatis} style={{ marginBottom: 3 }} />
          </div>
          <span>{statisTitle}</span>
        </Space>
      }
      extra={
        <Space>
          <div style={{ marginRight: 5 }}>
            {language('dmc.index.type')}
            {statisData.typeTotal}
          </div>
          <div style={{ marginRight: 5 }}>
            {language('dmc.index.factory')} {statisData.factoryTotal}
          </div>
          <div style={{ marginRight: 5 }}>
            {language('dmc.index.zone')} {statisData.zoneTotal}
          </div>
        </Space>
      }
    >
      <Divider />
      <div
        className="cascCardBody"
        style={{
          paddingTop: 0,
        }}
      >
        {typeData.length == 0 ? (
          <Skeleton.Input style={{ height: 135, width: '100%' }} active />
        ) : (
          <div className="groupBarDiv">
            <div className="itemDiv">
              <div className="devStatisText">
                {language('dmc.index.lenged.type.head')}&emsp;
                {language('dmc.index.lenged.type.foot')}
              </div>
              <div className="itemBarDiv">
                <Bar
                  {...config}
                  style={{
                    height: typeData?.length * 25,
                    minHeight: typeData?.length * 25,
                  }}
                />
              </div>
            </div>
            <Divider className="barDiv" />
            <div className="itemDiv">
              <div className="devStatisText">
                {' '}
                {language('dmc.index.lenged.factory.head')}&emsp;
                {language('dmc.index.lenged.factory.foot')}
              </div>
              <div className="itemBarDiv">
                <Bar
                  {...faConfig}
                  style={{
                    height: faData?.length * 25,
                    minHeight: faData?.length * 25,
                  }}
                />
              </div>
            </div>
            <Divider className="barDiv" />
            <div className="itemDiv">
              <div className="devStatisText">
                {' '}
                {language('dmc.index.lenged.zone.head')}&emsp;
                {language('dmc.index.lenged.zone.foot')}
              </div>
              <div className="itemBarDiv">
                <Bar
                  {...zoneConfig}
                  style={{
                    height: zoneData?.length * 25,
                    minHeight: zoneData?.length * 25,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProCard>
  )
}

export default DevStatisticCard
