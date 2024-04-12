import React, { useRef, useState, useEffect } from 'react'
import {
  message,
  Popconfirm,
  Radio,
  Drawer,
  Button,
  Table,
  Row,
  Col,
  TreeSelect,
  Select,
  Empty,
  ConfigProvider,
  Input,
} from 'antd'
import { DrawerForm } from '@ant-design/pro-components'
import { language } from '@/utils/language'
import { post, postAsync } from '@/services/https'
import styles from './index.less'

const { Search } = Input

const Policy = (props) => {
  const {
    visible,
    setVisible,
    operate = 'distribute',
    rowInfo,
    type,
    module,
  } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //key
  const [selectedRows, setSelectedRows] = useState([]) //行数据
  const [devList, setDevList] = useState([]) //设备列表
  const [modalValue, setModalValue] = useState('1') //选中类型
  const [loading, setLoading] = useState(false)
  const [limitVal, setLimitVal] = useState(20) // 每页条目
  const [currPage, setCurrPage] = useState(1) // 当前页码
  const [totEntry, setTotEntry] = useState(0) // 总条数

  const [zoneId, setZoneId] = useState('000000') //区域id
  const [zoneInfo, setZoneInfo] = useState({
    gpnamePath: '/全部区域',
    level: '1',
  }) //侧边栏选中地址id
  const [selectedDevList, setSelectedDevList] = useState([]) //选中设备列表
  const [zoneData, setZoneData] = useState([]) //区域列表
  const [certType, setCertType] = useState('1') //行政编号
  const [devID, setDevID] = useState('1') //设备ID
  const [filters, setFilters] = useState('') //筛选
  const drawerRef = useRef()

  const assocTbHeight = document.body.clientHeight - 265

  const typeMap = {
    1: '所有设备',
    2: '所有监测器',
    3: '所有管理系统',
  }
  const typeOptions = [
    { label: '全部设备', value: '1' },
    { label: '所有监测器', value: '2' },
    { label: '所有管理系统', value: '3' },
    { label: '部分设备', value: '4' },
    { label: '本级设备', value: '5' },
  ]
  //设备类型
  const devTypeMap = {
    1: '监测器',
    2: '自监管',
    3: '管理系统',
    4: '监测器集群管理',
    5: '终端组件',
  }

  //设备筛选项
  const devFilters = [
    { text: '监测器', value: '1' },
    { text: '自监管', value: '2' },
    { text: '管理系统', value: '3' },
    { text: '监测器集群管理', value: '4' },
    { text: '终端组件', value: '5' },
  ]

  //下发结果筛选项
  const resultFilters = [
    { text: '未下发', value: '0' },
    { text: '待响应', value: '1' },
    { text: '成功', value: '2' },
    { text: '失败', value: '3' },
  ]
  //标题
  const titleMap = {
    distribute: '策略分发',
    revoke: '策略撤销',
    assoc: '关联设备',
  }

  useEffect(() => {
    fetchdevList()
  }, [limitVal, currPage, zoneId, modalValue, operate, visible, devID,filters])
  useEffect(() => {
    getZoneData()
    fetchCertType()
  }, [])
  const onClose = () => {
    setVisible(false)
    setSelectedDevList([])
    setZoneId('000000')
    setZoneInfo({ gpnamePath: '/全部区域', level: '1' })
    setSelectedRowKeys([])
    setSelectedRows([])
    setModalValue('1')
  }

  //三种表头渲染
  const renderCol = () => {
    const columns = [
      {
        title: language('adminacc.label.status'),
        dataIndex: 'isOnline',
        key: 'isOnline',
        align: 'center',
        width: 80,
        render: (text) => {
          return text == '1' ? '在线' : '离线'
        },
      },
      {
        title: language('project.devid'),
        dataIndex: 'devid',
        key: 'devid',
        align: 'left',
        width: 110,
        ellipsis: true,
      },
      {
        title: language('project.logmngt.devname'),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        width: 100,
        ellipsis: true,
      },
      {
        title: '设备类型',
        dataIndex: 'type',
        key: 'type',
        align: 'left',
        width: 120,
        filters:operate==='assoc'&& devFilters,
        filterMultiple: false,
        render: (text) => {
          return devTypeMap[text]
        },
      },
      {
        title: language('adminacc.label.zone'),
        dataIndex: 'zoneName',
        key: 'zoneName',
        align: 'left',
        width: 150,
        ellipsis: true,
      },
      {
        title: '下发结果',
        dataIndex: 'isSelect',
        key: 'isSelect',
        align: 'center',
        width: 80,
        render: (text) => {
          return text === 'Y' ? '已下发' : '未下发'
        },
      },
      {
        title: '下发结果',
        dataIndex: 'result',
        key: 'result',
        align: 'center',
        width: 80,
        filters:resultFilters,
        filterMultiple: false,
        render: (text, record) => {
          let str = '';
          resultFilters.map((item)=>{
            if(item.value == text){
              str = item.text
            }
          })
          if(str) return str;
        },
      },
      {
        title: '时间',
        dataIndex: 'update_time',
        key: 'update_time',
        align: 'left',
        width: 120,
        ellipsis: true,
      },
    ]
    let cols = []
    if (operate === 'assoc') {
      cols = columns.filter((item) => {
        return (
          item.dataIndex === 'devid' ||
          item.dataIndex === 'name' ||
          item.dataIndex === 'type' ||
          item.dataIndex === 'zoneName' ||
          item.dataIndex === 'result' ||
          item.dataIndex === 'update_time'
        )
      })
    } else if (operate === 'distribute') {
      cols = columns.filter((item) => {
        return (
          item.dataIndex === 'isOnline' ||
          item.dataIndex === 'devid' ||
          item.dataIndex === 'name' ||
          item.dataIndex === 'type' ||
          item.dataIndex === 'zoneName'
        )
      })
    } else if (operate === 'revoke') {
      cols = columns.filter((item) => {
        return (
          item.dataIndex === 'isOnline' ||
          item.dataIndex === 'devid' ||
          item.dataIndex === 'name' ||
          item.dataIndex === 'type' ||
          item.dataIndex === 'zoneName' ||
          item.dataIndex === 'isSelect'
        )
      })
    }
    return cols
  }
  const selectedCol = [
    {
      title: '生效路径',
      dataIndex: 'zone',
      key: 'zone',
      align: 'left',
      width: 150,
      ellipsis: true,
    },
    {
      title: '生效设备',
      dataIndex: 'type',
      key: 'type',
      align: 'left',
      width: 120,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'optera',
      key: 'optera',
      align: 'center',
      width: 80,
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              delSelectedItem(record)
            }}
          >
            移除
          </a>
        )
      },
    },
  ]
  // 区域管理侧边点击id处理
  const onChangeZone = (value, node) => {
    setZoneId(value) //更新选中地址id
    setZoneInfo(node)
    setModalValue('1')
    setCurrPage(1)
  }
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys)
    setSelectedRows(newSelectedRows)
  }
  //获取区域列表
  const getZoneData = async () => {
    let data = {}
    data.type = 'tree'
    data.depth = 1
    let res = await postAsync(
      '/cfg.php?controller=confZoneManage&action=showZoneTree',
      data
    )
    if (res) {
      res.number = '000000'
      let data = []
      data.push(res)
      setZoneData(data)
    }
  }

  const fetchdevList = () => {
    setLoading(true)
    const dataType = {
      1: 0,
      2: 1,
      3: 2,
      4: 0,
      5: 3,
    }
    let data = {
      queryType: 'fuzzy',
      start: limitVal * (currPage - 1),
      limit: limitVal,
      rule_id: rowInfo?.rule_id,
    }
    
    if (operate !== 'assoc') {
      data = {
        ...data,
        type: type,
        module: module,
        dataType: dataType[modalValue],
        zoneID: zoneId,
      }
    } else {
      data = { ...data, device_id: devID, zone_id: zoneId ,filters : filters}
    }
    post(
      operate === 'assoc'
        ? '/cfg.php?controller=confPolicy&action=showDevice'
        : '/cfg.php?controller=confDevice&action=showSynclist',
      data
    )
      .then((res) => {
        if (res.success) {
          setDevList(res.data)
          setTotEntry(res.total)
          setLoading(false)
        }
      })
      .catch(() => {
        console.log('mistake')
        setLoading(false)
      })
  }
  const onChangeType = (value) => {
    setModalValue(value)
    setSelectedRows([])
    setSelectedRowKeys([])
    setCurrPage(1)
  }
  const fetchNamePath = (arr) => {
    let name = ''
    arr.map((item) => {
      if (item.id === zoneId) {
        return (name = item.gpnamePath)
      } else {
        if (item.children) {
          fetchNamePath(item.children)
        }
      }
    })
    return name
  }

  //加入分发列表
  const addList = () => {
    if (devList.length <= 0) {
      return message.error('暂无可下发设备！')
    }
    if (Number(modalValue) > 3 && selectedRowKeys.length <= 0) {
      return message.error('请选择设备！')
    }
    const index = selectedDevList.findIndex(
      (item) => item.zone === zoneInfo.gpnamePath
    )
    if (selectedDevList.length == 30 && index < 0) {
      return message.error('最多增加30条！')
    }
    let data = {}
    let id = ''
    console.log(zoneInfo?.level, 'level')
    switch (zoneInfo?.level) {
      case '1':
        modalValue === '5' ? (id = `000000`) : (id = `990000`)
        break
      case '2':
        modalValue === '5'
          ? (id = `${zoneId.slice(0, 2)}0000`)
          : (id = `${zoneId.slice(0, 2)}9900`)
        break
      case '3':
        modalValue === '5'
          ? (id = `${zoneId.slice(0, 4)}00`)
          : (id = `${zoneId.slice(0, 4)}99`)
        break
      default:
        id = zoneId
        break
    }
    if (Number(modalValue) < 4) {
      data = {
        zone_id: id,
        zone: zoneInfo.gpnamePath,
        type: typeMap[modalValue],
        type_id: modalValue,
      }
    } else {
      const ids = []
      selectedRows.map((item) => {
        ids.push(item.devid)
      })
      data = {
        zone_id: id,
        zone: zoneInfo.gpnamePath,
        type: ids.join(','),
        type_id: ids.join(','),
      }
    }

    if (index >= 0) {
      const arr = [...selectedDevList]
      arr.splice(index, 1, data)
      setSelectedDevList(arr)
    } else {
      setSelectedDevList([...selectedDevList, data])
    }
    setSelectedRowKeys([])
    setSelectedRows([])
  }

  //开始分发
  const distribute = () => {
    if (selectedDevList.length < 1) {
      return message.error('请选择设备！')
    }
    const effect = []
    selectedDevList.map((item) => {
      effect.push({ [`0${certType}${item.zone_id}`]: item.type_id })
    })
    const params = {
      op: operate,
      rule_id: rowInfo?.rule_id,
      effect_zone: JSON.stringify(effect),
    }
    post('/cfg.php?controller=confPolicy&action=sync', params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          onClose()
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //删除分发列表选项
  const delSelectedItem = (values) => {
    const arr = [...selectedDevList]
    const index = arr.findIndex((item) => item.zone_id === values.zone_id)
    arr.splice(index, 1)
    setSelectedDevList(arr)
  }

  //获取行政标编号
  const fetchCertType = () => {
    post('/cfg.php?controller=confCenterManage&action=show')
      .then((res) => {
        if (res.success) {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setCertType(res.data[0].type === 'XZ' ? '1' : '2')
          }
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <DrawerForm
      title={titleMap[operate]}
      visible={visible}
      width="800px"
      formRef={drawerRef}
      // getContainer={false}
      // style={{
      //   position: 'absolute',
      // }}
      // closable={false}
      // bodyStyle={{ backgroundColor: '#f0f2f5' }}
      onFinish={operate === 'assoc' ? onClose : distribute}
      drawerProps={{
        destroyOnClose: true,
        onClose: onClose,
        bodyStyle: { padding: 16 },
        headerStyle: { padding: 16 },
        forceRender: false,
      }}
    >
      <Row gutter={24} style={{ marginBottom: 12 }}>
        {operate === 'assoc' && (
          <Col>
            <Search
              placeholder="请输入设备ID"
              onSearch={(value) => {
                setCurrPage(1)
                setDevID(value)
              }}
              className={styles.inputsearch}
              allowClear
            />
          </Col>
        )}
        <Col>
          <span>所属区域：</span>
          <TreeSelect
            style={{
              width: '200px',
            }}
            value={zoneId}
            dropdownStyle={{
              maxHeight: 400,
              overflow: 'auto',
            }}
            treeData={zoneData}
            placeholder="请选择所属区域"
            onSelect={onChangeZone}
            fieldNames={{
              label: 'name',
              value: 'number',
            }}
          />
        </Col>
        {operate !== 'assoc' && (
          <Col>
            <span>生效设备：</span>
            <Select
              defaultValue="1"
              style={{
                width: 200,
              }}
              value={modalValue}
              options={typeOptions}
              onChange={onChangeType}
            />
          </Col>
        )}
      </Row>

      <div>
        <Table
          loading={loading}
          size="small"
          rowSelection={
            Number(modalValue) > 3 &&
            operate !== 'assoc' && {
              selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: (record) => ({
                disabled: record.isSelect === 'N' && operate !== 'distribute',
              }),
            }
          }
          className={styles.table}
          width={768}
          columns={renderCol()}
          dataSource={devList}
          key="devTable"
          rowKey={'devid'}
          pagination={{
            // hideOnSinglePage: true,
            showSizeChanger: true,
            pageSize: limitVal,
            current: currPage,
            total: totEntry,
            showTotal: (total) => language('project.page', { total: total }),
          }}
          onChange={(paging, filters, sorter) => {
            setLoading(true)
            setCurrPage(paging.current)
            setLimitVal(paging.pageSize)
            setFilters(JSON.stringify(filters))
          }}
          scroll={{ y: operate === 'assoc' ? assocTbHeight : 300 }}
          locale={{ emptyText: <Empty /> }}
        />
        {operate !== 'assoc' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '16px 0',
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  lineHeight: '32px',
                }}
              >
                {operate === 'distribute' ? '分发列表：' : '撤销列表'}
              </span>
              <Button type="primary" onClick={addList}>
                {operate === 'distribute' ? '加入分发列表' : '加入撤销列表'}
              </Button>
            </div>
            <Table
              columns={selectedCol}
              size="small"
              dataSource={selectedDevList}
              key="selectedDevTable"
              rowKey={'zoneID'}
              scroll={{ y: 270 }}
              pagination={false}
              locale={{
                emptyText: <Empty />,
              }}
            />
          </div>
        )}
      </div>
    </DrawerForm>
  )
}

export default Policy
