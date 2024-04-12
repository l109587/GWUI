import { ProtableModule } from "@/components/Module";
import { useState, useEffect } from "react";
import { useSelector } from "umi";
import { drawFormLayout } from "@/utils/helper";
import { Space, Tag, Form, message, Modal, Tooltip, Switch } from "antd";
import {
  ProFormText,
  ProFormSelect,
  ModalForm,
  DrawerForm,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSwitch,
} from "@ant-design/pro-components";
import {
  CloseOutlined,
  MenuOutlined,
  StopOutlined,
  CloseCircleFilled,
  EditOutlined,
} from "@ant-design/icons";
import { regList, regIpList } from "@/utils/regExp";
import { NotesText, NameText } from "@/utils/fromTypeLabel";
import DownnLoadFile from "@/utils/downnloadfile.js";
import { language } from "@/utils/language";
import { SortableHandle } from "react-sortable-hoc";
import WebUploadr from "@/components/Module/webUploadr";
import { post } from "@/services/https";
import styles from "./index.less";
import AddIcon from "@/assets/nac/add.svg";
import SaveSvg from "@/assets/nac/save.svg";
import AddTermGroup from "../../objman/components/addtermgrp";
import AddAceGroup from "../../objman/components/addacegrp";
import AddAccessTime from "../../access/components/addAccessTime";
import AddRegVerify from "../components/addRegVerify";
import AddAuthCfg from "../../objman/components/addAuthCfg";

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const { confirm } = Modal;

