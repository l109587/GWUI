import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProCard, ProForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormDigit, ProFormRadio } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message } from 'antd';
import { LinkTwo } from '@icon-park/react';
import { EditFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, PolicyTable, AmTag } from '@/components';
import { ImportAssembly } from '@/common';
import DownnLoadFile from '@/utils/downnloadfile.js';
import { regIpList } from '@/utils/regExp';
import { post } from '@/services/https';
import Policy from '../../components/policy';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Domainame = () => {

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
      title: language('dmcoconfig.targetadt.sip'),
      dataIndex: 'sip',
      key: 'sip',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return (record?.info?.sip)
      }
    },
    {
      title: language('dmcoconfig.targetadt.dns'),
      dataIndex: 'domain',
      key: 'domain',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return (record?.info?.domain)
      }
    },
    {
      title: language('dmcoconfig.transmchk.rule_type'),
      dataIndex: 'rule_type',
      key: 'rule_type',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        let title = '';
        ruletypeList.map((item) => {
          if (record.info.rule_type == item.value) {
            title = item.label;
          }
        })
        if (title) {
          return (
            <Tag style={{ marginRight: 0, padding: '0 10px' }}>{title}</Tag>
          )
        }
      }
    },
    {
      title: language('dmcoconfig.targetadt.match_type'),
      dataIndex: 'match_type',
      key: 'match_type',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        let title = '';
        matchtypeList.map((item) => {
          if (record.info.match_type == item.value) {
            title = item.label;
          }
        })
        if (title) {
          return (
            <Tag style={{ marginRight: 0, padding: '0 10px' }}>{title}</Tag>
          )
        }
      }
    },
    {
      title: language('dmcoconfig.targetadt.protocoltype'),
      dataIndex: 'protocol_type',
      key: 'protocol_type',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        if (record?.info?.protocol_type == 1) {
          return language('dmcoconfig.targetadt.encryptionprotocol');
        } else if (record?.info?.protocol_type == 2) {
          return language('dmcoconfig.targetadt.unknownprotocol');
        } else if (record?.info?.protocol_type == 0) {
          return language('dmcoconfig.targetadt.unlimited');
        }
      }
    },
    {
      title: language('dmcoconfig.transmchk.auditoften'),
      dataIndex: 'max_time',
      key: 'max_time',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return (record?.info?.max_time)
      }
    },
    {
      title: language('dmcoconfig.transmchk.audittraffic'),
      dataIndex: 'max_size',
      key: 'max_size',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return (record?.info?.max_size)
      }
    },
    {
      title: '告警数量',
      dataIndex: 'alarm_num',
      key: 'alarm_num',
      align: 'left',
      ellipsis: true,
    width: 100,
    },
    {
      title: '告警阈值',
      dataIndex: 'alarm_thresh',
      key: 'alarm_thresh',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        return record?.info?.alarm_thresh
      }
    },
    {
      title: language('dmcoconfig.desc'),
      dataIndex: 'desc',
      key: 'desc',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => {
        return record?.desc
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
      importStatus: 'N',
      align: 'left',
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
  const formRef = useRef()
  const [incID, setIncID] = useState(0);
  const [columns, setColumns] = useState(columnlist);
  const [queryVal, setQueryVal] = useState('');
  const [op, setOp] = useState('');
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [ruletypeData, setRuletypeData] = useState([]);
  let ruletypeList = []
  const [matchtypeData, setMatchtypeData] = useState([]);
  let matchtypeList = [];
  const [ruleStatus, setRuleStatus] = useState(1);
  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [modalVal, setModalVal] = useState();

  const module = 'domain_listen';

  /* 页面表格传参区 */
  const components = true;
  const tableKey = 'Domainame'
  let rowkey = (record => record.rule_id);
  const apiShowurl = '/cfg.php?controller=confPolicy&action=show';
  const columnvalue = 'domainameColunmval';
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: module };
  const addButton = true;
  const addTitle = language('project.newbuild');
  const delButton = true;
  const rowSelection = true;
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
    let api = '/cfg.php?controller=confPolicy&action=exportDomalisten';
    let data = list;
    data.queryVal = queryVal;
    data.moduleType = module;
    data.filters = JSON.stringify(filtersList);
    DownnLoadFile(api, data, setFileDownLoading)
  }
  const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
  const uploadUrl = '/cfg.php?controller=confPolicy&action=importDomalisten';
  const uploadAddUrl = '/cfg.php?controller=confPolicy&action=importDomalisten';
  const onUploadSuccess = (res) => {
    if (res.success) {
      incAdd();
    }
  }
  /**导入 导出 end */
  /* 策略组件传参区 */
  const projectType = 'policy';
  const assocShowurl = '/cfg.php?controller=confPolicy&action=showDevice';
  const syncundoShowurl = '/cfg.php?controller=confDevice&action=showSynclist';
  const syncundoSaveurl = '/cfg.php?controller=confPolicy&action=sync';
  const recordFind = rowRecord;
  const isDefaultCheck = true;

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
    return [
      <Search allowClear placeholder={language('dmcoconfig.targetadt.domainname.searchtext')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal.toLowerCase());
          setIncID(incID + 1);
        }} />
    ]
  }

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
    post('/cfg.php?controller=confPolicy&action=showData', { module: module }).then((res) => {
      setMatchtypeData(res?.data?.match_type);
      matchtypeList = res?.data?.match_type ? res?.data?.match_type : [];
      setRuletypeData(res?.data?.rule_type);
      ruletypeList = res?.data?.rule_type ? res?.data?.rule_type : [];
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let ruleTypeFilter = res?.data?.rule_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let matchTypeFilter = res?.data?.match_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "rule_type") {
          item.filters = ruleTypeFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "match_type") {
          item.filters = matchTypeFilter;
          item.filterMultiple = false;
        }
      })
      setColumns([...columnlist]);
    })
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

  const modifyFn = (each, op) => {
    let values = { ...each.info };
    values.state = each.state == 'Y' || each.state == true ? true : false;
    values.rule_id = each.rule_id;
    values.desc = each.desc;
    setTimeout(function () {
      formRef.current.setFieldsValue(values)
    }, 100)
    openModal('Y', op)
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

  const closeModal = () => {
    formRef.current.resetFields();
    setRuleStatus(1);
    openModal('N');
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

  const handleSave = (obj) => {
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = module;
    data.rule_id = obj.rule_id;
    let state = 'N'
    if (obj.state == 'Y' || obj.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete obj.state;
    let share = 'N';
    if (obj.share == 'Y' || obj.share == true) {
      share = 'Y';
    }
    data.share = share;
    delete obj.share;
    data.desc = obj.desc;
    data.info = JSON.stringify(obj);
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

  const afterDiv = (unit) => {
    return <div className='tafterDiv'>{unit}</div>
  }
  const protocolTypeData = [
    { label: language('dmcoconfig.targetadt.encryptionprotocol'), value: 1 },
    { label: language('dmcoconfig.targetadt.unknownprotocol'), value: 2 },
    { label: language('dmcoconfig.targetadt.unlimited'), value: 0 },
  ]
  return (<>
    <ProtableModule
      columns={columns}
      clientHeight={clientHeight}
      apishowurl={apiShowurl}
      searchVal={searchVal}
      rowkey={rowkey}
      searchText={tableTopSearch()}
      incID={incID}
      components={components}
      tableKey={tableKey}
      columnvalue={columnvalue}
      addButton={addButton}
      addTitle={addTitle}
      addClick={addClick}
      delButton={delButton}
      delClick={delClick}
      rowSelection={rowSelection}
      filterChange={filterChange}
      uploadButton={uploadButton}
      uploadClick={uploadClick}
      downloadButton={downloadButton}
      downLoadType={downLoadType}
      downloadClick={downloadClick}
    />
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.targetadt.domainame')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
      initialValues={{
        protocol_type: 1
      }}
      modalProps={{
        maskClosable: false,
        wrapClassName: 'mconfigmodalbox targetadtprotocolbox',
        onCancel: () => {
          closeModal()
        }
      }} onFinish={async (values) => {
        handleSave(values)
      }}>
      <ProFormText name='rule_id' hidden />
      <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormSwitch name='share' label={language('dmcoconfig.ifshare')} checkedChildren={language('project.yes')} unCheckedChildren={language('project.no')} />
      <ProFormText label={language('dmcoconfig.targetadt.sip')} name='sip'
        rules={[
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
          {
            required: true,
            message: language('project.mandatory')
          }
        ]}
      />
      <ProFormText label={language('dmcoconfig.targetadt.dns')} name='domain' rules={[{
        required: true,
        message: language('project.mandatory')
      }]} />
      <ProFormSelect label={language('dmcoconfig.transmchk.rule_type')} name='rule_type' options={ruletypeData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]}
        onChange={(e) => {
          setRuleStatus(e)
        }}
      />
      {ruleStatus == 0 ?
        <ProFormSelect label={language('dmcoconfig.targetadt.match_type')} name='match_type' options={matchtypeData} rules={[{
          required: true,
          message: language('project.messageselect')
        }]} />
        : <></>}
      <div className='tflexDiv'>
        <ProFormDigit
          label={language('dmcoconfig.transmchk.auditoften')}
          width={'186px'}
          initialValue={10}
          addonAfter={afterDiv(language('dmcoconfig.transmchk.minute'))}
          style={{ marginTop: '5px', marginRight: '5px' }}
          name="max_time"
          fieldProps={{
            precision: 0,
            controls: false,
          }}
        />
      </div>
      <div className='protocolDiv'>
        <ProFormRadio.Group label={language('dmcoconfig.targetadt.protocoltype')} name='protocol_type' radioType='button' options={protocolTypeData} fieldProps={{ buttonStyle: "solid" }} />
      </div>
      <div className='tflexDiv'>
        <ProFormDigit
          initialValue={5}
          label={language('dmcoconfig.transmchk.audittraffic')}
          width={'185px'}
          addonAfter={afterDiv('M')}
          style={{ marginTop: '5px', marginRight: '5px' }}
          name="max_size"
          fieldProps={{
            precision: 0,
            controls: false,
          }}
        />
      </div>
      <ProFormText name='desc' label={language('dmcoconfig.desc')} />
      <div className='tflexDiv'>
        <ProFormDigit
          label={'告警阈值'}
          min={1}
          addonAfter={afterDiv('条/分钟')}
          name="alarm_thresh"
          fieldProps={{
            precision: 0,
            controls: false,
          }}
          initialValue={100}
        />
      </div>
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
      columnlist={columnlist}
      uploadUrl={uploadUrl}
      uploadAddUrl={uploadAddUrl}
      onUploadSuccess={onUploadSuccess}
      imoritModalStatus={imoritModalStatus}
      setImoritModalStatus={setImoritModalStatus}
      uploadList={{moduleType: module}}
    />
    <Policy visible={visible} setVisible={setVisible} operate={operate} rowInfo = {rowRecord} module='domain_listen' type='policy'/>
  </>)
}

export default Domainame