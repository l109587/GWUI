import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormRadio, ProFormDigit } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message } from 'antd';
import { LinkTwo } from '@icon-park/react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, AmTag } from '@/components';
import { ImportAssembly } from '@/common';
import DownnLoadFile from '@/utils/downnloadfile.js';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { post } from '@/services/https';
import Policy from '../../components/policy';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Malapgtion = () => {

  let ruletypeList = [
    {
      label: language('dmcoconfig.attachck.filehash'),
      value: 1,
    },
    {
      label: language('dmcoconfig.attachck.filecharacteristic'),
      value: 2,
    }
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
      title: language('dmcoconfig.attachck.rulename'),
      dataIndex: 'rule_name',
      key: 'rule_name',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.rule_name
      }
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
          <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record?.info?.risk}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.attachck.attack_type'),
      dataIndex: 'attack_class',
      key: 'attack_class',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        if (record?.info?.attack_class) {
          let title = '';
          attackClassDateList.map((item) => {
            if (record?.info?.attack_class == item.value) {
              title = item.label;
            }
          })
          return (<Tag style={{ marginRight: 0, padding: '0 10px' }} >{title}</Tag>)
        }
      }
    },
    {
      title: language('dmcoconfig.attachck.attackorganization'),
      dataIndex: 'attack_group',
      key: 'attack_group',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.attack_group
      }
    },
    {
      title: language('dmcoconfig.attachck.filecharacteristic'),
      dataIndex: 'rule',
      key: 'rule',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.rule
      }
    },
    {
      title: language('dmcoconfig.attachck.filehash'),
      dataIndex: 'md5',
      key: 'md5',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.md5
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
                <i className="fa fa-recycle revokeIcon" aria-hidden="true" />
              </span>
            </Tooltip>
          </Space>
        )
      }
    },
  ]
  const [visible, setVisible] = useState(false) //策略下发、撤销、级联设备
  const [operate, setOperate] = useState(''); //撤销/下发/级联设备
  const module = 'malware';
  const formRef = useRef();
  const columnvalue = 'malapgColumnvalue';
  const tableKey = 'Malapgtion';
  const [op, setOp] = useState('')
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const isOptionHide = false;
  const isDefaultCheck = true;
  const apishowurl = '/cfg.php?controller=confPolicy&action=show'; // 页面表格回显接口
  const assocshowurl = '/cfg.php?controller=confPolicy&action=showDevice'; // language('dmcoconfig.refcnt')表格回显接口
  const syncundoshowurl = '/cfg.php?controller=confDevice&action=showSynclist';// 分发撤销回显接口
  const syncundosaveurl = '/cfg.php?controller=confPolicy&action=sync'; // 分发撤销配置接口
  const [queryVal, setQueryVal] = useState();
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: 'malware' };
  const addButton = true;
  const addTitle = language('project.newbuild');
  let rowkey = (record => record.rule_id);
  const delButton = true;
  const rowSelection = true;
  const concealColumns = {
    id: { show: false },
  }
  const [rowRecord, setRowRecord] = useState({});//记录当前信息
  const [incID, setIncID] = useState(0);
  const [modalVal, setModalVal] = useState();//当前点击弹框类型 distrbute | revoke | assocTable
  const recordFind = rowRecord; // 当前行id
  const projectType = 'policy';
  const [riskData, setRiskData] = useState([]);
  const [attackClassDate, setAttackClassDate] = useState([]);
  let attackClassDateList = [];
  const [ruleTypeStatus, setRuleTypeStatus] = useState(1);

  // 表格列
  const [columns, setColumns] = useState(columnlist);

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
    let api = '/cfg.php?controller=confPolicy&action=exportAttamal';
    let data = list;
    data.queryVal = queryVal;
    data.moduleType = module;
    data.filters = JSON.stringify(filtersList);
    DownnLoadFile(api, data, setFileDownLoading)
  }
  const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
  const uploadUrl = '/cfg.php?controller=confPolicy&action=importAttamal';
  const uploadAddUrl = '/cfg.php?controller=confPolicy&action=importAttamal';
  const onUploadSuccess = (res) => {
    if (res.success) {
      incAdd();
    }
  }
  /**导入 导出 end */

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
    post('/cfg.php?controller=confPolicy&action=showData', { module: module }).then((res) => {
      setRiskData(res?.data?.risk);
      setAttackClassDate(res?.data?.attack_class);
      attackClassDateList = res?.data?.attack_class ? res?.data?.attack_class : [];
      let riskFilter = res?.data?.risk?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let attacktypeFilter = res?.data?.attack_class?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == 'risk') {
          item.filters = riskFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "attack_class") {
          item.filters = attacktypeFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else {

        }
      })
      setColumns([...columnlist]);
    })
  }

  /**分发  撤销功能 start  */
  const sRef = useRef(null);
  //调用子组件接口判断弹框状态
  const disModal = (op = '', record = {}) => {
    setVisible(true)
    setRowRecord(record)
    setOperate(op)
  }

  const tableTopSearch = () => {
    return (
      <Search className='malapSearch' placeholder={language('dmcoconfig.attachack.malapgtion.searchtext')}
        width='260px'
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }} allowClear />
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
    setRuleTypeStatus(1);
    openModal('N');
  }

  const addClick = () => {
    openModal('Y', 'add')
  }

  const handleSave = (obj) => {
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = 'malware';
    data.rule_id = obj.rule_id;
    let state = 'N';
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
    if (!obj.md5) {
      obj.md5 = '';
    }
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

  /*删除接口  */
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

  const afterDiv = (unit) => {
    return <div className='afterDiv'>{unit}</div>
  }

  return (<>
    <ProtableModule components={true} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={clientHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowkey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} addTitle={addTitle} filterChange={filterChange} uploadButton={uploadButton} uploadClick={uploadClick} downloadButton={downloadButton} downLoadType={downLoadType} downloadClick={downloadClick} />
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.attachck.malapgtion')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
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
      <ProFormSelect name='risk' label={language('alarmdt.risk')} options={riskData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]} />
      <ProFormSelect name='attack_class' label={language('dmcoconfig.attachck.malware_type')} options={attackClassDate} />
      <NameText name='rule_name' label={language('dmcoconfig.attachck.rulename')} required={true} max={128} />
      <NameText name='attack_group' label={language('dmcoconfig.attachck.attackorganization')} required={false} max={64} />
      <div className='ruletypeDiv'>
        <ProFormRadio.Group
          label={language('dmcoconfig.attachck.ruletype')}
          initialValue={1}
          name='ruletype'
          radioType='button'
          options={ruletypeList}
          onChange={(e) => {
            setRuleTypeStatus(e.target.value);
          }}
          fieldProps={{ buttonStyle: "solid" }} />
      </div>

      {ruleTypeStatus == 1 ?
        <ProFormText name='md5' label={language('dmcoconfig.attachck.filehash')} />
        :
        <NotesText name="rule" label={language('dmcoconfig.attachck.filecharacteristic')} required={false} max={2048} />
      }
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
      <NameText name='desc' label={language('dmcoconfig.desc')} required={false} max={128} />
    </ModalForm>
    {/**导入动态字段 选择 */}
    <ImportAssembly
      columnlist={columnlist}
      uploadUrl={uploadUrl}
      uploadAddUrl={uploadAddUrl}
      onUploadSuccess={onUploadSuccess}
      imoritModalStatus={imoritModalStatus}
      setImoritModalStatus={setImoritModalStatus}
      uploadList={{ moduleType: module }}
    />
    <Policy visible={visible} setVisible={setVisible} operate={operate} rowInfo={rowRecord} type='policy' module='malware' />
  </>)
}

export default Malapgtion
