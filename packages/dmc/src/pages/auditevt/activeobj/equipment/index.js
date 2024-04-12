import React, { useState, useEffect } from 'react'
import { Space, Input, DatePicker, Dropdown, Menu } from 'antd'
import moment from 'moment';
import '@/utils/index.less'
import { language } from '@/utils/language';
import { post } from '@/services/https';
import { TableLayout } from '@/components';
import DateTimeRangePicker from '@/components/Common/dtRangePicker'
const { ProtableModule } = TableLayout;
const { Search } = Input
const { RangePicker } = DatePicker;

let clientHeight = document.body.clientHeight - 336
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default () => {
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
  }
  const columnlist = [
    {
      title: language('netaudit.activeobj.equipment.devicetype'),
      dataIndex: 'device_type',
      key: 'device_type',
      width: '120px',
      ellipsis: true,
      align: 'left',
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
      title: language('netaudit.activeobj.equipment.devicesubtype'),
      dataIndex: 'device_subtype',
      key: 'device_subtype',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.equipment.ip'),
      dataIndex: 'IP',
      key: 'IP',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.equipment.mac'),
      dataIndex: 'MAC',
      key: 'MAC',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.equipment.updatedat'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.equipment.extendedfields'),
      dataIndex: 'extended_fields',
      key: 'extended_fields',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
  ]

  const changeTime = (time) => {
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  const apishowurl = "/cfg.php?controller=logAudit&action=showActiveDevice";
  const [columns, setColumns] = useState(columnlist);
  useEffect(() => {
    getDeviceType();
  }, [])

  const getDeviceType = () => {
    post('/cfg.php?controller=logAudit&action=getDeviceType').then((res) => {
      if (res.success && res.data) {
        columnlist.map((item, index) => {
          if (item.dataIndex == "device_type") {
            item.filters = res.data;
            item.filterMultiple = false;
          }
        })
        setColumns([...columnlist]);
      }
    })
  }

  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          placeholder={language('netaudit.activeobj.equipment.tablesearch')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear
        />
        <DateTimeRangePicker changeTime={changeTime} />
      </Space>
    )
  }

  return (<>
    <ProtableModule
      tableKey={'uequipmentTable'}
      columnvalue={'uequipmentColumnvalue'}
      rowkey={'id'}
      concealColumns={concealColumns}
      rowSelection={false}
      clientHeight={clientHeight}
      columns={columns}
      apishowurl={apishowurl}
      searchText={tableTopSearch()}
      searchVal={searchVal}
      incID={incID}
    />
  </>)
}

