import React, { useState } from 'react'
import { Space, Input, DatePicker } from 'antd'
import moment from 'moment';
import '@/utils/index.less'
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
import DateTimeRangePicker from '@/components/Common/dtRangePicker'
const { ProtableModule } = TableLayout;
const { Search } = Input
const { RangePicker } = DatePicker;

let clientHeight = document.body.clientHeight - 336
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const Sslvisit = () => {
  const [incID, setIncID] = useState(0) //表格刷新
  const [queryVal, setQueryVal] = useState('') //搜索框的值
  const [starttime, setStarttime] = useState(
    moment().subtract(1, 'months').format(dateFormat)
  ) //搜索框的值
  const [endtime, setEndtime] = useState(moment().format(dateFormat)) //搜索框的值
  let searchVal = {
    queryVal: queryVal,
    queryType: 'fuzzy',
    startTime: starttime,
    endTime: endtime,
  } //顶部搜索框值 传入接口

  const concealColumns = {
    sport: { show: false },
    smac: { show: false },
    dport: { show: false },
    dmac: { show: false },
    country: { show: false },
    organize: { show: false },
  }

  const columns = [
    {
      title: language('netaudit.dnsreq.time'),
      dataIndex: 'time',
      key: 'time',
      width: '150px',
      ellipsis: true,
      align: 'left',
      class: 'aaaaaa'
    },
    {
      title: language('alarmdt.origin'),
      dataIndex: 'origin',
      key: 'origin',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.app'),
      dataIndex: 'app',
      key: 'app',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.protocol'),
      dataIndex: 'protocol',
      key: 'protocol',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sip'),
      dataIndex: 'sip',
      key: 'sip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sport'),
      dataIndex: 'sport',
      key: 'sport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.smac'),
      dataIndex: 'smac',
      key: 'smac',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetip'),
      dataIndex: 'dip',
      key: 'dip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetport'),
      dataIndex: 'dport',
      key: 'dport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dstmac'),
      dataIndex: 'dmac',
      key: 'dmac',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.applyname'),
      dataIndex: 'app_name',
      key: 'app_name',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.logtype'),
      dataIndex: 'log_type',
      key: 'log_type',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sessid'),
      dataIndex: 'sess_id',
      key: 'sess_id',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.extendedfieldcollection'),
      dataIndex: 'extended_fields',
      key: 'extended_fields',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.ssltls.finger'),
      dataIndex: 'finger',
      key: 'finger',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.ssltls.country'),
      dataIndex: 'country',
      key: 'country',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.ssltls.organize'),
      dataIndex: 'organize',
      key: 'organize',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.ssltls.cname'),
      dataIndex: 'cname',
      key: 'cname',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.ssltls.sni'),
      dataIndex: 'sni',
      key: 'sni',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.ssltls.ucname'),
      dataIndex: 'ucname',
      key: 'ucname',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.ssltls.uorganize'),
      dataIndex: 'uorganize',
      key: 'uorganize',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.issuer'),
      dataIndex: 'issuer',
      key: 'issuer',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.subject'),
      dataIndex: 'subject',
      key: 'subject',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.ja3'),
      dataIndex: 'ja3',
      key: 'ja3',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.ja3s'),
      dataIndex: 'ja3s',
      key: 'ja3s',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.version'),
      dataIndex: 'version',
      key: 'version',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.notbefore'),
      dataIndex: 'notbefore',
      key: 'notbefore',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.notafter'),
      dataIndex: 'notafter',
      key: 'notafter',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.publickey'),
      dataIndex: 'public_key',
      key: 'public_key',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.appbevr.sslvisit.sciphersuite'),
      dataIndex: 's_cipher_suite',
      key: 's_cipher_suite',
      width: '140px',
      ellipsis: true,
      align: 'left',
    }
  ]

  const changeTime = (time) =>{
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  // 顶部左侧搜索框
  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear={true}
          placeholder={language('netaudit.searchtext')}
        />
        <DateTimeRangePicker changeTime={changeTime}/>
      </Space>
    )
  }

  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAudit&action=showSSLVisit"
        clientHeight={clientHeight}
        columnvalue="sslvisitColumnvalue"
        tableKey="sslvisitTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}

export default Sslvisit
