import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormDigit, ProFormTextArea } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message } from 'antd';
import { LinkTwo } from '@icon-park/react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, AmTag } from '@/components';
import { ImportAssembly } from '@/common';
import DownnLoadFile from '@/utils/downnloadfile.js';
import Policy from '../../components/policy';
import { post } from '@/services/https';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Keyword = () => {
  const fileTypeList = [
    { label: language('dmcoconfig.document'), value: 1 },
    { label: language('dmcoconfig.picture'), value: 2 },
    { label: language('dmcoconfig.textfile'), value: 3 },
    { label: language('dmcoconfig.compackage'), value: 4 },
    { label: language('dmcoconfig.mail'), value: 5 },
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
      title: language('dmcoconfig.filetypelimit'),
      dataIndex: 'filter_file_type',
      key: 'filter_file_type',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        let content = [];
        if (record?.info?.filter_file_type && record?.info?.filter_file_type.length >= 1) {
          fileTypeList.map((item) => {
            if (record?.info?.filter_file_type.indexOf(item.value) >= 0) {
              content.push(item.label);
            }
          })
        }
        if (content.length >= 1) {
          return content.join(',');
        }
      }
    },
    {
      title: language('dmcoconfig.minsize'),
      dataIndex: 'min_size',
      key: 'min_size',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        return record?.info?.filter_file_size?.min_size
      }
    },
    {
      title: language('dmcoconfig.maxsize'),
      dataIndex: 'max_size',
      key: 'max_size',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        return record?.info?.filter_file_size?.max_size
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
      title: language('dmcoconfig.min_match_num'),
      dataIndex: 'min_match_count',
      key: 'min_match_count',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.min_match_count
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
      valueType: 'option',
      importStatus: 'N',
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
  const [ruletypeDate, setRuletypeDate] = useState([]);
  const [columns, setColumns] = useState(columnlist);
  const [modalVal, setModalVal] = useState(); // 当前点击弹框类型 distrbute | revoke | assocTable

  /* 页面表格传参区 */
  const components = true;
  const columnvalue = 'filefitKeywordColunmval';
  const tableKey = 'filefitKeyword';
  const module = 'keyword_filter';
  const apiShowurl = '/cfg.php?controller=confPolicy&action=show';
  let rowkey = (record => record.rule_id);
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
    let api = '/cfg.php?controller=confPolicy&action=exportFilekey';
    let data = list;
    data.queryVal = queryVal;
    data.moduleType = module;
    data.filters = JSON.stringify(filtersList);
    DownnLoadFile(api, data, setFileDownLoading)
  }
  const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
  const uploadUrl = '/cfg.php?controller=confPolicy&action=importFilekey';
  const uploadAddUrl = '/cfg.php?controller=confPolicy&action=importFilekey';
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
      setRuletypeDate(res?.data?.rule_type);
      let ruleTypeFillter = res?.data?.rule_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == 'rule_type') {
          item.filters = ruleTypeFillter;
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
    values.filter_file_size = {};
    values.filter_file_size.min_size = values.min_size;
    values.filter_file_size.max_size = values.max_size;
    delete values.min_size;
    delete values.max_size;
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

  const afterDiv = (unit) => {
    return <div className='afterDiv'>{unit}</div>
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
        filterChange={filterChange}
        uploadButton={uploadButton}
        uploadClick={uploadClick}
        downloadButton={downloadButton}
        downLoadType={downLoadType}
        downloadClick={downloadClick}
      />
      <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
        autoFocusFirstInput title={language('dmcoconfig.filefit.keywordfilteringrules')}
        visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
        initialValues={{
          "min_match_count": 1
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
        <ProFormSelect name='filter_file_type'
          fieldProps={{
            mode: 'multiple'
          }}
          label={language('dmcoconfig.filetypelimit')}
          options={fileTypeList}
          rules={[
            {
              required: true
            }
          ]}
        />
        <ProFormText name='min_match_count' label={language('dmcoconfig.min_match_num')} rules={[
          {
            required: true
          }
        ]} />
        <div className='flexDiv'>
          <ProFormText name='min_size' label={language('dmcoconfig.minsize')} addonAfter={afterDiv('KB')} rules={[
            {
              validator: (rule, value) => {
                if (Number(value) < 0 || Number(value) > (4 * 1024 * 1024)) {
                  return Promise.reject(language('dmcoconfig.filesizemsg'));
                } else {
                  return Promise.resolve();
                }
              }
            },
            {
              required: true
            }
          ]} />
          <ProFormText name='max_size' label={language('dmcoconfig.maxsize')} addonAfter={afterDiv('KB')} rules={[
            {
              validator: (rule, value) => {
                if (Number(value) < 0 || Number(value) > (4 * 1024 * 1024)) {
                  return Promise.reject(language('dmcoconfig.filesizemsg'));
                } else {
                  return Promise.resolve();
                }
              }
            },
            {
              required: true
            }
          ]} />
        </div>
        <ProFormTextArea name='rule_content' label={language('dmcoconfig.attachck.rule')} rules={[{
          required: true,
          message: language('project.mandatory')
        }]} />
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
      />
      <Policy visible={visible} setVisible={setVisible} operate={operate} rowInfo = {rowRecord} module='keyword_filter' type='policy'/>
    </>
  )

}

export default Keyword
