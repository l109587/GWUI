import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProCard, ProForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormCheckbox, ProFormTextArea } from '@ant-design/pro-components';
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

const Keyword = () => {
  const ruletypeDate = [
    {
      label: language('dmcoconfig.transmchk.rule_type.keyword'),
      text: language('dmcoconfig.transmchk.rule_type.keyword'),
      value: 0
    },
    {
      label: language('dmcoconfig.transmchk.rule_type.regular'),
      text: language('dmcoconfig.transmchk.rule_type.regular'),
      value: 1
    }
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
      title: language('alarmdt.ruleID'),
      dataIndex: 'rule_id',
      key: 'rule_id',
      align: 'left',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('alarmdt.risk'),
      dataIndex: 'risk',
      key: 'risk',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (text, record, index) => {
        let color = 'success';
        let title = language('analyse.resrisk.level.low');
        if (record?.info?.risk == '0') {
          color = '#BEBEBE';
          title = language('alarmdt.risk.safe')
        } else if (record?.info?.risk == '1') {
          color = '#93D2F3';
          title = language('alarmdt.risk.kind')
        } else if (record?.info?.risk == '2') {
          color = '#FA561F';
          title = language('alarmdt.risk.follow')
        } else if (record?.info?.risk == '3') {
          color = '#FF0000';
          title = language('alarmdt.risk.serious')
        } else if (record?.info?.risk == '4') {
          color = '#BD3124';
          title = language('alarmdt.risk.urgent')
        }
        return (
          <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record.risk}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.transmchk.rule_type'),
      dataIndex: 'rule_type',
      key: 'rule_type',
      align: 'center',
      ellipsis: true,
      width: 140,
      filters:ruletypeDate,
      filterMultiple:false,
      render: (text, record, index) => {
        let color
        let title
        if (record?.info?.rule_type == 0) {
          color = 'red'
          title = language('dmcoconfig.transmchk.rule_type.keyword')
        } else {
          color = 'magenta'
          title = language('dmcoconfig.transmchk.rule_type.regular')
        }
        return (
          <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record.rule_type}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.transmchk.formattype'),
      dataIndex: 'style_type',
      key: 'style_type',
      align: 'center',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        let title = '';
        styleTypeList.map((item) => {
          if (record.info.style_type == item.value) {
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
      title: language('dmcoconfig.transmchk.rule_content'),
      dataIndex: 'rule_content',
      key: 'rule_content',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.rule_content
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
      align: 'center',
      ellipsis: true,
      width: 100,
      render: 
      (text, record, index) => {
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
      title: language('dmcoconfig.refcnt') ,
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
  const [queryVal, setQueryVal] = useState();
  const [incID, setIncID] = useState(0);
  const [op, setOp] = useState('')
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [riskData, setRiskData] = useState([]);
  const [columns, setColumns] = useState(columnlist);
  const [modalVal, setModalVal] = useState(); // 当前点击弹框类型 distrbute | revoke | assocTable
  const [styleTypeDate, setStyleTypeDate] = useState([]);
  let styleTypeList = [];

  /* 页面表格传参区 */
  const components = true;
  const columnvalue = 'tformatColunmval';
  const tableKey = 'tformat';
  const module = 'file_style';
  const apiShowurl = '/cfg.php?controller=confPolicy&action=show';
  let rowkey = (record => record.rule_id);
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: module };
  const addButton = true;
  const addTitle = language('project.newbuild');
  const delButton = true;
  const rowSelection = true;

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
      <Search allowClear placeholder={language('dmcoconfig.transmchk.keyword.searchtext')}
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
      setStyleTypeDate(res?.data?.style_type)
      styleTypeList = res?.data?.style_type ? res?.data?.style_type : [];
      setRiskData(res?.data?.risk);
      let riskFilter = res?.data?.risk?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let styleTypeFillter = res?.data?.style_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == 'risk') {
          item.filters = riskFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "style_type") {
          item.filters = styleTypeFillter;
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
    openModal('N');
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
    data.desc = values.desc;
    delete values.desc;
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

  return (
    <>
      <ProtableModule
        tableKey={tableKey}
        columns={columns}
        clientHeight={clientHeight}
        apishowurl={apiShowurl}
        columnvalue={columnvalue}
        components={components}
        searchVal={searchVal}
        rowkey={rowkey}
        addButton={addButton}
        addTitle={addTitle}
        addClick={addClick}
        delButton={delButton}
        delClick={delClick}
        rowSelection={rowSelection}
        searchText={tableTopSearch()}
        incID={incID}
      />
      <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
        autoFocusFirstInput title={language('dmcoconfig.transmchk.formatfilefilteringrules')}
        visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
        initialValues={{
          "min_match_count" : 1
        }}
        modalProps={{
          maskClosable: false,
          wrapClassName:'mconfigmodalbox',
          onCancel: () => {
            closeModal()
          }
        }} onFinish={async (values) => {
          handleSave(values)
      }}>
        <ProFormText name='rule_id' hidden />
        <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
        <ProFormSelect name='risk' label={language('alarmdt.risk')} options={riskData} rules={[{
          required: true,
          message: language('project.messageselect')
      }]} />
        <ProFormSelect name='rule_type' label={language('dmcoconfig.transmchk.rule_type')} options={ruletypeDate} rules={[{
          required: true,
          message: language('project.messageselect')
      }]} />
        <ProFormSelect name='style_type' label={language('dmcoconfig.transmchk.formattype')} options={styleTypeDate} />
        <ProFormTextArea name='rule_content' label={language('dmcoconfig.attachck.rule')} rules={[{
          required: true,
          message: language('project.mandatory')
      }]} />
        <ProFormText name='desc' label={language('dmcoconfig.desc')} />
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
    </>
  )

}

export default Keyword
