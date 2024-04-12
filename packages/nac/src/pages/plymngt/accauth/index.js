import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Input,
  message,
  Tabs,
  Switch,
  Tooltip,
  Col,
  TreeSelect,
  Space,
  Popconfirm,
} from "antd";
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormRadio,
  ProFormSwitch,
  ProFormCheckbox,
  ProFormGroup,
  DrawerForm,
  ProFormTreeSelect
} from "@ant-design/pro-form";
import {
  EditFilled,
  ExclamationCircleOutlined,
  MessageFilled,
} from "@ant-design/icons";
import { post } from "@/services/https";
import { drawFromLayout } from "@/utils/helper";
import { NameText, ContentText } from "@/utils/fromTypeLabel";
import { regList } from "@/utils/regExp";
import { language } from "@/utils/language";
import SaveSvg from "@/assets/nac/save.svg";
import LoginshownSet from "@/assets/nac/plymngt/loginshownset.svg";
import LoginshowSet from "@/assets/nac/plymngt/loginshowset.svg";
import RecertifiCationnSet from "@/assets/nac/plymngt/recertificationnset.svg";
import RecertifiCationSet from "@/assets/nac/plymngt/recertificationset.svg";
import TraymenunSet from "@/assets/nac/plymngt/traymenunset.svg";
import TraymenuSet from "@/assets/nac/plymngt/traymenuset.svg";
import UnifiedAuthenticationnSet from "@/assets/nac/plymngt/unifiedauthenticationnset.svg";
import UnifiedAuthenticationSet from "@/assets/nac/plymngt/unifiedauthenticationset.svg";
import EnvironmentalDetectionnSet from "@/assets/nac/plymngt/environmentaldetectionnset.svg";
import EnvironmentalDetectionSet from "@/assets/nac/plymngt/environmentaldetectionset.svg";
import AccessModenSet from "@/assets/nac/plymngt/accessmodenset.svg";
import AccessModeSet from "@/assets/nac/plymngt/accessmodeset.svg";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import { TableLayout, AmTag, PolicyTable, CircleIcon } from "@/components";

