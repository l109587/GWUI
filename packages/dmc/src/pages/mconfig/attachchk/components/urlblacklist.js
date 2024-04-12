import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormDigit } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message } from 'antd';
import { LinkTwo } from '@icon-park/react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, AmTag } from '@/components';
import { ImportAssembly } from '@/common';
import DownnLoadFile from '@/utils/downnloadfile.js';
import { post } from '@/services/https';
import { regUrlList } from '@/utils/regExp';
import { NameText } from '@/utils/fromTypeLabel';
import Policy from '../../components/policy';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Troation = () => {
  const module = 'url_blacklist';
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
      title: language('dmcoconfig.attachck.blacklist.phaseofattack'),
      dataIndex: 'attack_stage',
      key: 'attack_stage',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        let title = '';
        attackStageDataList.map((item) => {
          if (record.info.attack_stage == item.value) {
            title = item.label;
          }
        })
        if (title) {
          return (
            <Tag style={{ marginRight: 0, padding: '0 10px' }} key={record.attack_stage}>{title}</Tag>
          )
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
      title: language('dmcoconfig.attachck.blacklist.typeattackfacility'),
      dataIndex: 'facility_type',
      key: 'facility_type',
      align: 'left',
      ellipsis: true,
      width: 130,
      render: (text, record, index) => {
        let title = [];
        record.info?.facility_type?.map(itemVal => {
          facilityTypeDataList.map((item) => {
            if (itemVal == item.value) {
              title.push(item.label);
            }
          })
        })
        if (title.length >= 1) {
          return title.join(',');
        }
      }
    },
    {
      title: language('dmcoconfig.attachck.attackclassification'),
      dataIndex: 'attack_class',
      key: 'attack_class',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        let title = '';
        attackClassDateList.map((item) => {
          if (record.info.attack_class == item.value) {
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
      title: language('dmcoconfig.attachck.blacklist.url'),
      dataIndex: 'url',
      key: 'url',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        return record?.info?.url
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
            <Tag style={{ marginRight: 0, padding: '0 10px' }} >{title}</Tag>
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
            <Tag style={{ marginRight: 0, padding: '0 10px' }}>{title}</Tag>
          )
        }
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
        return record?.info?.desc
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

  const [visible, setVisible] = useState(false) //策略下发、撤销、级联设备、
  const [operate, setOperate] = useState(''); //撤销/下发/级联设备
  const formRef = useRef();
  const columnvalue = 'atblacklistColumnvalue';
  const tableKey = 'atblacklist';
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
  const [riskData, setRiskData] = useState([]);
  const [attackStageData, setAttackStageData] = useState([]);
  let attackStageDataList = [];
  const [facilityTypeData, setFacilityTypeData] = useState([]);
  let facilityTypeDataList = [];
  const [attackClassDate, setAttackClassDate] = useState([]);
  let attackClassDateList = [];
  const [ruleTypeStatus, setRuleTypeStatus] = useState(1);

  // 表格列
  const [columns, setColumns] = useState(columnlist);
  const projectType = 'policy';

  /**分发  撤销功能 start  */
  const sRef = useRef(null);
  //调用子组件接口判断弹框状态
  const disModal = (op = '', record = {}) => {
    setVisible(true)
    setRowRecord(record)
    setOperate(op)
  }

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
    let api = '/cfg.php?controller=confPolicy&action=exportAttaBlackurl';
    let data = list;
    data.queryVal = queryVal;
    data.moduleType = module;
    data.filters = JSON.stringify(filtersList);
    DownnLoadFile(api, data, setFileDownLoading)
  }
  const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
  const uploadUrl = '/cfg.php?controller=confPolicy&action=importAttaBlackurl';
  const uploadAddUrl = '/cfg.php?controller=confPolicy&action=importAttaBlackurl';
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
      setAttackStageData(res?.data?.attack_stage);
      attackStageDataList = res?.data?.attack_stage ? res?.data?.attack_stage : [];
      setFacilityTypeData(res?.data?.facility_type);
      facilityTypeDataList = res?.data?.facility_type ? res?.data?.facility_type : [];
      setAttackClassDate(res?.data?.attack_class);
      attackClassDateList = res?.data?.attack_class ? res?.data?.attack_class : [];
      let riskFilter = res?.data?.risk?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let trojtypeFilter = res?.data?.trojan_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let attackStageFilter = res?.data?.attack_stage?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let facilityTypeData = res?.data?.facility_type?.map(item => ({
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
        } else if (item.dataIndex == "trojan_type") {
          item.filters = trojtypeFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "attack_class") {
          item.filters = attacktypeFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "attack_stage") {
          item.filters = attackStageFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "facility_type") {
          item.filters = facilityTypeData;
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

  const openModal = (status, op) => {
    setOp(op);
    if (status == 'Y') {
      setModalStatus(true);
    } else {
      setRuleTypeStatus(1)
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
    data.module = module;
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

  const afterDiv = (unit) => {
    return <div className='afterDiv'>{unit}</div>
  }

  return (<>
    <ProtableModule columns={columns} components={true} apishowurl={apishowurl} incID={incID} clientHeight={clientHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowkey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} addTitle={addTitle} filterChange={filterChange} uploadButton={uploadButton} uploadClick={uploadClick} downloadButton={downloadButton} downLoadType={downLoadType} downloadClick={downloadClick} />
    {/* <PolicyTable ref={sRef} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} syncundosaveurl={syncundosaveurl} isDefaultCheck={isDefaultCheck} module={module} projectType={projectType} /> */}
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.attachck.blacklist.urlblacklist')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
      modalProps={{
        maskClosable: false,
        wrapClassName: 'mconfigmodalbox attachchlkblackbox',
        onCancel: () => {
          closeModal()
        }
      }} onFinish={async (values) => {
        handleSave(values)
      }}>
      <ProFormText name='rule_id' hidden />
      <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormSwitch name='share' label={language('dmcoconfig.ifshare')} checkedChildren={language('project.yes')} unCheckedChildren={language('project.no')} />
      <ProFormSelect name='risk' label={language('alarmdt.risk')} options={riskData} rules={[{ required: true }]} />
      <ProFormSelect name='attack_stage' label={language('dmcoconfig.attachck.blacklist.phaseofattack')} options={attackStageData} rules={[{ required: true }]} />
      <NameText name='attack_group' label={language('dmcoconfig.attachck.attackorganization')} required={false} max={64} />
      <NameText name='rule_name' label={language('dmcoconfig.attachck.rulename')} required={true} max={128} />
      <ProFormSelect
        name='facility_type'
        label={language('dmcoconfig.attachck.blacklist.typeattackfacility')}
        options={facilityTypeData}
        fieldProps={{
          mode: 'multiple'
        }}
        rules={[{ required: true }]}
      />
      <NameText name='desc' label={language('dmcoconfig.desc')}
        required={false} max={128}
      />
      <ProFormSelect label={language('dmcoconfig.attachck.attackclassification')} name='attack_class' options={attackClassDate} />
      <div>
        <ProFormText label={language('dmcoconfig.attachck.blacklist.url')} name='url' rules={[{
          pattern: regUrlList.urlParm.regex,
          message: regUrlList.urlParm.alertText
        },]} />
        <ProFormSelect label={language('dmcoconfig.attachck.blacklist.ruletype')} name='rule_type' options={ruleTypeList}
          onChange={(e) => {
            setRuleTypeStatus(e);
          }}
        />
      </div>
      {ruleTypeStatus == 0 ?
        <ProFormSelect label={language('dmcoconfig.attachck.blacklist.matchtype')} name='match_type' options={matchTypeList} />
        : <></>}
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
    <Policy visible={visible} setVisible={setVisible} operate={operate} rowInfo = {rowRecord} module='url_blacklist' type='policy'/>
  </>)
}

export default Troation
