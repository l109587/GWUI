import React, { useEffect, useState } from 'react'
import { ProCard, StatisticCard } from '@ant-design/pro-components'
import { Button, Col, Divider, message, Row, Space } from 'antd'
import './index.less'
import CascDevTitle from '@/assets/dmc/indexIcon/CascDevTitle.svg'
import CascDevExtra from '@/assets/dmc/indexIcon/CascDevExtra.svg'
import Normal from '@/assets/dmc/indexIcon/Normal.svg'
import Break from '@/assets/dmc/indexIcon/Break.svg'
import Audit from '@/assets/dmc/indexIcon/Audit.svg'
import AuthCard from '@/components/Index/AuthCard/AuthCard'
import {
  DevStateCard,
  DevStatisticCard,
  NestPie,
  PolicyStatisticCard,
  AlarmStatisticCard,
  AuditLogCard,
  OrderStatisticCard,
  DisposeLogCard,
  TinyArea,
} from './components'
import { post } from '@/services/https'
// import { Column } from "@ant-design/plots";
import { language } from '@/utils/language'
import { useSelector } from 'umi'
import { LoadingOutlined } from '@ant-design/icons'

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 334
  const cardHeight = clientHeight / 2

  const [cascDevData, setCascDevData] = useState([])
  const [infodata, setInfodata] = useState({})

  useEffect(() => {
    getCascDev()
    getStatusData()
  }, [])

  const getCascDev = () => {
    post('/cfg.php?controller=sysHeader&action=showCascade').then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setCascDevData(res)
    })
  }

  /*顶部状态图  */
  const getStatusData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysInfo', {})
      .then((res) => {
        setInfodata(res)
      })
      .catch(() => {
        console.log('mistask')
      })
  }

  return (
    <div className="dmcIndexCont" style={{ height: contentHeight - 31 }}>
      <ProCard ghost gutter={[16, 16]} direction="column">
        {/* 第一排 */}
        <ProCard ghost gutter={[16, 16]}>
          <ProCard
            colSpan={8}
            ghost
            className="statisCard"
            title={
              <Space>
                <div className="cascTitle headerBg">
                  <img src={CascDevTitle} />
                </div>
                <span>{cascDevData?.title}</span>
              </Space>
            }
            extra={
              <div className="cascExtraDiv">
                <img src={CascDevExtra} />
                <div>
                  {cascDevData?.total ? (
                    cascDevData?.total + language('dmc.index.tower')
                  ) : (
                    <LoadingOutlined />
                  )}
                </div>
              </div>
            }
          >
            <Divider />
            <div className="cascCardBody colorBgDiv">
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  height: '100%',
                }}
              >
                <Col className="normalDiv" span={7}>
                  <img src={Normal} />
                  <div className="numDiv">{cascDevData?.normal?.value}</div>
                  <div>{cascDevData?.normal?.name}</div>
                </Col>
                <Col className="breakDiv" span={7}>
                  <img src={Break} />
                  <div className="numDiv">{cascDevData?.disconnect?.value}</div>
                  <div>{cascDevData?.disconnect?.name}</div>
                </Col>
                <Col className="auditDiv" span={7}>
                  <img src={Audit} />
                  <div className="numDiv">{cascDevData?.waitverify?.value}</div>
                  <div>{cascDevData?.waitverify?.name}</div>
                </Col>
              </Row>
            </div>
          </ProCard>
          <ProCard colSpan={8} ghost>
            <DevStateCard />
          </ProCard>
          <ProCard colSpan={8} ghost>
            <DevStatisticCard />
          </ProCard>
        </ProCard>
        {/* 第二排 */}
        <ProCard
          className="ststisticRow"
          ghost
          style={{ backgroundColor: 'white' }}
        >
          <ProCard ghost colSpan={8}>
            <NestPie height={280} />
          </ProCard>
          <ProCard ghost colSpan={8}>
            <PolicyStatisticCard height={280} />
          </ProCard>
          <ProCard ghost colSpan={8}>
            <AlarmStatisticCard height={280} />
          </ProCard>
        </ProCard>
        {/* 第三排 */}
        <ProCard className="ststisticRow" ghost gutter={[16, 16]}>
          <ProCard ghost colSpan={8}>
            <AuditLogCard height={215.5} />
          </ProCard>
          <ProCard ghost colSpan={8}>
            <OrderStatisticCard height={215.5} />
          </ProCard>
          <ProCard ghost colSpan={8}>
            <DisposeLogCard height={215.5} />
          </ProCard>
        </ProCard>
        <ProCard ghost gutter={[16, 16]}>
          <ProCard colSpan={8} ghost>
            <AuthCard infodata={infodata} />
          </ProCard>
          {/* cpu状态图 */}
          <ProCard colSpan={16} ghost>
            <TinyArea />
          </ProCard>
        </ProCard>
      </ProCard>
    </div>
  )
}
