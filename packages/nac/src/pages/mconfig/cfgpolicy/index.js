import React, { useRef, useState, useEffect } from "react";
import "@/utils/box.less";
import { ChildDrawer } from './components'
import { ProTabler } from "@/common";
import {
  Input,
  Space,
  Tooltip,
  Modal,
  Button,
  Alert,
  Avatar,
  Divider,
  Popconfirm,
  message,
  Spin,
} from "antd";
import {
  EditFilled,
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileSyncOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  DrawerForm,
  ProFormCheckbox,
  ProFormText,
  ProFormSelect,
  ProCard,
  ProFormRadio,
} from "@ant-design/pro-components";
import "./security.less";
import "@/common/common.less";
import { drawFormLayout } from "@/utils/helper";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import { regList } from "@/utils/regExp";
import { ReactComponent as Guest } from "@/assets/nac/security/guest.svg";
import { ReactComponent as Remote } from "@/assets/nac/security/remote.svg";
import { ReactComponent as Autoplay } from "@/assets/nac/security/autoplay.svg";
import { ReactComponent as Firewall } from "@/assets/nac/security/firewall.svg";
import { ReactComponent as Weakpass } from "@/assets/nac/security/weakpass.svg";
import { ReactComponent as Ipget } from "@/assets/nac/security/ipget.svg";
import { ReactComponent as Share } from "@/assets/nac/security/share.svg";
import { ReactComponent as Runtime } from "@/assets/nac/security/runtime.svg";
import { ReactComponent as Autoupdate } from "@/assets/nac/security/autoupdate.svg";
import { ReactComponent as Sysacc } from "@/assets/nac/security/sysacc.svg";
import { ReactComponent as Computername } from "@/assets/nac/security/computername.svg";
import { ReactComponent as Filescan } from "@/assets/nac/security/filescan.svg";
import { ReactComponent as Sysflaw } from "@/assets/nac/security/sysflaw.svg";
import { ReactComponent as Pwd } from "@/assets/nac/security/pwd.svg";
import { ReactComponent as Check_adlogin } from "@/assets/nac/security/check_adlogin.svg";
import { ReactComponent as Peripheral } from "@/assets/nac/security/peripheral.svg";
import { ReactComponent as Screen } from "@/assets/nac/security/screen.svg";
import { ReactComponent as OS } from "@/assets/nac/security/OS.svg";
import { ReactComponent as Home_page } from "@/assets/nac/security/home_page.svg";
import { ReactComponent as Proxy } from "@/assets/nac/security/proxy.svg";
import { ReactComponent as Edp_version } from "@/assets/nac/security/edp_version.svg";
import { ReactComponent as Check_edppolicy } from "@/assets/nac/security/check_edppolicy.svg";
import { ReactComponent as Antivirus } from "@/assets/nac/security/antivirus.svg";
import { ReactComponent as Registry } from "@/assets/nac/security/registry.svg";
import { ReactComponent as Office } from "@/assets/nac/security/office.svg";
import { ReactComponent as IEBrowser } from "@/assets/nac/security/IEBrowser.svg";
import { ReactComponent as Soft_install } from "@/assets/nac/security/soft_install.svg";
import { ReactComponent as Process } from "@/assets/nac/security/process.svg";
import { ReactComponent as Service } from "@/assets/nac/security/service.svg";
import { ReactComponent as Start_item } from "@/assets/nac/security/start_item.svg";
import { ReactComponent as Netviolation } from "@/assets/nac/security/netviolation.svg";
import { ReactComponent as Port_check } from "@/assets/nac/security/port_check.svg";
import { ReactComponent as Flowlimit } from "@/assets/nac/security/flowlimit.svg";
import { ReactComponent as Hardware } from "@/assets/nac/security/hardware.svg";
import { ReactComponent as WDel } from "@/assets/nac/security/wdel.svg";
import { ReactComponent as WSave } from "@/assets/nac/security/wsave.svg";
import SaveSvg from "@/assets/nac/save.svg";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import { NameText, EditTable } from "@/utils/fromTypeLabel";
const { Search } = Input;
const { confirm } = Modal;
let H = document.body.clientHeight - 443;
var clientHeight = H;

