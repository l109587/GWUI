import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Button, Switch, Popconfirm, Col, Tag } from 'antd';
import { EditFilled, DeleteFilled, SaveFilled, ExclamationCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { post } from '@/services/https';
import { ProCard } from '@ant-design/pro-components';
import ProForm, { ModalForm, ProFormText, ProFormDigit, ProFormTimePicker, ProFormSelect, ProFormSwitch, ProFormRadio } from '@ant-design/pro-form';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { modalFormLayout, formleftLayout, procardgutter, defaultModalFormLayout, defaultUserSync } from "@/utils/helper";
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import { regMacList, regPortList } from '@/utils/regExp';
import { TableLayout, PolicyTable } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
let H = document.body.clientHeight - 336
var clientHeight = H
export default () => {

  let logTypeList = [];
  const columns = [
    {
      title: language('evtlog.reportcfg.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
      width: 80,
    },
    {
      title: language('evtlog.reportcfg.state'),
      dataIndex: 'state',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 80,
      filters: true,
      filterMultiple: false,
      valueEnum: {
        Y: { text: language('project.open') },
        N: { text: language('project.close') },
      },
      render: (text, record, index) => {
        let checked = true;
        if (record.state == 'N') {
          checked = false;
        }
        return (<
          Switch checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
          checked={checked}
          onChange={
            (checked) => {
              save(record, 1, checked);
            }
          }
        />
        )
      },
    },
    {
      title: language('evtlog.reportcfg.name'),
      dataIndex: 'name',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('evtlog.reportcfg.reportingaddress'),
      dataIndex: 'rptAddr',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('evtlog.reportcfg.type'),
      dataIndex: 'logType',
      align: 'left',
      ellipsis: true,
      width: 130,
      render: (text, record, _, action) => {
        let label;
        let list = logType.length >= 1 ? logType : logTypeList;
        list.map((item) => {
          if (item.value == record.logType) {
            label = item.text;
          }
        })
        if (label) {
          return label;
        }
      }
    },
    {
      title: language('evtlog.reportcfg.forwardingaddress'),
      dataIndex: 'fwdAddr',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('evtlog.reportcfg.forwardingport'),
      dataIndex: 'fwdPort',
      align: 'left',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('evtlog.reportcfg.forwardingmethod'),
      dataIndex: 'fwdType',
      align: 'left',
      ellipsis: true,
      render: (_, record, index) => {
        let text = '';
        let color = '';
        let content = '';
        if (record.fwdType == 'DL') {
          text = language('evtlog.reportcfg.forwardnow');
          color = '#101010'
        } else if (record.fwdType == 'DT') {
          text = language('evtlog.reportcfg.timedforwarding');
          content = record.content ? record.content + '时刻' : '';
          color = '#FF7429'
        } else if (record.fwdType == 'DM') {
          text = language('evtlog.reportcfg.quantitaiveforwarding');
          content = record.content ? record.content + '条' : '';
          color = '#1890FF'
        } else if (record.fwdType == 'DI') {
          text = language('evtlog.reportcfg.periodicfrowarding');
          content = record.content ? record.content + language('evtlog.reportcfg.minute') : '';
          color = '#1890FF'
        }
        if (text) {
          return <Tag style={{ marginRight: '0px', color: record.fwdType == 'DL' ? '#101010 !important' : '#FFFFFF' }} color={record.fwdType != 'DL' ? color : false} key={text}>{text}<span style={{ marginLeft: content ? 3 : 0 }}>{content}</span></Tag>;
        }
      },
    },
    {
      disable: true,
      title: language('project.mconfig.operate'),
      align: 'center',
      valueType: 'option',
      fixed: 'right',
      width: 130,
      ellipsis: true,
      render: (text, record, _, action) => [
        <>
          <a key="editable"
            onClick={() => {
              mod(record, 'mod');
            }}>
            {language('project.deit')}
          </a>
          <>{renderRemove(language('project.del'), record)}</>
        </>
      ],
    },
  ];

  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [op, setop] = useState('mod');//选中id数组
  const [fwdTypeContent, setFwdTypeContent] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [logType, setLogType] = useState([]);
  const fwdTypeList = [
    { label: language('evtlog.reportcfg.forwardnow'), value: 'DL' },
    { label: language('evtlog.reportcfg.timedforwarding'), value: 'DT' },
    { label: language('evtlog.reportcfg.quantitaiveforwarding'), value: 'DM' },
    { label: language('evtlog.reportcfg.periodicfrowarding'), value: 'DI' },
  ]

  /** table组件 start */
  const rowKey = (record => record.id);//列表唯一值
  const tableHeight = clientHeight;//列表高度
  const tableKey = 'reportcfg';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = false; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'reportcfgcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confLogForward&action=show';//接口路径
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy' };//顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
  }


  //删除弹框
  const delClick = (selectedRowKeys, dataList) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: 'delclickbox',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        delList(selectedRowKeys, dataList)
      }
    });
  };

  //添加按钮点击触发
  const addClick = () => {
    let initialValue = [];
    initialValue.fwdType = 'DL';
    setFwdTypeContent('DL')
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValue)
    }, 100);
    getModal(1, 'add');
  }

  /** table组件 end */


  useEffect(() => {
    showLogType();
    showListenPort();
  }, [])

  const showLogType = () => {
    let code = '';
    post('/cfg.php?controller=confLogForward&action=showLogType', { code: code }).then((res) => {
      if (res.success) {
        setLogType(res.data ? res.data : []);
        logTypeList = res.data ? res.data : [];
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  //回显端口数据
  const showListenPort = () => {
    post('/cfg.php?controller=confLogForward&action=showListenPort').then((res) => {
      formRef.current.setFieldsValue(res);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const handleSaveBtn = (values) => {
    post('/cfg.php?controller=confLogForward&action=setListenPort', values).then((res) => {
      if (res.success) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    }).catch(() => {
      console.log('mistake')
    })
  }


  const renderRemove = (text, record) => (
    <Popconfirm onConfirm={() => { delList(record, text) }} key="popconfirm"
      title={language('project.delconfirm')}
      okButtonProps={{
        loading: confirmLoading,
      }} okText={language('project.yes')} cancelText={language('project.no')}>
      <a>{text}</a>
    </Popconfirm>
  );

  //判断是否弹出添加model
  const getModal = (status, op) => {
    if (status == 1) {
      setop(op)
      setModalStatus(true);
    } else {
      setop('mod')
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  //启用禁用
  const statusSave = (record, checked) => {
    let status = 'N';
    if (checked) {
      status = 'Y';
    }
    let id = record.id;
    post('/cfg.php?controller=confBlacklist&action=enableLanBlockIP', { id: id, status: status }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //添加修改接口
  const save = (info, status = false, checked = '') => {
    let data = {};
    data.op = op;
    data.id = info.id;
    if (status) {
      data.state = checked ? 'Y' : 'N';
    } else {
      data.state = info.state == true || info.state == 'Y' ? 'Y' : 'N';
    }
    data.name = info.name;
    data.rptAddr = info.rptAddr;
    data.logType = info.logType;
    data.fwdAddr = info.fwdAddr;
    data.fwdPort = info.fwdPort;
    data.fwdType = info.fwdType;
    data.content = info.content;
    let option = 'set';
    if (op == 'add') {
      option = 'add'
    }
    post('/cfg.php?controller=confLogForward&action=' + option, data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      if (!status) {
        getModal(2)
      }
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })

  }

  //删除数据
  const delList = (record) => {
    let id = record.id;
    post('/cfg.php?controller=confLogForward&action=del', { id: id }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setTimeout(() => {
        setIncID(incID + 1);
      }, 2000);

    }).catch(() => {
      console.log('mistake')
    })

  }

  //编辑
  const mod = (obj, op) => {
    let initialValues = obj;
    setFwdTypeContent(obj.fwdType)
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
  }

  const afterDiv = (unit) => {
    return <div className='basecfgAfterDiv'>{unit}</div>
  }
  return (
    <div>
      <ProCard ghost {...procardgutter}>
        <ProCard title={language('evtlog.reportcfg.port')} >
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
                      icon={<SaveOutlined />}>
                      {language('evtlog.reportcfg.saveconfig')}
                    </Button>
                  </Col>
                )
              }
            }} onFinish={async (values) => {
              handleSaveBtn(values)
            }}>
            <ProFormText
              width='200px'
              name='port'
              label={language('evtlog.reportcfg.listeningport')}
              rules={[
                {
                  required: true,
                  pattern: regPortList.port.regex,
                  message: regPortList.port.alertText
                }
              ]} />
          </ProForm>
        </ProCard>
        <ProCard ghost >
          <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />
        </ProCard>
      </ProCard>
      <ModalForm {...defaultModalFormLayout}
        width='500px'
        formRef={formRef}
        title={op == 'add' ? language('project.add') : language('project.alter')}
        className='blilistmodal'
        visible={modalStatus} autoFocusFirstInput
        modalProps={{
          wrapClassName: 'reportcfgbox',
          maskClosable: false,
          onCancel: () => {
            getModal(2)
          },
        }}

        onVisibleChange={setModalStatus}
        submitTimeout={2000} onFinish={async (values) => {
          save(values);
        }}>
        <ProFormText hidden={true} type="hidden" name="id" label="IP" />
        <ProFormText hidden={true} name="op" label={language('project.sysconf.syszone.opcode')} initialValue={op} />
        <ProFormSwitch checkedChildren={language('project.open')} unCheckedChildren={language('project.close')}
          name='state' label={language('evtlog.reportcfg.state')} />
        <NameText name='name' label={language('evtlog.reportcfg.name')} required={true} />
        <ProFormText name="rptAddr" label={language('evtlog.reportcfg.reportingaddress')} rules={[{ required: true, pattern: regMacList.ip.regex, message: regMacList.ip.alertText }]} />
        <ProFormText name="fwdAddr" label={language('evtlog.reportcfg.forwardingaddress')} rules={[{ required: true, pattern: regMacList.ip.regex, message: regMacList.ip.alertText }]} />
        <ProFormSelect
          options={logType}
          name="logType"
          label={language('evtlog.reportcfg.type')}
          rules={[{ required: true }]}
          fieldProps={{
            fieldNames: {
              label: 'text'
            }
          }}
        />
        <ProFormDigit
          label={language('evtlog.reportcfg.forwardingport')}
          width={301}
          name='fwdPort'
          fieldProps={{ precision: 0, controls: false }}
          rules={[{ required: true, pattern: regPortList.port.regex, message: regPortList.port.alertText }]}
        />
        <div className='fwdatypebox'>
          <ProFormRadio.Group options={fwdTypeList}
            rules={[{ required: true, message: language('project.pleasefill') }]}
            name="fwdType"
            radioType="button"
            label={language('evtlog.reportcfg.forwardingmethod')}
            onChange={(e) => {
              setFwdTypeContent(e.target.value)
            }}
            fieldProps={{
              buttonStyle: 'solid'
            }}
          />
        </div>
        <div style={{ marginLeft: '113px' }}>
          {fwdTypeContent == 'DT' ?
            <ProFormTimePicker
              width={301}
              name='content'
              fieldProps={{
                format: "HH:mm"
              }} />
            : <></>
          }
          {fwdTypeContent == 'DM' ?
            <ProFormDigit
              width={301}
              name='content'
            />
            : <></>
          }
          {fwdTypeContent == 'DI' ?
            <ProFormText
              name='content'
              width={250}
              addonAfter={afterDiv(language('evtlog.reportcfg.minute'))}
              rules={[
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
            : <></>
          }
        </div>

      </ModalForm>
    </div>
  );
};
