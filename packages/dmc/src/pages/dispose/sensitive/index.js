import React, { useState } from 'react'
import { Space, Input, DatePicker } from 'antd'
import moment from 'moment';
import '@/utils/index.less'
import { InfoCircleOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
import CutDropDown from './cutdropdown';
import DateTimeRangePicker from '@/components/Common/dtRangePicker'
const { ProtableModule } = TableLayout;
const { Search } = Input
const { RangePicker } = DatePicker;

let clientHeight = document.body.clientHeight - 295
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default  () => {
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
      title: language('dmc.dispose.sensitive.id'),
      dataIndex: 'id',
      key: 'id',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.sensitive.time'),
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
      title: language('dmc.dispose.sensitive.handletime'),
      dataIndex: 'handle_time',
      key: 'handle_time',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.sensitive.sendaccount'),
      dataIndex: 'send_account',
      key: 'send_account',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.sensitive.receiveaccount'),
      dataIndex: 'receive_account',
      key: 'receive_account',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.sensitive.analyzeresult'),
      dataIndex: 'analyze_result',
      key: 'analyze_result',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.sensitive.analyzetime'),
      dataIndex: 'analyze_time',
      key: 'analyze_time',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.sensitive.keywords'),
      dataIndex: 'key_words',
      key: 'key_words',
      width: '150px',
      ellipsis: true,
      align: 'left',
      render: (text, record, index) => {
        if (record?.info?.ip && record?.info?.ip.length > 0) {
          let menu = [];
          record?.key_words?.map((item) => {
            menu.push({ key: item, label: item, icon: <InfoCircleOutlined /> });
          })
          return <>
            <CutDropDown menu={menu} addrlist={record?.info?.key_words} />
          </>;
        }
      },
    },
    {
      title: language('dmc.dispose.sensitive.disposeresult'),
      dataIndex: 'dispose_result',
      key: 'dispose_result',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.sensitive.srcdevice'),
      dataIndex: 'src_device',
      key: 'src_device',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('dmc.dispose.sensitive.warningdetails'),
      dataIndex: 'warning_details',
      key: 'warning_details',
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

  const apishowurl = "/cfg.php?controller=logDispose&action=showSensitive"

  const tableTopSearch = () => {
    return(
      <Space>
        <Search
          placeholder={language('dmc.dispose.sensitive.tablesearch')}
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
      tableKey={'disensitiveTable'} 
      columnvalue={'disensitiveColumnvalue'} 
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