const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
const { TabPane } = Tabs;
let H = document.body.clientHeight - 336;
var clientHeight = H;
export default (props) => {
  const columns = [
    {
      title: language("plymngt.accauth.id"),
      dataIndex: "id",
      align: "center",
      ellipsis: true,
    },
    {
      title: language("plymngt.accauth.status"),
      dataIndex: "status",
      align: "center",
      fixed: "left",
      ellipsis: true,
      width: 80,
      filters: true,
      filterMultiple: false,
      valueEnum: {
        Y: { text: language("project.open") },
        N: { text: language("project.close") },
      },
      render: (text, record, index) => {
        let disabled = false;
        let checked = true;
        if (record.status == "N") {
          checked = false;
        }
        return (
          <Switch
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
            disabled={disabled}
            checked={checked}
            onChange={(checked) => {
              statusSave(record, checked);
            }}
          />
        );
      },
    },
    {
      title: language("plymngt.accauth.policyname"),
      dataIndex: "name",
      align: "left",
      fixed: "left",
      ellipsis: true,
      width: 130,
    },
    {
      title: language("plymngt.accauth.targetofexecution"),
      dataIndex: "devgrpName",
      align: "left",
      width: 90,
      ellipsis: true,
    },
    {
      title: language("plymngt.accauth.typecertification"),
      dataIndex: "kind",
      align: "center",
      ellipsis: true,
      width: 110,
      filters: true,
      filterMultiple: false,
      valueEnum: {
        portal: { text: language("plymngt.accauth.portalauthentication") },
        dot1x: { text: language("plymngt.accauth.xauthentication") },
      },
      render: (text, record, index) => {
        if (record.kind == "portal") {
          return (
            <AmTag
              color="cyan"
              style={{ minWidth: "75px" }}
              name={language("plymngt.accauth.portalauthentication")}
            />
          );
        } else {
          return (
            <AmTag
              color="red"
              style={{ minWidth: "75px" }}
              name={language("plymngt.accauth.xauthentication")}
            />
          );
        }
      },
    },
    {
      title: language("plymngt.accauth.basicconfig"),
      dataIndex: "",
      align: "center",
      ellipsis: true,
      width: 170,
      render: (text, record, index) => {
        let colorMessageOutlined = false;
        if (
          record.loginBoxUser == "Y" ||
          record.loginBoxRemember == "Y" ||
          record.loginBoxAutologin == "Y" ||
          record.loginBoxForget == "Y" ||
          record.loginBoxInput == "Y"
        ) {
          colorMessageOutlined = true;
        }
        let colorMe = false;
        if (
          record.showTrayLogin == "Y" ||
          record.showTrayLogout == "Y" ||
          record.showTrayAuthRes == "Y" ||
          record.showTrayModify == "Y"
        ) {
          colorMe = true;
        }
        let colorReplayMusic = false;
        if (record.rebootAuth == "Y" || record.netMReAuth == "Y") {
          colorReplayMusic = true;
        }
        let colorEqualRatio = false;
        if (record.unifyAuthen == "Y") {
          colorEqualRatio = true;
        }
        return (
          <div>
            <div>
              <Tooltip title={language("plymngt.accauth.traymenu")}>
                <img src={colorMe ? TraymenuSet : TraymenunSet} />
              </Tooltip>
              <Tooltip title={language("plymngt.accauth.logindisplay")}>
                <img
                  src={colorMessageOutlined ? LoginshowSet : LoginshownSet}
                  style={{ marginLeft: "10px" }}
                />
              </Tooltip>
              <Tooltip title={language("plymngt.accauth.recertification")}>
                <img
                  src={
                    colorReplayMusic ? RecertifiCationSet : RecertifiCationnSet
                  }
                  style={{ marginLeft: "10px" }}
                />
              </Tooltip>
              <Tooltip
                title={language("plymngt.accauth.unifiedauthentication")}
              >
                <img
                  src={
                    colorEqualRatio
                      ? UnifiedAuthenticationSet
                      : UnifiedAuthenticationnSet
                  }
                  style={{ marginLeft: "10px" }}
                />
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      title: language("plymngt.accauth.xconfig"),
      dataIndex: "",
      align: "center",
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        let authName = "";
        let authTitle = "";
        authTypeOptions.map((item) => {
          if (item.value == record.authType) {
            authName = item.title;
            authTitle = item.label;
          }
        });
        let authProtocolName = "";
        let authProtocolTitle = "";
        authProtocolOptions.map((item) => {
          if (item.value == record.authProtocol) {
            authProtocolName = item.title;
            authProtocolTitle = item.label;
          }
        });
        let colorWifi = false;
        if (record.wireless == "Y") {
          colorWifi = true;
        }
        let colorRotateOne = false;
        if (record.checkInnerDot1x == "Y") {
          colorRotateOne = true;
        }
        if (record.kind == "dot1x") {
          return (
            <div style={{ userSelect: "none" }}>
              <div style={{ position: "relative" }}>
                <Tooltip title={authTitle}>
                  <CircleIcon
                    name={authName}
                    style={{
                      width: "18px",
                      height: "18px",
                      lineHeight: "16px",
                    }}
                  />
                </Tooltip>
                <Tooltip title={authProtocolTitle}>
                  <CircleIcon
                    name={authProtocolName}
                    style={{
                      width: "18px",
                      height: "18px",
                      lineHeight: "16px",
                      marginLeft: "8px",
                    }}
                  />
                </Tooltip>
                <span style={{ position: "relative", top: "-1px" }}>
                  <Tooltip title={language("plymngt.accauth.accessmode")}>
                    <img
                      src={colorWifi ? AccessModeSet : AccessModenSet}
                      style={{ marginLeft: "8px" }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={language("plymngt.accauth.environmentaldetection")}
                  >
                    <img
                      src={
                        colorRotateOne
                          ? EnvironmentalDetectionSet
                          : EnvironmentalDetectionnSet
                      }
                      style={{ marginLeft: "8px" }}
                    />
                  </Tooltip>
                </span>
              </div>
            </div>
          );
        }
      },
    },
    {
      // title: '备注',
      title: language("project.remark"),
      dataIndex: "notes",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.createTime"),
      dataIndex: "createTime",
      align: "left",
      width: 130,
      ellipsis: true,
    },
    {
      title: language("project.updateTime"),
      dataIndex: "updateTime",
      align: "left",
      width: 130,
      ellipsis: true,
    },
    {
      disable: true,
      title: language("project.operate"),
      align: "center",
      valueType: "option",
      fixed: "right",
      width: 80,
      ellipsis: true,
      render: (text, record, _, action) => [
        <>
          <a
            key="editable"
            onClick={() => {
              mod(record, "mod");
            }}
          >
            <Tooltip title={language("project.deit")}>
              <img src={SaveSvg} />
            </Tooltip>
          </a>
        </>,
      ],
    },
  ];

  //认证方式
  const authTypeOptions = [
    {
      label: language("plymngt.accauth.terminalidentificationcertification"),
      value: "sid",
      title: language("plymngt.accauth.mark"),
    },
    {
      label: language("plymngt.accauth.domainloginauthentication"),
      value: "domain",
      title: language("plymngt.accauth.account"),
    },
    {
      label: language("plymngt.accauth.systemaccountauthentication"),
      value: "sysuser",
      title: language("plymngt.accauth.field"),
    },
    {
      label: language("plymngt.accauth.accountpasswordauthentication"),
      value: "userpass",
      title: language("plymngt.accauth.system"),
    },
    {
      label: language("plymngt.accauth.certificateauthentication"),
      value: "cert",
      title: language("plymngt.accauth.card"),
    },
  ];

  //认证协议
  const authProtocolOptions = [
    { label: "PEAP", value: "PEAP", title: "P" },
    { label: "TTLS", value: "TTLS", title: "T" },
  ];

  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [op, setop] = useState("add"); //操作
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowRecord, setRowRecord] = useState([]); //记录当前信息
  const [certificateShow, setCertificateShow] = useState(false);
  const [dot1xShow, setDot1xShow] = useState(true);
  const [innerAddrRule, setInnerAddrRule] = useState(false);
  const [wlanssidShow, setWlanssidShow] = useState(false);
  const [activeKey, setActiveKey] = useState("aauth1");
  const [checkInnerStatus, setCheckInnerStatus] = useState(false);

  useEffect(() => {
    getTree();
    setIncID(incID + 1);
  }, [props.incTID]);

  //区域数据
  const zoneType = "all";
  const [treeValue, setTreeValue] = useState();
  const [treeData, setTreeData] = useState([]);
  const [zoneVal, setZoneVal] = useState(); //添加区域id

  //区域管理start
  //区域管理 获取默认列表
  const getTree = (id = 1) => {
    // let page = pagestart != ''?pagestart:startVal;
    let data = {};
    data.id = id;
    data.type = zoneType;
    post("/cfg.php?controller=devGroupControl&action=showDevGrpComboTree", data)
      .then((res) => {
        setTreeData(res ? res : []);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //区域管理end

  /**分发  撤销功能 start  */
  const sRef = useRef(null);
  //调用子组件接口判断弹框状态
  const disModal = (op = "", record = {}) => {
    setRowRecord(record);
    modMethod(op);
    if (sRef.current) {
      sRef.current.openEdModal("Y");
    }
  };
  const [modalVal, setModalVal] = useState(); //当前点击弹框类型 distrbute | revoke | assocTable
  const recordFind = rowRecord; //当前行id
  const isDefaultCheck = true;
  const syncundoshowurl = "/cfg.php?controller=device&action=showCfgLinkDev"; //同步撤销回显接口
  const syncundosaveurl =
    "/cfg.php?controller=confDot1xPolicy&action=syncDot1xPolicy"; //同步撤销接口
  const assocshowurl = "/cfg.php?controller=device&action=showCfgLinkDev"; //设备列表接口路径
  const cfg_type_type = "cfgDot1x"; //设备列表类型
  const tableKeyVal = "mcauthentication"; //列表唯一key
  const isOptionHide = true;
  const assocType = 1;

  const modMethod = (type) => {
    setModalVal(type);
  };

  /**分发  撤销功能 end  */

  /** table组件 start */
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight; //列表高度
  const tableKey = "aauthenticationdev"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "aauthenticationcolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl =
    "/cfg.php?controller=dot1xPolicy&action=showDot1xPolicy"; //接口路径
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: "fuzzy" }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    valid_type: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language("plymngt.accauth.search")}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };

  //删除弹框
  const delClick = (selectedRowKeys, dataList) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: "delclickbox",
      icon: <ExclamationCircleOutlined />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      onOk() {
        delList(selectedRowKeys, dataList);
      },
    });
  };

  //添加按钮点击触发
  const addClick = () => {
    setActiveKey("portal");
    let showTray = ["showTrayLogin", "showTrayLogout", "showTrayAuthRes"];
    let initialValue = { showTray: showTray };
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValue);
    }, 100);
    getModal(1, "add");
  };

  /** table组件 end */

  //分发注销气泡框
  const operation = (text, record, op, languagetext) => (
    <Popconfirm
      onConfirm={() => {
        disModal(op, record);
      }}
      title={languagetext}
      okButtonProps={{
        loading: confirmLoading,
      }}
      okText={language("project.yes")}
      cancelText={language("project.no")}
    >
      <a>{text}</a>
    </Popconfirm>
  );

  //判断是否弹出添加model
  const getModal = (status, op) => {
    if (status == 1) {
      setop(op);
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  };

  //关闭弹框
  const closeModal = () => {
    setTreeValue("");
    setDot1xShow(true);
    setCertificateShow(false);
    setInnerAddrRule(false);
    getModal(2);
  };

  //全部启用禁用
  const statusSaveAll = (status) => {
    post("/cfg.php?controller=confDot1xPolicy&action=enableDot1xPolicyList", {
      status: status,
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //启用禁用
  const statusSave = (record, checked) => {
    let status = "N";
    if (checked) {
      status = "Y";
    }
    let id = record.id;
    post("/cfg.php?controller=confDot1xPolicy&action=enableDot1xPolicy", {
      id: id,
      status: status,
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        setIncID(incID + 1);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //添加修改接口
  const save = (info) => {
    let values = formRef.current.getFieldsValue(true);
    let data = {};
    data.op = op;
    data.id = values.id;
    data.status = values.status == "Y" || values.status ? "Y" : "N";
    data.name = values.name;
    data.devgrpID = values.devgrpID;
    data.kind = values.kind;
    data.notes = values.notes;
    let baseCFG = {}; //基本配置JSON
    baseCFG.loginBoxUser =
      values.loginArr?.indexOf("loginBoxUser") >= 0 ? "Y" : "N";
    baseCFG.loginBoxRemember =
      values.loginArr?.indexOf("loginBoxRemember") >= 0 ? "Y" : "N";
    baseCFG.loginBoxAutologin =
      values.loginArr?.indexOf("loginBoxAutologin") >= 0 ? "Y" : "N";
    baseCFG.loginBoxForget =
      values.loginBoxForget == "Y" || values.loginBoxForget ? "Y" : "N";
    baseCFG.forgetURL = values.forgetURL ? values.forgetURL : "";
    baseCFG.loginBoxInput =
      values.loginBoxInput == "Y" || values.loginBoxInput ? "Y" : "N";
    baseCFG.loginBoxTitle = values.loginBoxTitle ? values.loginBoxTitle : "";
    baseCFG.showTrayLogin =
      values.showTray?.indexOf("showTrayLogin") >= 0 ? "Y" : "N";
    baseCFG.showTrayLogout =
      values.showTray?.indexOf("showTrayLogout") >= 0 ? "Y" : "N";
    baseCFG.showTrayAuthRes =
      values.showTray?.indexOf("showTrayAuthRes") >= 0 ? "Y" : "N";
    baseCFG.showTrayModify =
      values.showTrayModify == "Y" || values.showTrayModify ? "Y" : "N";
    baseCFG.showTrayModifyUrl = values.showTrayModifyUrl
      ? values.showTrayModifyUrl
      : "";
    baseCFG.showTrayDesktop =
      values.showTrayDesktop == "Y" || values.showTrayDesktop ? "Y" : "N";
    baseCFG.showTrayDesktName = values.showTrayDesktName
      ? values.showTrayDesktName
      : "";
    baseCFG.rebootAuth = values.newauth?.indexOf("rebootAuth") >= 0 ? "Y" : "N";
    baseCFG.netMReAuth = values.newauth?.indexOf("netMReAuth") >= 0 ? "Y" : "N";
    baseCFG.idle = values.idle == "Y" || values.idle ? "Y" : "N";
    baseCFG.idleTime = values.idleTime ? values.idleTime : "";
    baseCFG.accExpire = values.accExpire == "Y" || values.accExpire ? "Y" : "N";
    baseCFG.expireTime = values.expireTime ? values.expireTime : "";
    baseCFG.expireClose =
      values.expireClose == "Y" || values.expireClose ? "Y" : "N";
    baseCFG.tipExpire = values.tipExpire ? values.tipExpire : "";
    baseCFG.unifyAuthen =
      values.unifyAuthen == "Y" || values.unifyAuthen ? "Y" : "N";
    data.baseCFG = JSON.stringify(baseCFG);
    let dot1xCFG = {};
    dot1xCFG.wireless = values.wireless == "Y" || values.wireless ? "Y" : "N";
    dot1xCFG.wlanssid = values.wlanssid ? values.wlanssid : "";
    dot1xCFG.authType = values.authType ? values.authType : "";
    dot1xCFG.authProtocol = values.authProtocol ? values.authProtocol : "";
    dot1xCFG.prevAuth = values.prevAuth ? values.prevAuth : "";
    dot1xCFG.userencry = values.userencry ? values.userencry : "";
    dot1xCFG.checkInnerDot1x =
      values.checkInnerDot1x == "Y" || values.checkInnerDot1x ? "Y" : "N";
    dot1xCFG.dot1xCheckMode = values.dot1xCheckMode
      ? values.dot1xCheckMode
      : "";
    dot1xCFG.innerAddr = values.innerAddr ? values.innerAddr : "";
    dot1xCFG.prevAuth =
      values.otherConfig?.indexOf("prevAuth") >= 0 ? "Y" : "N";
    dot1xCFG.userencry =
      values.otherConfig?.indexOf("userencry") >= 0 ? "Y" : "N";
    data.dot1xCFG = JSON.stringify(dot1xCFG);
    if (values.authType == "cert") {
      let setCertCFG = {}; //证书配置JSON
      setCertCFG.keyCert = values.keyCert ? values.keyCert : "";
      setCertCFG.secrtKeyType = values.secrtKeyType ? values.secrtKeyType : "";
      setCertCFG.certName = values.certName ? values.certName : "";
      setCertCFG.bothWayCert =
        values.bothWayCert == "Y" || values.bothWayCert ? "Y" : "N";
      data.setCertCFG = JSON.stringify(setCertCFG);
    }
    post("/cfg.php?controller=confDot1xPolicy&action=setDot1xPolicy", data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        closeModal();
        setIncID(incID + 1);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //删除数据
  const delList = (selectedRowKeys) => {
    let ids = selectedRowKeys.join(",");
    post("/cfg.php?controller=confDot1xPolicy&action=delDot1xPolicy", {
      ids: ids,
    })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setTimeout(() => {
          setIncID(incID + 1);
        }, 2000);
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  //编辑
  const mod = (values, op) => {
    let data = {};
    data.id = values.id;
    data.status = values.status == "Y" || values.status == true ? true : false;
    data.name = values.name;
    setTreeValue(values.fullDevgrpName);
    setZoneVal(values.devgrpID);

    data.devgrpID = values.devgrpID;
    data.kind = values.kind;
    setActiveKey(values.kind);
    if (values.kind == "dot1x") {
      setDot1xShow(false);
    } else {
      setDot1xShow(true);
    }
    data.notes = values.notes;
    let loginArr = [];
    if (values.loginBoxUser == "Y") {
      loginArr.push("loginBoxUser");
    }
    if (values.loginBoxRemember == "Y") {
      loginArr.push("loginBoxRemember");
    }
    if (values.loginBoxAutologin == "Y") {
      loginArr.push("loginBoxAutologin");
    }
    data.loginArr = loginArr;
    data.loginBoxForget =
      values.loginBoxForget == "Y" || values.loginBoxForget == true
        ? true
        : false;
    data.forgetURL = values.forgetURL;
    data.loginBoxInput =
      values.loginBoxInput == "Y" || values.loginBoxInput == true
        ? true
        : false;
    data.loginBoxTitle = values.loginBoxTitle;
    let showTray = [];
    if (values.showTrayLogin == "Y") {
      showTray.push("showTrayLogin");
    }
    if (values.showTrayLogout == "Y") {
      showTray.push("showTrayLogout");
    }
    if (values.showTrayAuthRes == "Y") {
      showTray.push("showTrayAuthRes");
    }
    data.showTray = showTray;
    data.showTrayModify =
      values.showTrayModify == "Y" || values.showTrayModify == true
        ? true
        : false;
    data.showTrayModifyUrl = values.showTrayModifyUrl;
    data.showTrayDesktop =
      values.showTrayDesktop == "Y" || values.showTrayDesktop == true
        ? true
        : false;
    data.showTrayDesktName = values.showTrayDesktName;
    let newauth = [];
    if (values.rebootAuth == "Y") {
      newauth.push("rebootAuth");
    }
    if (values.netMReAuth == "Y") {
      newauth.push("netMReAuth");
    }
    data.newauth = newauth;
    data.idle = values.idle == "Y" || values.idle == true ? true : false;
    data.idleTime = values.idleTime;
    data.accExpire =
      values.accExpire == "Y" || values.accExpire == true ? true : false;
    data.expireTime = values.expireTime;
    data.expireClose =
      values.expireClose == "Y" || values.expireClose == true ? true : false;
    data.tipExpire = values.tipExpire;
    data.unifyAuthen =
      values.unifyAuthen == "Y" || values.unifyAuthen == true ? true : false;
    data.wireless =
      values.wireless == "Y" || values.wireless == true ? true : false;
    data.wlanssid = values.wlanssid;
    if (values.wireless == "Y" || values.wireless == true) {
      setWlanssidShow(true);
    } else {
      setWlanssidShow(false);
    }
    data.authType = values.authType;
    if (values.authType == "cert") {
      setCertificateShow(true);
    } else {
      setCertificateShow(false);
    }
    data.authProtocol = values.authProtocol;
    data.prevAuth = values.prevAuth;
    data.userencry = values.userencry;
    data.checkInnerDot1x =
      values.checkInnerDot1x == "Y" || values.checkInnerDot1x == true
        ? true
        : false;
    data.dot1xCheckMode = values.dot1xCheckMode;
    if (values.dot1xCheckMode == "ipaddr") {
      setInnerAddrRule(true);
    } else {
      setInnerAddrRule(false);
    }
    data.innerAddr = values.innerAddr;
    let otherConfig = [];
    if (values.prevAuth == "Y") {
      otherConfig.push("prevAuth");
    }
    if (values.userencry == "Y") {
      otherConfig.push("userencry");
    }
    data.otherConfig = otherConfig;
    data.keyCert = values.keyCert;
    data.secrtKeyType = values.secrtKeyType;
    data.certName = values.certName;
    data.bothWayCert =
      values.bothWayCert == "Y" || values.bothWayCert == true ? true : false;
    setCheckInnerStatus(data.checkInnerDot1x);
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(data);
    }, 100);
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
        concealColumns={concealColumns}
        columns={columns}
        apishowurl={apishowurl}
        incID={incID}
        clientHeight={tableHeight}
        columnvalue={columnvalue}
        tableKey={tableKey}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        rowkey={rowKey}
        delButton={delButton}
        delClick={delClick}
        addButton={addButton}
        addClick={addClick}
        rowSelection={rowSelection}
      />
      <DrawerForm
        {...drawFromLayout}
        width="530px"
        key="aesauthmodal"
        onFinish={async (values) => {
          save(values);
        }}
        formRef={formRef}
        title={op == "add" ? language("project.add") : language("project.save")}
        visible={modalStatus}
        autoFocusFirstInput
        drawerProps={{
          className: "accauthfrombox",
          destroyOnClose: true,
          maskClosable: false,
          placement: "right",
          getContainer: false,
          style: {
            position: "absolute",
          },
          onClose: () => {
            closeModal();
          },
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}
      >
        <ProFormText name="id" hidden />
        <ProFormSwitch
          checkedChildren={language("project.enable")}
          unCheckedChildren={language("project.disable")}
          name="status"
          label={language("plymngt.accauth.policystatus")}
        />
        <NameText
          label={language("plymngt.accauth.policyname")}
          name="name"
          required={true}
        />
        <ProFormTreeSelect
            name="devgrpID"
            label={language("plymngt.accauth.targetofexecution")}
            fieldProps={{
              showArrow: false,
              filterTreeNode: true,
              dropdownMatchSelectWidth: false,
              labelInValue: false,
              autoClearSearchValue: true,
              treeData: treeData,
              treeNodeFilterProp: "text",
              fieldNames: {
                label: "text",
                value: "id",
              },
              allowClear: true,
              placeholder: language("project.select"),
            }}
            rules={[{ required: true, message: language("project.fillin") }]}
          />
        <ProFormSelect
          onChange={(key) => {
            setActiveKey(key);
            let state = true;
            if (key == "dot1x") {
              state = false;
            }
            setDot1xShow(state);
          }}
          rules={[{ required: true, message: language("project.fillin") }]}
          options={[
            {
              label: language("plymngt.accauth.portalauthentication"),
              value: "portal",
            },
            {
              label: language("plymngt.accauth.xauthentication"),
              value: "dot1x",
            },
          ]}
          name="kind"
          label={language("plymngt.accauth.accessauthentication")}
        />
        <div className="usersynctabs">
          <Tabs
            type="card"
            activeKey={activeKey}
            destroyInactiveTabPane={true}
            onChange={(key) => {
              setActiveKey(key);
            }}
          >
            <TabPane
              tab={language("plymngt.accauth.basicconfiguration")}
              key="portal"
              style={{ border: "1px solid #f4f4f4", borderTop: "0px solid" }}
            >
              <div className="accauthfromtab itemlinheightbox accauthtabbox">
                <div className="itembuttombox">
                  <ProFormCheckbox.Group
                    name="loginArr"
                    label={language("plymngt.accauth.logindisplay")}
                    options={[
                      {
                        label: language(
                          "plymngt.accauth.rememberaccountnumber"
                        ),
                        value: "loginBoxUser",
                      },
                      {
                        label: language("plymngt.accauth.rememberpassword"),
                        value: "loginBoxRemember",
                      },
                      {
                        label: language("plymngt.accauth.automaticlogon"),
                        value: "loginBoxAutologin",
                      },
                    ]}
                  />
                  <ProFormCheckbox.Group
                    name="loginBoxForget"
                    label={" "}
                    options={[
                      {
                        label: language("plymngt.accauth.forgotpassword"),
                        value: "loginBoxUser",
                      },
                    ]}
                    addonAfter={
                      <div className="itembuttombox itempositionbox itembuttomheightbox">
                        <ProFormText
                          placeholder={language(
                            "plymngt.accauth.defaultgatewayurladdress"
                          )}
                          width="195px"
                          name="forgetURL"
                          rules={[
                            {
                              pattern: regList.url.regex,
                              message: regList.url.alertText,
                            },
                          ]}
                        />
                      </div>
                    }
                  />
                </div>

                <ProFormCheckbox.Group
                  name="loginBoxInput"
                  label={" "}
                  options={[
                    {
                      label: language(
                        "plymngt.accauth.logintitlecustomization"
                      ),
                      value: "loginBoxUser",
                    },
                  ]}
                  addonAfter={
                    <div className="itembuttombox itempositionbox itembuttomheightbox">
                      <ProFormText
                        placeholder={language(
                          "plymngt.accauth.defaultgatewayurladdress"
                        )}
                        width="153px"
                        name="loginBoxTitle"
                        rules={[
                          {
                            pattern: regList.url.regex,
                            message: regList.url.alertText,
                          },
                        ]}
                      />
                    </div>
                  }
                />
                <div className="itembuttombox">
                  <ProFormCheckbox.Group
                    name="showTray"
                    label={language("plymngt.accauth.traymenu")}
                    options={[
                      {
                        label: language("plymngt.accauth.authenticationlogin"),
                        value: "showTrayLogin",
                      },
                      {
                        label: language(
                          "plymngt.accauth.certificationcancellation"
                        ),
                        value: "showTrayLogout",
                      },
                      {
                        label: language("plymngt.accauth.certificationresults"),
                        value: "showTrayAuthRes",
                      },
                    ]}
                  />
                </div>
                <ProFormCheckbox.Group
                  name="showTrayModify"
                  label={" "}
                  options={[
                    {
                      label: language("plymngt.accauth.changepassword"),
                      value: "loginBoxUser",
                    },
                  ]}
                  addonAfter={
                    <div className="itembuttombox itempositionbox itembuttomheightbox">
                      <ProFormText
                        placeholder={language(
                          "plymngt.accauth.defaultgatewayurladdress"
                        )}
                        width="195px"
                        name="showTrayModifyUrl"
                        rules={[
                          {
                            pattern: regList.url.regex,
                            message: regList.url.alertText,
                          },
                        ]}
                      />
                    </div>
                  }
                />
                <ProFormCheckbox.Group
                  name="showTrayDesktop"
                  label={language("plymngt.accauth.shortcut")}
                  options={[
                    {
                      label: language(
                        "plymngt.accauth.generateauthenticationshortcutdesktop"
                      ),
                      value: "loginBoxUser",
                    },
                  ]}
                  addonAfter={
                    <div className="itembuttombox itempositionbox itembuttomheightbox">
                      <ContentText
                        label={false}
                        placeholder={language(
                          "plymngt.accauth.identityauthentication"
                        )}
                        width="120px"
                        name="showTrayDesktName"
                      />
                    </div>
                  }
                />
                <ProFormCheckbox.Group
                  name="newauth"
                  label={language("plymngt.accauth.recertification")}
                  options={[
                    {
                      label: language(
                        "plymngt.accauth.authenticateafterterminalrestart"
                      ),
                      value: "rebootAuth",
                    },
                    {
                      label: language(
                        "plymngt.accauth.authenticateafternetworkrecovery"
                      ),
                      value: "netMReAuth",
                    },
                  ]}
                />
                <ProFormCheckbox.Group
                  name="idle"
                  label={language("plymngt.accauth.idlelogout")}
                  options={[
                    {
                      label: language("plymngt.accauth.free"),
                      value: "loginBoxUser",
                    },
                  ]}
                  addonAfter={
                    <div
                      className="itembuttombox itembuttomheightbox"
                      style={{ display: "flex", lineHeight: "32px" }}
                    >
                      {" "}
                      <ProFormDigit
                        placeholder={""}
                        width="70px"
                        name="idleTime"
                        min={5}
                      />
                      <div style={{ marginLeft: "8px" }}>
                        {language("plymngt.accauth.autologoutminutes")}
                      </div>
                    </div>
                  }
                />
                <div className="itembuttombox">
                  <ProFormCheckbox.Group
                    name="accExpire"
                    label={language("plymngt.accauth.expirationreminder")}
                    options={[
                      {
                        label: language("plymngt.accauth.expire"),
                        value: "loginBoxUser",
                      },
                    ]}
                    addonAfter={
                      <div
                        className="itembuttombox itembuttomheightbox"
                        style={{ display: "flex", lineHeight: "32px" }}
                      >
                        {" "}
                        <ProFormDigit
                          placeholder={""}
                          width="70px"
                          name="idleTime"
                          min={5}
                        />
                        <div style={{ marginLeft: "8px" }}>
                          {language("plymngt.accauth.reminderstarteddaysago")}
                        </div>
                      </div>
                    }
                  />
                </div>
                <ProFormCheckbox.Group
                  name="expireClose"
                  label={" "}
                  options={[
                    {
                      label: language(
                        "plymngt.accauth.manuallyclosereminderbox"
                      ),
                      value: "loginBoxUser",
                    },
                  ]}
                />
                <NameText
                  name="tipExpire"
                  label={language("plymngt.accauth.remindercontent")}
                />
                <ProFormCheckbox.Group
                  name="unifyAuthen"
                  label={language("plymngt.accauth.unifiedauthentication")}
                  options={[
                    {
                      label: language(
                        "plymngt.accauth.enableterminalunifieduthenticationlogin"
                      ),
                      value: "loginBoxUser",
                    },
                  ]}
                />
              </div>
            </TabPane>
            <TabPane
              disabled={dot1xShow}
              tab={language("plymngt.accauth.xconfiguration")}
              key="dot1x"
              style={{ border: "1px solid #f4f4f4", borderTop: "0px solid" }}
            >
              <div className="accauthfromtab itemlinheightbox accauthtabbox">
                <div>
                  <div className="itembuttombox">
                    <ProFormCheckbox.Group
                      name="loginBoxForget"
                      label={language("plymngt.accauth.accessmode")}
                      options={[
                        {
                          label: language(
                            "plymngt.accauth.enablewirelessaccesspleasefillcertifiablessid"
                          ),
                          value: "loginBoxUser",
                        },
                      ]}
                    />
                  </div>
                  <ProFormText
                    label={" "}
                    placeholder={""}
                    name="wlanssid"
                    rules={
                      wlanssidShow
                        ? [
                            {
                              required: true,
                              pattern: regList.cnEnAndNumEnsomePuncMore.regex,
                              message:
                                regList.cnEnAndNumEnsomePuncMore.alertText,
                            },
                          ]
                        : [
                            {
                              pattern: regList.cnEnAndNumEnsomePuncMore.regex,
                              message:
                                regList.cnEnAndNumEnsomePuncMore.alertText,
                            },
                          ]
                    }
                  />
                  <div className={certificateShow ? "itembuttombox" : ""}>
                    <ProFormSelect
                      onChange={(key) => {
                        if (key == "cert") {
                          setCertificateShow(true);
                        } else {
                          setCertificateShow(false);
                        }
                      }}
                      options={authTypeOptions}
                      initialValue="sid"
                      name="authType"
                      rules={[
                        { required: true, message: language("project.fillin") },
                      ]}
                      label={language("plymngt.accauth.authenticationmode")}
                    />
                  </div>
                  {certificateShow ? (
                    <>
                      <div className="itembuttombox">
                        <Col offset={6}>
                          <div className="certificatetext">
                            <ProFormGroup
                              style={{ width: "320px", height: "65px" }}
                            >
                              <ProFormSelect
                                options={[
                                  {
                                    label: language(
                                      "plymngt.accauth.computerlocalcert"
                                    ),
                                    value: "1",
                                  },
                                  {
                                    label: language(
                                      "plymngt.accauth.clientowncerificate"
                                    ),
                                    value: "2",
                                  },
                                  {
                                    label: language("plymngt.accauth.koal"),
                                    value: "3",
                                  },
                                  {
                                    label: language("plymngt.accauth.bjca"),
                                    value: "4",
                                  },
                                ]}
                                width="153px"
                                name="keyCert"
                                label={language(
                                  "plymngt.accauth.certificatetype"
                                )}
                              />
                              <div style={{ paddingLeft: "10px" }}>
                                <ProFormSelect
                                  options={[
                                    { label: "SM2", value: "2" },
                                    { label: "RSA", value: "1" },
                                  ]}
                                  width="153px"
                                  name="secrtKeyType"
                                  label={language("plymngt.accauth.keytype")}
                                />
                              </div>
                            </ProFormGroup>
                            <ProFormText
                              placeholder={language(
                                "plymngt.accauth.certificateissuer"
                              )}
                              width="320px"
                              name="certName"
                              label={language(
                                "plymngt.accauth.certificateissuer"
                              )}
                            />
                          </div>
                        </Col>
                      </div>
                      <ProFormCheckbox.Group
                        name="bothWayCert"
                        label={" "}
                        options={[
                          {
                            label: language(
                              "plymngt.accauth.enabletwo-wayauthenticationtoverifytheservercertificate"
                            ),
                            value: "loginBoxUser",
                          },
                        ]}
                      />
                    </>
                  ) : (
                    ""
                  )}

                  <ProFormRadio.Group
                    label={language("plymngt.accauth.authenticationprotocol")}
                    name="authProtocol"
                    fieldProps={{
                      buttonStyle: "solid",
                      optionType: "button",
                    }}
                    rules={[{ required: true }]}
                    options={authProtocolOptions}
                  />

                  <ProFormCheckbox.Group
                    name="accExpire"
                    label={language("plymngt.accauth.environmentaldetection")}
                    options={[
                      {
                        label: language(
                          "plymngt.accauth.enableintranetdetection"
                        ),
                        value: "loginBoxUser",
                      },
                    ]}
                    addonAfter={
                      <div className="itembuttombox itempositionbox">
                        {" "}
                        <ProFormSelect
                          style={{ width: "180px" }}
                          onChange={(key) => {
                            if (key == "ipaddr") {
                              setInnerAddrRule(true);
                            } else {
                              setInnerAddrRule(false);
                            }
                          }}
                          name="dot1xCheckMode"
                          rules={
                            checkInnerStatus ? [{ required: true }] : false
                          }
                          options={[
                            {
                              label: language("plymngt.accauth.usedefaultgatw"),
                              value: "default-gw",
                            },
                            {
                              label: language("plymngt.accauth.useipaddr"),
                              value: "ipaddr",
                            },
                          ]}
                        />
                      </div>
                    }
                  />
                  <ProFormText
                    label={language("plymngt.accauth.probeaddress")}
                    name="innerAddr"
                    rules={
                      innerAddrRule
                        ? [
                            {
                              required: true,
                              pattern: regList.url.regex,
                              message: regList.url.alertText,
                            },
                          ]
                        : [
                            {
                              pattern: regList.url.regex,
                              message: regList.url.alertText,
                            },
                          ]
                    }
                  />
                  <ProFormCheckbox.Group
                    name="otherConfig"
                    label={language("plymngt.accauth.otherconfigurations")}
                    options={[
                      {
                        label: language(
                          "plymngt.accauth.allowauthenticationbeforesystemlogin"
                        ),
                        value: "prevAuth",
                      },
                      {
                        label: language("plymngt.accauth.encrypttheusername"),
                        value: "userencry",
                      },
                    ]}
                  />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </DrawerForm>
      <PolicyTable
        ref={sRef}
        tableKeyVal={tableKeyVal}
        modalVal={modalVal}
        recordFind={recordFind}
        assocshowurl={assocshowurl}
        syncundoshowurl={syncundoshowurl}
        cfg_type_type={cfg_type_type}
        setIncID={setIncID}
        incID={incID}
        isOptionHide={isOptionHide}
        assocType={assocType}
        syncundosaveurl={syncundosaveurl}
        isDefaultCheck={isDefaultCheck}
      />
    </div>
  );
};
