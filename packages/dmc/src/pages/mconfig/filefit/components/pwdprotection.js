import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProCard, ProForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormTreeSelect, ProFormTextArea } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message, Popconfirm } from 'antd';
import { LinkTwo, LoadingOne, WorriedFace } from '@icon-park/react';
import { EditFilled, ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, PolicyTable } from '@/components';
import { post } from '@/services/https';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Encryption = () => {


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
      title: language('alarmdt.ruleID'),
      dataIndex: 'rule_id',
      key: 'rule_id',
      align: 'left',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('dmcoconfig.transmchk.minsize'),
      dataIndex: 'minsize',
      key: 'minsize',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        return record?.info?.filesize?.minsize
      }
    },
    {
      title: language('dmcoconfig.transmchk.maxsize'),
      dataIndex: 'maxsize',
      key: 'maxsize',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        return record?.info?.filesize?.maxsize
      }
    },
    {
      title: language('dmcoconfig.filefit.filetypelimit'),
      dataIndex: 'filetype',
      key: 'filetype',
      align: 'left',
      ellipsis: true,
      render: (text, record, index) => {
        if(record?.info?.filetype?.length >= 1){
          return record?.info?.filetype?.join(',');
        }
      }
    },
    {
      title: language('dmcoconfig.from'), // 文档没有
      dataIndex: 'from',
      key: 'from',
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

  const formRef = useRef();
  const [columns, setColumns] = useState(columnlist);
  const [queryVal, setQueryVal] = useState();
  const [incID, setIncID] = useState(0);
  const [op, setOp] = useState('');
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态

  const [fileTypeData, setFileTypeData] = useState([]);
  let fileTypeList = [];

  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [modalVal, setModalVal] = useState();

  const module = 'file_encryption';

  /* 页面表格传参区 */
  const addButton = true;
  const addTitle = language('project.newbuild');
  const delButton = true;
  const rowSelection = true;
  const apiShowurl = '/cfg.php?controller=confPolicy&action=show';
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: module };
  const tableKey = 'pwdprotection';
  const components = true;
  const columnvalue = 'pwdprotectionColunmval';
  let rowkey = (record => record.rule_id);

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
    setRowRecord(record);
    modMethod(op);
    if (sRef.current) {
      sRef.current.openEdModal('Y');
    }
  }

  const modMethod = (type) => {
    setModalVal(type);
  }

  const tableTopSearch = () => {
    return [
      <Search allowClear placeholder={language('dmcoconfig.attachack.unknacktion.searchtext')}
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
      setFileTypeData(res?.data?.filetype);
      fileTypeList = res?.data?.filetype ? res?.data?.filetype : [];
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == "from") {
          item.filters = fromFilter;
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

  const modifyFn = (each, op) => {
    let values = { ...each.info };
    values.state = each.state == 'Y' || each.state == true ? true : false;
    values.rule_id = each.rule_id;
    values.minsize = each.info.filesize?.minsize;
    values.maxsize = each.info.filesize?.maxsize;
    values.desc = each?.desc;
    setTimeout(function () {
      formRef.current.setFieldsValue(values)
    }, 100)
    openModal('Y', op)
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

  const handleSave = (values) => {
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = module;
    data.rule_id = values.rule_id;
    values.filesize = {};
    values.filesize.minsize = values.minsize;
    values.filesize.maxsize = values.maxsize;
    delete values.minsize;
    delete values.maxsize;
    let state = 'N'
    if (values.state == 'Y' || values.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete values.state;
    data.desc = values.desc;
    delete values.desc;
    data.info = JSON.stringify({ ...values });
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
    return <div className='afterDiv'>{unit}</div>
  }

  return (<>
    <ProtableModule
      columns={columns}
      apishowurl={apiShowurl}
      clientHeight={clientHeight}
      searchVal={searchVal}
      searchText={tableTopSearch()}
      rowkey={rowkey}
      incID={incID}
      tableKey={tableKey}
      components={components}
      columnvalue={columnvalue}
      addButton={addButton}
      addTitle={addTitle}
      addClick={addClick}
      delButton={delButton}
      delClick={delClick}
      rowSelection={rowSelection}
    />
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.filefit.protectedfilefliteringrules')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
      modalProps={{
        maskClosable: false,
        wrapClassName:'mconfigmodalbox filefitbox',
        onCancel: () => {
          closeModal()
        }
      }} onFinish={async (values) => {
        handleSave(values)
      }}>
      <ProFormText name='rule_id' hidden />
      <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormTreeSelect
        name='filetype'
        request={async () => {
          return fileTypeData;
        }}
        label={language('dmcoconfig.filefit.filetypelimit')}
        fieldProps={{
          multiple: true,
          treeCheckable:true,
        }}
      />
      <div className='flexDiv'>
        <ProFormText width={'185px'} name='minsize' label={language('dmcoconfig.transmchk.minsize')} addonAfter={afterDiv('KB')} rules={[{
          required: true,
          message: language('project.mandatory')
        }]} />
        <ProFormText width={'186px'} name='maxsize' label={language('dmcoconfig.transmchk.maxsize')} addonAfter={afterDiv('KB')} rules={[{
          required: true,
          message: language('project.mandatory')
        }]} />
      </div>
    </ModalForm>
    <PolicyTable
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
    />
  </>)
}

export default Encryption
