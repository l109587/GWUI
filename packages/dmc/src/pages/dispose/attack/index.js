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

let clientHeight = document.body.clientHeight - 295
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
    id: { show: false },
  }
  const columns = [
    {
      title: language('dmc.dispose.attack.id'),
      dataIndex: 'id',
      key: 'id',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.attack.time'),
      dataIndex: 'time',
      key: 'time',
      width: '150px',
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
      title: language('dmc.dispose.attack.handletime'),
      dataIndex: 'handle_time',
      key: 'handle_time',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.attack.samplemd5'),
      dataIndex: 'sample_md5',
      key: 'sample_md5',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.attack.disposeresult'),
      dataIndex: 'dispose_result',
      key: 'dispose_result',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.attack.alarminfo'),
      dataIndex: 'alarm_info',
      key: 'alarm_info',
      width: '200px',
      ellipsis: true,
      align: 'left',
      render: (text, record, index) => {
				return ;
			},
    },
  ]

  const changeTime = (time) =>{
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  const apishowurl = "/cfg.php?controller=logDispose&action=showAttack"

  const tableTopSearch = () => {
    return(
      <Space>
        <Search
          placeholder={language('dmc.dispose.attack.tablesearch')}
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
      tableKey={'diattackTable'} 
      columnvalue={'diattackColumnvalue'} 
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

