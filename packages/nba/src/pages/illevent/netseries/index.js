

import React, { useRef, useState, useEffect } from 'react';
import { Space, message, Spin, Input, DatePicker, Select, Tooltip } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { post, delayPost, postAsync, fileDown } from '@/services/https';
import { history } from 'umi'
import moment from 'moment';
import { TableLayout } from '@/components';
import { language } from '@/utils/language';
import { ViewGridList } from '@icon-park/react';
import store from 'store';
import './netseries.less';
import { DownloadOutlined } from '@ant-design/icons';
import { BsChevronContract } from "react-icons/bs";
import { useSelector } from 'umi'
import download from '@/utils/downnloadfile'
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;

export default (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 206

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      key: 'id',
    },
    {
      title: language('illevent.netseries.findTime'),
      dataIndex: 'findTime',
      align: 'left',
      width: 180,
      key: 'findTime',
      ellipsis: true,
    },
    {
      width: 140,
      title: language('illevent.netseries.probeAddr'),
      dataIndex: 'probeAddr',
      key: 'probeAddr',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.area'),
      width: 130,
      dataIndex: 'area',
      key: 'area',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.inIp'),
      dataIndex: 'inIp',
      width: 160,
      key: 'inIp',
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'VLAN',
      dataIndex: 'vlan',
      width: 120,
      key: 'vlan',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('illevent.netseries.devIp'),
      width: 120,
      dataIndex: 'devIp',
      key: 'devIp',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.devMac'),
      width: 160,
      dataIndex: 'devMac',
      key: 'devMac',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => {
        if(record.multiple == 'Y') {
          return (<Space className='netexpendDiv'>
            <>{text}</>
            <Tooltip title={language('illevent.expand')}>
              <ViewGridList className='netipicon' theme='outline' size='18' fill='#FF7429' onClick={() => {
                setIsdetails(true)
                setNowPage(1)
                getDetailds(record.inIp, record.devIp, record.devMac)
                setSeinip(record.inIp)
                setSeDevIp(record.devIp)
                setMacValue(record.devMac)
              }}/>
            </Tooltip>
          </Space>)
        } else if(record.folding == "Y") {
          return (<Space className='netexpendDiv'>
            <>{text}</>
            <Tooltip title={language('illevent.stow')}>
              <BsChevronContract className='netipicon' style={{ fontSize: '18px', color:'#FF7429', marginBottom:'-4px' }} onClick={() => {
                getTabledata()
              }} />
            </Tooltip>
          </Space>)
        }
        else {
          return (
            <>{text}</>
          )
        }
      }
    },
    {
      title: language('illevent.netseries.devVendor'),
      width: 100,
      dataIndex: 'devVendor',
      key: 'devVendor',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.outIp'),
      width: 140,
      dataIndex: 'outIp',
      key: 'outIp',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.outPort'),
      width: 120,
      dataIndex: 'outPort',
      key: 'outPort',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.region'),
      width: 100,
      dataIndex: 'region',
      key: 'region',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.city'),
      width: 100,
      dataIndex: 'city',
      key: 'city',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.isp'),
      width: 100,
      dataIndex: 'isp',
      key: 'isp',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.operator'),
      width: 100,
      dataIndex: 'operator',
      key: 'operator',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.flag'),
      width: 100,
      dataIndex: 'flag',
      key: 'flag',
      align: 'left',
      ellipsis: true,
    },
  ]

  const dateFormat = 'YYYY/MM/DD';
  const [olddate, setOlddate] = useState(moment().subtract(7, "days").format(dateFormat));
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const [userValue, setUserValue] = useState(store.get('userVal'))
  const [columnsHide, setColumnsHide] = useState(store.get('netserclmnvalue') ? store.get('netserclmnvalue') : {
    id: { show: false },
    region: { show: false }
  });//设置默认列
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  const [loading, setLoading] = useState(false);//加载
  const actionRef = useRef();
  const [tabledata, setTabledata] = useState([]);
  const [totalPage, setTotalPage] = useState(0);//总条数
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
  const [nowPage, setNowPage] = useState(1);//当前页码
  const initLtVal = store.get('pageSize') ? store.get('pageSize') : 50;//默认每页条数
  const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
  const searchArr = [nowPage, limitVal, queryVal, olddate, newdate, userValue];
  const [seinip, setSeinip] = useState('');
  const [seDevIp, setSeDevIp] = useState('');
  const [macValue, setMacValue] = useState('')
  const [isdetails, setIsdetails] = useState(false);
  const [userList, setUserList] = useState([]);
  let columnvalue = 'netseriesTable'
  let concealColumnList = {
    id: { show: false },
  }
  const [densitySize, setDensitySize] = useState('middle')
  const [downLoading, setDownLoading] = useState(false)

  useEffect(() => {
    getUserList()
    showTableConf()
  }, [])

  useEffect(() => {
    setLoading(true)
    if (isdetails === false) {
      getTabledata()
    } else {
      getDetailds(seinip, seDevIp, macValue)
    }
  }, searchArr)
  
  const getUserList = () => {
    post('/cfg.php?controller=sysHeader&action=showAdminListName').then((res) => {
      if(!res.success) {
        return false;
      }
      if (!store.get('userVal')) {
        setUserValue(res?.data[0]?.value)
        if (store.get('Permission')[0].route != '/index/alarm') {
          store.set('userVal', res?.data[0]?.value)
        }
      }
      setUserList(res.data)
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 表格数据 start  数据起始值   limit 每页条数  */
  const getTabledata = () => {
    let data = {};
    data.value = queryVal;
    data.limit = limitVal;
    data.start = limitVal * (nowPage - 1);
    data.startTime = olddate;
    data.endTime = newdate;
    data.user =  store.get('userVal') ? store.get('userVal') : userValue;
    delayPost('/cfg.php?controller=netcrossEvent&action=show', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        setLoading(false)
        return false;
      }
      setIsdetails(false);
      setLoading(false);
      setTotalPage(res.total)
      setTabledata([...res.data])
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 获取详情数据 */
  const getDetailds = (ipvalue, devIpVal, macVal) => {
    let data = {};
    data.limit = limitVal;
    data.start = limitVal * (nowPage - 1);
    data.inIp = ipvalue;
    data.startTime = olddate;
    data.endTime = newdate;
    data.devIp = devIpVal;
    data.user =  store.get('userVal') ? store.get('userVal') : userValue;
    data.devMac = macVal;
    delayPost('/cfg.php?controller=netcrossEvent&action=showDetails',data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      setIsdetails(true);
      setLoading(false);
      setTotalPage(res.total)
      setTabledata(res.data)
    }).catch(() => {
      console.log('mistake')
    })
  };

  /* 回显表格密度列设置 */
  const showTableConf = async () => {
    let data = []
    data.module = columnvalue
    let res
    res = await postAsync(
      '/cfg.php?controller=confTableHead&action=showTableHead',
      data
    )
    if (res.density) {
      setDensitySize(res.density)
    }
    if (!res.success || res.data.length < 1) {
      columns?.map((item) => {
        if (!concealColumnList[item.dataIndex] && item.hideInTable != true) {
          let showCon = {}
          showCon.show = true;
          concealColumnList[item.dataIndex] = showCon;
        }
      })
      let data = []
      data.module = columnvalue
      data.value = JSON.stringify(concealColumnList)
      res = await postAsync(
        '/cfg.php?controller=confTableHead&action=setTableHead',
        data
      )
      if (res.success) {
        setColumnsHide(concealColumnList)
      }
    } else {
      setColumnsHide(res.data ? res.data : {})
    }
  }

  /* 表格列设置配置 */
  const columnsTableChange = (value) => {
    let data = [];
    data.module = columnvalue;
    data.value = JSON.stringify(value);
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setColumnsHide(value);
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 表格密度设置 */
  const sizeTableChange = (sizeType) => {
    let data = [];
    data.module = columnvalue;
    data.density = sizeType;
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setDensitySize(sizeType);
    }).catch(() => {
      setDensitySize(sizeType);
      console.log('mistake')
    })
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    // setRecord(record)//选中行重新赋值
    setSelectedRowKeys(selectedRowKeys)
  }

  return (
    <Spin spinning={downLoading} tip={language('project.exporting')}>
      <ProTable className='netseriesTable'
        search={false}
        bordered={true}
        scroll={{ x: 1800, y: clientHeight }}
        dateFormatter="string"
        loading={loading}
        columnEmptyText={false}
        //设置选中提示消失
        tableAlertRender={false}
        actionRef={actionRef}
        rowkey={record => record.id}
        columns={columns}
        dataSource={tabledata}
        rowSelection={false}
          onSizeChange={(e) => {
          sizeTableChange(e);
        }}
        size={densitySize}
        columnsState={{
          value: columnsHide,
          persistenceType: 'sessionStorage',
          onChange: (value) => {
            columnsTableChange(value)
            store.set('netserclmnvalue', value)
          },
        }}
        headerTitle={
          <Space>
            <Search
              placeholder={language('illevent.netseries.searchtext')}
              style={{ width: 200 }}
              allowClear
              onSearch={(queryVal) => {
                setQueryVal(queryVal)
                setNowPage(1)
              }}
            />
            <RangePicker
              defaultValue={[moment(olddate, dateFormat),
              moment(newdate, dateFormat)]}
              format={dateFormat}
              onChange={(val, time) => {
                setNewdate(time[1])
                setOlddate(time[0])
                setNowPage(1)
              }}
            />
            <Select
              showSearch
              allowClear
              style={{
                width: 120,
              }}
              options={userList}
              // defaultValue={store.get('userVal')}
              value={store.get('userVal') ? store.get('userVal') : userValue}
              // defaultValue={userValue}
              name='user'
              placeholder={language('illevent.placeuser')}
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label.toUpperCase() ?? '').includes(input.toUpperCase())}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              onChange={(value) => {
                store.set('userVal', value)
                setUserValue(value)
                setNowPage(1)
              }}
            />
          </Space>
        }
        options={{
          reload: function () {
            setLoading(true);
            setNowPage(1)
            if (isdetails === false) {
              getTabledata()
            } else {
              getDetailds(seinip, seDevIp, macValue)
            }
          }
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if(type === 'get') {
              return Object.assign(Object.assign({}, values), { created_at: [values.startTime, values.endTime] });
            }
            return values;
          },
        }}

        toolBarRender={() => [
          <Tooltip title={language('project.export')} placement='top'>
            <DownloadOutlined style={{ fontSize: '15px' }} onClick={() => {
              let data = {}
              data.value = queryVal;
              data.startTime = olddate;
              data.endTime = newdate;
              data.user =  store.get('userVal') ? store.get('userVal') : userValue;
               download(
                '/cfg.php?controller=netcrossEvent&action=export',
                data,
                setDownLoading
              )
            }} />
          </Tooltip>
        ]}
        onChange={(paging, filters, sorter) => {
          setLoading(true);
          setNowPage(paging.current);
          setLimitVal(paging.pageSize);
          store.set('pageSize', paging.pageSize)
        }}
        pagination={{
          showSizeChanger: true,
          pageSize: limitVal,
          current: nowPage,
          total: totalPage,
          showTotal: total => language('project.page', { total: total }),
        }}
      />
    </Spin>
  )
}
