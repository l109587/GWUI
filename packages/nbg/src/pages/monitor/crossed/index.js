import React, { useRef, useState, useEffect } from 'react'
import {
  DownloadOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { ProTable, EditableProTable, ProCard } from '@ant-design/pro-components'
import ProForm, {
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-form'
import { formleftLayout, violationitem } from '@/utils/helper'
import {
  Search,
  Button,
  Row,
  Col,
  Form,
  Popconfirm,
  Tooltip,
  Space,
  Tag,
  message,
  Upload,
  Spin,
  Input,
} from 'antd'
import { post, get } from '@/services/https'
import * as XLSX from 'xlsx'
import store from 'store'
import '@/utils/index.less'
import './index.less'
import Title from 'antd/lib/skeleton/Title'
import { fetchAuth } from '@/utils/common'
import { regMacList, regIpList, regList } from '@/utils/regExp'
// import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import EditTable from '../mapping/components/assetIdentification/editTable'
import { language } from '@/utils/language'
import exportExcel from '@/utils/exportExcel'

export default () => {
  const writable = fetchAuth()
  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false)
        const tableDataSource = formRef.current.getFieldsValue([
          'scanRangeInfo',
        ])
      }}
      key="popconfirm"
      title={language('project.delconfirm')}
      okButtonProps={{
        loading: confirmLoading,
      }}
      okText={language('project.yes')}
      cancelText={language('project.no')}
    >
      <a>{text}</a>
    </Popconfirm>
  )

  const fromcolumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      hideInTable: true,
    },
    {
      title: 'VLAN',
      dataIndex: 'vlan',
      align: 'center',
      width: '15%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            pattern: regMacList.vlan.regex,
            message: regMacList.vlan.alertText,
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
      dataIndex: 'addr',
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
                list.push(item?.addr)
              })
              const dataindex = list.findIndex((item)=>item===value)
              if (rowKey!=dataSource[dataindex]?.id&&dataindex>=0) {
                return Promise.reject(new Error(language('monitor.illegal.urlissame.msg')))
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
      dataIndex: 'netmask',
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

  const formRef = useRef()
  const actionRef = useRef()
  const [editForm] = Form.useForm()
  const [dataSource, setDataSource] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [initialValue, setInitialValue] = useState()
  const [selectdata, setSelectdata] = useState([])
  const [oldCfgName, setOldCfgName] = useState([])
  const [trunkdata, setTrunkdata] = useState([])
  const [switchChecked, setSwitchChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSave, setIsSave] = useState(true) // 未保存当前数据不可下发
  const [editableKeys, setEditableRowKeys] = useState(() =>
    dataSource.map((item) => item.id)
  ) //每行编辑的id
  const [isSubmit, setIsSubmit] = useState('')
  const [isEqual, setIsEqual] = useState('')

  useEffect(() => {
    getTrunk()
  }, [])

  const getFind = (outlineVal, trunklist) => {
    setLoading(true)
    post('/cfg.php?controller=monitorManage&action=showNetcrossCfg')
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        let checked = false
        if (res.switch == 'Y') {
          checked = true
        }
        res.switch = checked
        setSwitchChecked(checked)
        setLoading(false)
        let obj = res
        if (!res.outlineCfgName && outlineVal.length > 0) {
          obj.outlineCfgName = outlineVal[0].value
        } else if (res.outlineCfgName) {
          obj.outlineCfgName = res.outlineCfgName
        } else {
          obj.outlineCfgName = ''
        }
        if (!res.interfaceName && trunklist.length > 0) {
          obj.interfaceName = trunklist[0].value
        } else if (res.interfaceName) {
          obj.interfaceName = res.interfaceName
        } else {
          obj.interfaceName = ''
        }
        setOldCfgName(obj.outlineCfgName) /* 修改前的外联配置 */
        formRef.current.setFieldsValue(obj)
        setDataSource(res.moniterScope)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getselect = (trunklist) => {
    post('/cfg.php?controller=monitorManage&action=getOutlineAllCfg')
      .then((res) => {
        setSelectdata(res.data)
        getFind(res.data, trunklist)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getTrunk = () => {
    post('/cfg.php?controller=monitorManage&action=getNcInfList')
      .then((res) => {
        if (!res.success) {
          return false
        }
        let list = []
        res.data.map((item) => {
          let tmp = []
          tmp['label'] = item.text
          tmp['value'] = item.value
          list.push(tmp)
        })
        setTrunkdata(list)
        getselect(res.data)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const setForm = () => {
    let obj = formRef.current.getFieldsValue([
      'switch',
      'interfaceName',
      'outlineCfgName',
      'moniterScope',
    ])
    setOldCfgName(obj.outlineCfgName) /* 修改前的外联配置 */
    let outlineCfgName = '' /* 修改后的外联配置*/
    selectdata.map((item) => {
      if (item.value == obj.outlineCfgName) {
        outlineCfgName = item.value
      }
    })
    let data = {}
    data.switch = obj.switch ? 'Y' : 'N'
    data.interfaceName = obj.interfaceName
    data.oldCfgName = oldCfgName
    data.outlineCfgName =
      outlineCfgName.length === 0 ? oldCfgName : outlineCfgName
    data.moniterScope = dataSource
    post('/cfg.php?controller=monitorManage&action=setNetcrossCfg', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(res.msg)
        getTrunk()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // 上传
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
        if (data.length < 1 || data[0].VLAN == "") {
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
          message.error(language('monitor.crossed.erroruptext'))
          setLoading(false)
          return false
        }
        let list = []
        data.map((item, index) => {
          let eath = []
          eath['id'] = index
          eath['vlan'] = item[excelHead[0]]
          eath['addr'] = item[excelHead[1]]
          eath['netmask'] = item[excelHead[2]]
          eath['deteAddrType'] = item[excelHead[3]] == "手动指定" ? 1 : 0
          eath['deteAddr'] = item[excelHead[4]]
          list.push(eath)
        })
        let isPass = true;
        for (let key in list) {
          if (!list[key].vlan && !list[key].addr && !list[key].netmask) {
            isPass = false;
            setLoading(false);
            message.error(language('monitor.crossed.emptyData.msg'))
          }
          if (!list[key].vlan || !regMacList.vlan.regex.test(list[key].vlan)) {
            isPass = false;
            setLoading(false);
            message.error(language("nbg.upload.vlan.error"));
            return false;
          } else if (!list[key].addr || !regIpList.ipv4.regex.test(list[key].addr)) {
            isPass = false;
            setLoading(false);
            message.error(language("nbg.upload.addr.error"));
            return false;
          } else if (!list[key].netmask || !regList.mask.regex.test(list[key].netmask)) {
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
        tmp[header[1]] = item.vlan
        tmp[header[2]] = item.addr
        tmp[header[3]] = item.netmask
        tmp[header[4]] = item.deteAddrType == 0 ? language("probers.hdprobe.hdprobeconfig.auto") : language("probers.hdprobe.hdprobeconfig.handle")
        tmp[header[5]] = item.deteAddr
        list.push(tmp)
      })
    }
    exportExcel(list, 'netcrossVlan.xlsx')
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

  return (
    <div className="crossedContent">
      <Spin spinning={loading}>
        <ProCard
          title={language('project.monitor.crossed.cardtitle')}
        >
          <ProForm
            className="seriform"
            {...formleftLayout}
            initialvalue={initialValue}
            formRef={formRef}
            submitter={{
              render: (props, doms) => {
                return [
                  <Row>
                    <Col span={14} offset={6}>
                      <Button
                        type="primary"
                        key="subment"
                        disabled={!writable}
                        style={{
                          paddingLeft: 0,
                          paddingRight: 0,
                          borderRadius: 5,
                          width: '90px',
                          lineHeight: 1.5,
                        }}
                        onClick={() => {
                          if (editForm.getFieldsError().length > 0) {
                            message.error(language('project.enterAndSaveMsg'))
                            return false
                          }
                          let list = []
                          dataSource.forEach((item) => {
                            list.push(item.addr)
                          })
                          let isSame = isRepeat(list)
                          if (isSame) {
                            message.error(
                              language('monitor.crossed.isSametext')
                            )
                          } else if (isEqual) {
                            message.error(
                              language('monitor.crossed.isSametext')
                            )
                          } else if (!isSave) {
                            message.error(language('project.pleasesavedata'))
                          } else {
                            setIsSubmit('finish')
                            formRef.current.submit()
                          }
                        }}
                      >
                        <SaveOutlined />
                        {language('project.set')}
                      </Button>
                    </Col>
                  </Row>,
                ]
              },
            }}
            onFinish={(values) => {
              if (isSubmit == 'finish') {
                setForm()
              }
            }}
          >
            <ProFormSwitch
              name="switch"
              label={language('project.monitor.crossed.network')}
              checkedChildren={language('project.open')}
              unCheckedChildren={language('project.close')}
            />
            {/* <>开启网络串线发现</> */}
            <ProFormSelect
              style={{ width: 250 }}
              placeholder={language('project.select')}
              name="interfaceName"
              label={language('project.monitor.crossed.lishten')}
              options={trunkdata}
            />
            <Col className="cortextCol" offset={6}>
              <span className="textMessage">
                {language('project.monitor.crossed.netword')}
              </span>
            </Col>
            <ProFormSelect
              style={{ width: 250 }}
              name="outlineCfgName"
              label={language('project.monitor.crossed.outline')}
              options={selectdata}
            />
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
                  accept=".xlsx"
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
            <Col className="mooniterCol" offset={6}>
              <ProForm.Item name="moniterScope">
                <EditTable
                  setIsSave={setIsSave}
                  columns={fromcolumns}
                  tableHeight={170}
                  tableWidth={720}
                  addButPosition="top"
                  dataSource={dataSource}
                  deleteButShow={false}
                  setDataSource={setDataSource}
                  editForm={editForm}
                />
              </ProForm.Item>
            </Col>
          </ProForm>
        </ProCard>
      </Spin>
    </div>
  )
}