export default function () {
  const [termgrpVisible, setTermgrpVisible] = useState(false); //新建终端分组弹窗开关
  const [acegrpVisible, setAcegrpVisible] = useState(false); //新建接入分组弹窗开关
  const [addAccTimeVisible, setAddAccTimeVisible] = useState(false); //新建准入时段弹窗开关
  const [addRegVerVisible, setAddRegVerVisible] = useState(false); //新建注册审核弹窗开关
  const [addAuthCfgVisible, setAddAuthCfgVisible] = useState(false); //新建权限配置弹窗开关
  const [addDrawerOpen, setAddDrawerOpen] = useState(false); //抽屉开关
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [screenList, setScreenList] = useState({});
  const [securitydomain, setSecuritydomain] = useState([]); //隔离区域
  const [timecombox, setTimecombox] = useState([]); //准入时段
  const [accesslocation, setAccesslocation] = useState([]); //接入位置
  const [devGrpCombo, setDevGrpCombo] = useState([]); //终端分组
  const [regverify, setRegverify] = useState([{ label: "不审核", value: "" }]); //注册审核
  const [devType, setDevType] = useState([]); //终端类型
  const [sysType, setSysType] = useState([]); //系统类型
  const [recordInfo, setRecordInfo] = useState({}); //策略信息
  const [domains, setDomains] = useState([]); //保存临时隔离区域
  const [imoritModalStatus, setImoritModalStatus] = useState(false); //导入 上传文件弹出框

  const [accessType, setAccessType] = useState("check"); //准入方式
  const [otherAccessType, setOtherAccessType] = useState([]); //其他准入方式
  const [checkactionType, setCheckactionType] = useState(""); //安全检查

  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;

  const [addform] = Form.useForm();
  const [importFormRef] = Form.useForm();

  useEffect(() => {
    fetchTimecombox();
    fetchAccesslocation();
    fetchDevGrpCombo();
    fetchRegverify();
    // fetchDevType();
    // fetchSysType();
  }, []);

  const accessmodeMap = {
    check: "入网检查",
    forbid: "阻断入网",
    allow: "直接入网",
  };
  const authMap = {
    no: "不认证",
    portal: "PORTAL认证",
    ukey: "UKEY认证",
  };
  const checkActionOptions = [
    {
      label: "不处理",
      value: "0",
    },
    {
      label: "关键项违规完全阻断",
      value: "1",
    },
    {
      label: "关键项违规隔离阻断",
      value: "2",
    },
    {
      label: "任意项违规隔离阻断",
      value: "3",
    },
  ];

  const columnsList = [
    {
      title: language("project.sort"),
      dataIndex: "sort",
      fixed: "left",
      width: 60,
      ellipsis: true,
      className: "drag-visible",
      render: (text, record, index) => {
        return (
          <div>
            <DragHandle />
            <span style={{ marginLeft: "6px" }}>{record.number}</span>
          </div>
        );
      },
    },
    {
      title: "策略状态",
      width: 80,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record) => {
        return (
          <Switch
            checked={text === "Y"}
            onChange={(state) => {
              changeStatus(record, state);
            }}
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
          />
        );
      },
    },
    {
      title: "策略名称",
      width: 110,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "终端分组",
      width: 150,
      dataIndex: "agent_group_id",
      key: "agent_group_id",
      align: "left",
      ellipsis: true,
    },
    {
      title: "接入位置",
      width: 150,
      dataIndex: "algid",
      key: "algid",
      align: "left",
      ellipsis: true,
    },
    {
      title: "设备类型",
      width: 80,
      dataIndex: "dev_type_name",
      key: "dev_type_name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "系统类型",
      width: 80,
      dataIndex: "sys_type_name",
      key: "sys_type_name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "准入时段",
      width: 80,
      dataIndex: "access_time_id",
      key: "access_time_id",
      align: "left",
      ellipsis: true,
    },
    {
      title: "准入方式",
      width: 140,
      dataIndex: "access_mode",
      key: "access_mode",
      align: "center",
      render: (text) => {
        let color = "#FF7429";
        switch (text) {
          case "check":
            color = "#FF7429";
            break;
          case "forbid":
            color = "#FF0000";
            break;
          case "allow":
            color = "#12C189";
            break;

          default:
            break;
        }
        return <Tag color={color}>{accessmodeMap[text]}</Tag>;
      },
    },
    {
      title: "认证方式",
      width: 140,
      dataIndex: "auth",
      key: "auth",
      align: "center",
      render: (text) => {
        let color = "default";
        switch (text) {
          case "portal":
            color = "cyan";
            break;
          case "ukey":
            color = "blue";
            break;
          default:
            break;
        }
        return <Tag color={color} style={{width:82,marginRight:0}}>{authMap[text] || "不认证"}</Tag>;
      },
    },
    {
      title: "注册审核策略",
      width: 140,
      dataIndex: "reg_verify_policy",
      key: "reg_verify_policy",
      align: "left",
      ellipsis: true,
    },
    {
      title: "安全检查",
      width: 160,
      dataIndex: "checkaction",
      key: "checkaction",
      align: "left",
      render: (text) => {
        const data = checkActionOptions.find((item) => item.value === text);
        return data.label;
      },
    },

    {
      title: "阻断提示",
      width: 140,
      dataIndex: "blockinfo",
      key: "blockinfo",
      align: "left",
      ellipsis: true,
    },
    {
      title: "隔离区域",
      width: 140,
      dataIndex: "quarantine_domain_id",
      key: "quarantine_domain_id",
      align: "left",
      ellipsis: true,
    },
    {
      title: "访客准入",
      width: 140,
      dataIndex: "is_guest_access",
      key: "is_guest_access",
      align: "center",
      render: (value) => {
        let color = value === "Y" ? "#12C189" : "#777777";
        let text = value === "Y" ? "开启" : "关闭";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "延迟准入",
      width: 140,
      dataIndex: "is_delay_access",
      key: "is_delay_access",
      align: "center",
      render: (value) => {
        let color = value === "Y" ? "#12C189" : "#777777";
        let text = value === "Y" ? "开启" : "关闭";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "延迟日期",
      width: 140,
      dataIndex: "delay_date",
      key: "delay_date",
      align: "left",
      ellipsis: true,
    },
    {
      title: "创建者",
      width: 120,
      dataIndex: "add_user_name",
      key: "add_user_name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "策略添加/修改时间",
      width: 140,
      dataIndex: "op_time",
      key: "op_time",
      align: "left",
      ellipsis: true,
    },
    {
      title: "操作",
      width: 100,
      dataIndex: "operate",
      key: "operate",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Space style={{ verticalAlign: "middle" }}>
            <Tooltip title={language("project.moveup")}>
              <span
                onClick={
                  record.first
                    ? false
                    : () => {
                        priorityadmpolicy(record, "up");
                      }
                }
              >
                <i
                  className="fa fa-arrow-circle-up"
                  style={{
                    color: record.first ? "#88898A" : "#12C189",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  aria-hidden="true"
                ></i>
              </span>
            </Tooltip>
            <Tooltip title={language("project.movedown")}>
              <span
                onClick={
                  record.last
                    ? false
                    : () => {
                        priorityadmpolicy(record, "down");
                      }
                }
              >
                <i
                  className="fa fa-arrow-circle-down"
                  style={{
                    color: record.last ? "#88898A" : "#12C189",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  aria-hidden="true"
                ></i>
              </span>
            </Tooltip>
            <Tooltip
              title={language("project.edit")}
              arrowPointAtCenter
              onClick={() => {
                setRecordInfo(record);
                console.log(record, "record");
                const otherAccType = [];
                if (record.is_guest_access === "Y") {
                  otherAccType.push("is_guest_access");
                }
                if (record.is_delay_access === "Y") {
                  otherAccType.push("is_delay_access");
                }
                setAccessType(record.access_mode);
                setOtherAccessType(otherAccType);
                setCheckactionType(record.checkaction);
                addform.setFieldsValue({
                  ...record,
                  status: record.status === "Y",
                  agent_group_idValue: record.agent_group_id,
                  access_time_idValue: record.access_time_id,
                  access_modeValue: record.access_mode,
                  authValue: record.auth,
                  quarantine_domain_idValue: record.quarantine_domain_id,
                  is_different_access: otherAccType,
                });
                setAddDrawerOpen(true);
              }}
            >
              <div style={{ height: 22, display:'flex',alignContent:'center' }}>
                <img src={SaveSvg} style={{ cursor: "pointer",width:16 }} />
              </div>
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  //顺序变动接口
  const priorityadmpolicy = (record, direction) => {
    let data = {
      direction,
      id: record.id,
      policyName: record.name,
      number: record.number,
      moveLocation: 1,
      filters: screenList,
    };
    post("/cfg.php?controller=admissionPolicy&action=move", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setIncID(incID + 1);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //新增
  const addClick = () => {
    setAddDrawerOpen(true);
  };
  const dragSort = (oldIndex, newIndex, dataList) => {
    // let data = {};
    // data.id = dataList[oldIndex].id;
    // data.number = dataList[oldIndex].number;
    // data.endnumber = dataList[newIndex].number;
    // post('/cfg.php?controller=confAdmissionPolicy&action=priorityadmpolicy', data).then((res) => {
    //   if (!res.success) {
    //     message.error(res.msg);
    //     return false;
    //   }
    //   setIncID(incID + 1);
    // }).catch(() => {
    //   console.log('mistake');
    // })
    return true;
  };

  //更改状态
  const changeStatus = (info, state) => {
    const params = { name: info.name, ids: info.id, status: state ? "Y" : "N" };
    post("/cfg.php?controller=admissionPolicy&action=enable", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };
  //全部禁用
  const disabledAllRender = () => {
    return (
      <Space style={{ cursor: "pointer" }} onClick={disabledAll}>
        <StopOutlined style={{ color: "#004AB5" }} />
        <span style={{ color: "#004AB5" }}>全部禁用</span>
      </Space>
    );
  };
  const disabledAll = () => {
    const params = { status: "N" };
    post("/cfg.php?controller=admissionPolicy&action=allEnable", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //批量删除
  const delClick = (selectedRowKeys, dataList, selectRecord) => {
    const sum = selectedRowKeys.length;
    confirm({
      icon: <CloseCircleFilled style={{ color: "red" }} />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      className: "delModal",
      okType: "danger",
      onOk: () => {
        delconfirm(selectRecord);
      },
    });
  };
  //确定删除
  const delconfirm = (selectRecord) => {
    const names = [];
    const ids = [];
    selectRecord.map((item) => {
      names.push(item.name);
      ids.push(item.id);
    });
    const params = { names: names.join(","), ids: ids.join(",") };
    post("/cfg.php?controller=admissionPolicy&action=del", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  //获取准入时段
  const fetchTimecombox = () => {
    post("/cfg.php?controller=timeObject&action=get_timeObject_combox")
      .then((res) => {
        if (res.success) {
          setTimecombox(res.data);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //获取接入位置
  const fetchAccesslocation = () => {
    post("/cfg.php?controller=algmng&action=accesslocationtree")
      .then((res) => {
        if (res.success) {
          setAccesslocation(res.data);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //获取终端分组
  const fetchDevGrpCombo = () => {
    post("/cfg.php?controller=devGroupControl&action=showDevGrpComboTree")
      .then((res) => {
        setDevGrpCombo(res ? res : []);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //获取注册审核
  const fetchRegverify = () => {
    post("/cfg.php?controller=reg_verify&action=reg_verify_policy_show")
      .then((res) => {
        if (res.success) {
          const datas = regverify;
          res.data.map((item) => {
            datas.push({ label: item.name, value: item.name });
          });
          setRegverify(datas);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //获取终端类型
  const fetchDevType = () => {
    post("/cfg.php?controller=devType&action=get_policy_devType")
      .then((res) => {
        if (res.success) {
          const datas = [];
          res.data.map((item) => {
            datas.push({ label: item.text, value: item.value });
          });
          setDevType(res.data);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  //获取系统类型
  const fetchSysType = () => {
    post("/cfg.php?controller=sysType&action=get_policy_sysClassType")
      .then((res) => {
        if (res.success) {
          const datas = [];
          res.data.map((item) => {
            datas.push({ label: item.text, value: item.value });
          });
          setSysType(res.data);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  //关闭弹窗重置数据
  const resetValues = () => {
    addform.resetFields();
    setAddDrawerOpen(false);
    setAccessType("check");
    setOtherAccessType([]);
    setCheckactionType("");
    setRecordInfo({});
  };

  //添加编辑入网策略
  const saveInfo = (values) => {
    let is_guest_access = "N";
    let is_delay_access = "N";
    if (values.is_different_access) {
      is_guest_access =
        values.is_different_access.findIndex(
          (item) => item === "is_guest_access"
        ) >= 0
          ? "Y"
          : "N";
      is_delay_access =
        values.is_different_access.findIndex(
          (item) => item === "is_delay_access"
        ) >= 0
          ? "Y"
          : "N";
    }
    const params = { ...values, is_guest_access, is_delay_access };
    delete params["is_different_access"];
    let url = "";
    if (Object.keys(recordInfo).length === 0) {
      url = "/cfg.php?controller=admissionPolicy&action=add";
    } else {
      url = "/cfg.php?controller=admissionPolicy&action=modify";
    }
    post(url, params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setAddModalVisible(false);
          setIncID && setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  //导入
  const uploadClick = () => {
    setImoritModalStatus(true);
  };
  /* 导入成功文件返回 */
  const onSuccess = (res) => {
    if (res.success) {
      message.success("导入成功");
      setImoritModalStatus(false);
      setIncID((incID) => incID + 1);
    } else {
      res.msg && message.error("res.msg");
    }
  };
  //导出
  const downloadClick = (list = {}) => {
    let api = "/cfg.php?controller=admissionPolicy&action=downPolicyExport";
    let data = list;
    DownnLoadFile(api, data, "", false);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <ProtableModule
        columns={columnsList}
        apishowurl="/cfg.php?controller=admissionPolicy&action=getAll"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="accnetTable"
        rowkey="id"
        columnvalue="accnetColumnvalue"
        addButton={true}
        addClick={addClick}
        delButton={true}
        delClick={delClick}
        uploadButton={true}
        uploadClick={uploadClick}
        downloadButton={true}
        downloadClick={downloadClick}
        checkRowKey="id"
        dragSort={dragSort}
        setScreenList={setScreenList}
        rowSelection={true}
        otherOperate={disabledAllRender}
      />
      <DrawerForm
        {...drawFormLayout}
        title={JSON.stringify(recordInfo) == "{}" ? "添加" : "编辑"}
        form={addform}
        visible={addDrawerOpen}
        onVisibleChange={setAddDrawerOpen}
        autoFocusFirstInput
        drawerProps={{
          destroyOnClose: true,
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          extra: (
            <div>
              <span onClick={resetValues} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
          onClose: resetValues,
        }}
        initialValues={{
          status: false,
          access_modeValue: "check",
          reg_verify_policy: "",
          checkaction: "0",
          authValue: "no",
          access_time_idValue: "一直生效",
          algid: "0",
          dev_type: "1",
          sys_type: "1",
        }}
        width={480}
        onFinish={saveInfo}
      >
        <div>
          <ProFormSwitch
            label="策略状态"
            name="status"
            checkedChildren={language("project.enable")}
            unCheckedChildren={language("project.disable")}
          />
        </div>
        <NameText
          name="name"
          label="策略名称"
          width={250}
          placeholder="请输入名称"
          required={true}
        />
        <div className={styles.formItem}>
          <ProFormTreeSelect
            name="agent_group_idValue"
            label="终端分组"
            rules={[
              {
                required: true,
                message: language("project.mandatory"),
              },
            ]}
            width={250}
            fieldProps={{
              showArrow: true,
              filterTreeNode: true,
              dropdownMatchSelectWidth: false,
              labelInValue: false,
              autoClearSearchValue: true,
              treeData: devGrpCombo,
              treeNodeFilterProp: "text",
              fieldNames: {
                label: "text",
                value: "value",
              },
              allowClear: false,
              treeNodeLabelProp: "value",
              placeholder: language("project.select"),
            }}
          />
          <img
            src={AddIcon}
            alt=""
            className={styles.addicon}
            onClick={() => {
              setTermgrpVisible(true);
            }}
          />
        </div>

        <div className={styles.formItem}>
          <ProFormTreeSelect
            name="algid"
            label="接入位置"
            rules={[
              {
                required: true,
                message: language("project.mandatory"),
              },
            ]}
            width={250}
            fieldProps={{
              showArrow: true,
              filterTreeNode: true,
              dropdownMatchSelectWidth: false,
              labelInValue: false,
              autoClearSearchValue: true,
              treeData: accesslocation,
              treeNodeFilterProp: "text",
              fieldNames: {
                label: "text",
                value: "id",
              },
              allowClear: false,
              placeholder: language("project.select"),
            }}
          />
          <img
            src={AddIcon}
            alt=""
            className={styles.addicon}
            onClick={() => {
              setAcegrpVisible(true);
            }}
          />
        </div>

        <ProFormSelect
          label="设备类型"
          name="dev_type"
          width={250}
          placeholder={language("project.select")}
          options={devType}
          fieldProps={{
            showSearch: true,
          }}
        />
        <ProFormSelect
          label="系统类型"
          name="sys_type"
          width={250}
          placeholder={language("project.select")}
          options={sysType}
          fieldProps={{
            showSearch: true,
          }}
        />
        <div className={styles.formItem}>
          <ProFormSelect
            label="准入时段"
            name="access_time_idValue"
            width={250}
            placeholder={language("project.select")}
            options={timecombox}
            rules={[
              {
                required: true,
                message: language("project.mandatory"),
              },
            ]}
            fieldProps={{
              fieldNames: {
                label: "text",
                value: "value",
              },
            }}
          />
          <img
            src={AddIcon}
            alt=""
            className={styles.addicon}
            onClick={(e) => {
              setAddAccTimeVisible(true);
            }}
          />
        </div>

        <div className={styles.radioGroup}>
          <ProFormRadio.Group
            width={250}
            name="access_modeValue"
            label="准入方式"
            options={[
              {
                label: "入网检查",
                value: "check",
              },
              {
                label: "阻断入网",
                value: "forbid",
              },
              {
                label: "直接入网",
                value: "allow",
              },
            ]}
            fieldProps={{
              optionType: "button",
              buttonStyle: "solid",
              onChange: (e) => {
                setAccessType(e.target.value);
              },
            }}
          />
        </div>
        {accessType === "forbid" && (
          <ProFormText
            label="阻断提示"
            name="blockinfo"
            width={250}
            placeholder="输入提示内容"
          />
        )}

        {accessType === "check" && (
          <>
            <div className={styles.formItem}>
              <ProFormSelect
                label="注册审核"
                name="reg_verify_policy"
                width={250}
                placeholder={language("project.select")}
                options={regverify}
              />
              <img
                src={AddIcon}
                alt=""
                className={styles.addicon}
                onClick={(e) => {
                  setAddRegVerVisible(true);
                }}
              />
            </div>

            <ProFormSelect
              label="安全检查"
              name="checkaction"
              width={250}
              placeholder={language("project.select")}
              options={checkActionOptions}
              fieldProps={{
                onChange: (value) => {
                  setCheckactionType(value);
                },
              }}
            />
            {checkactionType && (
              <ProFormDigit
                label="修复天数"
                name="repair_day"
                min={1}
                width={250}
                fieldProps={{
                  precision: 0,
                  addonAfter: "天",
                  className: styles.numberInput,
                }}
              />
            )}

            <ProFormSelect
              label="身份认证"
              name="authValue"
              width={250}
              placeholder={language("project.select")}
              options={[
                {
                  label: "不认证",
                  value: "no",
                },
                {
                  label: "PORTAL认证",
                  value: "portal",
                },
                {
                  label: "UKEY认证",
                  value: "ukey",
                },
              ]}
            />
            <div className={styles.formItem}>
              <ProFormSelect
                label="隔离区域"
                name="quarantine_domain_idValue"
                width={250}
                placeholder="请添加隔离区域"
                options={domains}
              />
              <img
                src={AddIcon}
                alt=""
                className={styles.addicon}
                onClick={(e) => {
                  setAddAuthCfgVisible(true);
                }}
              />
            </div>

            <ProFormCheckbox.Group
              label="其他准入"
              name="is_different_access"
              width={250}
              options={[
                {
                  label: "开启访客准入",
                  value: "is_guest_access",
                },
                {
                  label: "开启延迟准入",
                  value: "is_delay_access",
                },
              ]}
              fieldProps={{
                onChange: (value) => {
                  setOtherAccessType(value);
                },
              }}
            />
            {otherAccessType.some((item) => item === "is_delay_access") && (
              <ProFormDatePicker
                name="delay_date"
                label="延迟日期"
                rules={[
                  {
                    required: true,
                    message: language("project.mandatory"),
                  },
                ]}
              />
            )}
          </>
        )}
      </DrawerForm>
      <ModalForm
        layout="horizontal"
        formRef={importFormRef}
        title={language("project.import")}
        visible={imoritModalStatus}
        width={400}
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            setImoritModalStatus(false);
          },
        }}
        submitter={false}
      >
        <ProFormText
          tooltip="文件必须为.csv格式"
          label="导入文件"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
        >
          <WebUploadr
            isAuto={true}
            upbutext="请选择文件..."
            upurl="/cfg.php?controller=admissionPolicy&action=importPolicy"
            accept=".csv"
            maxSize={9999999999}
            maxCount={1}
            isUpsuccess={true}
            onSuccess={onSuccess}
            isShowUploadList={false}
          />
        </ProFormText>
      </ModalForm>

      <AddTermGroup
        visible={termgrpVisible}
        setVisible={setTermgrpVisible}
        formType="modal"
        mainformRef={addform}
      />
      <AddAceGroup
        visible={acegrpVisible}
        setVisible={setAcegrpVisible}
        formType="modal"
        mainformRef={addform}
        fetchAccesslocation={fetchAccesslocation}
      />
      <AddAccessTime
        addVisible={addAccTimeVisible}
        setAddModalVisible={setAddAccTimeVisible}
        formType="modal"
        fetchTimecombox={fetchTimecombox}
        mainformRef={addform}
      />
      <AddRegVerify
        addVisible={addRegVerVisible}
        setAddModalVisible={setAddRegVerVisible}
        formType="modal"
        fetchRegverify={fetchRegverify}
        mainformRef={addform}
      />
      <AddAuthCfg
        addVisible={addAuthCfgVisible}
        setAddModalVisible={setAddAuthCfgVisible}
        formType="modal"
        setDomains={setDomains}
        domains={domains}
        mainformRef={addform}
      />
    </div>
  );
}
