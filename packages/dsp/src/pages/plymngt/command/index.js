import React, { useRef, useState, useEffect } from "react";
import {
  ExclamationCircleOutlined,
  EditFilled,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormDateTimePicker,
  DrawerForm,
  ProFormSwitch,
  ProFormDatePicker,
  ProFormDigit,
  ProFormItem,
} from "@ant-design/pro-components";
import {
  Tooltip,
  Input,
  message,
  Space,
  Tag,
  Modal,
  Row,
  Col,
  Divider,
  TreeSelect,
  Table,
  Empty,
  Select,
  Button,
  Popconfirm,
  Checkbox,
} from "antd";
import { post, postAsync } from "@/services/https";
import { language } from "@/utils/language";
import WebUploadr from "@/components/Module/webUploadr";
import PolicyTable from "@/components/Module/policyTable";
const { Search } = Input;
const { confirm } = Modal;
import { TableLayout } from "@/components";
const { ProtableModule } = TableLayout;
import { modalFormLayout } from "@/utils/helper";
import styles from "./index.less";
import { LinkTwo } from "@icon-park/react";
import { regList } from "@/utils/regExp";
import { NameText } from "@/utils/fromTypeLabel";
import DrawerPolicy from "@/common/drawerPolicy";
import { useSelector } from "umi";
import EditTable from "@/components/Module/tinyEditTable/tinyEditTable";

import RevokeIcon from "@/assets/operate/revoke.svg"; /* 撤销 */
import DistributeIcon from "@/assets/operate/distribute.svg"; /* 分发 */
import AssociaIcon from "@/assets/operate/association.svg"; /* 关联 */
import DisAssociaIcon from "@/assets/operate/disAssociation.svg";

