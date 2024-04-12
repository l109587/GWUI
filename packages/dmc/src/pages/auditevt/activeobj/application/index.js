import React, { useState, useEffect } from 'react'
import { Space, Input, DatePicker, Dropdown, Menu } from 'antd'
import moment from 'moment';
import '@/utils/index.less'
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
import { post } from '@/services/https';
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
      title: language('netaudit.activeobj.application.apptype'),
      dataIndex: 'app_type',
      key: 'app_type',
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
      title: language('netaudit.activeobj.application.ip'),
      dataIndex: 'IP',
      key: 'IP',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.application.port'),
      dataIndex: 'port',
      key: 'port',
      width: '90px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.application.updatedat'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.application.extendedfields'),
      dataIndex: 'extended_fields',
      key: 'extended_fields',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
  ]

  const changeTime = (time) =>{
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  const apishowurl = "/cfg.php?controller=logAudit&action=showActiveApp";
  const [columns, setColumns] = useState(columnlist);
  useEffect(() => {
    getAppType();
  }, [])

  const getAppType = () => {
    post('/cfg.php?controller=logAudit&action=getAppType').then((res) => {
      if (res.success && res.data) {
        columnlist.map((item, index) => {
          if (item.dataIndex == "app_type") {
            item.filters = res.data;
            item.filterMultiple = false;
          }
        })
        setColumns([...columnlist]);
      }
    })
  }

  const tableTopSearch = () => {
    return(
      <Space>
        <Search
          placeholder={language('netaudit.activeobj.application.tablesearch')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear
        />
        <DateTimeRangePicker changeTime={changeTime}/>
      </Space>
    )
  }

  return (<>
    <ProtableModule
      tableKey={'uapplicationTable'} 
      columnvalue={'uapplicationColumnvalue'} 
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

