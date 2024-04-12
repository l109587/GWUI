import { useState, useEffect } from 'react'
import { ProtableModule } from '@/components/Module'
import { useSelector } from 'umi'
import { Input } from 'antd'

const { Search } = Input

export default function ARP(props) {
  const { ip } = props
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  let clientHeight = contentHeight - 378
  const [queryVal, setQueryVal] = useState('') //首个搜索框的值
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新

  const rowKey = (record) => record.name //列表唯一值
  let searchVal = {
    value: queryVal,
    type: 'fuzzy',
    swIP: ip,
  } //顶部搜索框值 传入接口

  const columnsList = [
    {
      title: '序号',
      width: '100px',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      width: '120px',
      dataIndex: 'ip',
      key: 'ip',
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'MAC地址',
      width: '120px',
      dataIndex: 'mac',
      key: 'mac',
      align: 'left',
      ellipsis: true,
    },
  ]
  const tableTopSearch = () => {
    return (
      <>
        <Search
          placeholder="IP/MAC"
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear={true}
        />
      </>
    )
  }
  return (
    <>
      <ProtableModule
        columns={columnsList}
        apishowurl="/cfg.php?controller=assetMapping&action=showARPList"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="arpTable"
        searchText={tableTopSearch()}
        searchVal={searchVal}
        rowkey={rowKey}
        columnvalue="ARPColumnvalue"
        rowSelection={false}
      />
    </>
  )
}
