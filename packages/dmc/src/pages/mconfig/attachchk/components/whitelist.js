import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProCard, ProForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormCheckbox, ProFormTextArea } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message, Popconfirm } from 'antd';
import { LinkTwo, LoadingOne, WorriedFace } from '@icon-park/react';
import { EditFilled, ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, PolicyTable } from '@/components';
import { post } from '@/services/https';
import { regList, regIpList } from '@/utils/regExp';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Troation = () => {
  const module = 'alarm_whitelist';
  let ruletypeDate = [
    {
      label: 'md5',
      text: 'md5',
      value: 0
    }
  ]

  const submoduleList = [
    {
      label: language('dmcoconfig.attachack.whitelist.ipwhiterules'),
      text: language('dmcoconfig.attachack.whitelist.ipwhiterules'),
      value: 1
    },
    {
      label: language('dmcoconfig.attachack.whitelist.filehashwhiterules'),
      text: language('dmcoconfig.attachack.whitelist.filehashwhiterules'),
      value: 2
    },
  ]

  /* 页面表格表头 */
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
      title: language('dmcoconfig.modulename'),
      dataIndex: 'submodule',
      key: 'submodule',
      align: 'center',
      ellipsis: true,
      width: 120,
      filters: submoduleList,
      filterMultiple: false,
      render: (text, record, index) => {
        let title = '';
        submoduleList.map((item) => {
          if (record.info.submodule == item.value) {
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
      title: language('dmcoconfig.attachack.whitelist.ip'),
      dataIndex: 'ip',
      key: 'ip',
      align: 'left',
      ellipsis: true,
      width: 240,
      render: (text, record, index) => {
        return record?.info?.ip
      }
    },
    {
      title: language('dmcoconfig.attachack.whitelist.port'),
      dataIndex: 'port',
      key: 'port',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        return record?.info?.port
      }
    },
    {
      title: language('dmcoconfig.transmchk.rule_type'),
      dataIndex: 'rule_type',
      key: 'rule_type',
      align: 'center',
      ellipsis: true,
      width: 100,
      filters: ruletypeDate,
      filterMultiple: false,
      render: (text, record, index) => {
        if (record?.info?.rule_type == 0) {
          return (
            <Tag style={{ marginRight: 0, padding: '0 10px' }} key={record.rule_type}>{'md5'}</Tag>
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
        return record?.info?.desc
      }
    },
    {
      title: language('dmcoconfig.from'),
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
      width: 80,
      fixed: 'right',
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
              record.refcnt > 0 ? <LinkTwo theme="outline" size="20" fill={color} strokeWidth={3} style={{ cursor: 'pointer' }} onClick={() => { disModal('assoc', record) }} /> : <LinkTwo theme="outline" size="20" fill={color} strokeWidth={3} style={{ cursor: 'not-allowed' }} />
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
                <i className="fa fa-recycle revokeIcon" aria-hidden="true" />
              </span>
            </Tooltip>
          </Space>
        )
      }
    },
  ]

  const formRef = useRef();
  const columnvalue = 'atwhitelistColumnvalue';
  const tableKey = 'atwhitelist';
  const [op, setOp] = useState('')
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const apishowurl = '/cfg.php?controller=confPolicy&action=show';
  const assocshowurl = '/cfg.php?controller=confPolicy&action=showDevice';
  const syncundoshowurl = '/cfg.php?controller=confDevice&action=showSynclist'; // 分发撤销回显接口
  const syncundosaveurl = '/cfg.php?controller=confPolicy&action=sync';
  const [queryVal, setQueryVal] = useState();
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: module };
  const addButton = true;
  const addTitle = language('project.newbuild');
  let rowkey = (record => record.rule_id);
  const delButton = true;
  const rowSelection = true;
  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [incID, setIncID] = useState(0);
  const [modalVal, setModalVal] = useState(); // 当前点击弹框类型 distrbute | revoke | assocTable
  const recordFind = rowRecord; // 当前行id
  const isOptionHide = false;
  const isDefaultCheck = true;
  const [blackListType, setBlackListType] = useState();

  // 表格列
  const [columns, setColumns] = useState(columnlist);

  const projectType = 'policy';


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

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
    post('/cfg.php?controller=confPolicy&action=showData', { module: module }).then((res) => {

      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));

      columnlist.map((item, index) => {
        if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else {

        }
      })
      setColumns([...columnlist]);
    })
  }

  const tableTopSearch = () => {
    return ( 
      <Search allowClear placeholder={language('dmcoconfig.attachack.troation.searchtext')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }} />
    )
  }

  const modMethod = (type) => {
    setModalVal(type);
  }

  const modifyFn = (each, op) => {
    let values = { ...each.info };
    values.state = each.state == 'Y' || each.state == true ? true : false;
    if (values.store_pcap == 2) {
      values.store_pcap = false
    }
    values.rule_id = each.rule_id;
    setBlackListType(values.submodule);
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
    setBlackListType('');
    openModal('N');
  }

  const addClick = () => {
    openModal('Y', 'add')
  }

  const handleSave = (obj) => {
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = module;
    data.rule_id = obj.rule_id;
    let state = 'N';
    if (obj.state == 'Y' || obj.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete obj.state;
    if (!obj.store_pcap) {
      obj.store_pcap = 2;
    } else {
      obj.store_pcap = 1;
    }
    if (!obj.desc) {
      obj.desc = '';
    }
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

  return (<>
    <ProtableModule columns={columns} components={true} apishowurl={apishowurl} incID={incID} clientHeight={clientHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowkey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} addTitle={addTitle} />
    <PolicyTable ref={sRef} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} syncundosaveurl={syncundosaveurl} isDefaultCheck={isDefaultCheck} module={module} projectType={projectType} />
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.attachck.blacklistrules')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
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
      <ProFormSelect
        name='submodule'
        label={language('dmcoconfig.submodule')}
        options={submoduleList}
        rules={[{
          required: true,
        }]}
        onChange={(e) => {
          setBlackListType(e);
        }}
      />
      {blackListType == 1 ?
        <div>
          <ProFormText label={language('dmcoconfig.attachack.whitelist.ip')} name='ip' rules={[{
            pattern: regIpList.singleipv4Mask.regex,
            message: regIpList.singleipv4Mask.alertText
          },]} />
          <ProFormText label={language('dmcoconfig.attachack.whitelist.port')} name='port' />
        </div>
        : <></>}
      {blackListType == 2 ?
        <div>
          <ProFormSelect name='rule_type' label={language('dmcoconfig.transmchk.rule_type')} options={ruletypeDate} rules={[{
            required: true,
            message: language('project.messageselect')
          }]} />
          <ProFormTextArea name='rule_content' label={language('dmcoconfig.attachck.rule')} rules={[{
            required: true,
            message: language('project.mandatory')
          }]} />
        </div>
        : <></>}
      <NameText name='desc' label={language('dmcoconfig.desc')} required={false} max={128} />
    </ModalForm>
  </>)
}

export default Troation
