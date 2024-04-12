import React, { useRef, useState, useEffect } from 'react';
import { ProCard, ProTable } from '@ant-design/pro-components';
import ProForm, { ProFormSwitch, ProFormTextArea, ProFormText } from '@ant-design/pro-form';
import { language } from '@/utils/language';
import { Col, Button, message, Row } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { post } from '@/services/https';
import { formleftLayout, procardgutter } from '@/utils/helper'
import { regList, regIpList } from '@/utils/regExp';
import WebUploadr from '@/components/Module/webUploadr';
import '@/utils/index.less';
import './index.less';
import { fetchAuth } from '@/utils/common';

const SNMP = () => {
  const writable = fetchAuth()
  const formRef = useRef();
  const formRef1 = useRef();
  const listenFormRef = useRef()
  const [superviseType, setSuperviseType] = useState('XZ') //监管类型
  const [level, setLevel] = useState('') //平台级别
  const [provinceCode, setProvinceCode] = useState('') //省级code
  const [cityCode, setCityCode] = useState('') //市级code
  const [countryCode, setCountryCode] = useState('') //县级code
  const [certData, setCertData] = useState([]) //证书列表
  const [uplisData, setUplisData] = useState([]) //上传证书返回表格数据

  useEffect(() => {
    getData();
    getDevAlarmThreshold();
    fetchData();
  }, [])
  //中心级别配置回显
  const fetchData = () => {
    post('/cfg.php?controller=confCenterManage&action=show').then((res) => {
      if (res.success) {
        const { type, level, sysid, port } = res.data[0]
        const data = { type: type, level: level, sysid: sysid }
        setSuperviseType(type || 'XZ')
        setLevel(level)
        setCertData(res.cert || [])
        if (type === 'XZ') {
          setProvinceCode(res.data[0]?.division[0]?.code || '')
          setCityCode(res.data[0]?.division[1]?.code || '')
          setCountryCode(res.data[0]?.division[2]?.code || '')
        } 
        listenFormRef.current.setFieldsValue({ port: port })
      }
    })
  }
  const getData = () => {
    post('/cfg.php?controller=confDevice&action=getCasIPRange', {}).then((res) => {
      res.state = res.state == 'Y' ? true : false;
      formRef.current.setFieldsValue(res);
    }).catch(() => {
      console.log('mistake')
    })
  };

  const getDevAlarmThreshold = () => {
    post('/cfg.php?controller=confDevice&action=getDevAlarmThreshold', {}).then((res) => {
      formRef1.current.setFieldsValue(res);
    }).catch(() => {
      console.log('mistake')
    })
  };

  const handleSaveBtn = (values) => {
    values.state = values.state ? 'Y' : 'N';
    post('/cfg.php?controller=confDevice&action=setCasIPRange', values).then((res) => {
      if (res.success) {
        message.success(res.msg)
        getData()
      } else {
        message.success(res.msg)
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  const setDevAlarmThreshold = (values) => {
    post('/cfg.php?controller=confDevice&action=setDevAlarmThreshold', values).then((res) => {
      if (res.success) {
        message.success(res.msg)
        getData()
      } else {
        message.success(res.msg)
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  const afterDiv = (unit) => {
    return <div className='basecfgAfterDiv'>{unit}</div>
  }


  const saveConfig = (op) => {
    const { type, level, code, sysid } = formRef.current.getFieldsValue(true)
    const { port } = listenFormRef.current.getFieldsValue(true)
    let params = {}
    if (op === '1') {
      if (type === 'XZ') {
        let div = {}
        if (level === '2') {
          div = { division: `${provinceCode}000000000000` }
        } else if (level === '3') {
          div = { division: `${provinceCode}${cityCode}000000` }
        } else if (level === '4') {
          div = { division: `${provinceCode}${cityCode}${countryCode}` }
        }
        params = { type: type, level: level, sysid: sysid, ...div }
      } else {
        params = { type: type, code: code, sysid: sysid }
      }
    } else {
      params = { port: port }
    }

    post('/cfg.php?controller=confCenterManage&action=set', params).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }

  const updateFinish = (params) => {
    if (params.success) {
      params.msg && message.success(params.msg)
      setUplisData(params.data)
    } else {
      params.msg && message.error(params.msg)
    }
  }

  const UploadRender = (
    <span className={'bauploadButton'}>
      <WebUploadr
        isAuto={true}
        upbutext='上传国密数字证书'
        maxSize={3000}
        upurl="/cfg.php?controller=confCenterManage&action=uploadCert"
        isShowUploadList={false}
        maxCount={1}
        onSuccess={updateFinish}
        isUpsuccess={true}
      />
    </span>
  )

  const lisColumns = [
    {
      title: language('project.sysconf.syscert.issuer'),
      dataIndex: 'issuer',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.subject'),
      dataIndex: 'subject',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.expire'),
      dataIndex: 'expire',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.serial'),
      dataIndex: 'serial',
      width: 250,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      ellipsis: true,
    }
  ]

  return (<>
    <ProCard ghost {...procardgutter}>
      <ProCard title='监听设置' >
        <ProForm
          formRef={listenFormRef} {...formleftLayout}
          autoFocusFirstInput
          submitter={false}
          className={'basuperviseType'}
          onFinish={() => {
            saveConfig('2')
          }}
        >
          <ProFormText label='业务监听端口' name='port' width='140px' addonAfter={UploadRender} />
          <ProFormText label='国密数字证书'>
            <div className='ptablebox'>
            <ProTable
              size="small"
              columns={lisColumns}
              tableStyle={{ width: 700 }}
              // scroll={{ y: 700 }}
              className={'balisTable'}
              tableAlertRender={false}
              search={false}
              options={false}
              dataSource={uplisData.length > 0 ? uplisData : certData}
              pagination={false}
              rowKey="id"
            ></ProTable>
            </div>

          </ProFormText>
          <Row style={{ marginBottom: '16px' }}>
            <Col span={6}></Col>
            <Col>
              <Button
                icon={<SaveOutlined />}
                type="primary"
                htmlType="submit"
              >
                {language('project.sysconf.syscert.saveConf')}
              </Button>
            </Col>
          </Row>
        </ProForm>
      </ProCard>
      <ProCard title={language('dmc.cfgmngt.reglist.devconfigrange')} >
        <ProForm formRef={formRef} {...formleftLayout} autoFocusFirstInput
          submitter={{
            render: (props, doms) => {
              return (
                <Col offset={6}>
                  <Button type='primary' key='subment'
                    style={{ borderRadius: 5 }}
                    onClick={() => {
                      formRef.current.submit();
                    }}
                    disabled={!writable}
                    icon={<SaveOutlined />}>
                    {language('project.savesettings')}
                  </Button>
                </Col>
              )
            }
          }} onFinish={async (values) => {
            handleSaveBtn(values)
          }}>
          <ProFormSwitch label={language('dmc.cfgmngt.reglist.switch')} name='state' checkedChildren={language('project.enable')} unCheckedChildren={language('project.disable')} />
          <ProFormTextArea width='350px' label={language('dmc.cfgmngt.reglist.allowiprange')} name='iprange'
            rules={[{
              pattern: regIpList.multipv4Mask.regex,
              message: regIpList.multipv4Mask.alertText,
            }, { max: 1000 }]}
            extra={language('dmc.cfgmngt.reglist.allowipextra')}
          />
        </ProForm>
      </ProCard>
      <ProCard title={language('dmc.cfgmngt.reglist.devthresholdconfig')} >
        <ProForm className='basecfgfrombox' formRef={formRef1} {...formleftLayout} autoFocusFirstInput
          submitter={{
            render: (props, doms) => {
              return (
                <Col offset={6}>
                  <Button type='primary' key='subment'
                    style={{ borderRadius: 5 }}
                    onClick={() => {
                      formRef1.current.submit();
                    }}
                    disabled={!writable}
                    icon={<SaveOutlined />}>
                    {language('project.savesettings')}
                  </Button>
                </Col>
              )
            }
          }} onFinish={async (values) => {
            setDevAlarmThreshold(values)
          }}>
          <ProFormText width='299px' name='offline' label={language('dmc.cfgmngt.reglist.devofflinethreshold')} addonAfter={afterDiv(language('dmc.cfgmngt.reglist.minute'))} rules={[
            {
              validator: (rule, value) => {
                if (Number(value) < 1 || Number(value) > 1440) {
                  return Promise.reject(new Error(language('project.number.minAndMax', { min: 1, max: 1440 })))
                } else {
                  return Promise.resolve();
                }
              }
            },
          ]} />
          <ProFormText width='299px' name='flow' label={language('dmc.cfgmngt.reglist.reportedtrafficthreshold')} addonAfter={afterDiv('Mbps')} rules={[
            {
              validator: (rule, value) => {
                if (Number(value) < 1) {
                  return Promise.reject(new Error(language('project.number.minVal', { min: 1 })))
                } else {
                  return Promise.resolve();
                }
              }
            },
          ]} />
          <ProFormText width='299px' name='dropdata' label={language('dmc.cfgmngt.reglist.alarmbacklogproportion')} addonAfter={afterDiv('%')} rules={[
            {
              validator: (rule, value) => {
                if (Number(value) < 1 || Number(value) > (100)) {
                  return Promise.reject(new Error(language('project.number.minAndMax', { min: 1, max: 100 })))
                } else {
                  return Promise.resolve();
                }
              }
            },
          ]} />
        </ProForm>
      </ProCard>
    </ProCard>
  </>)
}
export default SNMP;
