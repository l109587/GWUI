import React, { useRef, useState, useEffect } from 'react'
import { language } from '@/utils/language'
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components'
import {
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
} from '@ant-design/icons'
import exportExcel from '@/utils/exportExcel'
// import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import EditTable from '../../monitor/mapping/components/assetIdentification/editTable'
import * as XLSX from 'xlsx'
import {
  Button,
  Row,
  Col,
  Spin,
  Space,
  Upload,
  message,
  Popconfirm,
  Tooltip,
  Form,
  Input,
} from 'antd'
import { formleftLayout } from '@/utils/helper'
import '@/utils/index.less'
import './chkcnfo.less'
import { post, get } from '@/services/https'
import { regIpList, regList, regMacList } from '@/utils/regExp'
import { fetchAuth } from '@/utils/common';

export default () => {
  const writable = fetchAuth()
  const formRef = useRef()
  const conformRef = useRef()
  const [loading, setLoading] = useState(true)
  const [isSave, setIsSave] = useState(true)
  const [dataSource, setDataSource] = useState([])
  const [isSubmit, setIsSubmit] = useState('');
  const [isEqual, setIsEqual] = useState(false)
  const [editForm] = Form.useForm()

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
      width: '20%',
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
              dataSource.forEach((item) => {
                list.push(item.netAddr)
              })
              const dataindex = list.findIndex((item)=>item===value)
              if (rowKey!=dataSource[dataindex]?.id&&dataindex>=0) {
                return Promise.reject(language('monitor.crossed.isSametext'))
              } else if (!isSave) {
                return Promise.reject(language('project.pleasesavedata'))
              }
               else {
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
                if (current.deteAddrType == 1 && !current.deteAddr) {
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
    getOutConfig()
    getMonitConfig()
  }, [])

  const getOutConfig = () => {
    post('/cfg.php?controller=probeManage&action=showHrdprbOutlineCfg').then(
      (res) => {
        if (!res.success) {
          message.error(res.msg)
          setLoading(false)
          return false
        }
        formRef.current.setFieldsValue(res)
        setLoading(false)
      }
    )
  }

  const getMonitConfig = () => {
    post('/cfg.php?controller=probeManage&action=showHrdprbMonitorCfg').then(
      (res) => {
        if (!res.success) {
          message.error(res.msg)
          setLoading(false)
          return false
        }
        conformRef.current.setFieldsValue(res)
        setDataSource(res.netRange)
        setLoading(false)
      }
    )
  }

  /* 表格数据导出方法 */
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
    exportExcel(list, 'hrdprbvlan.csv')
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

  const setOutConfig = () => {
    let values = formRef.current.getFieldsValue(['rptFlag', 'rptAddr'])
    post('/cfg.php?controller=probeManage&action=setHrdprbOutlineCfg', values).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    })
  }

  const setMonitConfig = () => {
    let values = conformRef.current.getFieldsValue(['vioInfo']);
    let data = {};
    data.vioInfo = values.vioInfo;
    dataSource.map((item) => {
      if (item.index) {
        delete item.index;
        delete item.id
      }
    })
    data.netRange = dataSource;
    post('/cfg.php?controller=probeManage&action=setHrdprbMonitorCfg', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      getMonitConfig()
      message.success(res.msg);
    })
  }

  return (
    <Spin spinning={loading}>
      <ProCard
        ghost
        direction="column"
        gutter={[16, 16]}
        className="chkconfCard"
      >
        <ProCard className="outCfgCard" title={language('project.monitor.crossed.outline')}>
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
                        style={{
                          marginTop: 8,
                          borderRadius: 5,
                          width: '90px',
                        }}
                        disabled={!writable}
                        icon={<SaveOutlined />}
                        onClick={() => {
                          props.submit()
                        }}
                      >
                        {language('project.set')}
                      </Button>
                    </Col>
                  </Row>,
                ]
              },
            }} onFinish={() => {
              setOutConfig();
            }}
          >
            <ProFormText label={language('illevent.netseries.flag')} name="rptFlag" rules={[
              {
                pattern: regList.numPa8.regex,
                message: regList.numPa8.alertText,
              }
            ]} />
            <ProFormText label={language('prbmgt.chkconf.rptAddr')} name="rptAddr" rules={[
              {
                pattern: regIpList.ipv4.regex,
                message: regIpList.ipv4.alertText,
              }
            ]} />
          </ProForm>
        </ProCard>
        <ProCard title={language('prbmgt.chkconf.monCardTitle')}>
          <ProForm
            {...formleftLayout}
            formRef={conformRef}
            autoFocusFirstInput
            submitTimeout={2000}
            submitter={{
              render: (props, doms) => {
                return [
                  <Row>
                    <Col offset={6}>
                      <Button
                        type="primary"
                        style={{
                          marginTop: 17,
                          borderRadius: 5,
                          width: '90px',
                        }}
                        disabled={!writable}
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
                            conformRef.current.submit();
                          }
                        }}
                        icon={<SaveOutlined />}
                      >
                        {language('project.set')}
                      </Button>
                    </Col>
                  </Row>,
                ]
              },
            }}
            onFinish={() => {
              if (isSubmit == 'finish') {
                setMonitConfig()
              }
            }}
          >
            <ProFormCheckbox.Group
              name="vioInfo"
              label={language('prbmgt.chkconf.vioInfo')}
              options={[
                {
                  label: language('project.monitor.illegal.outline'),
                  value: 'vioOutline',
                },
                {
                  label: language('project.monitor.montask.vioSrvtext'),
                  value: 'vioServer',
                },
                {
                  label: language('probers.teprobe.vioDev'),
                  value: 'vioDevice',
                },
              ]}
            />
            <ProFormText label={language('project.monitor.crossed.listen')}>
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  style={{ width: 150 }}
                  onClick={exportExcelFile}
                  disabled={!writable}
                >
                  {language('monitor.crossed.exportVLAN')}
                </Button>
                <Upload
                  accept=".xlsx, .csv"
                  maxCount={1}
                  showUploadList={false}
                  customRequest={HandleImportFile}
                >
                  <Button icon={<UploadOutlined />} style={{ width: 150 }} disabled={!writable}>
                    {language('project.monitor.crossed.enter')}
                  </Button>
                </Upload>
              </Space>
            </ProFormText>
            <Col offset={6}>
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
            </Col>
          </ProForm>
        </ProCard>
      </ProCard>
    </Spin>
  )
}
