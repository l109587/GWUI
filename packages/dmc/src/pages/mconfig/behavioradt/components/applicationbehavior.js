import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProFormText, ProFormSwitch, ProFormDateTimePicker, ProFormSelect } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message } from 'antd';
import { LinkTwo } from '@icon-park/react';
import { InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { regIpList } from '@/utils/regExp';
import { EditTable } from '@/common/editTable';
import CutDropDown from './cutdropdown';
import { TableLayout, PolicyTable, AmTag } from '@/components';
import { ImportAssembly } from '@/common';
import DownnLoadFile from '@/utils/downnloadfile.js';
import Policy from '../../components/policy';
import { post } from '@/services/https';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Behareport = () => {
  //列表数据
  const fromcolumns = [
    {
      title: language('dmcoconfig.bac'),
      dataIndex: 'ip',
      align: 'center',
      formItemProps: () => {
        return {
          rules: [
            {
              validator: (rules, value) => {
                let reg = regIpList.singleipv4Mask.regex;
                if (!reg.test(value)) {
                  return Promise.reject(regIpList.singleipv4Mask.alertText);
                }
                let info = value.split('-')
                let state = true;
                info.map((item) => {
                  if (item == '0.0.0.0/0' || item == '0.0.0.0') {
                    state = false;
                  }
                })
                if (!state) {
                  return Promise.reject(regIpList.singleipv4Mask.alertText);
                }
                return Promise.resolve();
              }
            },
          ],
        };
      },
    },
  ];

  const [fromContData, setFromContData] = useState([]);
  const [jsonParamData, setJsonParamData] = useState([])
  const [auditTypeData, setAuditTypeData] = useState([]);
  let auditTypeList = [];

  const columnlist = [
    {
      title: language('project.analyse.status'),
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      width: 80,
      filters: [
        { text: language('project.open'), value: "Y" },
        { text: language('project.close'), value: "N" },
      ],
      filterMultiple: false,
      render: (text, record, index) => {
        let checked = true;
        if (record.state == 'N') {
          checked = false;
        }
        return (<Switch
          checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
          checked={checked}
          onChange={async (checked) => { SwitchBtn(record, checked) }}
        />)
      }
    },
    {
      title: language('dmcoconfig.share'),
      dataIndex: 'share',
      key: 'share',
      align: 'center',
      width: 80,
      filters: [
        { text: language('project.yes'), value: "Y" },
        { text: language('project.no'), value: "N" },
      ],
      filterMultiple: false,
      render: (text, record, index) => {
        let color = '';
        if (record.share == 'Y') {
          color = '#12C189';
          text = language('project.yes')
        } else {
          color = '#FF0000';
          text = language('project.no')
        }
        return (
          <AmTag name={text} color={color} />
        )
      }
    },
    {
      title: language('alarmdt.ruleID'),
      dataIndex: 'rule_id',
      key: 'rule_id',
      importStatus: 'N',
      align: 'left',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('dmcoconfig.behavioradt.ip'),
      dataIndex: 'ip',
      key: 'ip',
      align: 'left',
      ellipsis: true,
      width: 240,
      render: (text, record, index) => {
        if (record?.info?.ip && record?.info?.ip.length > 0) {
          let menu = [];
          record?.info?.ip?.map((item) => {
            menu.push({ key: item, label: item, icon: <InfoCircleOutlined /> });
          })
          return <>
            <CutDropDown menu={menu} addrlist={record?.info?.ip} />
          </>;
        }
      },
    },
    {
      title: language('dmcoconfig.behavioradt.audittype'),
      dataIndex: 'audit_type',
      key: 'audit_type',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        if (record?.info?.audit_type) {
          let title = '';
          auditTypeList.map((item) => {
            if (record?.info?.audit_type == item.value) {
              title = item.label;
            }
          })
          return (title)
        }
      }
    },
    {
      title: language('dmcoconfig.behavioradt.expiretime'),
      dataIndex: 'expire_time',
      key: 'expire_time',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => {
        return record?.info?.expire_time
      }
    },
    {
      title: language('dmcoconfig.from'),
      dataIndex: 'from',
      key: 'from',
      importStatus: 'N',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        let color = 'cyan'
        let title = language('project.mconfig.local')
        if (record.from == "local") {
          color = 'cyan'
          title = language('project.mconfig.local')
        } else {
          color = 'volcano'
          title = language('project.mconfig.remote')
        }
        return (
          <Tag style={{ marginRight: '0px', padding: '0 10px' }} color={color}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.refcnt'),
      dataIndex: 'refcnt',
      key: 'refcnt',
      align: 'left',
      importStatus: 'N',
      ellipsis: true,
      fixed: 'right',
      width: 80,
      render: (text, record, index) => {
        let color = '#8E8D8D'
        if (record.refcnt > 0) {
          color = '#FF7429'
        } else {
          color = '#8E8D8D'
        }
        return (
          <Space className='assocDiv' align='left'>
            <div className='refcntNum'>{record.refcnt}</div>
            {
              record.refcnt > 0 ? <LinkTwo theme="outline" size="20" fill={color} strokeWidth={3} style={{ cursor: 'pointer' }} onClick={() => {
                disModal('assoc', record)
              }} /> : <LinkTwo theme="outline" size="20" fill={color} strokeWidth={3} style={{ cursor: 'not-allowed' }} />
            }
          </Space>
        )
      }
    },
    {
      title: language('project.mconfig.operate'),
      align: 'center',
      key: 'operate',
      importStatus: 'N',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Space className='attoperateDiv'>
            <Tooltip title={language('project.distribute')} >
              <span onClick={() => {
                disModal('distribute', record)
              }}>
                <i className="ri-mail-send-fill distribuIcon" />
              </span>
            </Tooltip>
            <Tooltip title={language('project.revoke')} >
              <span onClick={() => {
                disModal('revoke', record)
              }}>
                <i className="fa fa-recycle revokeIcon" />
              </span>
            </Tooltip>
          </Space>
        )
      }
    }
  ]

  const [visible, setVisible] = useState(false) //策略下发、撤销
  const [operate, setOperate] = useState(''); //撤销/下发
  const formRef = useRef();
  const [queryVal, setQueryVal] = useState();
  const [incID, setIncID] = useState(0);
  const [op, setOp] = useState('')
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [columns, setColumns] = useState(columnlist);
  const [modalVal, setModalVal] = useState(); // 当前点击弹框类型 distrbute | revoke | assocTable

  const module = 'app_behavior';

  const apishowurl = '/cfg.php?controller=confPolicy&action=show';
  const columnvalue = 'applicationbehaviorColumnvalue';
  const tableKey = 'applicationbehavior';
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: module };
  const addButton = true;
  const addTitle = language('project.newbuild');
  let rowkey = (record => record.rule_id);
  const delButton = true;
  const rowSelection = true;

  const projectType = 'policy';
  const assocShowurl = '/cfg.php?controller=confPolicy&action=showDevice';
  const syncundoShowurl = '/cfg.php?controller=confDevice&action=showSynclist';
  const syncundoSaveurl = '/cfg.php?controller=confPolicy&action=sync';
  const recordFind = rowRecord;
  const isDefaultCheck = true;
  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  }
  const [filtersList, setFiltersList] = useState({});
  const filterChange = (filters) => {
    setFiltersList(filters)
  }
  const [fileDownLoading, setFileDownLoading] = useState(false);
  /** 导入 导出 start */
  const uploadButton = true; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = true; //导出按钮 与 downloadClick 方法 组合使用
  const downLoadType = 'all'; //导出类型 与 downloadButton 方法 默认 false
  //导入按钮
  const uploadClick = () => {
    setImoritModalStatus(true);
  }
  //导出按钮
  const downloadClick = (list = {}) => {
    let api = '/cfg.php?controller=confPolicy&action=exportAppbeha';
    let data = list;
    data.queryVal = queryVal;
    data.moduleType = module;
    data.filters = JSON.stringify(filtersList);
    DownnLoadFile(api, data, setFileDownLoading)
  }
  const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
  const uploadUrl = '/cfg.php?controller=confPolicy&action=importAppbeha';
  const uploadAddUrl = '/cfg.php?controller=confPolicy&action=importAppbeha';
  const onUploadSuccess = (res) => {
    if (res.success) {
      incAdd();
    }
  }
  /**导入 导出 end */
  /**分发  撤销功能 start  */
  const sRef = useRef(null);
  //调用子组件接口判断弹框状态
  const disModal = (op = '', record = {}) => {
    setVisible(true)
    setRowRecord(record)
    setOperate(op)
  }

  const modMethod = (type) => {
    setModalVal(type);
  }

  const tableTopSearch = () => {
    return (
      <Search allowClear placeholder={language('dmcoconfig.desc')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }} />
    )
  }

  /* 启用禁用 */
  const SwitchBtn = (each, checked) => {
    let data = {};
    data.rule_id = each.rule_id;
    let state = 'N';
    if (checked) {
      state = 'Y';
    }
    data.state = state;
    post('/cfg.php?controller=confPolicy&action=enable', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID => incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const addClick = () => {
    openModal('Y', 'add')
  }

  const openModal = (status, op) => {
    setOp(op);
    if (status == 'Y') {
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  const delClick = (selectedRowKeys, dataList, selectedRows) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: 'delclickbox',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        handleDel(selectedRowKeys, selectedRows)
      }
    });
  }

  /* 删除接口 */
  const handleDel = (selectedRowKeys, selectedRows) => {
    let data = {}
    let ruleIDArr = selectedRows.map((e) => e.rule_id);
    data.rule_id = ruleIDArr.toString();
    post('/cfg.php?controller=confPolicy&action=del', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID + 1);
    })
  }

  const closeModal = () => {
    formRef.current.resetFields();
    openModal('N');
  }

  const handleSave = (values) => {
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = module;
    delete values.module;
    data.rule_id = values.rule_id;
    let state = 'N'
    if (values.state == 'Y' || values.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete values.state;
    let share = 'N';
    if (values.share == 'Y' || values.share == true) {
      share = 'Y';
    }
    data.share = share;
    delete values.share;
    data.desc = values.desc;
    delete values.desc;
    let addrlist = [];
    let count = 0;
    if (values.ip) {
      count = values.ip.length;
    }
    if (count > 0) {
      values.ip.map((item) => {
        addrlist.push(item.ip)
      })
    } else {
      addrlist = [];
    }
    values.ip = addrlist;
    data.info = JSON.stringify(values);
    post(operateUrl, data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID + 1);
      openModal('N')
    })
  }

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
    post('/cfg.php?controller=confPolicy&action=showData', { module: module }).then((res) => {

      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));

      setAuditTypeData(res?.data?.audit_type ? res?.data?.audit_type : []);
      auditTypeList = res?.data?.audit_type ? res?.data?.audit_type : [];
      let auditTypeFilter = res?.data?.audit_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "audit_type") {
          item.filters = auditTypeFilter;
          item.filterMultiple = false;
        } else {

        }
      })
      setColumns([...columnlist]);
    })
  }


  return (<>
    <ProtableModule columns={columns} components={true} apishowurl={apishowurl} incID={incID} clientHeight={clientHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowkey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} addTitle={addTitle} filterChange={filterChange} uploadButton={uploadButton} uploadClick={uploadClick} downloadButton={downloadButton} downLoadType={downLoadType} downloadClick={downloadClick} />
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.behavioradt.configapplicationbechaviorauditresults')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
      modalProps={{
        maskClosable: false,
        wrapClassName: 'mconfigmodalbox mcbehaviordatfrom',
        onCancel: () => {
          closeModal()
        }
      }} onFinish={async (values) => {
        handleSave(values)
      }}>
      <ProFormText name='rule_id' hidden />
      <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormSwitch name='share' label={language('dmcoconfig.ifshare')} checkedChildren={language('project.yes')} unCheckedChildren={language('project.no')} />
      <ProFormDateTimePicker
        name="expire_time"
        showTime
        fieldProps={{
          format: (value) => value.format('YYYY-MM-DD HH:mm:ss')
        }}
        label={language('dmcoconfig.behavioradt.expiretime')} />
      <EditTable
        name={'ip'}
        label={language('dmcoconfig.behavioradt.ip')}
        fromcolumns={fromcolumns}
        formRef={formRef}
        required={true}
        maxLength={false}
      />
      <ProFormSelect
        name='audit_type'
        label={language('dmcoconfig.behavioradt.audittype')}
        options={auditTypeData}
        onChange={(e) => {
          auditTypeData.map((item) => {
            if (item.value == e) {
              setFromContData(item.param ? item.param : [])
              setJsonParamData(item.json_param ? item.json_param : [])
            }
          })
        }}
        rules={[{
          required: true,
        }]}
      />
      {fromContData.length >= 1 ?
        fromContData.map((item) => {
          if (item.type == 'select') {
            return (
              <ProFormSelect
                name={item.value}
                label={item.title}
                options={item.options}
              />
            )
          } else {
            return (
              <ProFormText name={item.value} label={item.title} />
            )
          }
        })
        : <></>}
      {jsonParamData.length >= 1 ?
        jsonParamData.map((item) => {
          return (
            <EditTable
              name={item.value}
              label={item.title}
              fromcolumns={item.param}
              formRef={formRef}
              required={true}
              maxLength={item.type == 'object' ? 1 : false}
              editableKeys={editableKeys}
              setEditableRowKeys={setEditableRowKeys} />
          )
        })
        : <></>}
    </ModalForm>
    {/* <PolicyTable
      module={module}
      projectType={projectType}
      ref={sRef}
      modalVal={modalVal}
      assocshowurl={assocShowurl}
      syncundoshowurl={syncundoShowurl}
      recordFind={recordFind}
      syncundosaveurl={syncundoSaveurl}
      setIncID={setIncID}
      incID={incID}
      isDefaultCheck={isDefaultCheck}
    /> */}
    {/**导入动态字段 选择 */}
    <ImportAssembly
      columnlist={columns}
      uploadUrl={uploadUrl}
      uploadAddUrl={uploadAddUrl}
      onUploadSuccess={onUploadSuccess}
      imoritModalStatus={imoritModalStatus}
      setImoritModalStatus={setImoritModalStatus}
      uploadList={{ moduleType: module }}
    />
    <Policy visible={visible} setVisible={setVisible} operate={operate} rowInfo={rowRecord} module='app_behavior' type='policy' />
  </>)
}

export default Behareport
