import React, { useRef, useState, useEffect } from 'react'
import {
  AlertFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import ProCard from '@ant-design/pro-card'
import { Space, message, Tag, Input, Spin, Button, Modal, Tooltip } from 'antd'
import { ReduceOne } from '@icon-park/react'
import { post, get } from '@/services/https'
import '@/utils/box.less'
import './illout.less'
import store from 'store'
import OSIcon from "@/nbgUtils/osIconType";
import { TableLayout } from '@/components'
import { language } from '@/utils/language'
import download from '@/utils/downnloadfile'
import { useSelector } from 'umi'
import { ReactComponent as AclUnblockIcon } from "@/assets/images/operate/aclUnblockIcon.svg";
const { ProtableModule } = TableLayout
const { Search } = Input
const { confirm } = Modal;

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 226
  const columnlist = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      key: 'id',
    },
    {
      title: language('project.analyse.status'),
      dataIndex: 'online',
      align: 'center',
      width: 80,
      key: 'online',
      render: (text, record, index) => {
        let color = 'success'
        let name = language('project.central.online')
        if (text == '1') {
          color = 'success'
          name = language('project.sysconf.analysis.online')
        } else {
          color = 'default'
          name = language('project.sysconf.analysis.noline')
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.online}>
              {name}
            </Tag>
          </Space>
        )
      },
    },
    {
      width: 150,
      title: language('project.analyse.illout.ip'),
      dataIndex: 'addr',
      key: 'addr',
      sorter: true,
      ellipsis: true,
      render: (text, record, index) => {
        return (
          <Space>
            <div>{text}</div>
            {/* <MinusCircleOutlined style={{ fontSize: 16, color: '#FF0000' }} /> */}
            {record.blockStatus == 'Y' ? (
              <div style={{ position: 'relative' }}>
                <ReduceOne 
                  theme="filled" 
                  size="16" 
                  fill="#FF0000" 
                  style={{ 
                    position: 'absolute', 
                    top: '-7px' 
                  }} 
                />
              </div>
            ) : (
              <></>
            )}
          </Space>
        )
      },
    },
    {
      width: 140,
      title: language('project.analyse.illout.host'),
      dataIndex: 'devName',
      key: 'devName',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.mac'),
      dataIndex: 'mac',
      width: 160,
      key: 'mac',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.covery'),
      width: 130,
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      render: (text, record, index) => {
        let typeText
        if (record.type == 'script') {
          typeText = language('analyse.illout.script')
        } else if (record.type == 'gw') {
          typeText = language('illevent.illoutline.selfCheck')
        } else if (record.type == 'scan') {
          typeText = language('analyse.illout.scan')
        } else if (record.type == 'netcross') {
          typeText = language('analyse.illout.netcross')
        } else if (record.type == 'client') {
          typeText = language('analyse.illout.client')
        } else {
          typeText = language('analyse.illout.flow')
        }
        return (
          <div className='typeDiv'>
            <div className='typeText'>{typeText}</div>
            {record.sender == 'tacs' ? <AlertFilled style={{ fontSize: 16, color: '#FA561F' }} /> : <></>}
          </div>
        )
      },
    },
    {
      title: language('project.analyse.illout.os'),
      width: 140,
      dataIndex: 'os',
      key: 'os',
      ellipsis: true,
      align: "left",
      render: (text, record, _, action) => {
        return (
          <Tooltip title={record.os} placement="topLeft">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="osIcon">{OSIcon(record.os)}</div>
            <div className="typeText">{record.os}</div>
          </div>
          </Tooltip>
        );
      },
    },
    {
      title: language('project.analyse.illout.browser'),
      width: 160,
      dataIndex: 'browser',
      key: 'browser',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.outAddr'),
      width: 140,
      dataIndex: 'outAddr',
      key: 'outAddr',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.num'),
      width: 80,
      dataIndex: 'count',
      key: 'count',
      ellipsis: true,
    },
    {
      title: language('project.analyse.series.lasttime'),
      width: 160,
      dataIndex: 'lastTM',
      key: 'lastTM',
      ellipsis: true,
    },
    {
      title: language('project.analyse.series.firstime'),
      width: 160,
      dataIndex: 'firstTM',
      key: 'firstTM',
      ellipsis: true,
    },
  ]

  const [columns, setColumns] = useState(columnlist)
  useEffect(() => {
    getfillter()
  }, [])

  const getfillter = () => {
    post('/cfg.php?controller=assetMapping&action=filterVioOutline')
      .then((res) => {
        let onlinefillter = []
        let typefillter = []
        res.data.map((item) => {
          if (item.filterName == 'type') {
            item.info.map((each) => {
              typefillter.push({ text: each.text, value: each.text })
            })
          } else if (item.filterName == 'online') {
            item.info.map((each) => {
              onlinefillter.push({ text: each.text, value: each.id })
            })
          } else {
          }
        })
        columnlist.map((item) => {
          if (item.dataIndex == 'type') {
            item.filters = typefillter
            item.filterMultiple = false
          } else if (item.dataIndex == 'online') {
            item.filters = onlinefillter
            item.filterMultiple = false
          } else {
          }
        })
        setColumns([...columnlist])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  let searchVal = { value: queryVal, type: 'fuzzy' } //顶部搜索框值 传入接口
  const apishowurl = '/cfg.php?controller=assetMapping&action=showVioOutline'
  const concealColumns = {
    id: { show: false },
  }
  const tableKey = 'illout'
  const setcolumnKey = 'pro-table-singe-demos-illout'
  const columnvalue = 'outcolumnvalue'
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const downloadButton = true
  let rowKey = (record) => record.id
  const [downLoading, setDownLoading] = useState(false)
  //导出按钮
  const downloadClick = () => {
    download(
      '/cfg.php?controller=assetMapping&action=exportVioOutline',
      '',
      setDownLoading
    )
  }

  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('analyse.illout.searchText')}
        allowClear
        className="illoutSearch"
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }}
      />
    )
  }

  const showOpButton = (selectedRowKeys, data, selectedRows) => {
    let disabled = false;
    if (selectedRowKeys.length === 0) {
      disabled = true;
    }
    return <Space>
      <Button 
        type='danger'
        disabled={disabled}
        icon={<AclUnblockIcon style={{ fill: disabled ? 'rgba(0, 0, 0, 0.25)' : '#FFFFFF', marginBottom: -3, marginRight: 5 }} />}
        onClick={() => {
          let list = selectedRows.filter((item) => item.blockStatus == 'Y')
          let ids = [];
          let ips = [];
          let senders = [];
          list.map((item) => {
            ids.push(item.id);
            ips.push(item.addr);
            senders.push(item.sender);
          });
          showOKModal(ids, ips, senders, selectedRows)
        }}
       >
        {language('analyse.illout.aclUnblock')}
      </Button>
    </Space>
  }

  const showOKModal = (ids, ips, senders, selectedRows) => {
    let sum = selectedRows.length;
    confirm({
      className: 'aclUnblockModal',
      icon: <ExclamationCircleOutlined />,
      title: language('analyse.illout.aclUnblock.confirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        aclUnblock(ids, ips, senders)
      }
    });
  }

  const aclUnblock = (ids, ips, senders) => {
    post('/cfg.php?controller=assetMapping&action=aclUnblock', {
      ids: JSON.stringify(ids),
      ips: JSON.stringify(ips),
      senders: JSON.stringify(senders),
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID((incID) => incID + 1);
    })
  }

  return (
    <div>
      <Spin spinning={downLoading} tip={language('project.exporting')}>
        <ProtableModule
          incID={incID}
          columnvalue={columnvalue}
          columns={columns}
          tableKey={tableKey}
          clientHeight={clientHeight}
          setcolumnKey={setcolumnKey}
          apishowurl={apishowurl}
          searchText={tableTopSearch()}
          searchVal={searchVal}
          concealColumns={concealColumns}
          downloadButton={downloadButton}
          downloadClick={downloadClick}
          otherOpLeft={showOpButton}
          rowSelection={true}
          rowkey={rowKey}
        />
      </Spin>
    </div>
  )
}
