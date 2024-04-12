import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProFormText, ProFormSwitch, ProFormSelect } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message } from 'antd';
import { LinkTwo } from '@icon-park/react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, PolicyTable, AmTag } from '@/components';
import { ImportAssembly } from '@/common';
import DownnLoadFile from '@/utils/downnloadfile.js';
import { post } from '@/services/https';
import Policy from '../../components/policy';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Ipaudit = () => {

  const ruleTypeList = [
    {
      label: language('dmcoconfig.attachck.blacklist.textexpression'),
      text: language('dmcoconfig.attachck.blacklist.textexpression'),
      value: 0
    },
    {
      label: language('dmcoconfig.attachck.blacklist.regularexpression'),
      text: language('dmcoconfig.attachck.blacklist.regularexpression'),
      value: 1
    },
  ]

  const matchTypeList = [
    {
      label: language('dmcoconfig.attachck.blacklist.substringmatching'),
      text: language('dmcoconfig.attachck.blacklist.substringmatching'),
      value: 0
    },
    {
      label: language('dmcoconfig.attachck.blacklist.rightmatching'),
      text: language('dmcoconfig.attachck.blacklist.rightmatching'),
      value: 1
    },
    {
      label: language('dmcoconfig.attachck.blacklist.leftmatching'),
      text: language('dmcoconfig.attachck.blacklist.leftmatching'),
      value: 2
    },
    {
      label: language('dmcoconfig.attachck.blacklist.perfectmatch'),
      text: language('dmcoconfig.attachck.blacklist.perfectmatch'),
      value: 3
    },
  ]

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
      title: language('dmcoconfig.attachck.blacklist.dns'),
      dataIndex: 'dns',
      key: 'dns',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => {
        return record?.info?.dns
      }
    },
    {
      title: language('dmcoconfig.attachck.blacklist.ruletype'),
      dataIndex: 'rule_type',
      key: 'rule_type',
      align: 'center',
      ellipsis: true,
      width: 110,
      filters: ruleTypeList,
      filterMultiple: false,
      render: (text, record, index) => {
        let title = '';
        ruleTypeList.map((item) => {
          if (record.info.rule_type == item.value) {
            title = item.label;
          }
        })
        if (title) {
          return (
            <Tag style={{ marginRight: 0, padding: '0 10px' }} key={record.risk}>{title}</Tag>
          )
        }
      }
    },
    {
      title: language('dmcoconfig.attachck.blacklist.matchtype'),
      dataIndex: 'match_type',
      key: 'match_type',
      align: 'center',
      ellipsis: true,
      width: 110,
      filters: matchTypeList,
      filterMultiple: false,
      render: (text, record, index) => {
        let title = '';
        matchTypeList.map((item) => {
          if (record.info.match_type == item.value) {
            title = item.label;
          }
        })
        if (title) {
          return (
            <Tag style={{ marginRight: 0, padding: '0 10px' }} key={record.risk}>{title}</Tag>
          )
        }
      }
    },
    {
      title: language('dmcoconfig.from'), // 文档没有
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
  const formRef = useRef()
  const [incID, setIncID] = useState(0);
  const [columns, setColumns] = useState(columnlist);
  const [queryVal, setQueryVal] = useState('');
  const [op, setOp] = useState('');
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [modalVal, setModalVal] = useState();
  const module = 'audit_domain_whitelist';

  /* 页面表格传参区 */
  const components = true;
  const tableKey = 'beauditwhite'
  const columnvalue = 'beauditwhiteColunmval';
  let rowkey = (record => record.rule_id);
  const apiShowurl = '/cfg.php?controller=confPolicy&action=show';
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
    let api = '/cfg.php?controller=confPolicy&action=exportWhitedoma';
    let data = list;
    data.queryVal = queryVal;
    data.moduleType = module;
    data.filters = JSON.stringify(filtersList);
    DownnLoadFile(api, data, setFileDownLoading)
  }
  const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
  const uploadUrl = '/cfg.php?controller=confPolicy&action=importWhitedoma';
  const uploadAddUrl = '/cfg.php?controller=confPolicy&action=importWhitedoma';
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
      <Search allowClear placeholder={language('dmcoconfig.targetadt.ipaudit.searchtext')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal.toLowerCase());
          incAdd();
        }} />
    ]
  }

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
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
      incAdd();
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

  const closeModal = () => {
    formRef.current.resetFields();
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
      incAdd();
    })
  }

  const handleSave = (values) => {
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = module;
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
    data.info = JSON.stringify({ ...values });
    post(operateUrl, data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      incAdd();
      openModal('N')
    })
  }

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
      autoFocusFirstInput title={language('dmcoconfig.behavioradt.auditdomainwhiterules')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
      initialValues={{
        protocol: 6
      }}
      modalProps={{
        maskClosable: false,
        wrapClassName: 'mconfigmodalbox',
        onCancel: () => {
          closeModal()
        }
      }} onFinish={async (values) => {
        handleSave(values)
      }}>
      <ProFormText name='rule_id' hidden />
      <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormSwitch name='share' label={language('dmcoconfig.ifshare')} checkedChildren={language('project.yes')} unCheckedChildren={language('project.no')} />
      <div>
        <ProFormText label={language('dmcoconfig.attachck.blacklist.dns')} name='dns' />
        <ProFormSelect label={language('dmcoconfig.attachck.blacklist.ruletype')} name='rule_type' options={ruleTypeList} />
        <ProFormSelect label={language('dmcoconfig.attachck.blacklist.matchtype')} name='match_type' options={matchTypeList} />
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
    <Policy visible={visible} setVisible={setVisible} operate={operate} rowInfo = {rowRecord} module='audit_domain_whitelist' type='policy'/>
  </>)
}

export default Ipaudit
