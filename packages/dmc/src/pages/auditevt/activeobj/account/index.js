import React, { useState, useEffect } from 'react'
import { Space, Input, DatePicker } from 'antd'
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

const Email = () => {
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
      title: language('netaudit.activeobj.account.accountid'),
      dataIndex: 'account_id',
      key: 'account_id',
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
      title: language('netaudit.activeobj.account.accounttype'),
      dataIndex: 'account_type',
      key: 'account_type',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.account.account'),
      dataIndex: 'account',
      key: 'account',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.account.ip'),
      dataIndex: 'IP',
      key: 'IP',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.account.port'),
      dataIndex: 'port',
      key: 'port',
      width: '90px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.account.updatedat'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.activeobj.account.extendedfields'),
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

  const apishowurl = "/cfg.php?controller=logAudit&action=showActiveAccount";
  const [columns, setColumns] = useState(columnlist);
  useEffect(() => {
    getAppType();
  }, [])

  const getAppType = () => {
    post('/cfg.php?controller=logAudit&action=getAccountType').then((res) => {
      if (res.success && res.data) {
        columnlist.map((item, index) => {
          if (item.dataIndex == "account_type") {
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
          placeholder={language('netaudit.activeobj.account.tablesearch')}
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
      tableKey={'ucaccountTable'} 
      columnvalue={'ucaccountColumnvalue'} 
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

export default Email