export default () => {
  let systypeMap = {
    chs: "windows",
    win: "Windows",
    linux: "Linux",
    mac: "MacOS",
  };
  const columns = [
    {
      title: "规范名称",
      dataIndex: "rule_name",
      key: "rule_name",
      align: "left",
      width: 160,
      ellipsis: true,
    },
    {
      title: "系统类型",
      dataIndex: "systype",
      key: "systype",
      align: "left",
      width: 160,
      ellipsis: true,
      render: (text, record, _, action) => {
        return systypeMap[record.systype];
      },
    },
    {
      title: "规范内容",
      dataIndex: "content",
      key: "content",
      align: "left",
      width: 260,
      ellipsis: true,
    },
    {
      title: "备注",
      dataIndex: "notes",
      key: "notes",
      align: "left",
      width: 250,
      ellipsis: true,
    },
    {
      title: language("project.operate"),
      align: "center",
      key: "operate",
      valueType: "option",
      width: 120,
      render: (text, record, _, action) => {
        return (
          <Space align="center" className="refcntspace">
            <Tooltip title={language("project.edit")}>
              <Button
                size="small"
                type="text"
                key="editable"
                onClick={() => {
                  showDraw("open", record);
                  setOp("edit");
                }}
              >
                <EditFilled style={{ color: "#0083FF", fontSize: "15px" }} />
              </Button>
            </Tooltip>
            <Popconfirm
              okText={language("project.yes")}
              cancelText={language("project.no")}
              title={language("project.delconfirm")}
              onConfirm={() => {
                delList(record);
              }}
            >
              <Tooltip placement="top" title={language("project.del")}>
                <Button size="small" type="text" key="delect">
                  <DeleteOutlined style={{ color: "red" }} />
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const gridStyle = {
    width: "188px",
    minWidth: "188px",
    marginLeft: 10,
    marginTop: 10,
    textAlign: "center",
  };
  const [isHovering, setIsHovering] = useState("");
  let isHoverstatus = '';
  const tableKey = "security";
  const columnvalue = "securitycolvalue";
  let addButton = true;
  let rowkey = (record) => record.id;
  const apiShowUrl = "/cfg.php?controller=securityRule&action=getList";
  const [queryVal, setQueryVal] = useState(); //首个搜索框的值
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  let searchVal = {
    value: queryVal,
  };
  const drawformRef = useRef();
  const showformRef = useRef();
  const disformRef = useRef();
  const actionRef = useRef();
  const [drawLeftStatus, setDrawLeftStatus] = useState(false);
  const [drawStatus, setDrawStatus] = useState(false);
  const [ruKeyList, setRuKeyList] = useState([]);
  const [ruleList, setRuleList] = useState({});
  const [op, setOp] = useState("");
  const chRef = useRef(null);
  const editRule = (item) => {
    let keyList = drawformRef.current.getFieldsValue();
    console.log(keyList);
    chRef.current &&
      chRef.current.optionMod(ruleList, item, ruKeyList, keyList);
  };
  const [osType, setOsType] = useState("win");
  const [ruleListCopy, setRuleListCopy] = useState({});
  const [drawLoading, setDrawLoading] = useState(false);
  const [delKey, setDelKey] = useState([]);
  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          placeholder=""
          style={{ width: 200 }}
          allowClear
          onSearch={(value) => {
            setQueryVal(value);
            setIncID((incID) => incID + 1);
          }}
        />
      </Space>
    );
  };

  const otherOperate = () => {
    return (
      <Space>
        <div
          onClick={() => {
            optionShowModal(true);
          }}
        >
          显示设置
        </div>
        <div
          onClick={() => {
            optionDisModal(true);
          }}
        >
          字典配置
        </div>
      </Space>
    );
  };

  const addClick = () => {
    showDraw("open");
    setOp("add");
    setRuleListCopy({
      guest: { state: "N", key: "N" }, //访客
      antivirus: { state: "N", key: "N", avrRepairAuto: "Y", list: [] }, //杀毒
      process: { state: "N", key: "N", xor: "N", list: [] }, //进程
      remote: { state: "N", key: "N" }, //远程桌面
      share: { state: "N", key: "N", list: [] }, //共享资源
      service: { state: "N", key: "N", list: [] }, //服务检查
      port_check: { state: "N", key: "N", denyPort: "", confPort: "" }, //端口检查
      sysflaw: { state: "N", key: "N", list: [] }, //系统漏洞
      pwd: {
        state: "N",
        key: "N",
        complexity: "Y",
        legthMin: "",
        saveMax: "",
        saveMin: "",
        historyNum: "",
      }, //密码强度
      weakpass: { state: "N", key: "N", weakFlag: "N" }, //弱口令检查
      check_adlogin: { state: "N", key: "N", check: "add", list: [] }, //AD域
      start_item: { state: "N", key: "N", list: [] }, //启动项检查
      registry: { state: "N", key: "N", list: [] }, //注册表检查
      soft_install: { state: "N", key: "N", xor: "N", list: [] }, //软件安装
      office: { state: "N", key: "N", office_allow: "", office_forbid: "" }, //Office正版检查
      home_page: { state: "N", key: "N", list: [] }, //浏览器主页
      edp_version: {
        state: "N",
        key: "N",
        edpVersion: "",
        edpUrl: "",
        edpDesc: "",
      }, //EDP版本
      check_edppolicy: { state: "N", key: "N", list: [] }, //EDP策略
      netviolation: {
        state: "N",
        key: "N",
        blockNoauth: "N",
        blockDualnet: "N",
        vioChkAddr: "",
        vioChkAddrIPV6: "",
        vioReportmark: "",
        vioConfIp: "",
        tipContent: language("nac.mconfig.cfgpolicy.tipContent"),
        vioRealchk: "N",
        vioMethod: "Y",
      }, //违规外联
      flowlimit: { state: "N", key: "N", flowContrSw: "N", flowUpperLimit: "" }, //流量限制
      firewall: { state: "N", key: "N", firewallStatus: "Y" }, //防火墙检查
      hardware: {
        state: "N",
        key: "N",
        hardwareModem: "0",
        hardwareWifi: "0",
        hardwareNetCard: "0",
        hardwareProtableWifi: "0",
      }, //硬件安装
      cdburn: { state: "N", key: "N" }, //光盘刻录
      autoplay: { state: "N", key: "N" }, //自动播放
      ipget: { state: "N", key: "N", addrMode: "N" }, //地址获取
      // screen: {
      //   state: 'N',
      //   key: 'N',
      //   screenComp: 'Y',
      //   screensaver: 'N',
      //   screenRecTime: '',
      // }, //屏幕保护
      OS: {
        state: "N",
        key: "N",
        multiOS: "N",
        virtualOS: "N",
        OSVersion: "N",
        list: [],
      }, //操作系统
      ieplugin: { state: "N", key: "N", iepluginCheck: "N", iepluginName: "" }, //IE插件
      proxy: {
        state: "N",
        key: "N",
        browserProxyIE: "N",
        browserProxyFirefox: "N",
        browserProxyChrome: "N",
        list: [],
      }, //浏览器代理
      runtime: { state: "N", key: "N", upperTime: "" }, //终端运行时间
      autoupdate: { state: "N", key: "N", autoUpdateMode: "Y" }, //自动更新
      sysacc: {
        state: "N",
        key: "N",
        multiAcc: "N",
        redundancyAcc: "N",
        redundancyTime: "",
      }, //系统账号
      computername: { state: "N", key: "N", matchingRules: "" }, //计算机名称
      IEBrowser: { state: "N", key: "N", ieVersion: "", iePatchNum: "" }, //IE浏览器
      peripheral: {
        state: "N",
        key: "N",
        storageChk: "N",
        inputChk: "N",
        wirelessNetCard: "N",
        mobileDeivce: "N",
      }, //USB外设检查
      filescan: { state: "Y", key: "Y", xor: "Y", list: [] },
    });
  };

  const delList = (record) => {
    let data = {};
    data.id = record.id;
    data.name = record.rule_name;
    post("/cfg.php?controller=securityRule&action=del", data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setIncID(incID + 1);
      message.success(res.msg);
    });
  };

  const showDraw = (state, record) => {
    if (state == "open") {
      setDrawLeftStatus(true);
      if (record) {
        showRules(record);
      } else {
        setOsType("win");
      }
    } else {
      drawformRef.current.resetFields();
      setRuKeyList([]);
      setRuleList({});
      setDelKey([]);
      setTimeout(() => {
        drawformRef.current?.setFieldsValue({});
      }, 500);
      setDrawLeftStatus(false);
    }
  };

  const showRules = (record) => {
    setDrawLoading(true);
    post("/cfg.php?controller=securityRule&action=getRule", {
      id: record.id,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      let copy = JSON.parse(JSON.stringify(res.items));
      setRuleList(res.items);
      setRuleListCopy(copy);
      let keys = [];
      let initialValue = {};
      for (const key in res.items) {
        if (res.items[key].state == "Y") {
          keys.push(key);
        }
        initialValue[key + "key"] = res.items[key].key === "Y";
      }
      setOsType(res.systype);
      initialValue.name = res.name;
      initialValue.systype = res.systype;
      initialValue.notes = res?.notes;
      initialValue.id = res.id;
      setRuKeyList(keys);
      setTimeout(() => {
        drawformRef.current?.setFieldsValue(initialValue);
        setDrawLoading(false);
      }, 500);
    });
  };

  const showChDraw = (status) => {
    if (status == "open") {
      setDrawStatus(true);
    } else {
      setDrawStatus(false);
    }
  };

  let ruleTextMap = (value) => {
    let text;
    if (value == "guest") {
      text = "来宾访客";
    } else if (value == "remote") {
      text = "远程桌面";
    } else if (value == "autoplay") {
      text = "自动播放";
    } else if (value == "firewall") {
      text = "防火墙检查";
    } else if (value == "weakpass") {
      text = "弱口令检查";
    } else if (value == "ipget") {
      text = "地址获取";
    } else if (value == "share") {
      text = "共享资源";
    } else if (value == "runtime") {
      text = "终端运行时间";
    } else if (value == "autoupdate") {
      text = "自动更新";
    } else if (value == "sysacc") {
      text = "系统账号";
    } else if (value == "computername") {
      text = "计算机名称";
    } else if (value == "filescan") {
      text = "文件检查";
    } else if (value == "sysflaw") {
      text = "系统漏洞";
    } else if (value == "pwd") {
      text = "密码策略";
    } else if (value == "check_adlogin") {
      text = "AD域检查";
    } else if (value == "peripheral") {
      text = "USB外设检查";
    } else if (value == "screen") {
      text = "屏幕保护";
    } else if (value == "OS") {
      text = "操作系统";
    } else if (value == "home_page") {
      text = "浏览器主页";
    } else if (value == "proxy") {
      text = "浏览器代理";
    } else if (value == "edp_version") {
      text = "卓管版本";
    } else if (value == "check_edppolicy") {
      text = "卓管策略";
    } else if (value == "antivirus") {
      text = "杀毒软件";
    } else if (value == "registry") {
      text = "注册表检查";
    } else if (value == "office") {
      text = "Office正版";
    } else if (value == "IEBrowser") {
      text = "IE浏览器";
    } else if (value == "soft_install") {
      text = "软件安装";
    } else if (value == "process") {
      text = "进程运行";
    } else if (value == "service") {
      text = "服务运行";
    } else if (value == "start_item") {
      text = "启动项检查";
    } else if (value == "netviolation") {
      text = "违规外联";
    } else if (value == "port_check") {
      text = "端口开放";
    } else if (value == "flowlimit") {
      text = "流量检测";
    } else if (value == "hardware") {
      text = "硬件安装";
    }

    return text;
  };

  const getRuleValues = (values) => {
    let addKeys = [];
    for (const key in values) {
      if (values[key].state == "Y") {
        addKeys.push(key);
      }
    }
    setRuleList(values);
    setRuKeyList(addKeys);
  };

  const delRule = (item) => {
    let delArr = [...ruKeyList];
    delArr.map((each, index) => {
      if (item === each) {
        delKey.push(each);
        delArr.splice(index, 1);
      }
    });
    setRuKeyList(delArr);
    // for (const key in ruleList) {
    //   if (key === item) {
    //     delete ruleList[key]
    //   }
    // }
    // setRuleList(ruleList)
  };

  const setRule = (values, valueList) => {
    delKey.map((item) => {
      valueList[item].key = "N";
      valueList[item].state = "N";
    });
    let data = {};
    data.id = values.id ? values.id : "";
    data.opcode = op === "add" ? "add" : "modify";
    data.name = values.name;
    data.systype = values.systype;
    data.notes = values.notes;
    data.items = {};
    let antivirus = contrast(valueList, "antivirus");
    if (antivirus) {
      data.items.antivirus = antivirus;
    }
    let OS = contrast(valueList, "OS");
    if (OS) {
      data.items.OS = OS;
    }
    let sysflaw = contrast(valueList, "sysflaw");
    if (sysflaw) {
      data.items.sysflaw = sysflaw;
    }
    let pwd = contrast(valueList, "pwd");
    if (pwd) {
      data.items.pwd = pwd;
    }
    // let screen = contrast(valueList, 'screen')
    // if (screen) {
    //   data.items.screen = screen
    // }
    let soft_install = contrast(valueList, "soft_install");
    if (soft_install) {
      data.items.soft_install = soft_install;
    }
    let process = contrast(valueList, "process");
    if (process) {
      data.items.process = process;
    }
    let service = contrast(valueList, "service");
    if (service) {
      data.items.service = service;
    }
    let port_check = contrast(valueList, "port_check");
    if (port_check) {
      data.items.port_check = port_check;
    }
    let hardware = contrast(valueList, "hardware");
    if (hardware) {
      data.items.hardware = hardware;
    }
    data.items = JSON.stringify(data.items);
    post("/cfg.php?controller=securityRule&action=setRule", data).then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        showDraw("close");
        setIncID(incID + 1);
        message.success(res.msg);
      }
    );
  };

  const changeType = (e) => {
    setOsType(e);
  };

  //判断是否是object对象
  function isObj(object) {
    return (
      object &&
      typeof object == "object" &&
      Object.prototype.toString.call(object).toLowerCase() == "[object object]"
    );
  }
  // 判断是否是数组对象
  function isArray(object) {
    return object && typeof object == "object" && object.constructor == Array;
  }
  //获取长度
  function getLength(object) {
    var count = 0;
    for (var i in object) count++;
    return count;
  }

  function compareObj(objA, objB, flag) {
    for (var key in objA) {
      if (!flag)
        //跳出整个循环
        break;
      if (!objB.hasOwnProperty(key)) {
        flag = false;
        break;
      }
      if (!isArray(objA[key])) {
        //子级不是数组时,比较属性值
        if (objB[key] != objA[key]) {
          flag = false;
          break;
        }
      } else {
        if (!isArray(objB[key])) {
          flag = false;
          break;
        }
        var oA = objA[key],
          oB = objB[key];
        if (oA.length != oB.length) {
          flag = false;
          break;
        }
        for (var k in oA) {
          if (!flag)
            //这里跳出循环是为了不让递归继续
            break;
          flag = compareObj(oA[k], oB[k], flag);
        }
      }
    }
    return flag;
  }
  function compareJSON(objA, objB) {
    if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
    if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
    return compareObj(objA, objB, true); //默认为true
  }

  const contrast = (valueList, key) => {
    var items_flag = compareJSON(ruleListCopy[key], valueList[key]);
    if (items_flag == false) {
      return valueList[key];
    } else {
      return false;
    }
  };

  let titleIcon = (value) => {
    let a;
    switch (value) {
      case "guest":
        a = <Guest />;
        break;
      case "remote":
        a = <Remote />;
        break;
      case "autoplay":
        a = <Autoplay />;
        break;
      case "firewall":
        a = <Firewall />;
        break;
      case "weakpass":
        a = <Weakpass />;
        break;
      case "ipget":
        a = <Ipget />;
        break;
      case "share":
        a = <Share />;
        break;
      case "runtime":
        a = <Runtime />;
        break;
      case "autoupdate":
        a = <Autoupdate />;
        break;
      case "sysacc":
        a = <Sysacc />;
        break;
      case "computername":
        a = <Computername />;
        break;
      case "filescan":
        a = <Filescan />;
        break;
      case "sysflaw":
        a = <Sysflaw />;
        break;
      case "pwd":
        a = <Pwd />;
        break;
      case "check_adlogin":
        a = <Check_adlogin />;
        break;
      case "peripheral":
        a = <Peripheral />;
        break;
      case "screen":
        a = <Screen />;
        break;
      case "OS":
        a = <OS />;
        break;
      case "home_page":
        a = <Home_page />;
        break;
      case "proxy":
        a = <Proxy />;
        break;
      case "edp_version":
        a = <Edp_version />;
        break;
      case "check_edppolicy":
        a = <Check_edppolicy />;
        break;
      case "antivirus":
        a = <Antivirus />;
        break;
      case "registry":
        a = <Registry />;
        break;
      case "office":
        a = <Office />;
        break;
      case "IEBrowser":
        a = <IEBrowser />;
        break;
      case "soft_install":
        a = <soft_install />;
        break;
      case "process":
        a = <Process />;
        break;
      case "service":
        a = <Service />;
        break;
      case "start_item":
        a = <Start_item />;
        break;
      case "netviolation":
        a = <Netviolation />;
        break;
      case "port_check":
        a = <port_check />;
        break;
      case "flowlimit":
        a = <Flowlimit />;
        break;
      case "hardware":
        a = <Hardware />;
        break;
      default:
        a = <Hardware />;
        break;
    }
    return a;
  };

  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        const tableDataSource = formRef.current.getFieldsValue([
          "addrlistinfo",
        ]);
        formRef.current.setFieldsValue({
          addrlistinfo: tableDataSource["addrlistinfo"].filter(
            (item) => item.id != record.id
          ),
        });
      }}
      key="popconfirm"
      title={language("project.delconfirm")}
      okText={language("project.yes")}
      cancelText={language("project.no")}
    >
      <a>{text}</a>
    </Popconfirm>
  );

  const [showVisible, setShowVisible] = useState(false);
  const optionShowModal = (status) => {
    if (status) {
      showList();
      setShowVisible(true);
    } else {
      showformRef.current.resetFields();
      setShowVisible(false);
    }
  };

  const showList = () => {
    post("/cfg.php?controller=checkNotes&action=getAll").then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      showformRef.current.setFieldsValue({ addrlistinfo: res.data });
    });
  };

  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const fromcolumns = [
    {
      title: "安检项名称",
      width: 130,
      dataIndex: "text",
      key: "text",
      align: "left",
      ellipsis: true,
      editable:false,
    },
    {
      title: "显示名称",
      dataIndex: "display",
      key: "display",
      align: "left",
    },
    {
      title: "修复提示",
      dataIndex: "repairTip",
      key: "repairTip",
      align: "left",
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "100px",
      align: "center",
      render: (text, record, _, action) => [
        <>
          <Space>
            <Tooltip placement="top" title={language("project.edit")}>
              <a
                onClick={() => {
                  action.startEditable?.(record.id);
                }}
              >
                <img src={EditIcon} alt="" />
              </a>
            </Tooltip>

            {renderRemove(
              <Tooltip placement="top" title={language("project.del")}>
                <a>
                  <img src={DelIcon} alt="" />
                </a>
              </Tooltip>,
              record
            )}
          </Space>
        </>,
      ],
    },
  ];
  const disfromcolumns = [
    {
      title: "弱口令",
      dataIndex: "weakpassword",
      key: "weakpassword",
      align: "left",
      ellipsis: true,
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "100px",
      align: "center",
      render: (text, record, _, action) => [
        <div style={{ width: "100%", height: "100%" }}>
          {isHovering === record.id || isHoverstatus === record.id ?
          <Space>
            <Tooltip placement="top" title={language("project.edit")}>
              <a
                onClick={() => {
                  action.startEditable?.(record.id);
                }}
              >
                <img src={EditIcon} alt="" />
              </a>
            </Tooltip>

            {renderRemove(
              <Tooltip placement="top" title={language("project.del")}>
                <a>
                  <img src={DelIcon} alt="" />
                </a>
              </Tooltip>,
              record
            )}
          </Space>
          : <></>}
        </div>,
      ],
    },
  ];

  //字典配置 start
  const [disVisible, setDisVisible] = useState(false);
  const optionDisModal = (status) => {
    if (status) {
      showDisList();
      setDisVisible(true);
    } else {
      disformRef.current.resetFields();
      setDisVisible(false);
    }
  };

  const showDisList = (record)=>{
    post("/cfg.php?controller=checkPolicy&action=getWeakpwdDic").then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      let arr = [];
      let content = res.data[0].weakpwdDic? res.data[0].weakpwdDic?.split(',') : [];
      console.log(res.data[0].weakpwdDic)
      console.log(content)
      content?.map((item,index)=>{
        console.log(index)
        let obj = {id: index, weakpassword: item};
        arr.push(obj);
      })
      console.log(arr)
      disformRef.current.setFieldsValue({ status: res.data[0].status, showinfolist: arr });
    });
  }


  //行操作
  const onRow = (record, type = '') => {
    console.log(record)
    console.log(type)
    if(type == 1){
      setIsHovering(record.id);
      isHoverstatus = record.id;
    }else {
      setIsHovering("");
      isHoverstatus = '';
    }
  }

    //更新修改功能
    const onShowSave = (record)=>{
      let data = {};
      data.name = record.name;
      data.display = record.display;
      data.repairTip = record.repairTip;
      post('/cfg.php?controller=checkNotes&action=updateField',data).then((res) => {
          if(!res.success){
              message.error(res.msg);
              return false;
          }
          showList()
      }).catch(() => {
          console.log('mistake')
      })
  }

  return (
    <div
      id="drawerContainer"
      style={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <ProTabler
        incID={incID}
        columns={columns}
        tableKey={tableKey}
        rowSelection={true}
        addButton={addButton}
        addClick={addClick}
        searchVal={searchVal}
        apiShowUrl={apiShowUrl}
        columnvalue={columnvalue}
        searchText={tableTopSearch()}
        rowkey={rowkey}
        clientHeight={clientHeight}
        otherOperate={otherOperate}
      />
      <DrawerForm
        layout="horizontal"
        title={"字典配置"}
        width={"510px"}
        formRef={disformRef}
        visible={disVisible}
        onVisibleChange={setDisVisible}
        drawerProps={{
          className: "cfgpolicynshowbox radio-width-mode",
          placement: "right",
          closable: false,
          maskClosable: false,
          destroyOnClose: true,
          getContainer: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                optionDisModal();
              }}
            />
          ),
          style: {
            position: "absolute",
          },
          bodyStyle: {
            paddingLeft: 30,
            paddingRight: 30,
          },
          onClose: () => {
            optionDisModal();
          },
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        onFinish={(values) => {}}
      >
        <>
          <div className="infoFileds">
            <ProFormCheckbox name={"status"}>
              开启弱口令字典同步
            </ProFormCheckbox>
          </div>
          <div style={{ width: "404px", marginLeft: "23px" }}>
            {/* <Space> */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "7px",
              }}
            >
              <Search
                placeholder=""
                style={{ width: 200 }}
                allowClear
                onSearch={(value) => {}}
              />
              <Button
                key="button"
                onClick={() => {
                  actionRef?.current?.addEditRecord?.({
                    id: Date.now(),
                  });
                }}
                type="primary"
              >
                <PlusOutlined />
                添加
              </Button>
            </div>
            {/* </Space> */}
            <EditTable
              name={"showinfolist"}
              fromcolumns={disfromcolumns}
              required={false}
              actionRef={actionRef}
              label={false}
              position={false}
              onRow={onRow}
              editableKeys={editableKeys}
              setEditableRowKeys={setEditableRowKeys}
            />
          </div>
        </>
      </DrawerForm>
      <DrawerForm
        layout="horizontal"
        title={"安检显示设置"}
        width={"887px"}
        formRef={showformRef}
        visible={showVisible}
        onVisibleChange={setShowVisible}
        drawerProps={{
          className: "cfgpolicynshowbox radio-width-mode",
          placement: "right",
          closable: false,
          maskClosable: false,
          destroyOnClose: true,
          getContainer: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                optionShowModal();
              }}
            />
          ),
          style: {
            position: "absolute",
          },
          bodyStyle: {
            paddingLeft: 30,
            paddingRight: 30,
          },
          onClose: () => {
            optionShowModal();
          },
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        onFinish={(values) => {}}
      >
        <>
          <Alert
            message={
              "显示名称最多只能输入12个汉字或者24个字符；修复提示最多只能输入256个字符"
            }
            type="info"
            showIcon
            style={{
              width: 600,
              marginBottom: 12,
              whiteSpace: "pre-wrap",
              alignItems: "baseline",
            }}
          />
          <EditTable
            name={"addrlistinfo"}
            fromcolumns={fromcolumns}
            required={false}
            label={false}
            position={false}
            onShowSave={onShowSave}
            editableKeys={editableKeys}
            setEditableRowKeys={setEditableRowKeys}
          />
        </>
      </DrawerForm>

      <DrawerForm
        {...drawFormLayout}
        layout="horizontal"
        labelCol={{ xs: { span: 6 } }}
        wrapperCol={{ xs: { span: 12 } }}
        title={
          op == "add"
            ? language("nac.mconfig.cfgpolicy.addRuleTitle")
            : language("nac.mconfig.cfgpolicy.editRule")
        }
        width={drawStatus ? "950px" : "620px"}
        formRef={drawformRef}
        visible={drawLeftStatus}
        onVisibleChange={setDrawLeftStatus}
        initialValues={{
          systype: "win",
        }}
        drawerProps={{
          className: "cfgpolicynbox radio-width-mode",
          placement: "right",
          closable: false,
          maskClosable: false,
          destroyOnClose: true,
          getContainer: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                showDraw("close");
              }}
            />
          ),
          style: {
            position: "absolute",
          },
          bodyStyle: {
            paddingLeft: 30,
            paddingRight: 30,
          },
          onClose: () => {
            showDraw("close");
          },
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        onFinish={(values) => {
          let setArr = [];
          for (const key in values) {
            if (key.includes("key") && values[key]) {
              let key1 = key.substr(0, key.length - 3);
              setArr.push(key1);
            }
          }
          for (const key in ruleList) {
            ruleList[key].key = "N";
            setArr.map((item) => {
              if (key === item) {
                ruleList[key].key = "Y";
              }
            });
          }
          setRule(values, ruleList);
        }}
      >
        <div style={{ fontSize: "14px", fontWeight: "700" }}>{"规范内容"}</div>
        <ProFormText label="ID" name="id" hidden />
        <ProFormText
          label={language("nac.mconfig.cfgpolicy.rulename")}
          name="name"
          rules={[
            {
              required: true,
              message: language("project.mandatory"),
            },
          ]}
          disabled={op === "add" ? false : true}
        />
        <div className="sysyTypeDiv">
          <ProFormRadio.Group
            label={language("nac.mconfig.cfgpolicy.systype")}
            name="systype"
            disabled={op === "add" ? false : true}
            options={[
              { label: "Windows", value: "win" },
              { label: "Linux", value: "linux" },
              { label: "信创通用", value: "chs" },
              { label: "MacOS", value: "mac" },
            ]}
            onChange={(e) => {
              changeType(e);
            }}
            fieldProps={{
              buttonStyle: "solid",
              optionType: "button",
            }}
            rules={[
              {
                required: true,
                message: language("project.mustSelect"),
              },
            ]}
          />
        </div>
        <ProFormText label={language("project.remark")} name="notes" />
        <div style={{ fontSize: "14px", fontWeight: "700" }}>
          {language("nac.mconfig.cfgpolicy.rulecontent")}
        </div>

        <Spin spinning={drawLoading}>
          <div className="infoDiv">
            <ProCard
              hoverable
              style={{
                lineHeight: "68px",
                ...gridStyle,
              }}
              bordered
              className="addCard"
              onClick={() => {
                showChDraw("open");
                editRule("");
              }}
            >
              <span
                style={{
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: "52px",
                  textAlign: "center",
                }}
              >
                <PlusOutlined />
                &emsp;{language("nac.mconfig.cfgpolicy.addRule")}
              </span>
            </ProCard>
            {ruKeyList.map((item) => {
              return (
                <ProCard
                  hoverable={false}
                  style={gridStyle}
                  className="checkInfoCard"
                  bordered
                  actions={
                    <div className="actionDiv">
                      <div className="infoFileds">
                        <ProFormCheckbox name={item + "key"}>
                          {language("nac.mconfig.cfgpolicy.setKey")}
                          {item.key}
                        </ProFormCheckbox>
                      </div>
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            marginRight: "10px",
                            position: "absolute",
                            bottom: "5px",
                            right: "35px",
                          }}
                        >
                          <Tooltip title={language("project.edit")}>
                            <WSave
                              className="wsave"
                              style={{ cursor: "pointer", fill: "#A1A1A1" }}
                              key="edit"
                              onClick={() => {
                                showChDraw("open");
                                editRule(item);
                              }}
                            />
                          </Tooltip>
                        </div>
                        <div
                          style={{
                            marginRight: "10px",
                            position: "absolute",
                            bottom: "5px",
                            right: "10px",
                          }}
                        >
                          <Tooltip
                            placement="top"
                            title={language("project.del")}
                          >
                            <WDel
                              className="wdel"
                              style={{ cursor: "pointer", fill: "#A1A1A1" }}
                              key="del"
                              onClick={() => {
                                delRule(item);
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="infoContDiv">
                    <div className="infoIcon">
                      <Avatar icon={titleIcon(item)} />
                      <span
                        className="cardtitle"
                        style={{ marginLeft: "10px" }}
                      >
                        {ruleTextMap(item)}
                      </span>
                    </div>
                  </div>
                </ProCard>
              );
            })}
          </div>
        </Spin>
      </DrawerForm>
      <>
      <ChildDrawer
        ref={chRef}
        showChDraw={showChDraw}
        drawStatus={drawStatus}
        setDrawStatus={setDrawStatus}
        getRuleValues={getRuleValues}
        osType={osType}
        height={document.getElementById('drawerContainer')?.offsetHeight}
        optionType={op}
      />
    </>
    </div>
  );
};
