import React, { useRef, useState, useEffect } from 'react'
import { language } from '@/utils/language'
import {
  Button,
  Row,
  Col,
  Upload,
  Popconfirm,
  Spin,
  Space,
  Tag,
  message,
  Tooltip,
  Alert,
  Input,
  Form
} from 'antd'
import WebUploadr from '@/components/Module/webUploadr'
import { post, get } from '@/services/https'
import store, { set } from 'store'
import * as XLSX from 'xlsx'
import {
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { formleftLayout } from '@/utils/helper'
import '@/utils/index.less'
import { regIpList, regList, regMacList } from '@/utils/regExp'
import { TableLayout } from '@/components'
// import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import EditTable from '../../../monitor/mapping/components/assetIdentification/editTable'
import exportExcel from '@/utils/exportExcel'
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components'
import { fetchAuth } from '@/utils/common';
const { ProtableModule } = TableLayout

const Hdprobeconfig = () => {
  const writable = fetchAuth()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: language('project.mconfig.ectstu'),
      dataIndex: 'state',
      width: 90,
      align: 'center',
      render: (text, record, index) => {
        let color = 'success'
        if (record.state == 'published') {
          color = 'success'
          text = language('project.temporary.terminal.published')
        } else if (record.state == 'expired') {
          color = 'default'
          text = language('probers.hdprobe.expired')
        } else {
          color = 'error'
          text = language('project.temporary.terminal.nopublish')
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.type}>
              {text}
            </Tag>
          </Space>
        )
      },
    },
    {
      title: language('project.temporary.terminal.pkgName'),
      dataIndex: 'name',
      width: 160,
      ellipsis: true,
    },
    {
      title: language('project.temporary.terminal.pkgMd5'),
      dataIndex: 'md5',
      width: 400,
      ellipsis: true,
    },
    {
      title: language('project.temporary.terminal.uploadTM'),
      dataIndex: 'time',
      width: 160,
      ellipsis: true,
    },
    {
      title: language('project.temporary.terminal.version'),
      dataIndex: 'version',
      width: 130,
      ellipsis: true,
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      width: 100,
      align: 'center',
      hideInTable: !writable,
      render: (text, record, _, action) => {
        if (record.state == 'published') { 
          return showPopconfirm(record, <div className='dangeDiv optionTag' >{language('adminacc.message.popfirm.cancel')}</div>, language('project.temporary.terminal.canclecontitle'), '/cfg.php?controller=probeManage&action=hrdprbCancel')
        } else if (record.state == 'unpublished') { 
          return showPopconfirm(record, <a className='optionTag'>{language('probers.hdprobe.published')}</a>, language('project.temporary.terminal.publishcontitle'), '/cfg.php?controller=probeManage&action=hrdprbPublish')
        } else {
          return [showPopconfirm(record,<div className='dangeDiv optionTag'>{language('probers.hdprobe.published')}</div>, language('project.temporary.terminal.publishcontitle'), '/cfg.php?controller=probeManage&action=hrdprbPublish'),
          showPopconfirm(record,<div className='dangeDiv optionTag'>{language('project.del')}</div>,language('probers.hdprobe.deltitle'), '/cfg.php?controller=probeManage&action=hrdprbDelete')]
        }
      },
    },
  ]

  const showPopconfirm = (value, tag, title, optionUrl) => {
    return <Popconfirm title={title} onConfirm={() => {
      optionFn(value, optionUrl)
    }}>{tag}</Popconfirm>
  }

  const fromcolumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      hideInTable: true,
    },
    {
      title: 'VLAN',
      dataIndex: 'vlanID',
      align: 'center',
      width: '15%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            pattern: regMacList.vlanid.regex,
            message: regMacList.vlanid.alertText,
          },
          {
            required: true,
            message: language('project.sysconf.syscert.required'),
          },
          {
            validator: (rule, value) => {
              if (!isSave) {
                return Promise.reject(language('project.pleasesavedata'))
              } else {
                return Promise.resolve()
              }
            },
          },
        ],
      },
    },
    {
      title: language('project.monitor.crossed.addr'),
      dataIndex: 'netAddr',
      align: 'left',
      width: '25%',
      ellipsis: true,
      formItemProps: (form, {rowKey}) => {
        return { rules: [
          {
            required: true,
            message: language('project.sysconf.syscert.required'),
          },
          {
            pattern: regIpList.ipv4.regex,
            message: regIpList.ipv4.alertText,
          },
          {
            validator: (rule, value) => {
              let list = []
              dataSource?.forEach((item) => {
                list.push(item?.netAddr)
              })
              const dataindex = list.findIndex((item)=>item===value)
              if (rowKey!=dataSource[dataindex]?.id&&dataindex>=0) {
                return Promise.reject(language('monitor.crossed.isSametext'))
              } else if (!isSave) {
                return Promise.reject(language('project.pleasesavedata'))
              } else {
                return Promise.resolve()
              }
            },
          },
        ],}
      },
    },
    {
      title: language('project.monitor.crossed.netmask'),
      dataIndex: 'netMask',
      align: 'center',
      width: '15%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.sysconf.syscert.required'),
          },
          {
            pattern: regList.mask.regex,
            message: regList.mask.alertText,
          },
          {
            validator: (rule, value) => {
              if (!isSave) {
                return Promise.reject(language('project.pleasesavedata'))
              } else {
                return Promise.resolve()
              }
            },
          },
        ],
      },
    },
    {
      title: language("probers.hdprobe.hdprobeconfig.deteAddrType"),
      dataIndex: 'deteAddrType',
      align: 'left',
      width: '18%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.sysconf.syscert.required'),
          },
          {
            validator: (rule, value) => {
              if (!isSave) {
                return Promise.reject(language('project.pleasesavedata'))
              } else {
                return Promise.resolve()
              }
            },
          },
        ],
      },
      valueType: "select",
      request: () => [
        {
          value: 0,
          label: language("probers.hdprobe.hdprobeconfig.auto")
        },
        {
          value: 1,
          label: language("probers.hdprobe.hdprobeconfig.handle")
        }
      ],
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: (e) => {
            console.log(e)
          },
          allowClear: false
          // defaultValue: "auto"
        }
      }
    },
    {
      title: language("probers.hdprobe.hdprobeconfig.deteAddr"),
      dataIndex: 'deteAddr',
      align: 'left',
      width: '25%',
      ellipsis: true,
      formItemProps:(key, value, config, index) => {
        return {
          rules: [
            {
              validator: (values) => {
                const { field } = values
                // 获取当前行数据
                const current = editForm.getFieldValue(`${field.split(".")[0]}`) || {}
                if (current.deteAddrType == 1 && !current.deteAddr) { // 如果产品分类选择必填,产品名称校验
                  return Promise.reject(new Error(language('project.sysconf.syscert.required')))
                }
                return Promise.resolve()
              }
            },
            {
              validator: (values) => {
                const { field } = values
                // 获取当前行数据
                const current = editForm.getFieldValue(`${field.split(".")[0]}`) || {}
                if (current.deteAddrType == 1) {
                   if (!regIpList.ipv4.regex.test(current.deteAddr)) {
                    return Promise.reject(new Error(regIpList.ipv4.alertText))
                   }
                   return Promise.resolve()
                }
                return Promise.resolve()
              },
            },
            {
              validator: (rule, value) => {
                if (!isSave) {
                  return Promise.reject(language('project.pleasesavedata'))
                } else {
                  return Promise.resolve()
                }
              },
            },
          ],
        }
      },
      renderFormItem: (_, config, data) => {
        if (config.record.deteAddrType == 1) {
          return <Input defaultValue={""} allowClear />
        } else {
          return <Input disabled value={config.record.deteAddr} />
        }
      },
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: '15%',
      align: 'center',
      render: (text, record, _, action) => [
        <Tooltip placement="top" title={language('project.edit')}>
          <EditOutlined 
            style={{ 
              cursor: 'pointer',  
              color: '#1890ff' 
            }} 
            onClick={() => {
              action.startEditable?.(record.id)
            }} 
          />
        </Tooltip>,
        <Popconfirm
          okText={language('project.yes')}
          cancelText={language('project.no')}
          title={language('project.delconfirm')}
          onConfirm={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id))
          }}
        >
          <Tooltip placement="top" title={language('project.del')}>
            <a key="delete" style={{ color: 'red' }}>
              <DeleteOutlined />
            </a>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ]

  useEffect(() => {
    setLoading(true)
    getOutline()
    getConfig()
  }, [])

  let rowkey = (record => record.id);
  const tableKey = 'hdprbeuptable';
  const apishowurl = '/cfg.php?controller=probeManage&action=showHrdprbUpgrade'
  const concealColumns = {
    id: { show: false },
  }
  const formRef = useRef()
  const [editForm] = Form.useForm()
  const [isEqual, setIsEqual] = useState('')
  const [outlineData, setOutlineData] = useState([])
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [isSave, setIsSave] = useState(true)
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const [oldCfgName, setOldCfgName] = useState('');
  const [isSubmit, setIsSubmit] = useState('');
  const maxSize = 200; // 最大文件上传体积
	const accept = '.tgz,'; // 限制文件上传类型
	const upurl = '/cfg.php?controller=probeManage&action=hrdprbUpload'; // 上传接口
	const isShowUploadList = false; // 是否回显文件名与进度条
	const maxCount = 1; // 最大上传文件数量
	const isUploading = true;
	const isUpsuccess = true;
	const onUploading = (info) => {
		setLoading(true)
	}
  
  const isRepeat = (ary) => {
    let hash = {}
    for (var i in ary) {
      if (hash[ary[i]]) {
        return true
      }
      hash[ary[i]] = true
    }
    return false
  }

  const tableTopSearch = () => {
    return (
      <div className='hdprbFlexdiv'>
        <Alert
          className="hdpbAlert"
          type="info"
          showIcon
          message={language('project.temporary.terminal.probealert')}
        />
        {!writable ? <></> :
          <WebUploadr
            isUploading={isUploading} 
            isUpsuccess={isUpsuccess} 
            isAuto={true} 
            upbutext={language('project.upload')} 
            maxSize={maxSize} 
            upurl={upurl} 
            accept={accept} 
            isShowUploadList={isShowUploadList}
            maxCount={maxCount} 
            onSuccess={onSuccess} 
            onUploading={onUploading}
          />
        }
      </div>
    )
  }

  const onSuccess = (res) => {
		setLoading(false)
		// if (!res.success) {
		// 	message.error(res.msg)
    //   return false
		// }
		message.success(res.msg)
    setIncID(incID+1)
	}

  const getConfig = () => {
    post('/cfg.php?controller=probeManage&action=showHrdprbCfg').then((res) => {
      if (!res.success) {
        setLoading(false)
        message.error(res.msg)
        return false
      }
      setOldCfgName(res.vioConfig)
      formRef.current.setFieldsValue(res)
      setLoading(false)
      setDataSource(res?.netRange ? res?.netRange : [])
    })
  }

  const getOutline = () => {
    post('/cfg.php?controller=monitorManage&action=getOutlineAllCfg')
      .then((res) => {
        setOutlineData(res.data)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // 上传解析xlsx文件
  const HandleImportFile = (info) => {
    setLoading(true)
    let files = info.file
    // 获取文件名称
    let name = files.name
    // 获取文件后缀
    let suffix = name.substr(name.lastIndexOf('.'))
    let reader = new FileReader()
    reader.onload = (event) => {
      try {
        // 判断文件类型是否正确
        if ('.xls' != suffix && '.xlsx' != suffix && '.csv' != suffix) {
          setLoading(false)
          message.error(language('monitor.crossed.filetypensg'))
          return false
        }
        let { result } = event.target
        // 读取文件
        let workbook = XLSX.read(result, { type: 'binary' })
        let data = []
        let filedata = []
        // 循环文件中的每个表
        for (let sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 将获取到表中的数据转化为json格式
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
            filedata[sheet] = filedata.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            )
          }
        }
        if (data.length < 1 || data[0].VLAN == '') {
          setLoading(false)
          message.error(language('monitor.crossed.emptyData.msg'))
          return false
        }
        if (data.length > 128) {
          data = data.slice(0, 128)
        }
        const excelData = filedata.mySheet
        const excelHead = []
        for (const hearArr in excelData[0]) {
          if (hearArr === "__EMPTY") {
            setLoading(false);
            message.error(language("nbg.upload.excelHead.error"));
            return false;
          }
          excelHead.push(hearArr)
        }
        if (excelHead.length != 5) {
          setLoading(false)
          message.error(language('monitor.crossed.erroruptext'))
          return false
        }
        let list = []
        data.map((item, index) => {
          let eath = []
          eath['id'] = index
          eath['vlanID'] = item[excelHead[0]]
          eath['netAddr'] = item[excelHead[1]]
          eath['netMask'] = item[excelHead[2]]
          eath['deteAddrType'] = item[excelHead[3]] == "手动指定" ? 1 : 0
          eath['deteAddr'] = item[excelHead[4]]
          list.push(eath)
        })
        let isPass = true;
        for (let key in list) {
          if (!list[key].vlanID && !list[key].netAddr && !list[key].netMask) {
            isPass = false;
            setLoading(false);
            message.error(language('monitor.crossed.emptyData.msg'))
          }
          if (!list[key].vlanID || !regMacList.vlanid.regex.test(list[key].vlanID)) {
            isPass = false;
            setLoading(false);
            message.error(language("nbg.upload.vlan.error"));
            return false;
          } else if (!list[key].netAddr || !regIpList.ipv4.regex.test(list[key].netAddr)) {
            isPass = false;
            setLoading(false);
            message.error(language("nbg.upload.addr.error"));
            return false;
          } else if (!list[key].netMask || !regList.mask.regex.test(list[key].netMask)) {
            isPass = false;
            setLoading(false);
            message.error(language("nbg.upload.netmask.error"));
            return false;
          } else {
            isPass = true;
          }
        }
        if (isPass) {
          setLoading(false);
          setDataSource(list);
          message.success(language('monitor.crossed.successuptext'));
        }
      } catch (e) {
        setLoading(false)
        message.error(language('monitor.crossed.filrerrormsg'))
      }
    }
    reader.readAsBinaryString(files)
  }

  const exportExcelFile = () => {
    let header = []
    fromcolumns.map((item, index) => {
      header.push(item.title)
    })
    let list = []
    if (dataSource.length < 1) {
      let tmp = {}
      tmp[header[1]] = ''
      tmp[header[2]] = ''
      tmp[header[3]] = ''
      tmp[header[4]] = ''
      tmp[header[5]] = ''
      list.push(tmp)
    } else {
      dataSource.map((item) => {
        let tmp = {}
        tmp[header[1]] = item.vlanID
        tmp[header[2]] = item.netAddr
        tmp[header[3]] = item.netMask
        tmp[header[4]] = item.deteAddrType == 0 ? language("probers.hdprobe.hdprobeconfig.auto") : language("probers.hdprobe.hdprobeconfig.handle")
        tmp[header[5]] = item.deteAddr
        list.push(tmp)
      })
    }
    console.log(list)
    exportExcel(list, 'hrdprbvlan.csv')
  }

  const setConfig = () => {
    let values = formRef.current.getFieldsValue(['vioConfig', 'vioInfo'])
    setOldCfgName(values.vioConfig)/* 修改前的外联配置 */
    let outlineCfgName = '';/* 修改后的外联配置*/
    outlineData.map((item) => {
      if (item.value == values.vioConfig) {
        outlineCfgName = item.value
      }
    })
    let data = {}
    data.oldCfgName = oldCfgName ? oldCfgName : outlineCfgName; 
    data.vioConfig = outlineCfgName.length === 0 ? oldCfgName: outlineCfgName;
    data.vioInfo = values.vioInfo;
    dataSource.map((item) => {
      if (item.index) {
        delete item.index;
        delete item.id
      }
    })
    data.netRange = dataSource;
    post('/cfg.php?controller=probeManage&action=setHrdprbCfg', data).then(
      (res) => {
        if(!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        getConfig()
      }
    )
  }

  const optionFn = (value, optionUrl) => {
    let data = {};
    data.id = value.id
    post(optionUrl, data).then((res) => {
      if(!res.success) {
        message.error(res.msg)
        return false
      }
      setIncID(incID+1)
    })
  }

  return (
    <>
      <Spin size="large" spinning={loading}>
        <ProCard className='hdprobeCard'>
          <ProForm
            {...formleftLayout}
            formRef={formRef}
            autoFocusFirstInput
            submitTimeout={2000}
            submitter={{
              render: (props, doms) => {
                return [
                  <Row>
                    <Col offset={6}>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        disabled={!writable}
                        style={{
                          marginTop: '20px',
                          borderRadius: 5,
                          width: '90px',
                        }}
                        onClick={() => {
                          if (editForm.getFieldsError().length > 0) {
                            message.error(language('project.enterAndSaveMsg'))
                            return false
                          }
                          let list = [];
                          dataSource.forEach(item => {
                              list.push(item.netAddr)
                          });
                          let isSame = isRepeat(list)
                          if (isSame) {
                            message.error(language('monitor.crossed.isSametext'))
                          } else if (isEqual) {
                            message.error(language('monitor.crossed.isSametext'))
                          } else {
                            setIsSubmit('finish')
                            formRef.current.submit();
                          }
                        }}
                      >
                        {language('project.set')}
                      </Button>
                    </Col>
                  </Row>,
                ]
              },
            }}
            onFinish={(fvalues) => {
              if (isSubmit == 'finish') {
                setConfig(fvalues)
              }
            }}
          >
            <ProFormSelect
              name="vioConfig"
              width="250px"
              label={language('project.monitor.illegal.outlinecfgname')}
              options={outlineData}
            />
            <div className='vioInfoDiv'>
              <ProFormCheckbox.Group
                name="vioInfo"
                label={language('project.temporary.srcprobes.monitorItems')}
                options={[
                  {
                    label: language('probers.teprobe.ckInOut'),
                    value: 'vioOutline',
                  },
                  {
                    label: language('probers.teprobe.vioSrv'),
                    value: 'vioServer',
                  },
                  {
                    label: language('probers.teprobe.vioDev'),
                    value: 'vioDevice',
                  },
                ]}
              />
            </div>
            <ProFormText label={language('project.monitor.crossed.listen')}>
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  style={{ width: 150 }}
                  onClick={exportExcelFile}
                >
                  {language('monitor.crossed.exportVLAN')}
                </Button>
                <Upload
                  accept=".xlsx, .csv"
                  maxCount={1}
                  showUploadList={false}
                  customRequest={HandleImportFile}
                >
                  <Button icon={<UploadOutlined />} style={{ width: 150 }}>
                    {language('project.monitor.crossed.enter')}
                  </Button>
                </Upload>
              </Space>
            </ProFormText>
            <Col offset={6}>
              <div name="netRange">
                <EditTable
                  tableWidth={720}
                  tableHeight={170}
                  columns={fromcolumns}
                  deleteButShow={false}
                  addButPosition="top"
                  dataSource={dataSource}
                  setIsSave={setIsSave}
                  setDataSource={setDataSource}
                  editForm={editForm}
                />
              </div>
            </Col>
          </ProForm>
        </ProCard>
        <div className="divider">
          <span className="leftLine"></span>
          <span className="txt">{language('probers.hdprobe.tableTitle')}</span>
          <span className="rightLine"></span>
        </div>
        <div className="hdpbconTable">
          <ProtableModule
            columns={columns}
            apishowurl={apishowurl}
            concealColumns={concealColumns}
            searchText={tableTopSearch()}
            clientHeight={store.get('layout')==='top'? 229 : 280}
            tableKey={tableKey}
            rowkey={rowkey}
            incID={incID}
            columnvalue={'hdprobeconfig'}
          />
        </div>
      </Spin>
    </>
  )
}

export default Hdprobeconfig