export default function Ctrlcmd() {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const tableHeight = contentHeight - 214;
  const devTableHeight = contentHeight - 300;
  const rowKey = (record) => record.id; //列表唯一值
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [queryVal, setQueryVal] = useState(""); //搜索框的值
  const [cmdType, setCmdType] = useState(""); //命令类型
  const [devqueryVal, setDevqueryVal] = useState(""); //设备搜索搜索框的值
  const [orderType, setOrderType] = useState(""); //表单中命令类型
  const [checkMethod, setCheckMethod] = useState("get_file"); //检查方法
  const [ruleType, setRuleType] = useState(""); //规则类型
  const [rowRecord, setRowRecord] = useState({}); //关联设备数据
  const [updateRes, setUpdateRes] = useState({}); //获取固件升级返回信息
  const [ruleRes, setRuleRes] = useState({}); //获取规则文件返回信息
  const [modulesall, setModulesall] = useState([]); //获取规则文件返回信息
  const [modules, setModules] = useState([]); //获取所有模块信息
  const [submodules, setSubmodules] = useState([]); //获取子模块信息
  const [submoduleall, setSubmoduleall] = useState([]); //获取所有子模块信息
  const [deviceType, setDeviceType] = useState("5"); //下发设备类型
  let searchVal = { queryVal: queryVal, queryType: "fuzzy" }; //顶部搜索框值 传入接口
  const formRef = useRef();

  //命令下发
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //key
  const [devList, setDevList] = useState([]); //设备列表
  const [modalValue, setModalValue] = useState("1"); //选中类型
  const [loading, setLoading] = useState(false);
  const [limitVal, setLimitVal] = useState(20); // 每页条目
  const [currPage, setCurrPage] = useState(1); // 当前页码
  const [totEntry, setTotEntry] = useState(0); // 总条数
  const [zoneId, setZoneId] = useState("000000"); //机构id
  const [operate, setOperate] = useState(""); //撤销/下发/级联设备
  const [zoneInfo, setZoneInfo] = useState({
    gpnamePath: "/全部机构",
    level: "1",
  }); //侧边栏选中地址id
  const [selectedDevList, setSelectedDevList] = useState([]); //选中设备列表
  const [zoneData, setZoneData] = useState([]); //机构列表
  const [certType, setCertType] = useState("1"); //行政编号

  const [isSave, setIsSave] = useState(true); // 未保存当前数据不可下发
  const [eventsData, setEventsData] = useState([]); // 未保存当前数据不可下发

  const [drawerVisible, setDrawerVisible] = useState(false); //当前点击弹框类型 distrbute | revoke | assocTable
  //调用子组件接口判断弹框状态
  const disModal = (op = "", record = {}) => {
    setRowRecord(record);
    setDrawerVisible(true);
    setOperate(op);
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language("project.cfgmngt.ctrlcmd.puzzysearch")}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };
  //删除弹框
  const delClick = (selectedRowKeys) => {
    let sum = selectedRowKeys.length;
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      onOk() {
        delList(selectedRowKeys);
      },
    });
  };
  //删除功能
  const delList = (selectedRowKeys) => {
    let data = {};
    data.ids = selectedRowKeys.join(",");
    post("/cfg.php?controller=confRemoteCmd&action=del", data)
      .then((res) => {
        if (res.success) {
          setIncID(incID + 1);
          res.msg && message.success(res.msg);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //新建命令
  const addClick = () => {
    fetchdevList();
    setModalStatus(true);
  };

  //下发命令
  const save = (values) => {
    if (modalValue === "4" && selectedRowKeys.length == 0) {
      message.error("请选择下发设备！");
      return false;
    }
    let param = {};
    switch (orderType) {
      case "report_policy":
        param = { submodule: values.submodule };
        break;
      case "cert_update":
        param = { filename: ruleRes.filename, md5: ruleRes.md5 };
        break;
      case "ctrl_inner_policy":
        param = {
          submodule: values.submodule,
          rule_id: values.rule_id,
          vender_id: values.vender_id,
          enable: values.enable ? "1" : "0",
        };
        break;
      case "warning_dispose":
        const events = [];
        eventsData.map((item) => {
          const alarmids = item.alarm_id.split(",");
          events.push({ device_id: item.device_id, alarm_id: alarmids });
        });
        param = {
          warn_id: values.warn_id,
          warn_title: values.warn_title,
          vender_id: values.vender_id,
          warn_desc: values.warn_desc,
          warn_level: values.warn_level,
          expire_date: values.expire_date,
          // relation_events:JSON.stringify(events)
          relation_events: events,
        };
        break;
      case "startm":
        param = { module: values.module, submodule: values.submodule };
        break;
      case "stopm":
        param = { module: values.module, submodule: values.submodule };
        break;
      case "startm_inner":
        param = { module: values.module, submodule: values.submodule };
        break;
      case "stopm_inner":
        param = { module: values.module, submodule: values.submodule };
        break;
      case "sync_time":
        param = { time: values.time };
        break;
      case "inner_policy_update":
        param = { filename: ruleRes.filename, md5: ruleRes.md5 };
        break;
      case "update":
        param = {
          filename: updateRes?.filename,
          md5: updateRes?.md5,
          soft_version: updateRes?.version,
        };
        break;
      case "version_check":
        if (values.method === "ls") {
          param = {
            method: values.method,
            path: values.path,
          };
        } else {
          param = {
            method: values.method,
            offset: values.offset,
            length: values.length,
            filename: values.filename,
          };
        }
        break;
      case "passwd":
        param = { user: values.user, passwd: values.passwd };
        break;
      case "dropdata":
        param = {
          submodule: values.submoduledel,
          rule_id: values.ruleId === 2 ? values.id : values.ruleId,
          time: values.overtime,
        };
        break;
      default:
        break;
    }
    const params = {
      deviceType: values.deviceType,
      type: orderType,
      desc: values.desc,
      param: JSON.stringify(param),
      zoneID: zoneId,
      devids: selectedRowKeys.join(","),
    };
    if (modalValue === "4") {
      delete params.zoneID;
    }
    post("/cfg.php?controller=confRemoteCmd&action=add", params).then((res) => {
      if (res.success) {
        setModalStatus(false);
        setIncID(incID + 1);
        res.msg && message.success(res.msg);
        setOrderType("");
        setRuleRes({});
        setUpdateRes({});
        onClose();
      } else {
        res.msg && message.error(res.msg);
      }
    });
  };

  const typeMap = {
    reboot: language("project.cfgmngt.ctrlcmd.reboot"),
    shutdown: language("project.cfgmngt.ctrlcmd.shutdown"),
    startm: language("project.cfgmngt.ctrlcmd.startm"),
    stopm: language("project.cfgmngt.ctrlcmd.stopm"),
    sync_time: language("project.cfgmngt.ctrlcmd.sync_time"),
    update: language("project.cfgmngt.ctrlcmd.update"),
    version_check: language("project.cfgmngt.ctrlcmd.version_check"),
    inner_policy_update: language("project.cfgmngt.ctrlcmd.ruleupdate"),
    passwd: language("project.cfgmngt.ctrlcmd.passwd"),
    dropdata: language("project.cfgmngt.ctrlcmd.dropdata"),
    report_policy: "策略上报",
    cert_update: "证书更新",
    ctrl_inner_policy: "内置策略启停",
    warning_dispose: "威胁预警处置",
    device_report: "设备信息上报",
    startm_inner: "内置模块策略开启",
    stopm_inner: "内置模块策略关闭",
  };

  const columns = [
    {
      title: "指令对象",
      dataIndex: "deviceType",
      key: "deviceType",
      width: "80px",
      align: "left",
      render: (text) => {
        return text === "5" ? "终端组件" : "监测器";
      },
    },
    {
      title: language("project.cfgmngt.ctrlcmd.order"),
      dataIndex: "type",
      key: "type",
      width: "140px",
      align: "center",
      filterMultiple: false,
      filters: [
        { text: language("project.cfgmngt.ctrlcmd.reboot"), value: "reboot" },
        {
          text: language("project.cfgmngt.ctrlcmd.shutdown"),
          value: "shutdown",
        },
        { text: language("project.cfgmngt.ctrlcmd.startm"), value: "startm" },
        { text: language("project.cfgmngt.ctrlcmd.stopm"), value: "stopm" },
        {
          text: language("project.cfgmngt.ctrlcmd.sync_time"),
          value: "sync_time",
        },
        { text: language("project.cfgmngt.ctrlcmd.update"), value: "update" },
        {
          text: language("project.cfgmngt.ctrlcmd.version_check"),
          value: "version_check",
        },
        {
          text: language("project.cfgmngt.ctrlcmd.ruleupdate"),
          value: "inner_policy_update",
        },
        { text: language("project.cfgmngt.ctrlcmd.passwd"), value: "passwd" },
        {
          text: language("project.cfgmngt.ctrlcmd.dropdata"),
          value: "dropdata",
        },
        {
          text: "策略上报",
          value: "report_policy",
        },
        {
          text: "证书更新",
          value: "cert_update",
        },
        {
          text: "内置策略启停",
          value: "ctrl_inner_policy",
        },
        {
          text: "威胁预警处置",
          value: "warning_dispose",
        },
        {
          text: "设备信息上报",
          value: "device_report",
        },
        {
          text: "内置模块策略开启",
          value: "startm_inner",
        },
        {
          text: "内置模块策略关闭",
          value: "stopm_inner",
        },
      ],
      render: (text) => {
        let color = "processing";
        switch (text) {
          case "reboot":
            color = "processing";
            break;
          case "shutdown":
            color = "error";
            break;
          case "startm":
            color = "processing";
            break;
          case "stopm":
            color = "error";
            break;
          case "sync_time":
            color = "processing";
            break;
          case "update":
            color = "processing";
            break;
          case "version_check":
            color = "processing";
            break;
          case "inner_policy_update":
            color = "processing";
            break;
          case "passwd":
            color = "error";
            break;
          case "dropdata":
            color = "error";
            break;
          case "startm_inner":
            color = "processing";
            break;
          case "stopm_inner":
            color = "error";
            break;
          default:
            break;
        }
        return (
          <Tag color={color} style={{ margin: 0 }}>
            {typeMap[text]}
          </Tag>
        );
      },
    },
    {
      title: language("project.cfgmngt.ctrlcmd.param"),
      dataIndex: "param",
      key: "param",
      ellipsis: true,
      align: "left",
    },
    {
      title: language("project.cfgmngt.ctrlcmd.desc"),
      dataIndex: "desc",
      key: "desc",
      width: "180px",
      ellipsis: true,
      align: "left",
    },
    {
      title: language("project.cfgmngt.ctrlcmd.refdevCnt"),
      dataIndex: "refDevCnt",
      key: "refDevCnt",
      width: "80px",
      align: "center",
      render: (text, record) => {
        return (
          <Space align="left">
            <div>{text}</div>
            {text >= 1 ? (
              <div
                style={{ marginLeft: "8px", cursor: "pointer", height: 21 }}
                onClick={() => {
                  disModal("assoc", record);
                  fetchdevList();
                }}
              >
                <img src={AssociaIcon} alt="" />
              </div>
            ) : (
              <div style={{ marginLeft: "8px", cursor: "pointer", height: 21 }}>
                <img src={DisAssociaIcon} alt="" />
              </div>
            )}
          </Space>
        );
      },
    },
    // {
    //   title: language("project.mconfig.operate"),
    //   align: "center",
    //   key: "operate",
    //   importStatus: "N",
    //   valueType: "option",
    //   width: 100,
    //   fixed: "right",
    //   render: (text, record) => {
    //     return (
    //       <Space className="attoperateDiv">
    //         <Tooltip title={language("project.distribute")}>
    //           <span
    //             onClick={() => {
    //               disModal("distribute", record);
    //             }}
    //             style={{ cursor: "pointer" }}
    //           >
    //             <img src={DistributeIcon} alt="" />
    //           </span>
    //         </Tooltip>
    //         <Tooltip title={language("project.revoke")}>
    //           <span
    //             onClick={() => {
    //               disModal("revoke", record);
    //             }}
    //             style={{ cursor: "pointer" }}
    //           >
    //             <img src={RevokeIcon} alt="" />
    //           </span>
    //         </Tooltip>
    //       </Space>
    //     );
    //   },
    // },
  ];

  const fromcolumns = [
    {
      title: "监测器/终端组件ID",
      dataIndex: "device_id",
      align: "center",
      width: "43%",
      formItemProps: {
        rules: [
          {
            required: true,
            message: language("project.mandatory"),
          },
        ],
      },
    },
    {
      title: "告警ID",
      dataIndex: "alarm_id",
      align: "center",
      width: "43%",
      fieldProps: {
        placeholder: "多个ID请用逗号分隔",
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: language("project.mandatory"),
          },
        ],
      },
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "14%",
      align: "center",
      render: (text, record, _, action) => [
        <Tooltip placement="top" title={language("project.edit")}>
          <a
            key="editable"
            onClick={() => {
              setIsSave(false);
              var _a;
              (_a =
                action === null || action === void 0
                  ? void 0
                  : action.startEditable) === null || _a === void 0
                ? void 0
                : _a.call(action, record.id);
            }}
          >
            <EditFilled />
          </a>
        </Tooltip>,
        <Popconfirm
          okText={language("project.yes")}
          cancelText={language("project.no")}
          title={language("project.delconfirm")}
          onConfirm={() => {
            setEventsData(eventsData.filter((item) => item.id !== record.id));
          }}
        >
          <Tooltip placement="top" title={language("project.del")}>
            <DeleteOutlined style={{ color: "red" }} />
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ];

  const [orderTypes, setOrderTypes] = useState([]);

  useEffect(() => {
    getZoneData();
    fetchCertType();
  }, []);

  useEffect(() => {
    getCommandTypes();
  }, [deviceType]);

  useEffect(() => {
    fetchdevList();
  }, [limitVal, currPage, zoneId, cmdType, deviceType, devqueryVal]);

  const getCommandTypes = () => {
    const params = { deviceType: deviceType };
    post(
      "/cfg.php?controller=confRemoteCmd&action=getCommandTypes",
      params
    ).then((res) => {
      if (res.success && res.data.length >= 1) {
        setOrderTypes(res.data);
      }
    });
  };
  const versionTypes = [
    { label: language("project.cfgmngt.ctrlcmd.get_file"), value: "get_file" },
    { label: language("project.cfgmngt.ctrlcmd.ls"), value: "ls" },
    { label: language("project.cfgmngt.ctrlcmd.md5sum"), value: "md5sum" },
  ];

  const ruleIds = [
    { label: "全部规则", value: -1 },
    { label: "内置规则", value: 0 },
    { label: "指定规则", value: 2 },
  ];
  //获取固件更新返回值
  const fetchUpdateRes = (res) => {
    if (res.success) {
      setUpdateRes(res);
      res.msg && message.success(res.msg);
    } else {
      res.msg && message.error(res.msg);
    }
  };
  //获取规则更新返回值
  const fetchRuleRes = (res) => {
    if (res.success) {
      setRuleRes(res);
      res.msg && message.success(res.msg);
    } else {
      res.msg && message.error(res.msg);
    }
  };

  //模块选择
  const changeModules = (value) => {
    const submodules = [];
    const module = modulesall.filter((item) => item.name === value);
    module[0]?.submodules.map((item) => {
      submodules.push({ value: item.name, label: item.title });
    });
    setSubmodules(submodules);
  };

  //获取所有模块和子模块名称
  const fetchModudleNames = (value) => {
    const arr = [
      "startm",
      "stopm",
      "startm_inner",
      "stopm_inner",
      "ctrl_inner_policy",
      "report_policy",
      "dropdata",
    ];
    if (!arr.includes(value)) {
      return false;
    }
    const typeInfo = formRef?.current?.getFieldsValue(["type"]) || "";
    const data = { cmd: typeInfo.type };
    console.log(data, "data");
    post("/cfg.php?controller=confRemoteCmd&action=getModuleNames", data).then(
      (res) => {
        if (res.success) {
          const names = [];
          let subModules = [];
          const subModuleall = [];
          const modulesAll = [...res.data];
          setModulesall(modulesAll);
          res.data.map((item) => {
            names.push({ value: item.name, label: item.title });
            subModules = subModules.concat(item.submodules);
          });
          setModules(names);
          subModules.map((item) => {
            subModuleall.push({ value: item.name, label: item.title });
          });
          setSubmoduleall(subModuleall);
        }
      }
    );
  };

  //新增机构命令下发
  const selectedCol = [
    {
      title: "生效路径",
      dataIndex: "zone",
      key: "zone",
      align: "left",
      width: 150,
      ellipsis: true,
    },
    {
      title: "生效设备",
      dataIndex: "type",
      key: "type",
      align: "left",
      width: 120,
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "optera",
      key: "optera",
      align: "center",
      width: 80,
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              delSelectedItem(record);
            }}
          >
            移除
          </a>
        );
      },
    },
  ];
  const cmdColoumn = [
    {
      title: language("project.devid"),
      dataIndex: "devid",
      key: "devid",
      align: "left",
      width: 110,
      ellipsis: true,
    },
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: "设备类型",
      dataIndex: "type",
      key: "type",
      align: "left",
      width: 120,
      render: (text) => {
        return devTypeMap[text];
      },
    },
    {
      title: language("adminacc.label.zone"),
      dataIndex: "zoneName",
      key: "zoneName",
      align: "left",
      width: 150,
      ellipsis: true,
    },
  ];
  //设备类型
  const devTypeMap = {
    1: "监测器",
    5: "终端组件",
  };

  const selTypeMap = {
    1: "所有设备",
    2: "所有监测器",
    3: "所有管理系统",
  };

  //获取设备列表
  const fetchdevList = () => {
    setLoading(true);
    const data = {
      queryVal: devqueryVal,
      queryType: "fuzzy",
      start: limitVal * (currPage - 1),
      limit: limitVal,
      type: "command",
      zoneID: zoneId,
      cmd: cmdType,
      deviceType: deviceType,
    };

    post("/cfg.php?controller=confDevice&action=showSynclist", data)
      .then((res) => {
        if (res.success) {
          setDevList(res.data);
          setTotEntry(res.total);
          setLoading(false);
        }
      })
      .catch(() => {
        console.log("mistake");
        setLoading(false);
      });
  };
  const typeOptions = [
    { label: "全部设备", value: "1" },
    { label: "部分设备", value: "4" },
  ];

  const onChangeType = (value) => {
    setModalValue(value);
    setSelectedRowKeys([]);
  };

  //获取机构列表
  const getZoneData = async () => {
    let data = {};
    data.type = "tree";
    data.depth = 1;
    let res = await postAsync(
      "/cfg.php?controller=confZoneManage&action=showZoneTree",
      data
    );
    if (res) {
      res.number = "000000";
      let data = [];
      data.push(res);
      setZoneData(data);
    }
  };
  // 机构管理侧边点击id处理
  const onChangeZone = (value, node) => {
    setZoneId(value); //更新选中地址id
    setZoneInfo(node);
    setModalValue("1");
  };
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  //删除分发列表选项
  const delSelectedItem = (values) => {
    const arr = [...selectedDevList];
    const index = arr.findIndex((item) => item.zone_id === values.zone_id);
    arr.splice(index, 1);
    setSelectedDevList(arr);
  };

  //获取行政标编号
  const fetchCertType = () => {
    post("/cfg.php?controller=confCenterManage&action=show")
      .then((res) => {
        if (res.success) {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setCertType(res.data[0].type === "XZ" ? "1" : "2");
          }
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //关闭命令下发抽屉
  const onClose = () => {
    setModalStatus(false);
    setOrderType("");
    setRuleRes({});
    setUpdateRes({});
    setSelectedDevList([]);
    setZoneId("000000");
    setZoneInfo({ gpnamePath: "/全部机构", level: "1" });
    setSelectedRowKeys([]);
    setModalValue("1");
    setEventsData([]);
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
        columns={columns}
        apishowurl="/cfg.php?controller=confRemoteCmd&action=show"
        clientHeight={tableHeight}
        columnvalue="ctrlcmdColumnvalue"
        tableKey="ctrlcmdTable"
        rowkey={rowKey}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        delButton={true}
        delClick={delClick}
        addButton={true}
        addClick={addClick}
        rowSelection={true}
      />
      <DrawerForm
        {...modalFormLayout}
        width="800px"
        onFinish={save}
        initialValues={{ start: 0, rule: "rule", deviceType: "5" }}
        formRef={formRef}
        title={language("project.cfgmngt.ctrlcmd.addtitle")}
        visible={modalStatus}
        autoFocusFirstInput
        drawerProps={{
          destroyOnClose: true,
          okText: language("project.cfgmngt.ctrlcmd.add"),
          bodyStyle: { padding: 16 },
          headerStyle: { padding: 16 },
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          extra: (
            <div>
              <span onClick={onClose} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
        }}
        className={styles.devModal}
        onVisibleChange={setModalStatus}
      >
        <div className={styles.objRadioGroup}>
          <ProFormRadio.Group
            width={280}
            name="deviceType"
            label="指令对象"
            options={[
              {
                label: "终端组件",
                value: "5",
              },
              {
                label: "监测器",
                value: "1",
              },
            ]}
            fieldProps={{
              optionType: "button",
              buttonStyle: "solid",
              onChange: (values) => {
                setDeviceType(values.target.value);
              },
            }}
          />
        </div>
        <ProFormSelect
          label={language("project.cfgmngt.ctrlcmd.ordertype")}
          name="type"
          options={orderTypes}
          fieldProps={{
            onChange: (value) => {
              setOrderType(value);
              formRef.current.setFieldsValue({ type: value });
              setCmdType(value);
              fetchModudleNames(value);
            },
          }}
          width={280}
          rules={[
            {
              required: true,
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />

        {orderType === "ctrl_inner_policy" && (
          <div>
            <ProFormSwitch
              label="策略启停"
              name="enable"
              defaultValue={false}
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
            />
            <NameText
              name="rule_id"
              label="规则ID"
              width="280px"
              placeholder="请输入"
            />
            <NameText
              name="vender_id"
              label="厂商编号"
              width="280px"
              placeholder="请输入"
            />
          </div>
        )}

        <ProFormSelect
          options={modules}
          hidden={
            !(
              orderType === "startm" ||
              orderType === "stopm" ||
              orderType === "report_policy" ||
              orderType === "ctrl_inner_policy" ||
              orderType === "startm_inner" ||
              orderType === "stopm_inner"
            )
          }
          name="module"
          label={language("project.cfgmngt.ctrlcmd.module")}
          width={280}
          fieldProps={{
            onChange: (value) => {
              changeModules(value);
              formRef.current.setFieldsValue({ submodule: [] });
            },
          }}
          rules={[
            {
              required:
                orderType === "startm" ||
                orderType === "stopm" ||
                orderType === "report_policy" ||
                orderType === "ctrl_inner_policy" ||
                orderType === "startm_inner" ||
                orderType === "stopm_inner",
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />
        <ProFormSelect
          options={submodules}
          hidden={
            !(
              orderType === "startm" ||
              orderType === "stopm" ||
              orderType === "report_policy" ||
              orderType === "ctrl_inner_policy" ||
              orderType === "startm_inner" ||
              orderType === "stopm_inner"
            )
          }
          name="submodule"
          label={language("project.cfgmngt.ctrlcmd.submodule")}
          fieldProps={{
            showArrow: true,
            mode: "multiple",
          }}
          width={280}
        />
        <ProFormDateTimePicker
          hidden={!(orderType === "sync_time")}
          label={language("project.cfgmngt.ctrlcmd.systime")}
          name="time"
          width={280}
          className={styles.systime}
          rules={[
            {
              required: orderType === "sync_time",
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />
        <ProFormText
          hidden={!(orderType === "update")}
          label={language("project.cfgmngt.ctrlcmd.updatetxt")}
          width={280}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: 280,
            }}
          >
            <span>{updateRes?.filename}</span>
            <span className={styles.uploadButton}>
              <WebUploadr
                isAuto={true}
                upbutext={language("project.sysconf.syscert.upload")}
                maxSize={30000000}
                upurl="/cfg.php?controller=confRemoteCmd&action=storeFirmware"
                isShowUploadList={false}
                maxCount={1}
                name={true}
                isUpsuccess={true}
                onSuccess={fetchUpdateRes}
              />
            </span>
          </div>
        </ProFormText>
        <ProFormText
          hidden={!(orderType === "update")}
          label={language("project.cfgmngt.ctrlcmd.code")}
          width={280}
        >
          <span>{updateRes?.md5}</span>
        </ProFormText>
        <ProFormText
          hidden={!(orderType === "update")}
          label={language("project.cfgmngt.ctrlcmd.version")}
          width={280}
        >
          <span>{updateRes?.version}</span>
        </ProFormText>
        <div className={styles.methodRadioGroup}>
          <ProFormRadio.Group
            options={versionTypes}
            hidden={!(orderType === "version_check")}
            label={language("project.cfgmngt.ctrlcmd.method")}
            radioType="button"
            name="method"
            initialValue="get_file"
            fieldProps={{
              buttonStyle: "solid",
              onChange: (value) => {
                const method = value.target.value;
                setCheckMethod(method);
                formRef.current.resetFields([
                  "filename",
                  "path",
                  "offset",
                  "length",
                ]);
              },
            }}
            rules={[
              {
                required: true,
                message: language("project.cfgmngt.ctrlcmd.required"),
              },
            ]}
          />
        </div>

        <ProFormText
          hidden={!(orderType === "version_check" && checkMethod === "ls")}
          name="path"
          label={language("project.cfgmngt.ctrlcmd.path")}
          width={280}
          rules={[
            {
              required: orderType === "version_check" && checkMethod === "ls",
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />
        <ProFormText
          hidden={
            !(
              orderType === "version_check" &&
              (checkMethod === "get_file" || checkMethod === "md5sum")
            )
          }
          name="filename"
          label={language("project.cfgmngt.ctrlcmd.path")}
          width={280}
          rules={[
            {
              required:
                orderType === "version_check" &&
                (checkMethod === "get_file" || checkMethod === "md5sum"),
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />
        <ProFormText
          label={language("project.cfgmngt.ctrlcmd.offset")}
          className={styles.offset}
          hidden={
            !(
              orderType === "version_check" &&
              (checkMethod === "get_file" || checkMethod === "md5sum")
            )
          }
          rules={[
            {
              required: true,
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
          name="start"
        >
          <Row gutter={4}>
            <Col>
              <ProFormText
                hidden={
                  !(
                    orderType === "version_check" &&
                    (checkMethod === "get_file" || checkMethod === "md5sum")
                  )
                }
                name="offset"
                width={100}
                rules={[
                  {
                    required:
                      orderType === "version_check" &&
                      (checkMethod === "get_file" || checkMethod === "md5sum"),
                    message: language("project.cfgmngt.ctrlcmd.required"),
                  },
                  {
                    pattern: regList.numPattern.regex,
                    message: regList.numPattern.alertText,
                  },
                ]}
              />
            </Col>
            <Col>
              <ProFormText
                name="length"
                label={language("project.cfgmngt.ctrlcmd.readlength")}
                width={100}
                rules={[
                  {
                    required:
                      orderType === "version_check" &&
                      (checkMethod === "get_file" || checkMethod === "md5sum"),
                    message: language("project.cfgmngt.ctrlcmd.required"),
                  },
                  {
                    pattern: regList.numPattern.regex,
                    message: regList.numPattern.alertText,
                  },
                ]}
              />
            </Col>
          </Row>
        </ProFormText>
        <ProFormText
          hidden={
            !(
              orderType === "inner_policy_update" || orderType === "cert_update"
            )
          }
          label={
            orderType === "inner_policy_update"
              ? language("project.cfgmngt.ctrlcmd.ruletxt")
              : "证书文件"
          }
          width={280}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: 280,
            }}
          >
            <span>{ruleRes?.filename}</span>
            <span className={styles.uploadButton}>
              <WebUploadr
                isAuto={true}
                accept=".zip"
                upbutext={language("project.sysconf.syscert.upload")}
                maxSize={30000000}
                upurl={
                  orderType === "inner_policy_update"
                    ? "/cfg.php?controller=confRemoteCmd&action=storePolicyFile"
                    : "/cfg.php?controller=confRemoteCmd&action=storeCertFile"
                }
                isShowUploadList={false}
                maxCount={1}
                name={true}
                isUpsuccess={true}
                onSuccess={fetchRuleRes}
              />
            </span>
          </div>
        </ProFormText>
        <ProFormText
          hidden={
            !(
              orderType === "inner_policy_update" || orderType === "cert_update"
            )
          }
          label={language("project.cfgmngt.ctrlcmd.code")}
          width={280}
        >
          <span>{ruleRes?.md5}</span>
        </ProFormText>
        <ProFormText
          hidden={!(orderType === "passwd")}
          name="user"
          label={language("project.cfgmngt.ctrlcmd.user")}
          width={280}
          rules={[
            {
              required: orderType === "passwd",
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />
        <ProFormText.Password
          hidden={!(orderType === "passwd")}
          name="passwd"
          label={language("project.cfgmngt.ctrlcmd.password")}
          width={280}
          rules={[
            {
              required: orderType === "passwd",
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />
        <ProFormSelect
          hidden={!(orderType === "dropdata")}
          name="submoduledel"
          label={language("project.cfgmngt.ctrlcmd.submodulename")}
          options={submoduleall}
          width={280}
          rules={[
            {
              required: orderType === "dropdata",
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />
        <ProFormText
          label={language("project.cfgmngt.ctrlcmd.ruleid")}
          hidden={!(orderType === "dropdata")}
          className={styles.offset}
          name="rule"
          rules={[
            {
              required: orderType === "dropdata",
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        >
          <Row gutter={10}>
            <Col>
              <ProFormSelect
                name="ruleId"
                options={ruleIds}
                width={100}
                fieldProps={{
                  onChange: (value) => {
                    setRuleType(value);
                  },
                }}
                rules={[
                  {
                    required: orderType === "dropdata",
                    message: language("project.cfgmngt.ctrlcmd.required"),
                  },
                ]}
              />
            </Col>
            {ruleType === 2 && (
              <Col>
                <ProFormText
                  name="id"
                  width={170}
                  rules={[
                    {
                      required: ruleType === 2,
                      message: language("project.cfgmngt.ctrlcmd.required"),
                    },
                  ]}
                />
              </Col>
            )}
          </Row>
        </ProFormText>
        <ProFormDateTimePicker
          hidden={!(orderType === "dropdata")}
          label={language("project.cfgmngt.ctrlcmd.overtime")}
          name="overtime"
          width={280}
          rules={[
            {
              required: orderType === "dropdata",
              message: language("project.cfgmngt.ctrlcmd.required"),
            },
          ]}
        />

        {orderType === "warning_dispose" && (
          <div>
            <NameText
              name="warn_id"
              label="预警编号"
              width="280px"
              placeholder="请输入"
              required={true}
            />
            <NameText
              name="warn_title"
              label="预警标题"
              width="280px"
              placeholder="请输入"
            />
            <NameText
              name="warn_desc"
              label="处置事件内容"
              width="280px"
              placeholder="请输入"
            />
            <ProFormDigit
              name="warn_level"
              label="预警级别"
              width="280px"
              placeholder="请输入"
              min={0}
              max={5}
            />
            <ProFormDatePicker
              label="处置时限"
              name="expire_date"
              width={280}
              className={styles.systime}
            />
            <ProFormItem
              label="关联告警信息"
              width={500}
              wrapperCol={{ span: 17 }}
            >
              <EditTable
                setIsSave={setIsSave}
                columns={fromcolumns}
                maxLength={5}
                dataSource={eventsData}
                setDataSource={setEventsData}
                deleteButShow={false}
                tableHeight={110}
                tableWidth={500}
              />
            </ProFormItem>
          </div>
        )}
        <ProFormText
          name="desc"
          label={language("project.cfgmngt.ctrlcmd.desc")}
          width={280}
        />

        <Divider orientation="left" style={{ marginBottom: 0 }}>
          {language("project.cfgmngt.ctrlcmd.dev")}
        </Divider>
        <div>
          <Row gutter={24} style={{ marginBottom: 12, marginTop: 6 }}>
            <Col>
              <Search
                placeholder="请输入设备ID"
                onSearch={(value) => {
                  setDevqueryVal(value);
                  setCurrPage(1);
                  if(value){
                    setModalValue("4");
                  } else{
                    setModalValue("1");
                  }
                }}
                allowClear
              />
            </Col>
            <Col>
              <span>所属机构：</span>
              <TreeSelect
                style={{
                  width: "200px",
                }}
                value={zoneId}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: "auto",
                }}
                treeData={zoneData}
                placeholder="请选择所属机构"
                onSelect={onChangeZone}
                fieldNames={{
                  label: "name",
                  value: "number",
                }}
              />
            </Col>
            <Col>
              <span>生效设备：</span>
              <Select
                defaultValue="1"
                style={{
                  width: 150,
                }}
                value={modalValue}
                options={typeOptions}
                onChange={onChangeType}
              />
            </Col>
          </Row>
          <div>
            <Table
              loading={loading}
              size="small"
              rowSelection={
                Number(modalValue) > 3 && {
                  selectedRowKeys,
                  onChange: onSelectChange,
                }
              }
              className={styles.devTable}
              width={768}
              columns={cmdColoumn}
              dataSource={devList}
              key="devTable"
              rowKey={"devid"}
              pagination={{
                hideOnSinglePage: true,
                showSizeChanger: true,
                pageSize: limitVal,
                current: currPage,
                total: totEntry,
                showTotal: (total) =>
                  language("project.page", { total: total }),
              }}
              onChange={(paging, filters, sorter) => {
                setLoading(true);
                setCurrPage(paging.current);
                setLimitVal(paging.pageSize);
              }}
              scroll={{ y: 250 }}
              locale={{ emptyText: <Empty /> }}
            />
          </div>
        </div>
      </DrawerForm>
      {drawerVisible && (
        <DrawerPolicy
          visible={drawerVisible}
          setVisible={setDrawerVisible}
          operate={operate}
          rowInfo={rowRecord}
          module="command"
          type="policy"
          assocurl='/cfg.php?controller=confRemoteCmd&action=getCmdStatus'
        />
      )}
    </div>
  );
}
