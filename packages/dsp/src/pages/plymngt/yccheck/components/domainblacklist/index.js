import React, { useRef, useState, useEffect } from "react";
import {
  DrawerForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
  ProFormDigit,
} from "@ant-design/pro-components";
import { Input, Modal, Space, Switch, Tag, Tooltip, message } from "antd";
import { LinkTwo } from "@icon-park/react";
import { CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { language } from "@/utils/language";
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, AmTag } from "@/components";
import { post } from "@/services/https";
import { NameText } from "@/utils/fromTypeLabel";
import { useSelector } from "umi";
import DrawerPolicy from "@/common/drawerPolicy";
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

import RevokeIcon from "@/assets/operate/revoke.svg"; /* 撤销 */
import DistributeIcon from "@/assets/operate/distribute.svg"; /* 分发 */
import AssociaIcon from "@/assets/operate/association.svg"; /* 关联 */
import DisAssociaIcon from "@/assets/operate/disAssociation.svg";

const Troation = () => {
  const module = "domain_blacklist";
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const tableHeight = contentHeight - 246;

  const ruleTypeList = [
    {
      label: language("dmcoconfig.attachck.blacklist.textexpression"),
      text: language("dmcoconfig.attachck.blacklist.textexpression"),
      value: 0,
    },
    {
      label: language("dmcoconfig.attachck.blacklist.regularexpression"),
      text: language("dmcoconfig.attachck.blacklist.regularexpression"),
      value: 1,
    },
  ];
  const matchTypeList = [
    {
      label: language("dmcoconfig.attachck.blacklist.substringmatching"),
      text: language("dmcoconfig.attachck.blacklist.substringmatching"),
      value: 0,
    },
    {
      label: language("dmcoconfig.attachck.blacklist.rightmatching"),
      text: language("dmcoconfig.attachck.blacklist.rightmatching"),
      value: 1,
    },
    {
      label: language("dmcoconfig.attachck.blacklist.leftmatching"),
      text: language("dmcoconfig.attachck.blacklist.leftmatching"),
      value: 2,
    },
    {
      label: language("dmcoconfig.attachck.blacklist.perfectmatch"),
      text: language("dmcoconfig.attachck.blacklist.perfectmatch"),
      value: 3,
    },
  ];
  /* 页面表格表头 */
  const columnlist = [
    {
      title: language("project.analyse.status"),
      dataIndex: "state",
      key: "state",
      align: "center",
      width: 80,
      filters: [
        { text: language("project.open"), value: "Y" },
        { text: language("project.close"), value: "N" },
      ],
      filterMultiple: false,
      render: (text, record, index) => {
        let checked = true;
        if (record.state == "N") {
          checked = false;
        }
        return (
          <Switch
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
            checked={checked}
            onChange={async (checked) => {
              SwitchBtn(record, checked);
            }}
          />
        );
      },
    },
    {
      title: language("alarmdt.ruleID"),
      dataIndex: "rule_id",
      key: "rule_id",
      importStatus: "N",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: language("alarmdt.risk"),
      dataIndex: "risk",
      key: "risk",
      align: "center",
      width: 100,
      ellipsis: true,
      render: (text, record, index) => {
        let color = "success";
        let title = language("analyse.resrisk.level.low");
        if (record?.info?.risk == "0") {
          color = "#BEBEBE";
          title = language("alarmdt.risk.safe");
        } else if (record?.info?.risk == "1") {
          color = "#93D2F3";
          title = language("alarmdt.risk.kind");
        } else if (record?.info?.risk == "2") {
          color = "#FA561F";
          title = language("alarmdt.risk.follow");
        } else if (record?.info?.risk == "3") {
          color = "#FF0000";
          title = language("alarmdt.risk.serious");
        } else if (record?.info?.risk == "4") {
          color = "#BD3124";
          title = language("alarmdt.risk.urgent");
        }
        return (
          <Tag
            style={{ marginRight: 0, padding: "0 10px" }}
            color={color}
            key={record.risk}
          >
            {title}
          </Tag>
        );
      },
    },
    {
      title: "策略名称",
      dataIndex: "rule_name",
      key: "rule_name",
      align: "left",
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.rule_name;
      },
    },
    {
      title: language("dmcoconfig.attachck.blacklist.dns"),
      dataIndex: "dns",
      key: "dns",
      align: "left",
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        return record?.info?.dns;
      },
    },
    {
      title: "策略类型",
      dataIndex: "rule_type",
      key: "rule_type",
      align: "center",
      ellipsis: true,
      width: 110,
      filters: ruleTypeList,
      filterMultiple: false,
      render: (text, record, index) => {
        let title = "";
        ruleTypeList.map((item) => {
          if (record.info.rule_type == item.value) {
            title = item.label;
          }
        });
        if (title) {
          return (
            <Tag style={{ marginRight: 0, padding: "0 10px" }}>{title}</Tag>
          );
        }
      },
    },
    {
      title: language("dmcoconfig.attachck.blacklist.matchtype"),
      dataIndex: "match_type",
      key: "match_type",
      align: "center",
      ellipsis: true,
      width: 110,
      filters: matchTypeList,
      filterMultiple: false,
      render: (text, record, index) => {
        let title = "";
        matchTypeList.map((item) => {
          if (record.info.match_type == item.value) {
            title = item.label;
          }
        });
        if (title) {
          return (
            <Tag style={{ marginRight: 0, padding: "0 10px" }}>{title}</Tag>
          );
        }
      },
    },
    {
      title: language("dmcoconfig.attachck.attackorganization"),
      dataIndex: "attack_group",
      key: "attack_group",
      align: "left",
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.attack_group;
      },
    },
    {
      title: language("dmcoconfig.attachck.blacklist.phaseofattack"),
      dataIndex: "attack_stage",
      key: "attack_stage",
      align: "center",
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        let title = "";
        attackStageDataList.map((item) => {
          if (record.info.attack_stage == item.value) {
            title = item.label;
          }
        });
        if (title) {
          return (
            <Tag
              style={{ marginRight: 0, padding: "0 10px" }}
              key={record.attack_stage}
            >
              {title}
            </Tag>
          );
        }
      },
    },

    {
      title: language("dmcoconfig.attachck.blacklist.typeattackfacility"),
      dataIndex: "facility_type",
      key: "facility_type",
      align: "left",
      ellipsis: true,
      width: 130,
      render: (text, record, index) => {
        let title = [];
        record.info?.facility_type?.map((itemVal) => {
          facilityTypeDataList.map((item) => {
            if (itemVal == item.value) {
              title.push(item.label);
            }
          });
        });
        if (title.length >= 1) {
          return title.join(",");
        }
      },
    },
    {
      title: language("dmcoconfig.attachck.attackclassification"),
      dataIndex: "attack_class",
      key: "attack_class",
      align: "center",
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        let title = "";
        attackClassDateList.map((item) => {
          if (record.info.attack_class == item.value) {
            title = item.label;
          }
        });
        if (title) {
          return (
            <Tag
              style={{ marginRight: 0, padding: "0 10px" }}
              key={record.risk}
            >
              {title}
            </Tag>
          );
        }
      },
    },

    {
      title: "告警数量",
      dataIndex: "alarm_num",
      key: "alarm_num",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: language("dmcoconfig.desc"),
      dataIndex: "desc",
      key: "desc",
      align: "left",
      ellipsis: true,
      render: (text, record, index) => {
        return record?.info?.desc;
      },
    },
    {
      title: language("dmcoconfig.refcnt"),
      dataIndex: "refcnt",
      key: "refcnt",
      importStatus: "N",
      align: "left",
      ellipsis: true,
      width: 80,
      fixed: "right",
      render: (text, record, index) => {
        let color = "#8E8D8D";
        if (record.refcnt > 0) {
          color = "#FF7429";
        } else {
          color = "#8E8D8D";
        }
        return (
          <Space align="left" style={{display:'flex',alignContent:'center'}}>
            <div style={{ minWidth: 21 }}>{record.refcnt}</div>
            {record.refcnt > 0 ? (
              <div
                style={{ marginLeft: "8px", cursor: "pointer",height:21}}
                onClick={() => {
                  disModal("assoc", record);
                }}
              >
                <img src={AssociaIcon} alt="" />
              </div>
            ) : (
              <div style={{ marginLeft: "8px", cursor: "pointer",height:21 }}>
                <img src={DisAssociaIcon} alt="" />
              </div>
            )}
          </Space>
        );
      },
    },
    {
      title: language("project.mconfig.operate"),
      align: "center",
      key: "operate",
      importStatus: "N",
      valueType: "option",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return (
          <Space className="attoperateDiv">
            <Tooltip title={language("project.distribute")}>
              <span
                onClick={() => {
                  disModal("distribute", record);
                }}
                style={{ cursor: "pointer" }}
              >
                <img src={DistributeIcon} alt="" />
              </span>
            </Tooltip>
            <Tooltip title={language("project.revoke")}>
              <span
                onClick={() => {
                  disModal("revoke", record);
                }}
                style={{ cursor: "pointer" }}
              >
                <img src={RevokeIcon} alt="" />
              </span>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const [visible, setVisible] = useState(false); //策略下发、撤销、级联设备、
  const [operate, setOperate] = useState(""); //撤销/下发/级联设备
  const formRef = useRef();
  const columnvalue = "atblacklistColumnvalue";
  const tableKey = "atblacklist";
  const [op, setOp] = useState("");
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const apishowurl = "/cfg.php?controller=confPolicy&action=show";
  const [queryVal, setQueryVal] = useState();
  let searchVal = { queryVal: queryVal, queryType: "fuzzy", module: module };
  const addButton = true;
  const addTitle = language("project.newbuild");
  let rowkey = (record) => record.rule_id;
  const delButton = true;
  const rowSelection = true;
  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [incID, setIncID] = useState(0);
  const [riskData, setRiskData] = useState([]);
  const [attackStageData, setAttackStageData] = useState([]);
  let attackStageDataList = [];
  const [facilityTypeData, setFacilityTypeData] = useState([]);
  let facilityTypeDataList = [];
  const [attackClassDate, setAttackClassDate] = useState([]);
  let attackClassDateList = [];
  // 表格列
  const [columns, setColumns] = useState(columnlist);

  const projectType = "policy";

  const [filtersList, setFiltersList] = useState({});
  const filterChange = (filters) => {
    setFiltersList(filters);
  };

  /**分发  撤销功能 start  */
  const sRef = useRef(null);
  //调用子组件接口判断弹框状态
  const disModal = (op = "", record = {}) => {
    setVisible(true);
    setRowRecord(record);
    setOperate(op);
  };

  useEffect(() => {
    getSelectData();
  }, []);

  const getSelectData = () => {
    post("/cfg.php?controller=confPolicy&action=showData", {
      module: module,
    }).then((res) => {
      setRiskData(res?.data?.risk);
      setAttackStageData(res?.data?.attack_stage);
      attackStageDataList = res?.data?.attack_stage
        ? res?.data?.attack_stage
        : [];
      setFacilityTypeData(res?.data?.facility_type);
      facilityTypeDataList = res?.data?.facility_type
        ? res?.data?.facility_type
        : [];
      setAttackClassDate(res?.data?.attack_class);
      attackClassDateList = res?.data?.attack_class
        ? res?.data?.attack_class
        : [];
      let riskFilter = res?.data?.risk?.map((item) => ({
        text: item.label,
        value: item.value,
      }));
      let fromFilter = res?.data?.from?.map((item) => ({
        text: item.label,
        value: item.value,
      }));
      let attackStageFilter = res?.data?.attack_stage?.map((item) => ({
        text: item.label,
        value: item.value,
      }));
      let facilityTypeData = res?.data?.facility_type?.map((item) => ({
        text: item.label,
        value: item.value,
      }));
      let attacktypeFilter = res?.data?.attack_class?.map((item) => ({
        text: item.label,
        value: item.value,
      }));

      columnlist.map((item, index) => {
        if (item.dataIndex == "risk") {
          item.filters = riskFilter;
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
      });
      setColumns([...columnlist]);
    });
  };

  const tableTopSearch = () => {
    return (
      <Search
        allowClear
        placeholder={language("dmcoconfig.attachack.troation.searchtext")}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };

  const openModal = (status, op) => {
    setOp(op);
    if (status == "Y") {
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  };

  const closeModal = () => {
    formRef.current.resetFields();
    openModal("N");
    setRowRecord({});
  };

  const addClick = () => {
    openModal("Y", "add");
  };

  const handleSave = (obj) => {
    let operateUrl =
      op == "add"
        ? "/cfg.php?controller=confPolicy&action=add"
        : "/cfg.php?controller=confPolicy&action=set";
    let data = {};
    data.module = module;
    data.rule_id = obj.rule_id;
    let state = "N";
    if (obj.state == "Y" || obj.state == true) {
      state = "Y";
    }
    data.state = state;
    delete obj.state;
    let share = "N";
    if (obj.share == "Y" || obj.share == true) {
      share = "Y";
    }
    data.share = share;
    delete obj.share;
    if (!obj.store_pcap) {
      obj.store_pcap = 2;
    } else {
      obj.store_pcap = 1;
    }
    if (!obj.desc) {
      obj.desc = "";
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
      openModal("N");
    });
  };

  const delClick = (selectedRowKeys, dataList, selectedRows) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: "delclickbox",
      icon: <ExclamationCircleOutlined />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      onOk() {
        handleDel(selectedRowKeys, selectedRows);
      },
    });
  };

  /* 删除接口 */
  const handleDel = (selectedRowKeys, selectedRows) => {
    let data = {};
    let ruleIDArr = selectedRows.map((e) => e.rule_id);
    data.rule_id = ruleIDArr.toString();
    post("/cfg.php?controller=confPolicy&action=del", data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID + 1);
    });
  };

  /* 启用禁用 */
  const SwitchBtn = (each, checked) => {
    let data = {};
    data.rule_id = each.rule_id;
    let state = "N";
    if (checked) {
      state = "Y";
    }
    data.state = state;
    post("/cfg.php?controller=confPolicy&action=enable", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        setIncID((incID) => incID + 1);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <>
      <ProtableModule
        columns={columns}
        components={true}
        apishowurl={apishowurl}
        incID={incID}
        clientHeight={tableHeight}
        columnvalue={columnvalue}
        tableKey={tableKey}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        rowkey={rowkey}
        delButton={delButton}
        delClick={delClick}
        addButton={addButton}
        addClick={addClick}
        rowSelection={rowSelection}
        addTitle={addTitle}
        filterChange={filterChange}
      />
      {/* <PolicyTable ref={sRef} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} syncundosaveurl={syncundosaveurl} isDefaultCheck={isDefaultCheck} module={module} projectType={projectType} /> */}
      <DrawerForm
        formRef={formRef}
        {...modalFormLayout}
        title={language("dmcoconfig.attachck.blacklist.domainblacklist")}
        visible={modalStatus}
        onVisibleChange={setModalStatus}
        width="520px"
        drawerProps={{
          maskClosable: false,
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          extra: (
            <div>
              <span onClick={closeModal} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
        }}
        onFinish={async (values) => {
          handleSave(values);
        }}
      >
        <div>
          <ProFormSwitch
            name="state"
            label={language("dmcoconfig.attachck.plicystatus")}
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
          />
        </div>
        <ProFormSelect
          name="risk"
          label={language("alarmdt.risk")}
          options={riskData}
          rules={[{ required: true }]}
        />
        <NameText
          name="rule_name"
          label="策略名称"
          required={true}
          max={128}
          placeholder="请输入"
        />
        <NameText
          label={language("dmcoconfig.attachck.blacklist.dns")}
          name="dns"
          placeholder="请输入"
        />
        <ProFormSelect
          label="策略类型"
          name="rule_type"
          options={ruleTypeList}
        />
        <ProFormSelect
          label={language("dmcoconfig.attachck.blacklist.matchtype")}
          name="match_type"
          options={matchTypeList}
        />
        <NameText
          name="attack_group"
          label={language("dmcoconfig.attachck.attackorganization")}
          required={false}
          max={64}
          placeholder="请输入"
        />
        <ProFormSelect
          name="attack_stage"
          label={language("dmcoconfig.attachck.blacklist.phaseofattack")}
          options={attackStageData}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="facility_type"
          label={language("dmcoconfig.attachck.blacklist.typeattackfacility")}
          options={facilityTypeData}
          rules={[{ required: true }]}
          fieldProps={{
            mode: "multiple",
          }}
        />
        <ProFormSelect
          label={language("dmcoconfig.attachck.attackclassification")}
          name="attack_class"
          options={attackClassDate}
        />
        <NameText
          name="desc"
          label={language("dmcoconfig.desc")}
          required={false}
          max={128}
          placeholder="请输入"
        />
      </DrawerForm>
      <DrawerPolicy
        visible={visible}
        setVisible={setVisible}
        operate={operate}
        rowInfo={rowRecord}
        module="domain_blacklist"
        type="policy"
      />
    </>
  );
};

export default Troation;
