import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Anchor,
  Divider,
  Row,
  Space,
  Popconfirm,
  message,
  Alert,
  Tabs,
  Tooltip,
} from "antd";
import { post, postAsync } from "@/services/https";
import {
  CloseOutlined,
} from "@ant-design/icons";
import { modalFormLayout } from "@/utils/helper";
import ProForm, {
  ModalForm,
  ProCard,
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormCheckbox,
  ProFormDigit,
  ProFormSwitch,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { EditTable } from "@/utils/fromTypeLabel";
import { CfgpolicyTable } from "@/common";
import { regPortList, regList, regIpList } from "@/utils/regExp";
import { NotesText, ContentText, NameText } from "@/utils/fromTypeLabel";
import { ReactComponent as Query } from "@/assets/nac/security/query.svg";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import "./childDrawer.less";
const { Link } = Anchor;

var scrollHeight = 200;
const ChildDrawer = forwardRef(({ ...props }, ref) => {
  useImperativeHandle(ref, () => ({
    optionMod: optionMod,
  }));
  const {
    showChDraw,
    drawStatus,
    setDrawStatus,
    getRuleValues,
    osType,
    optionType,
  } = props;
  let clientHeight = props.height - 205;
  const [anchorVal, setAnchorVal] = useState("");

  const [tabKey, setTabKey] = useState("b1");
  let keysObj = {
    guest: "a1",
    remote: "a2",
    autoplay: "a3",
    firewall: "a4",
    weakpass: "a5",
    ipget: "a6",
    share: "a7",
    runtime: "a8",
    autoupdate: "a9",
    sysacc: "a10",
    computername: "a11",
    filescan: "a12",
    sysflaw: "a13", //B2
    pwd: "a14",
    check_adlogin: "a15",
    peripheral: "a16",
    screen: "a17",
    OS: "a18",
    home_page: "a19",
    proxy: "a20",
    edp_version: "a21",
    check_edppolicy: "a22",
    antivirus: "a23",
    registry: "a24",
    office: "a25",
    IEBrowser: "a26",
    soft_install: "a27", //b3
    process: "a28",
    service: "a29",
    start_item: "a30",
    netviolation: "a31", //b4
    port_check: "a32",
    flowlimit: "a33",
    hardware: "a34",
  };
  //当前开启图标
  const [titleList, setTitleList] = useState([]);
  let titleArr = [];
  const titleTypeChange = (status, titleKey) => {
    let list = [...(titleList.length < 1 ? titleArr : titleList)];
    if (status) {
      list.push(titleKey);
      setTitleList(list);
      titleArr = list;
    } else {
      if (titleKey) {
        setTitleList(list.filter((item) => item != titleKey));
        titleArr = list.filter((item) => item != titleKey);
      } else {
        setTitleList([]);
        titleArr = [];
      }
    }
  };

  const optionMod = (info, clickKey, keysArr, keyList) => {
    let setArr = [];
    for (const key in keyList) {
      if (key.includes("key")) {
        let key1 = key.substr(0, key.length - 3);
        setArr.push(key1);
      }
    }
    for (const key in info) {
      setArr.map((item) => {
        if (key === item) {
          info[key].key = keyList[item + "key"] ? "Y" : "N";
        }
      });
    }
    let keyInfo = [];
    for (const key in info) {
      console.log(info[key].state);
      if (info[key].state == "Y") {
        keyInfo.push(keysObj[key]);
      }
    }
    setTitleList(keyInfo);
    titleArr = keyInfo;

    let initialValue = {};

    //来宾访客
    initialValue.gueststate = info?.guest?.state == "Y" ? true : false;
    initialValue.guestkey = info?.guest?.key == "Y" ? ["Y"] : [];

    //远程桌面
    initialValue.remotestate = info?.remote?.state == "Y" ? true : false;
    initialValue.remotekey = info?.remote?.key == "Y" ? ["Y"] : [];

    //自动播放
    initialValue.autoplaystate = info?.autoplay?.state == "Y" ? true : false;
    initialValue.autoplaykey = info?.autoplay?.key == "Y" ? ["Y"] : [];

    //防火墙检查
    initialValue.firewallstate = info?.firewall?.state == "Y" ? true : false;
    initialValue.firewallkey = info?.firewall?.key == "Y" ? ["Y"] : [];

    //弱口令检查
    initialValue.weakpassstate = info?.weakpass?.state == "Y" ? true : false;
    initialValue.weakpasskey = info?.weakpass?.key == "Y" ? ["Y"] : [];
    initialValue.weakFlag = info?.weakpass?.weakFlag == "Y" ? ["Y"] : [];

    //地址获取
    initialValue.ipgetstate = info?.ipget?.state == "Y" ? true : false;
    initialValue.ipgetkey = info?.ipget?.key == "Y" ? ["Y"] : [];
    initialValue.addrMode = info?.ipget?.addrMode == "Y" ? ["Y"] : [];

    //共享资源
    initialValue.sharestate = info?.share?.state == "Y" ? true : false;
    initialValue.sharekey = info?.share?.key == "Y" ? ["Y"] : [];
    initialValue.share = info?.share?.list ? info.share.list : [];

    //终端运行时间
    initialValue.runtimestate = info?.runtime?.state == "Y" ? true : false;
    initialValue.runtimekey = info?.runtime?.key == "Y" ? ["Y"] : [];

    //自动更新
    initialValue.autoupdatestate =
      info?.autoupdate?.state == "Y" ? true : false;
    initialValue.autoupdatekey = info?.autoupdate?.key == "Y" ? ["Y"] : [];
    initialValue.autoUpdateMode = "Y";

    //系统账号
    initialValue.sysaccstate = info?.sysacc?.state == "Y" ? true : false;
    initialValue.sysacckey = info?.sysacc?.key == "Y" ? ["Y"] : [];
    initialValue.multiAcc = info?.sysacc?.multiAcc == "Y" ? ["Y"] : [];
    initialValue.redundancyAcc =
      info?.sysacc?.redundancyAcc == "Y" ? ["Y"] : [];
    initialValue.redundancyTime = info?.sysacc?.redundancyTime;

    //计算机名称
    initialValue.computernamestate =
      info?.computername?.state == "Y" ? true : false;
    initialValue.computernamekey = info?.computername?.key == "Y" ? ["Y"] : [];
    initialValue.matchingRules = info?.computername?.matchingRules;

    //文件检查
    initialValue.filescanstate = info?.filescan?.state == "Y" ? true : false;
    initialValue.filescankey = info?.filescan?.key == "Y" ? ["Y"] : [];
    initialValue.filescanxor = info?.filescan?.xor == "Y" ? ["Y"] : [];
    initialValue.filescan = info?.filescan?.list ? info.filescan.list : [];

    //tab2
    //系统漏洞
    initialValue.sysflawstate = info?.sysflaw?.state == "Y" ? true : false;
    initialValue.sysflawkey = info?.sysflaw?.key == "Y" ? ["Y"] : [];
    initialValue.sysflaw = info?.sysflaw?.list ? info.sysflaw.list : [];

    //密码策略
    initialValue.pwdstate = info?.pwd?.state == "Y" ? true : false;
    initialValue.pwdkey = info?.pwd?.key == "Y" ? ["Y"] : [];
    initialValue.complexity = info?.pwd?.complexity == "Y" ? ["Y"] : [];
    initialValue.saveMin = info?.pwd?.saveMin;
    initialValue.saveMax = info?.pwd?.saveMax;
    initialValue.legthMin = info?.pwd?.legthMin;
    initialValue.historyNum = info?.pwd?.historyNum ? info?.pwd?.historyNum : 0;

    //AD域检查
    initialValue.check_adloginstate =
      info?.check_adlogin?.state == "Y" ? true : false;
    initialValue.check_adloginkey =
      info?.check_adlogin?.key == "Y" ? ["Y"] : [];
    initialValue.check = info?.check_adlogin?.check;
    initialValue.check_adlogin = info?.check_adlogin?.list
      ? info.check_adlogin.list
      : [];

    //USB外设检查
    initialValue.peripheralstate =
      info?.peripheral?.state == "Y" ? true : false;
    initialValue.peripheralkey = info?.peripheral?.key == "Y" ? ["Y"] : [];
    initialValue.storageChk = info?.peripheral?.storageChk == "Y" ? ["1"] : [];
    initialValue.inputChk = info?.peripheral?.inputChk == "Y" ? ["1"] : [];
    initialValue.wirelessNetCard =
      info?.peripheral?.wirelessNetCard == "Y" ? ["1"] : [];
    initialValue.mobileDeivce =
      info?.peripheral?.mobileDeivce == "Y" ? ["1"] : [];

    //屏幕保护
    initialValue.screenstate = info?.screen?.state == "Y" ? true : false;
    initialValue.screenkey = info?.screen?.key == "Y" ? ["Y"] : [];
    initialValue.screensaver = info?.screen?.screensaver == "Y" ? ["Y"] : [];
    initialValue.screenComp = info?.screen?.screenComp == "Y" ? ["Y"] : [];
    initialValue.screenRecTime = info?.screen?.screenRecTime;

    //操作系统
    initialValue.OSstate = info?.OS?.state == "Y" ? true : false;
    initialValue.OSkey = info?.OS?.key == "Y" ? ["Y"] : [];
    initialValue.OSVersion = info?.OS?.OSVersion == "Y" ? ["Y"] : [];
    initialValue.multiOS = info?.OS?.multiOS == "Y" ? ["Y"] : [];
    initialValue.virtualOS = info?.OS?.virtualOS == "Y" ? ["Y"] : [];
    initialValue.OS = info?.OS?.list ? info.OS.list : [];

    //浏览器主页
    initialValue.home_pagestate = info?.home_page?.state == "Y" ? true : false;
    initialValue.home_pagekey = info?.home_page?.key == "Y" ? ["Y"] : [];
    initialValue.home_page = info?.home_page?.list ? info.home_page.list : [];

    //浏览器代理
    initialValue.proxystate = info?.proxy?.state == "Y" ? true : false;
    initialValue.proxykey = info?.proxy?.key == "Y" ? ["Y"] : [];
    initialValue.browserProxyIE =
      info?.proxy?.browserProxyIE == "Y" ? ["Y"] : [];
    initialValue.browserProxyFirefox =
      info?.proxy?.browserProxyFirefox == "Y" ? ["Y"] : [];
    initialValue.browserProxyChrome =
      info?.proxy?.browserProxyChrome == "Y" ? ["Y"] : [];
    initialValue.proxy = info?.proxy?.list ? info.proxy.list : [];

    //卓管版本
    initialValue.edp_versionstate =
      info?.edp_version?.state == "Y" ? true : false;
    initialValue.edp_versionkey = info?.edp_version?.key == "Y" ? ["Y"] : [];
    initialValue.edpVersion = info?.edp_version?.edpVersion;
    initialValue.edpUrl = info?.edp_version?.edpUrl;
    initialValue.edpDesc = info?.edp_version?.edpDesc;
    initialValue.edp_version = info?.edp_version?.edp_version;

    //卓管策略
    initialValue.check_edppolicystate =
      info?.check_edppolicy?.state == "Y" ? true : false;
    initialValue.check_edppolicykey =
      info?.check_edppolicy?.key == "Y" ? ["Y"] : [];
    initialValue.check_edppolicy = info?.check_edppolicy?.list
      ? info.check_edppolicy.list
      : [];

    //杀毒软件
    initialValue.antivirustate = info?.antivirus?.state == "Y" ? true : false;
    initialValue.antiviruskey = info?.antivirus?.key == "Y" ? ["Y"] : [];
    initialValue.avrRepairAuto = info?.antivirus?.avrRepairAuto;
    initialValue.antivirus = info?.antivirus?.list ? info.antivirus.list : [];

    //注册表检查
    initialValue.registrystate = info?.registry?.state == "Y" ? true : false;
    initialValue.registrykey = info?.registry?.key == "Y" ? ["Y"] : [];
    initialValue.registry = info?.registry?.list ? info.registry.list : [];

    //Office正版
    initialValue.officestate = info?.office?.state == "Y" ? true : false;
    initialValue.officekey = info?.office?.key == "Y" ? ["Y"] : [];

    let allowVal = [];
    if (info?.office?.office_allow) {
      let arr = info?.office?.office_allow.split(",");
      arr.map((item, index) => {
        let obj = {};
        obj.id = index + 1;
        obj.number = item;
        allowVal.push(obj);
      });
    }
    initialValue.office_allow = allowVal;

    let forbidVal = [];
    if (info?.office?.office_forbid) {
      let arr = info?.office?.office_forbid.split(",");
      arr.map((item, index) => {
        let obj = {};
        obj.id = index + 1;
        obj.number = item;
        forbidVal.push(obj);
      });
    }
    initialValue.office_forbid = forbidVal;

    //IE浏览器
    initialValue.IEBrowserstate = info?.IEBrowser?.state == "Y" ? true : false;
    initialValue.IEBrowserkey = info?.IEBrowser?.key == "Y" ? ["Y"] : [];
    initialValue.ieVersion = info?.IEBrowser?.ieVersion;

    let iePatchValNum = [];
    if (info?.IEBrowser?.iePatchNum) {
      let arr = info?.IEBrowser?.iePatchNum.split(",");
      arr.map((item, index) => {
        let obj = {};
        obj.id = index + 1;
        obj.iePatchNum = item;
        iePatchValNum.push(obj);
      });
    }
    initialValue.iePatchNum = iePatchValNum;

    //软件安装
    initialValue.soft_installstate =
      info?.soft_install?.state == "Y" ? true : false;
    initialValue.soft_installkey = info?.soft_install?.key == "Y" ? ["Y"] : [];
    initialValue.soft_installxor = info?.soft_install?.xor == "Y" ? ["Y"] : [];
    initialValue.soft_install = info?.soft_install?.list
      ? info.soft_install.list
      : [];

    //进程运行
    initialValue.porcessstate = info?.process?.state == "Y" ? true : false;
    initialValue.porcesskey = info?.process?.key == "Y" ? ["Y"] : [];
    initialValue.processxor = info?.process?.xor == "Y" ? ["Y"] : [];
    initialValue.process = info?.process?.list ? info.process.list : [];

    //服务运行
    initialValue.servicestate = info?.service?.state == "Y" ? true : false;
    initialValue.servicekey = info?.service?.key == "Y" ? ["Y"] : [];
    initialValue.service = info?.service?.list ? info.service.list : [];

    //启动项检查
    initialValue.start_itemstate =
      info?.start_item?.state == "Y" ? true : false;
    initialValue.start_itemkey = info?.start_item?.key == "Y" ? ["Y"] : [];
    initialValue.start_item = info?.start_item?.list
      ? info.start_item.list
      : [];

    //违规外联
    initialValue.netviolationstate =
      info?.netviolation?.state == "Y" ? true : false;
    initialValue.netviolationkey = info?.netviolation?.key == "Y" ? ["Y"] : [];
    let blockType = [];
    if (info?.netviolation?.blockNoauth == "Y") {
      blockType.push("blockNoauth");
    }
    if (info?.netviolation?.blockDualnet == "Y") {
      blockType.push("blockDualnet");
    }
    initialValue.blockType = blockType;
    initialValue.vioChkAddr = info?.netviolation?.vioChkAddr;
    initialValue.vioChkAddrIPV6 = info?.netviolation?.vioChkAddrIPV6;
    initialValue.vioReportmark = info?.netviolation?.vioReportmark;
    initialValue.vioRealchk =
      info?.netviolation?.vioRealchk == "Y" ? ["Y"] : [];
    initialValue.vioMethod = info?.netviolation?.vioMethod;

    let vioConfValIp = [];
    if (info?.netviolation?.vioConfIp) {
      let arr = info?.netviolation?.vioConfIp.split(",");
      arr.map((item, index) => {
        let obj = {};
        obj.id = index + 1;
        obj.vioConfIp = item;
        vioConfValIp.push(obj);
      });
    }
    initialValue.vioConfIp = vioConfValIp; //可编辑table  转字符串

    initialValue.tipContent = info?.netviolation?.tipContent;

    //端口开放
    initialValue.port_checkstate =
      info?.port_check?.state == "Y" ? true : false;
    initialValue.port_checkkey = info?.port_check?.key == "Y" ? ["Y"] : [];
    initialValue.confPort = info?.port_check?.confPort;
    initialValue.denyPort = info?.port_check?.denyPort;

    //流量检测
    initialValue.flowlimitstate = info?.flowlimit?.state == "Y" ? true : false;
    initialValue.flowlimitkey = info?.flowlimit?.key == "Y" ? ["Y"] : [];
    initialValue.flowContrSw = info?.flowlimit?.flowContrSw == "Y" ? ["Y"] : [];
    initialValue.flowUpperLimit = info?.flowlimit?.flowUpperLimit;

    //硬件安装
    initialValue.hardwarestate = info?.hardware?.state == "Y" ? true : false;
    initialValue.hardwarekey = info?.hardware?.key == "Y" ? ["Y"] : [];
    initialValue.hardwarekey = info?.hardware?.key == "Y" ? ["Y"] : [];
    initialValue.hardwareModem =
      info?.hardware?.hardwareModem == "1" ? ["1"] : [];
    initialValue.hardwareWifi =
      info?.hardware?.hardwareWifi == "1" ? ["1"] : [];
    initialValue.hardwareNetCard =
      info?.hardware?.hardwareNetCard == "1" ? ["1"] : [];
    initialValue.hardwareProtableWifi =
      info?.hardware?.hardwareProtableWifi == "1" ? ["1"] : [];

    setTimeout(function () {
      formRef.current?.setFieldsValue(initialValue);
    }, 100);
    showChDraw("open");

    for (const key in keysObj) {
      if (clickKey === key) {
        console.log(clickKey);
        console.log(keysObj[clickKey]);
        let keyTab = "b1";
        if (
          keysObj[clickKey]?.substr(1, keysObj[clickKey].length) > 12 &&
          keysObj[clickKey]?.substr(1, keysObj[clickKey].length) < 27
        ) {
          keyTab = "b2";
        } else if (
          keysObj[clickKey]?.substr(1, keysObj[clickKey].length) > 27 &&
          keysObj[clickKey]?.substr(1, keysObj[clickKey].length) < 31
        ) {
          keyTab = "b3";
        } else if (
          keysObj[clickKey]?.substr(1, keysObj[clickKey].length) > 31
        ) {
          keyTab = "b4";
        }
        setTabKey(keyTab);
        setTimeout(() => {
          let element = document.getElementById(keysObj[clickKey]);
          element &&
            element.scrollIntoView({ block: "start", behavior: "smooth" });
        }, 500);
      }
    }
  };

  //规范内容添加弹框关闭
  const closeDrawStatus = () => {
    formRef.current.resetFields();
    showChDraw();
  };

  const formRef = useRef();
  const addFormRef = useRef();

  const [modalType, setModalType] = useState();
  const [antivirusModalStatus, setAntivirusModalStatus] = useState(false);
  const [softList, setSoftList] = useState([]);
  const [winTypeList, setWinTypeList] = useState([]);

  //服务运行内容
  const [serviceDenyStatus, setServiceDenyStatus] = useState("N");
  const [serviceRepAuto, setServiceRepAuto] = useState("Y");

  //进程运行内容
  const [processDenyStatus, setProcessDenyStatus] = useState("N");

  //软件安装
  const [softDenyStatus, setSoftDenyStatus] = useState("N");
  const [softRepAuto, setSoftRepAuto] = useState("Y");

  //文件检查 类型显隐
  const [filescanDenyType, setFilescanDenyType] = useState("Y");

  //版本要求
  const OsCheckreqList = [
    {
      label: language("nac.mconfig.cfgpolicy.equalto"),
      value: "1",
    },
    {
      label: language("nac.mconfig.cfgpolicy.lessthan"),
      value: "2",
    },
    {
      label: language("nac.mconfig.cfgpolicy.greaterthan"),
      value: "3",
    },
    {
      label: language("nac.mconfig.cfgpolicy.moreorequal"),
      value: "4",
    },
    {
      label: language("nac.mconfig.cfgpolicy.lessthanorequalto"),
      value: "5",
    },
  ];

  //操作系统版本
  const sysOsverList = [
    {
      label: "所有系统",
      value: "1",
    },
    {
      label: "windows 10_64",
      value: "2",
    },
    {
      label: "windows 10_32",
      value: "3",
    },
    {
      label: "windows 8.1_64",
      value: "4",
    },
    {
      label: "windows 8.1_32",
      value: "5",
    },
    {
      label: "windows 8_64",
      value: "6",
    },
    {
      label: "windows 8_32",
      value: "7",
    },
    {
      label: "windows 7_64",
      value: "8",
    },
    {
      label: "windows 7_32",
      value: "9",
    },
    {
      label: "windows XP_64",
      value: "10",
    },
    {
      label: "windows XP_32",
      value: "11",
    },
    {
      label: "windows 2000",
      value: "12",
    },
  ];

  //处理器架构
  const architectureList = [
    {
      label: language("nac.mconfig.cfgpolicy.allarchitectures"),
      value: "1",
    },
    {
      label: "x86",
      value: "2",
    },
    {
      label: "x86_64",
      value: "3",
    },
    {
      label: "amd64",
      value: "4",
    },
    {
      label: "arm64",
      value: "5",
    },
    {
      label: "i386",
      value: "6",
    },
    {
      label: "i686",
      value: "7",
    },
    {
      label: "mips",
      value: "8",
    },
    {
      label: "aarc32",
      value: "9",
    },
    {
      label: "aarch64",
      value: "10",
    },
    {
      label: "loongarch64",
      value: "11",
    },
  ];

  //软件版本
  const checkverList = [
    {
      label: language("nac.mconfig.cfgpolicy.greaterthanorequalto"),
      value: "1",
    },
    {
      label: language("nac.mconfig.cfgpolicy.lessthanorequalto"),
      value: "2",
    },
    {
      label: language("nac.mconfig.cfgpolicy.equalto"),
      value: "4",
    },
  ];

  useEffect(() => {
    getWinType();
    showSoft();
  }, []);

  //操作系统版本
  const getWinType = async () => {
    let res = await postAsync(
      "/cfg.php?controller=securityRule&action=getWinType"
    );
    if (res.data && res.data.length > 0) {
      let list = [];
      res.data.map((item) => {
        list.push({
          value: item.value.toString(),
          name: item.name,
        });
      });
      setWinTypeList(list);
    } else {
      setWinTypeList([]);
    }
  };

  //杀毒厂商
  const showSoft = async () => {
    let res = await postAsync(
      "/cfg.php?controller=securityRule&action=show_soft"
    );
    setSoftList(res.data ? res.data : []);
  };

  const fromcolumns = [
    {
      title: "共享名",
      dataIndex: "OSVerInfo",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = "--";
        winTypeList.map((item) => {
          if (item.value == record.OSVerInfo) {
            cont = item.name;
          }
        });
        return cont;
      },
    },
    {
      title: "描述",
      dataIndex: "OSCheckreqValue",
      width: 100,
      ellipsis: true,
      render: (text, record) => {
        let cont = "--";
        OsCheckreqList.map((item) => {
          if (item.value == record.OSCheckreqValue) {
            cont = item.label;
          }
        });
        return cont;
      },
    },
  ];

  //操作系统版本table
  const oscolumns = [
    {
      title: language("nac.mconfig.cfgpolicy.operatingsystemversion"),
      dataIndex: "OSVerInfo",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = "--";
        winTypeList.map((item) => {
          if (item.value == record.OSVerInfo) {
            cont = item.name;
          }
        });
        return cont;
      },
    },
    {
      title: language("nac.mconfig.cfgpolicy.versionrequirements"),
      dataIndex: "OSCheckreqValue",
      width: 100,
      ellipsis: true,
      render: (text, record) => {
        let cont = "--";
        OsCheckreqList.map((item) => {
          if (item.value == record.OSCheckreqValue) {
            cont = item.label;
          }
        });
        return cont;
      },
    },
  ];
  //  共享资源检测
  const sharecolumns = [
    {
      title: "共享名",
      dataIndex: "shareName",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "描述",
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
    },
  ];

  //文件检查
  const filescancolumns = [
    {
      title: "共享名",
      dataIndex: "deny",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        if (record.deny == "Y") {
          return "禁止文件";
        } else {
          return "必须存在文件";
        }
      },
    },
    {
      title: "文件路径",
      dataIndex: "filepath",
      width: 100,
      ellipsis: true,
    },
    {
      title: "文件MD5",
      dataIndex: "filemd5",
      width: 100,
      ellipsis: true,
    },
    {
      title: "安检显示",
      dataIndex: "display",
      width: 100,
      ellipsis: true,
    },
    {
      title: "描述",
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
    },
    {
      title: "修复提示",
      dataIndex: "repairTip",
      width: 100,
      ellipsis: true,
    },
    {
      title: "修复链接",
      dataIndex: "repairArg",
      width: 100,
      ellipsis: true,
    },
  ];

  //AD域
  const check_adlogincolumns = [
    {
      title: "AD域名",
      dataIndex: "adDomain",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "描述",
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  //浏览器主页
  const home_pagecolumns = [
    {
      title: "URL地址",
      dataIndex: "browserUrl",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "描述",
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  //浏览器代理
  const proxycolumns = [
    {
      title: "代理IP",
      dataIndex: "proxyIp",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "代理端口",
      dataIndex: "proxyPort",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "描述",
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  //卓管策略检测
  const check_edppolicycolumns = [
    {
      title: "启动类别",
      dataIndex: "deny",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "EDP策略名称",
      dataIndex: "edpName",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "描述",
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "安检显示",
      dataIndex: "display",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "修复提示",
      dataIndex: "repairTip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  //杀毒软件
  const antivirusColumn = [
    {
      title: language("nac.mconfig.cfgpolicy.antivirusmanufacturer"),
      dataIndex: "type",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = "--";
        softList.map((item) => {
          if (item.softname == record.type) {
            cont = item.softname;
          }
        });
        return cont;
      },
    },
    {
      title: language("nac.mconfig.cfgpolicy.antivirusname"),
      dataIndex: "name",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.softwareversion"),
      dataIndex: "version",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.viruslibraryversionnumber"),
      dataIndex: "virusVers",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.viruslibraryupdateperiod"),
      dataIndex: "virusDays",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.viruslibraryupdateaddress"),
      dataIndex: "virusDataUpdate",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.fixparameters"),
      dataIndex: "repairArg",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  //注册表检查
  const registrycolumns = [
    {
      title: "名称",
      dataIndex: "regeditName",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "注册表路径",
      dataIndex: "regeditPath",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "数据",
      dataIndex: "regeditData",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  const [confirmLoading, setConfirmLoading] = useState(false);
  const renderRemove = (text, record, type = "") => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        if (type == "office_allow") {
          const tableDataSource = formRef.current.getFieldsValue([
            "office_allow",
          ]);
          formRef.current.setFieldsValue({
            office_allow: tableDataSource["office_allow"].filter(
              (item) => item.id != record.id
            ),
          });
        } else if (type == "office_forbid") {
          const tableDataSource = formRef.current.getFieldsValue([
            "office_forbid",
          ]);
          formRef.current.setFieldsValue({
            office_forbid: tableDataSource["office_forbid"].filter(
              (item) => item.id != record.id
            ),
          });
        } else if (type == "iePatchNum") {
          const tableDataSource = formRef.current.getFieldsValue([
            "iePatchNum",
          ]);
          formRef.current.setFieldsValue({
            iePatchNum: tableDataSource["iePatchNum"].filter(
              (item) => item.id != record.id
            ),
          });
        } else if (type == "vioConfIp") {
          const tableDataSource = formRef.current.getFieldsValue(["vioConfIp"]);
          formRef.current.setFieldsValue({
            vioConfIp: tableDataSource["vioConfIp"].filter(
              (item) => item.id != record.id
            ),
          });
        }
      }}
      key="popconfirm"
      title={language("project.delconfirm")}
      okButtonProps={{
        loading: confirmLoading,
      }}
      okText={language("project.yes")}
      cancelText={language("project.no")}
    >
      <a>{text}</a>
    </Popconfirm>
  );
  // office正版检查  序列号
  const office_allowcolumns = [
    {
      title: "序列号",
      dataIndex: "number",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "25%",
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
              record,
              "office_allow"
            )}
          </Space>
        </>,
      ],
    },
  ];
  const office_forbidcolumns = [
    {
      title: "序列号",
      dataIndex: "number",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "25%",
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
              record,
              "office_forbid"
            )}
          </Space>
        </>,
      ],
    },
  ];

  //IE浏览器补丁检测
  const iePatchNumcolumns = [
    {
      title: "补丁编号",
      dataIndex: "iePatchNum",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "25%",
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
              record,
              "iePatchNum"
            )}
          </Space>
        </>,
      ],
    },
  ];

  //违规外联  合规ip
  const vioConfIpcolumns = [
    {
      title: "IPv4段/掩码/IPv6段/范围",
      dataIndex: "vioConfIp",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "25%",
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
              record,
              "vioConfIp"
            )}
          </Space>
        </>,
      ],
    },
  ];

  //系统漏洞 补丁管理
  const sysflawColumn = [
    {
      title: language("nac.mconfig.cfgpolicy.patchname"),
      dataIndex: "patchname",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.parchnumber"),
      dataIndex: "patchnum",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.operatingsystemversion"),
      dataIndex: "sys_osver",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = "--";
        sysOsverList.map((item) => {
          if (item.value == record.sys_osver) {
            cont = item.label;
          }
        });
        return cont;
      },
    },
    {
      title: language("nac.mconfig.cfgpolicy.processorarchitecture"),
      dataIndex: "architecture",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let str = "--";
        architectureList?.map((item) => {
          if (item.value == record.architecture) {
            str = item.label;
          }
        });
        return str;
      },
    },
    {
      title: language("nac.mconfig.cfgpolicy.softwarename"),
      dataIndex: "softname",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.softwareversion"),
      dataIndex: "softver",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.softwareversion"),
      dataIndex: "patchurl",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  //服务运行
  const servicecolumns = [
    {
      title: language("nac.mconfig.cfgpolicy.launchcategory"),
      dataIndex: "deny",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = language("nac.mconfig.cfgpolicy.must");
        if (record.deny && record.deny == "Y") {
          cont = language("nac.mconfig.cfgpolicy.prohibit");
        }
        return cont;
      },
    },
    {
      title: language("nac.mconfig.cfgpolicy.servicename"),
      dataIndex: "name",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.securitydisplay"),
      dataIndex: "display",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.describe"),
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.fixlink"),
      dataIndex: "repairArg",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.repairprompt"),
      dataIndex: "repairTip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.repairtype"),
      dataIndex: "repairAuto",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = language("nac.mconfig.cfgpolicy.manualrepair");
        if (record.repairAuto && record.repairAuto == "Y") {
          cont = language("nac.mconfig.cfgpolicy.automaticrepair");
        }
        return cont;
      },
    },
  ];

  //进程运行
  const processcolumn = [
    {
      title: language("nac.mconfig.cfgpolicy.launchcategory"),
      dataIndex: "deny",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = language("nac.mconfig.cfgpolicy.must");
        if (record.deny && record.deny == "Y") {
          cont = language("nac.mconfig.cfgpolicy.prohibit");
        }
        return cont;
      },
    },
    {
      title: language("nac.mconfig.cfgpolicy.processname"),
      dataIndex: "name",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.processfingerprint"),
      dataIndex: "finger",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.securitydisplay"),
      dataIndex: "display",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.describe"),
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.repairprompt"),
      dataIndex: "repairTip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.repairaddress"),
      dataIndex: "repairArg",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  //软件安装
  const soft_installcolumn = [
    {
      title: language("nac.mconfig.cfgpolicy.launchcategory"),
      dataIndex: "deny",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = language("nac.mconfig.cfgpolicy.must");
        if (record.deny && record.deny == "Y") {
          cont = language("nac.mconfig.cfgpolicy.prohibit");
        }
        return cont;
      },
    },
    {
      title: language("nac.mconfig.cfgpolicy.softwarename"),
      dataIndex: "softName",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.fixlink"),
      dataIndex: "repairArg",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.describe"),
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.securitydisplay"),
      dataIndex: "display",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.repairprompt"),
      dataIndex: "repairTip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.uninstallrepairparameters"),
      dataIndex: "uninstallRepairParam",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.softwareversion"),
      dataIndex: "version",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language("nac.mconfig.cfgpolicy.uninstallrepairparameters"),
      dataIndex: "repairAuto",
      width: 100,
      ellipsis: true,
      importStatus: true,
      render: (text, record) => {
        let cont = language("nac.mconfig.cfgpolicy.manualrepair");
        if (record.repairAuto && record.repairAuto == "Y") {
          cont = language("nac.mconfig.cfgpolicy.automaticrepair");
        }
        return cont;
      },
    },
  ];

  //启动项检查
  const start_itemcolumns = [
    {
      title: "禁止启动项",
      dataIndex: "disableStart",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "安检显示",
      dataIndex: "display",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "描述",
      dataIndex: "descrip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: "修复提示",
      dataIndex: "repairTip",
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
  ];

  //杀毒软件添加弹框开启
  const getAntivirusModal = (type = "", nameKey) => {
    setModalType(nameKey);
    if (type) {
      setAntivirusModalStatus(true);
    } else {
      setAntivirusModalStatus(false);
    }
  };
  //杀毒软件添加弹框关闭
  const closeAntivirusModal = () => {
    addFormRef.current.resetFields();
    if (modalType == "service") {
      setServiceDenyStatus("N");
      setServiceRepAuto("Y");
    }
    if (modalType == "process") {
      setProcessDenyStatus("N");
    }
    if (modalType == "soft_install") {
      setSoftDenyStatus("N");
      setSoftRepAuto("Y");
    }
    getAntivirusModal();
  };

  /**保存 */
  const save = (values, nameKey, type = "") => {
    let obj = formRef.current.getFieldsValue(nameKey);
    obj = obj[nameKey];
    if (!obj) {
      obj = [];
    }
    if (values.id) {
      obj.map((item, index) => {
        if (item.id == values.id) {
          obj[index] = values;
        }
      });
    } else {
      values.id = Date.now();
      obj.push(values);
    }
    let list = {};
    list[nameKey] = obj;
    formRef.current.setFieldsValue(list);
    closeAntivirusModal();
  };

  //打开编辑弹框
  const mod = (nameKey, selectedRowKeys) => {
    if (selectedRowKeys.length != 1) {
      message.error(language("nac.mconfig.cfgpolicy.pleaseselectpieceofdata"));
      return false;
    }
    let obj = formRef.current.getFieldsValue([nameKey]);
    obj = obj[nameKey];
    let findRow = {};
    obj.map((item) => {
      if (item.id == selectedRowKeys[0]) {
        findRow = item;
      }
    });
    if (nameKey == "service") {
      setServiceDenyStatus(findRow.deny);
      setServiceRepAuto(findRow.repairAuto);
    }
    if (nameKey == "process") {
      setProcessDenyStatus(findRow.deny);
    }
    if (nameKey == "soft_install") {
      setSoftDenyStatus(findRow.deny);
      setSoftRepAuto(findRow.repairAuto);
    }
    setTimeout(() => {
      addFormRef.current.setFieldsValue(findRow);
    }, 500);
    getAntivirusModal(true, nameKey);
  };

  const deleteClick = (nameKey, selectedRowKeys, selectedKeysEmpty) => {
    if (selectedRowKeys.length < 1) {
      message.error(language("nac.mconfig.cfgpolicy.pleaseselectpieceofdata"));
      return false;
    }
    let obj = formRef.current.getFieldsValue([nameKey]);
    obj = obj[nameKey];
    let list = {};
    list[nameKey] = obj.filter(
      (item) => selectedRowKeys.indexOf(item.id) == -1
    );
    setTimeout(() => {
      formRef.current.setFieldsValue(list);
    }, 500);
    selectedKeysEmpty();
  };

  //编辑保存
  const contentSave = (info) => {
    let data = {};
    let len = false;

    //来宾访客
    let guest = {};
    guest.state = info.gueststate || info.gueststate == "Y" ? "Y" : "N";
    guest.key = info.guestkey?.length > 0 ? "Y" : "N";
    data.guest = guest;

    //远程桌面
    let remote = {};
    remote.state = info.remotestate || info.remotestate == "Y" ? "Y" : "N";
    remote.key = info.remotekey?.length > 0 ? "Y" : "N";
    data.remote = remote;

    //自动播放
    let autoplay = {};
    autoplay.state =
      info.autoplaystate || info.autoplaystate == "Y" ? "Y" : "N";
    autoplay.key = info.autoplaykey?.length > 0 ? "Y" : "N";
    data.autoplay = autoplay;

    //防火墙检查
    let firewall = {};
    firewall.state =
      info.firewallstate || info.firewallstate == "Y" ? "Y" : "N";
    firewall.key = info.firewallkey?.length > 0 ? "Y" : "N";
    data.firewall = firewall;

    //弱口令检查
    let weakpass = {};
    weakpass.state =
      info.weakpassstate || info.weakpassstate == "Y" ? "Y" : "N";
    weakpass.key = info.weakpasskey?.length > 0 ? "Y" : "N";
    weakpass.weakFlag = info.weakFlag?.length > 0 ? "Y" : "N";
    data.weakpass = weakpass;

    //地址获取
    let ipget = {};
    ipget.state = info.ipgetstate || info.ipgetstate == "Y" ? "Y" : "N";
    ipget.key = info.ipgetkey?.length > 0 ? "Y" : "N";
    ipget.addrMode =
      info.addrMode?.length > 0 && info.addrMode[0] == "Y" ? "Y" : "N";
    data.ipget = ipget;

    //共享资源
    let share = {};
    share.state = info.sharestate || info.sharestate == "Y" ? "Y" : "N";
    share.key = info.sharekey?.length > 0 ? "Y" : "N";
    share.list = info.share ? info.share : [];
    data.share = share;

    //终端运行时间
    let runtime = {};
    runtime.state = info.runtimestate || info.runtimestate == "Y" ? "Y" : "N";
    runtime.key = info.runtimekey?.length > 0 ? "Y" : "N";
    runtime.upperTime = info.upperTime;
    data.runtime = runtime;

    //自动更新
    let autoupdate = {};
    autoupdate.state =
      info.autoupdatestate || info.autoupdatestate == "Y" ? "Y" : "N";
    autoupdate.key = info.autoupdatekey?.length > 0 ? "Y" : "N";
    autoupdate.autoUpdateMode = "Y";
    data.autoupdate = autoupdate;

    //系统账号
    let sysacc = {};
    sysacc.state = info.sysaccstate || info.sysaccstate == "Y" ? "Y" : "N";
    sysacc.key = info.sysacckey?.length > 0 ? "Y" : "N";
    sysacc.multiAcc =
      info.multiAcc?.length > 0 && info.multiAcc[0] == "Y" ? "Y" : "N";
    sysacc.redundancyAcc =
      info.redundancyAcc?.length > 0 && info.redundancyAcc[0] == "Y"
        ? "Y"
        : "N";
    sysacc.redundancyTime = info.redundancyTime;
    data.sysacc = sysacc;

    //计算机名称
    let computername = {};
    computername.state =
      info.computernamestate || info.computernamestate == "Y" ? "Y" : "N";
    computername.key = info.computernamekey?.length > 0 ? "Y" : "N";
    computername.matchingRules = info.matchingRules;
    data.computername = computername;

    //文件检查
    let filescan = {};
    filescan.state =
      info.filescanstate || info.filescanstate == "Y" ? "Y" : "N";
    filescan.key = info.filescankey?.length > 0 ? "Y" : "N";
    filescan.xor =
      info.filescanxor?.length > 0 && info.filescanxor[0] == "Y" ? "Y" : "N";
    filescan.list = info.filescan ? info.filescan : [];
    data.filescan = filescan;

    //tab2
    //系统漏洞
    let sysflaw = {};
    sysflaw.state = info.sysflawstate || info.sysflawstate == "Y" ? "Y" : "N";
    sysflaw.key = info.sysflawkey?.length > 0 ? "Y" : "N";
    sysflaw.list = info.sysflaw ? info.sysflaw : [];
    data.sysflaw = sysflaw;

    //密码策略
    let pwd = {};
    pwd.state = info.pwdstate || info.pwdstate == "Y" ? "Y" : "N";
    pwd.key = info.pwdkey?.length > 0 ? "Y" : "N";
    pwd.complexity = info.complexity?.length > 0 ? "Y" : "N";
    pwd.saveMin = info.saveMin;
    pwd.saveMax = info.saveMax;
    pwd.legthMin = info.legthMin;
    pwd.historyNum = info.historyNum ? info.historyNum : 0;
    data.pwd = pwd;

    //AD域检查
    let check_adlogin = {};
    check_adlogin.state =
      info.check_adloginstate || info.check_adloginstate == "Y" ? "Y" : "N";
    check_adlogin.key = info.check_adloginkey?.length > 0 ? "Y" : "N";
    check_adlogin.check = info.check;
    check_adlogin.list = info.check_adlogin ? info.check_adlogin : [];
    data.check_adlogin = check_adlogin;

    //USB外设检查
    let peripheral = {};
    peripheral.state =
      info.peripheralstate || info.peripheralstate == "Y" ? "Y" : "N";
    peripheral.key = info.peripheralkey?.length > 0 ? "Y" : "N";
    peripheral.storageChk = info.storageChk?.length > 0 ? "Y" : "N";
    peripheral.inputChk = info.inputChk?.length > 0 ? "Y" : "N";
    peripheral.wirelessNetCard = info.wirelessNetCard?.length > 0 ? "Y" : "N";
    peripheral.mobileDeivce = info.mobileDeivce?.length > 0 ? "Y" : "N";
    data.peripheral = peripheral;

    //屏幕保护
    let screen = {};
    screen.state = info.screenstate ? "Y" : "N";
    screen.key = info.screenkey?.length > 0 ? "Y" : "N";
    screen.screensaver = info.screensaver?.length > 0 ? "Y" : "N";
    screen.screenComp = info.screenComp?.length > 0 ? "Y" : "N";
    screen.screenRecTime = info.screenRecTime;
    if (optionType == "mod") {
      data.screen = screen;
      len = true;
    } else {
      if (screen.state == "Y") {
        data.screen = screen;
        len = true;
      }
    }

    //操作系统
    let OS = {};
    OS.state = info.OSstate ? "Y" : "N";
    OS.key = info.OSkey?.length > 0 ? "Y" : "N";
    OS.OSVersion = info.OSVersion?.length > 0 ? "Y" : "N";
    OS.multiOS = info.multiOS?.length > 0 ? "Y" : "N";
    OS.virtualOS = info.virtualOS?.length > 0 ? "Y" : "N";
    OS.list = info.OS ? info.OS : [];
    if (optionType == "mod") {
      data.OS = OS;
      len = true;
    } else {
      data.OS = OS;
      len = true;
    }

    //浏览器主页
    let home_page = {};
    home_page.state = info.home_pagestate ? "Y" : "N";
    home_page.key = info.home_pagekey?.length > 0 ? "Y" : "N";
    home_page.list = info.home_page ? info.home_page : [];
    data.home_page = home_page;
    //浏览器代理
    let proxy = {};
    proxy.state = info.proxystate ? "Y" : "N";
    proxy.key = info.proxykey?.length > 0 ? "Y" : "N";
    proxy.browserProxyIE = info.browserProxyIE?.length > 0 ? "Y" : "N";
    proxy.browserProxyFirefox =
      info.browserProxyFirefox?.length > 0 ? "Y" : "N";
    proxy.browserProxyChrome = info.browserProxyChrome?.length > 0 ? "Y" : "N";
    proxy.list = info.proxy ? info.proxy : [];
    data.proxy = proxy;

    //卓管版本
    let edp_version = {};
    edp_version.state =
      info.edp_versionstate?.length > 0 || info.edp_versionstate == "Y"
        ? "Y"
        : "N";
    edp_version.key = info.edp_versionkey?.length > 0 ? "Y" : "N";
    edp_version.edpVersion = info.edpVersion;
    edp_version.edpUrl = info.edpUrl;
    edp_version.edpDesc = info.edpDesc;
    data.edp_version = edp_version;

    //卓管策略
    let check_edppolicy = {};
    check_edppolicy.state = info.check_edppolicystate ? "Y" : "N";
    check_edppolicy.key = info.check_edppolicykey?.length > 0 ? "Y" : "N";
    check_edppolicy.list = info.check_edppolicy ? info.proxy : [];
    data.check_edppolicy = check_edppolicy;

    //杀毒软件
    let antivirus = {};
    antivirus.state = info.antivirustate ? "Y" : "N";
    antivirus.key = info.antiviruskey?.length > 0 ? "Y" : "N";
    antivirus.avrRepairAuto = info.avrRepairAuto;
    antivirus.list = info.antivirus ? info.antivirus : [];
    data.antivirus = antivirus;

    //注册表检查
    let registry = {};
    registry.state = info.registrystate ? "Y" : "N";
    registry.key = info.registrykey?.length > 0 ? "Y" : "N";
    registry.list = info.registry ? info.registry : [];
    data.registry = registry;

    //Office正版
    let office = {};
    office.state = info.officestate ? "Y" : "N";
    office.key = info.officekey?.length > 0 ? "Y" : "N";
    let office_allow = "";
    if (info.office_allow && info.office_allow.length > 0) {
      office_allow = info.office_allow
        .map((v) => {
          return v.number;
        })
        .join(",");
    }
    office.office_allow = office_allow;
    let office_forbid = "";
    if (info.office_forbid && info.office_forbid.length > 0) {
      office_forbid = info.office_forbid
        .map((v) => {
          return v.number;
        })
        .join(",");
    }
    office.office_forbid = office_forbid;
    data.office = office;

    //IE浏览器
    let IEBrowser = {};
    IEBrowser.state = info.IEBrowserstate ? "Y" : "N";
    IEBrowser.key = info.IEBrowserkey?.length > 0 ? "Y" : "N";
    IEBrowser.ieVersion = info.ieVersion;
    let iePatchNum = "";
    if (info.iePatchNum && info.iePatchNum.length > 0) {
      iePatchNum = info.iePatchNum
        .map((v) => {
          return v.iePatchNum;
        })
        .join(",");
    }
    IEBrowser.iePatchNum = iePatchNum;
    data.IEBrowser = IEBrowser;

    //软件安装
    let soft_install = {};
    soft_install.state = info.soft_installstate ? "Y" : "N";
    soft_install.key = info.soft_installkey?.length > 0 ? "Y" : "N";
    soft_install.xor = info.soft_installxor?.length > 0 ? "Y" : "N";
    soft_install.list = info.soft_install ? info.soft_install : [];
    data.soft_install = soft_install;

    //进程运行
    let process = {};
    process.state = info.porcessstate ? "Y" : "N";
    process.key = info.porcesskey?.length > 0 ? "Y" : "N";
    process.xor = info.processxor?.length > 0 ? "Y" : "N";
    process.list = info.process ? info.process : [];
    data.process = process;

    //服务运行
    let service = {};
    service.state = info.servicestate ? "Y" : "N";
    service.key = info.servicekey?.length > 0 ? "Y" : "N";
    service.list = info.service ? info.service : [];
    data.service = service;

    //启动项检查
    let start_item = {};
    start_item.state = info.start_itemstate ? "Y" : "N";
    start_item.key = info.start_itemkey?.length > 0 ? "Y" : "N";
    start_item.list = info.start_item ? info.start_item : [];
    data.start_item = start_item;

    //违规外联
    let netviolation = {};
    netviolation.state = info.netviolationstate ? "Y" : "N";
    netviolation.key = info.netviolationkey?.length > 0 ? "Y" : "N";
    netviolation.blockNoauth =
      info.blockType?.length > 0 && info.blockType.indexOf("blockNoauth") != -1
        ? "Y"
        : "N";
    netviolation.blockDualnet =
      info.blockType?.length > 0 && info.blockType.indexOf("blockDualnet") != -1
        ? "Y"
        : "N";
    netviolation.vioChkAddr = info.vioChkAddr;
    netviolation.vioChkAddrIPV6 = info.vioChkAddrIPV6;
    netviolation.vioReportmark = info.vioReportmark;
    netviolation.vioRealchk = info.vioRealchk?.length > 0 ? "Y" : "N";
    netviolation.vioMethod = info.vioMethod;
    let vioConfValIp = "";
    if (info.vioConfIp && info.vioConfIp.length > 0) {
      vioConfValIp = info.vioConfIp
        .map((v) => {
          return v.vioConfIp;
        })
        .join(",");
    }
    netviolation.vioConfIp = vioConfValIp; //可编辑table  转字符串
    netviolation.tipContent = info.tipContent;
    data.netviolation = netviolation;

    //端口开放
    let port_check = {};
    port_check.state = info.port_checkstate ? "Y" : "N";
    port_check.key = info.port_checkkey?.length > 0 ? "Y" : "N";
    port_check.confPort = info.confPort;
    port_check.denyPort = info.denyPort;
    data.port_check = port_check;

    //流量检测
    let flowlimit = {};
    flowlimit.state = info.flowlimitstate ? "Y" : "N";
    flowlimit.key = info.flowlimitkey?.length > 0 ? "Y" : "N";
    flowlimit.flowContrSw = info.flowContrSw?.length > 0 ? "Y" : "N";
    flowlimit.flowUpperLimit = info.flowUpperLimit;
    data.flowlimit = flowlimit;

    //硬件安装
    let hardware = {};
    hardware.state = info.hardwarestate ? "Y" : "N";
    hardware.key = info.hardwarekey?.length > 0 ? "Y" : "N";
    hardware.hardwareModem = info.hardwareModem?.length > 0 ? "1" : "0";
    hardware.hardwareWifi = info.hardwareWifi?.length > 0 ? "1" : "0";
    hardware.hardwareNetCard = info.hardwareNetCard?.length > 0 ? "1" : "0";
    hardware.hardwareProtableWifi =
      info.hardwareProtableWifi?.length > 0 ? "1" : "0";
    data.hardware = hardware;

    console.log(data);
    if (!len) {
      message.error(
        language("nac.mconfig.cfgpolicy.openatleastonesecuritychecktiem")
      );
      return false;
    }
    getRuleValues(data);
    closeDrawStatus();
  };

  const onAnchorChange = (e, link) => {
    e.preventDefault();
  };

  const titleTypeIcon = (key) => {
    let list = titleList.length < 1 ? titleArr : titleList;
    return list.indexOf(key) != -1 ? (
      <Query style={{ position: "absolute", top: "3px", fontSize: "15px" }} />
    ) : (
      ""
    );
  };

  const onTabsChange = (key) => {
    setTabKey(key);
  };

  return (
    <div>
      {/* 添加编辑抽屉 */}
      <DrawerForm
        layout="horizontal"
        width="751px"
        visible={drawStatus}
        formRef={formRef}
        title="配置规范内容"
        onVisibleChange={setDrawStatus}
        initialValues={{
          avrRepairAuto: "Y",
        }}
        drawerProps={{
          placement: "right",
          className: "ncfgpolicyfrom",
          closable: false,
          maskClosable: false,
          destroyOnClose: true,
          getContainer: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                titleTypeChange(false, false);
                setDrawStatus(false, false);
              }}
            />
          ),
          bodyStyle: {},
          style: {
            position: "absolute",
            display: drawStatus ? "block" : "none",
          },
        }}
        onFinish={async (values) => {
          titleTypeChange(false, []);
          contentSave(values);
        }}
      >
        <ProCard
          style={{
            marginLeft: 18,
            paddingRight: 15,
          }}
          ghost
        >
          <Alert
            banner
            message={
              "请滑动滑块来开启/关闭检测，关键项开启后，将与策略关联，开启入网限制。"
            }
            type="info"
            showIcon
          />
        </ProCard>
        <ProCard ghost>
          <div className="cfgtoptabbox">
            <Tabs
              onChange={onTabsChange}
              activeKey={tabKey}
              destroyInactiveTabPane={false}
              size="Large"
            >
              <Tabs.TabPane tab={"系统基线"} key="b1">
                <ProCard ghost className="buttomconbox">
                  <ProCard ghost colSpan={"136px"}>
                    <div
                      className="cfglefttabbox"
                      style={{ height: clientHeight - 3, overflowY: "auto" }}
                    >
                      <Anchor
                        affix={false}
                        showInkInFixed={false}
                        getContainer={() => document.getElementById("csy")}
                        onClick={onAnchorChange}
                      >
                        <Link
                          href="#a1"
                          title={
                            <div>
                              {titleTypeIcon("a1")}
                              <span style={{ marginLeft: "25px" }}>
                                {"来宾访客"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a2"
                          title={
                            <div>
                              {titleTypeIcon("a2")}
                              <span style={{ marginLeft: "25px" }}>
                                {"远程桌面"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a3"
                          title={
                            <div>
                              {titleTypeIcon("a3")}
                              <span style={{ marginLeft: "25px" }}>
                                {"自动播放"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a4"
                          title={
                            <div>
                              {titleTypeIcon("a4")}
                              <span style={{ marginLeft: "25px" }}>
                                {"防火墙检查"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a5"
                          title={
                            <div>
                              {titleTypeIcon("a5")}
                              <span style={{ marginLeft: "25px" }}>
                                {"弱口令检查"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a6"
                          title={
                            <div>
                              {titleTypeIcon("a6")}
                              <span style={{ marginLeft: "25px" }}>
                                {"地址获取"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a7"
                          title={
                            <div>
                              {titleTypeIcon("a7")}
                              <span style={{ marginLeft: "25px" }}>
                                {"共享资源"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a8"
                          title={
                            <div>
                              {titleTypeIcon("a8")}
                              <span style={{ marginLeft: "25px" }}>
                                {"终端运行时间"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a9"
                          title={
                            <div>
                              {titleTypeIcon("a9")}
                              <span style={{ marginLeft: "25px" }}>
                                {"自动更新"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a10"
                          title={
                            <div>
                              {titleTypeIcon("a10")}
                              <span style={{ marginLeft: "25px" }}>
                                {"系统账号"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a11"
                          title={
                            <div>
                              {titleTypeIcon("a11")}
                              <span style={{ marginLeft: "25px" }}>
                                {"计算机名称"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a12"
                          title={
                            <div>
                              {titleTypeIcon("a12")}
                              <span style={{ marginLeft: "25px" }}>
                                {"文件检查"}
                              </span>
                            </div>
                          }
                        />
                      </Anchor>
                    </div>
                  </ProCard>
                  <Divider
                    type="vertical"
                    style={{ height: clientHeight }}
                    className="divider"
                  />
                  <ProCard ghost colSpan={"calc(100% - 134px)"}>
                    <div
                      id="csy"
                      style={{
                        overflow: "auto",
                        height: clientHeight,
                        marginTop: "10px",
                        marginLeft: "18px",
                      }}
                    >
                      <div id="b1">
                        <div id="a1">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="gueststate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a1");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    来宾访客检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="guestkey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对外来设备进行检测
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a2">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="remotestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a2");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    远程桌面检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="remotekey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对远程桌面进行检测
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a3">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="autoplaystate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a3");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    自动播放检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="autoplaykey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对软件自动播放进行检测
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a4">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="firewallstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a4");
                                }}
                                addonAfter={
                                  <div className="aftercontent">防火墙检查</div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="firewallkey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对防火墙开启进行检测
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a5">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="weakpassstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a5");
                                }}
                                addonAfter={
                                  <div className="aftercontent">弱口令检查</div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="weakpasskey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对全部账号弱口令进行检测
                              </div>
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "只检查当前账号",
                                  },
                                ]}
                                name="weakFlag"
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a6">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="ipgetstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a6");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    地址获取检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="ipgetkey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对IP地址获取方式进行检测
                              </div>
                              <ProFormRadio.Group
                                options={[
                                  {
                                    value: "N",
                                    label: "静态获取IP",
                                  },
                                  {
                                    value: "Y",
                                    label: "动态获取IP",
                                  },
                                ]}
                                name="addrMode"
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a7">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="sharestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a7");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    共享资源检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="sharekey"
                              />
                            </div>
                            <div className="contentbox">
                              <CfgpolicyTable
                                nameKey="share"
                                headerTitle={
                                  <div className="desccolor">
                                    开启后将对共享资源进行检测
                                  </div>
                                }
                                columns={sharecolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a8">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="runtimestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a8");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    终端运行时间检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="runtimekey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div
                                className="desccolor"
                                style={{ marginBottom: "12px" }}
                              >
                                开启后将对终端运行时间进行检测
                              </div>
                              <Row>
                                <div
                                  style={{
                                    marginRight: "5px",
                                    height: "24px",
                                    lineHeight: "24px",
                                  }}
                                >
                                  终端运行时间上限为
                                </div>
                                <ProFormDigit
                                  width="90px"
                                  style={{
                                    marginTop: "5px",
                                    marginRight: "5px",
                                  }}
                                  name="upperTime"
                                  max={20}
                                  fieldProps={{
                                    precision: 0,
                                    controls: false,
                                  }}
                                />
                                <div
                                  style={{
                                    marginLeft: "5px",
                                    height: "24px",
                                    lineHeight: "24px",
                                  }}
                                >
                                  小时
                                </div>
                              </Row>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a9">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="autoupdatestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a9");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    自动更新检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="autoupdatekey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div
                                className="desccolor"
                                style={{ marginBottom: "12px" }}
                              >
                                开启后将对自动更新开启进行检测
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a10">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="sysaccstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a10");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    系统账号检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="sysacckey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div
                                className="desccolor"
                                style={{ marginBottom: "10px" }}
                              >
                                开启后将对系统账号进行检测
                              </div>
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "asset",
                                    label: "多账号检测",
                                  },
                                ]}
                                name="multiAcc"
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "asset",
                                    label: "冗余账号检测",
                                  },
                                ]}
                                name="redundancyAcc"
                              />
                              <Row>
                                <div
                                  style={{
                                    marginRight: "5px",
                                    height: "24px",
                                    lineHeight: "24px",
                                  }}
                                >
                                  账号
                                </div>
                                <ProFormDigit
                                  width="90px"
                                  style={{
                                    marginTop: "5px",
                                    marginRight: "5px",
                                  }}
                                  name="redundancyTime"
                                  max={20}
                                  fieldProps={{
                                    precision: 0,
                                    controls: false,
                                  }}
                                />
                                <div
                                  style={{
                                    marginLeft: "5px",
                                    height: "24px",
                                    lineHeight: "24px",
                                  }}
                                >
                                  小时不登录为冗余账号
                                </div>
                              </Row>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a11">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="computernamestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a11");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    计算机名称检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="computernamekey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div
                                className="desccolor"
                                style={{ marginBottom: "10px" }}
                              >
                                开启后将对系统账号进行检测
                              </div>
                              <Row>
                                <div
                                  style={{
                                    marginRight: "5px",
                                    height: "24px",
                                    lineHeight: "24px",
                                  }}
                                >
                                  匹配规则
                                </div>
                                <ProFormText
                                  width="90px"
                                  style={{
                                    marginTop: "5px",
                                    marginRight: "5px",
                                  }}
                                  name="matchingRules"
                                />
                                <div
                                  style={{
                                    marginLeft: "5px",
                                    height: "24px",
                                    lineHeight: "24px",
                                  }}
                                >
                                  (*代表通配)
                                </div>
                              </Row>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a12">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="filescanstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a12");
                                }}
                                addonAfter={
                                  <div className="aftercontent">文件检查</div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="filescankey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对共享资源进行检测
                              </div>
                              <CfgpolicyTable
                                nameKey="filescan"
                                headerTitle={
                                  <div className="itembuttmo0">
                                    <ProFormCheckbox.Group
                                      options={[
                                        {
                                          value: "Y",
                                          label:
                                            "必须存在的文件,满足其中一项即可",
                                        },
                                      ]}
                                      name="filescanxor"
                                    />
                                  </div>
                                }
                                columns={filescancolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                      </div>
                    </div>
                  </ProCard>
                </ProCard>
              </Tabs.TabPane>
              <Tabs.TabPane tab={"系统加固"} key="b2">
                <ProCard ghost className="buttomconbox">
                  <ProCard ghost colSpan={"136px"}>
                    <div
                      className="cfglefttabbox"
                      style={{ height: clientHeight - 3, overflowY: "auto" }}
                    >
                      <Anchor
                        affix={false}
                        showInkInFixed={false}
                        getContainer={() => document.getElementById("csy1")}
                        onClick={onAnchorChange}
                      >
                        <Link
                          href="#a13"
                          title={
                            <div>
                              {titleTypeIcon("a13")}
                              <span style={{ marginLeft: "25px" }}>
                                {"系统漏洞"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a14"
                          title={
                            <div>
                              {titleTypeIcon("a14")}
                              <span style={{ marginLeft: "25px" }}>
                                {"密码策略"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a15"
                          title={
                            <div>
                              {titleTypeIcon("a15")}
                              <span style={{ marginLeft: "25px" }}>
                                {"AD域检查"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a16"
                          title={
                            <div>
                              {titleTypeIcon("a16")}
                              <span style={{ marginLeft: "25px" }}>
                                {"USB外设检查"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a17"
                          title={
                            <div>
                              {titleTypeIcon("a17")}
                              <span style={{ marginLeft: "25px" }}>
                                {"屏幕保护"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a18"
                          title={
                            <div>
                              {titleTypeIcon("a18")}
                              <span style={{ marginLeft: "25px" }}>
                                {"操作系统"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a19"
                          title={
                            <div>
                              {titleTypeIcon("a19")}
                              <span style={{ marginLeft: "25px" }}>
                                {"浏览器主页"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a20"
                          title={
                            <div>
                              {titleTypeIcon("a20")}
                              <span style={{ marginLeft: "25px" }}>
                                {"浏览器代理"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a21"
                          title={
                            <div>
                              {titleTypeIcon("a21")}
                              <span style={{ marginLeft: "25px" }}>
                                {"桌管版本"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a22"
                          title={
                            <div>
                              {titleTypeIcon("a22")}
                              <span style={{ marginLeft: "25px" }}>
                                {"桌管策略"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a23"
                          title={
                            <div>
                              {titleTypeIcon("a23")}
                              <span style={{ marginLeft: "25px" }}>
                                {"杀毒软件"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a24"
                          title={
                            <div>
                              {titleTypeIcon("a24")}
                              <span style={{ marginLeft: "25px" }}>
                                {"注册表检查"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a25"
                          title={
                            <div>
                              {titleTypeIcon("a25")}
                              <span style={{ marginLeft: "25px" }}>
                                {"Office正版"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a26"
                          title={
                            <div>
                              {titleTypeIcon("a26")}
                              <span style={{ marginLeft: "25px" }}>
                                {"IE浏览器"}
                              </span>
                            </div>
                          }
                        />
                      </Anchor>
                    </div>
                  </ProCard>
                  <Divider
                    type="vertical"
                    style={{ height: clientHeight }}
                    className="divider"
                  />
                  <ProCard ghost colSpan={"calc(100% - 134px)"}>
                    <div
                      id="csy1"
                      style={{
                        overflow: "auto",
                        height: clientHeight,
                        marginTop: "10px",
                        marginLeft: "18px",
                      }}
                    >
                      <div id="b2">
                        <div id="a13">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="sysflawstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a13");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    系统漏洞检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="sysflawkey"
                              />
                            </div>
                            <div className="contentbox">
                              <CfgpolicyTable
                                nameKey="sysflawList"
                                headerTitle={
                                  <div className="desccolor">
                                    开启后将对系统漏洞进行检测
                                  </div>
                                }
                                columns={fromcolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a14">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="pwdstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a14");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    密码策略检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="pwdkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对系统漏洞进行检测
                              </div>
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "启用密码必须符合复杂性要求检测",
                                  },
                                ]}
                                name="complexity"
                              />
                              <div>
                                <Row>
                                  <div
                                    style={{
                                      marginRight: "5px",
                                      height: "24px",
                                      lineHeight: "24px",
                                      width: "122px",
                                      textAlign: "right",
                                    }}
                                  >
                                    密码长度最小值
                                  </div>
                                  <ProFormDigit
                                    width="90px"
                                    style={{
                                      marginTop: "5px",
                                      marginRight: "5px",
                                    }}
                                    name="legthMin"
                                    max={20}
                                    fieldProps={{
                                      precision: 0,
                                      controls: false,
                                    }}
                                  />
                                  <div
                                    style={{
                                      marginLeft: "5px",
                                      height: "24px",
                                      lineHeight: "24px",
                                    }}
                                  >
                                    个字符(0不限制)
                                  </div>
                                </Row>
                                <Row>
                                  <div
                                    style={{
                                      marginRight: "5px",
                                      height: "24px",
                                      lineHeight: "24px",
                                      width: "122px",
                                      textAlign: "right",
                                    }}
                                  >
                                    密码最长存留期
                                  </div>
                                  <ProFormDigit
                                    width="90px"
                                    style={{
                                      marginTop: "5px",
                                      marginRight: "5px",
                                    }}
                                    name="saveMax"
                                    max={20}
                                    fieldProps={{
                                      precision: 0,
                                      controls: false,
                                    }}
                                  />
                                  <div
                                    style={{
                                      marginLeft: "5px",
                                      height: "24px",
                                      lineHeight: "24px",
                                    }}
                                  >
                                    天
                                  </div>
                                </Row>
                                <Row>
                                  <div
                                    style={{
                                      marginRight: "5px",
                                      height: "24px",
                                      lineHeight: "24px",
                                      width: "122px",
                                      textAlign: "right",
                                    }}
                                  >
                                    密码最短存留期
                                  </div>
                                  <ProFormDigit
                                    width="90px"
                                    style={{
                                      marginTop: "5px",
                                      marginRight: "5px",
                                    }}
                                    name="saveMin"
                                    max={20}
                                    fieldProps={{
                                      precision: 0,
                                      controls: false,
                                    }}
                                  />
                                  <div
                                    style={{
                                      marginLeft: "5px",
                                      height: "24px",
                                      lineHeight: "24px",
                                    }}
                                  >
                                    天(最短留存期不能大于等于最长留存期)
                                  </div>
                                </Row>
                                <Row>
                                  <div
                                    style={{
                                      marginRight: "5px",
                                      height: "24px",
                                      lineHeight: "24px",
                                      width: "122px",
                                      textAlign: "right",
                                    }}
                                  >
                                    密码历史记录
                                  </div>
                                  <ProFormDigit
                                    width="90px"
                                    style={{
                                      marginTop: "5px",
                                      marginRight: "5px",
                                    }}
                                    name="historyNum"
                                    max={20}
                                    fieldProps={{
                                      precision: 0,
                                      controls: false,
                                    }}
                                  />
                                  <div
                                    style={{
                                      marginLeft: "5px",
                                      height: "24px",
                                      lineHeight: "24px",
                                    }}
                                  >
                                    次
                                  </div>
                                </Row>
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a15">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="check_adloginstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a15");
                                }}
                                addonAfter={
                                  <div className="aftercontent">AD域检测</div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="check_adloginkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对客户端是否登录指定的AD域进行检测
                              </div>
                              <div className="itembuttmo0 ">
                                <ProFormRadio.Group
                                  name="check"
                                  fieldProps={{
                                    buttonStyle: "solid",
                                  }}
                                  initialValue={0}
                                  options={[
                                    {
                                      value: "add",
                                      label: "终端是否加域",
                                    },
                                    {
                                      value: "login",
                                      label:
                                        "终端是否登录域用户(同时检查是否加域)",
                                    },
                                  ]}
                                />
                              </div>
                              <CfgpolicyTable
                                nameKey="check_adloginList"
                                columns={check_adlogincolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a16">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="peripheralstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a16");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    USB外设检查
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="peripheralkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对USB外设进行检查
                              </div>
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label:
                                      "开启存储设备检测(U盘、移动硬盘、光驱)",
                                  },
                                ]}
                                name="storageChk"
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "开启输入设备检测(鼠标、键盘)",
                                  },
                                ]}
                                name="inputChk"
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "开启无线网卡检测(USB无线网卡)",
                                  },
                                ]}
                                name="wirelessNetCard"
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "开启移动终端检测(手机、iPad)",
                                  },
                                ]}
                                name="mobileDeivce"
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a17">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="screenstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a17");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    屏幕保护检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="screenkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对屏幕保护进行检测
                              </div>
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "使用默认屏保",
                                  },
                                ]}
                                name="screenComp"
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "屏保启用时间小于",
                                  },
                                ]}
                                name="screensaver"
                                addonAfter={
                                  <div
                                    className="aftercontent itembuttmo0"
                                    style={{ marginLeft: "-12px" }}
                                  >
                                    <Row>
                                      <ProFormDigit
                                        width="90px"
                                        style={{
                                          marginTop: "5px",
                                          marginRight: "5px",
                                        }}
                                        name="screenRecTime"
                                        max={60}
                                        fieldProps={{
                                          precision: 0,
                                          controls: false,
                                        }}
                                      />
                                      <div
                                        style={{
                                          marginLeft: "5px",
                                          height: "24px",
                                          lineHeight: "24px",
                                        }}
                                      >
                                        分钟
                                      </div>
                                    </Row>
                                  </div>
                                }
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a18">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="OSstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a18");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    操作系统检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="OSkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对系统漏洞进行检测
                              </div>
                              <div>
                                <ProFormCheckbox.Group
                                  options={[
                                    {
                                      value: "Y",
                                      label: "多操作系统检查",
                                    },
                                  ]}
                                  name="multiOS"
                                />
                                <ProFormCheckbox.Group
                                  options={[
                                    {
                                      value: "Y",
                                      label: "虚拟操作系统检查",
                                    },
                                  ]}
                                  name="virtualOS"
                                />
                                <ProFormCheckbox.Group
                                  options={[
                                    {
                                      value: "Y",
                                      label: "操作系统版本检查",
                                    },
                                  ]}
                                  name="OSVersion"
                                />
                              </div>
                              <CfgpolicyTable
                                nameKey="OS"
                                columns={oscolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a19">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="home_pagestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a19");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    浏览器主页检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="home_pagekey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <CfgpolicyTable
                                nameKey="home_page"
                                headerTitle={
                                  <div className="desccolor">
                                    开启后将对浏览器主页检测进行检测,可配置多个URL,满足一项即可
                                  </div>
                                }
                                columns={home_pagecolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a20">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="proxystate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a20");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    浏览器代理检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="proxykey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对浏览器代理进行检测,列表中配置白名单
                              </div>
                              <div>
                                <ProFormCheckbox.Group
                                  options={[
                                    {
                                      value: "Y",
                                      label: "开启IE浏览器代理检测",
                                    },
                                  ]}
                                  name="browserProxyIE"
                                />
                                <ProFormCheckbox.Group
                                  options={[
                                    {
                                      value: "Y",
                                      label: "开启火狐浏览器代理检测",
                                    },
                                  ]}
                                  name="browserProxyFirefox"
                                />
                                <ProFormCheckbox.Group
                                  options={[
                                    {
                                      value: "Y",
                                      label: "开启谷歌浏览器代理检测",
                                    },
                                  ]}
                                  name="browserProxyChrome"
                                />
                              </div>
                              <CfgpolicyTable
                                nameKey="proxy"
                                columns={proxycolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a21">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="edp_versionstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a21");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    桌管版本检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="edp_versionkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对桌管版本进行检测
                              </div>
                              <div className="itembuttmo0">
                                <ProFormText
                                  label={"EDP版本号"}
                                  name="edpVersion"
                                  width={"240px"}
                                />
                                <ProFormText
                                  label={"修复地址"}
                                  name="edpUrl"
                                  width={"240px"}
                                />
                                <ProFormText
                                  label={"描述"}
                                  name="edpDesc"
                                  width={"240px"}
                                />
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a22">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="check_edppolicystate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a22");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    卓管策略检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="check_edppolicykey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <CfgpolicyTable
                                nameKey="check_edppolicy"
                                headerTitle={
                                  <div className="desccolor">
                                    开启后将对卓管策略进行检测
                                  </div>
                                }
                                columns={check_edppolicycolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a23">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="antivirusstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a23");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    杀毒软件检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="antiviruskey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对杀毒软件进行检测
                              </div>
                              <div className="itembuttmo0">
                                <ProFormRadio.Group
                                  name="avrRepairAuto"
                                  fieldProps={{
                                    buttonStyle: "solid",
                                  }}
                                  initialValue={0}
                                  options={[
                                    {
                                      value: "Y",
                                      label: "自动修复",
                                    },
                                    {
                                      value: "N",
                                      label: "手动修复",
                                    },
                                  ]}
                                />
                              </div>

                              <CfgpolicyTable
                                nameKey="antivirus"
                                columns={antivirusColumn}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a24">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="registrystate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a24");
                                }}
                                addonAfter={
                                  <div className="aftercontent">注册表检查</div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="registrykey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <CfgpolicyTable
                                nameKey="registry"
                                headerTitle={
                                  <div className="desccolor">
                                    开启后将对列表中的注册表进行检查
                                  </div>
                                }
                                columns={registrycolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a25">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="officestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a25");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    Office正版检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="officekey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对Office正版进行检测
                              </div>
                              <EditTable
                                name={"office_allow"}
                                label={"允许的序列号"}
                                fromcolumns={office_allowcolumns}
                                formRef={formRef}
                                required={false}
                                maxLength={false}
                              />
                              <EditTable
                                name={"office_forbid"}
                                label={"禁止的序列号"}
                                fromcolumns={office_forbidcolumns}
                                formRef={formRef}
                                required={false}
                                maxLength={false}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a26">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="IEBrowserstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a26");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    IE浏览器检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="IEBrowserkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对IE浏览器进行检测
                              </div>
                              <div className="labelcenter">
                                <ProFormRadio.Group
                                  name="ieVersion"
                                  fieldProps={{
                                    buttonStyle: "solid",
                                  }}
                                  width="226px"
                                  label={"IE版本最低限制"}
                                  initialValue={0}
                                  options={[
                                    {
                                      value: "IE6",
                                      label: "IE6",
                                    },
                                    {
                                      value: "IE7",
                                      label: "IE7",
                                    },
                                    {
                                      value: "IE8",
                                      label: "IE8",
                                    },
                                    {
                                      value: "IE9",
                                      label: "IE9",
                                    },
                                    {
                                      value: "IE10",
                                      label: "IE10",
                                    },
                                    {
                                      value: "IE11",
                                      label: "IE11",
                                    },
                                  ]}
                                />
                              </div>
                              <EditTable
                                name={"iePatchNum"}
                                label={"浏览器补丁检测"}
                                fromcolumns={iePatchNumcolumns}
                                formRef={formRef}
                                required={false}
                                maxLength={false}
                              />
                            </div>
                          </ProCard>
                        </div>
                      </div>
                    </div>
                  </ProCard>
                </ProCard>
              </Tabs.TabPane>
              <Tabs.TabPane tab={"应用安全"} key="b3">
                <ProCard ghost className="buttomconbox">
                  <ProCard ghost colSpan={"136px"}>
                    <div
                      className="cfglefttabbox"
                      style={{ height: clientHeight - 3, overflowY: "auto" }}
                    >
                      <Anchor
                        affix={false}
                        showInkInFixed={false}
                        getContainer={() => document.getElementById("csy2")}
                        onClick={onAnchorChange}
                      >
                        <Link
                          href="#a27"
                          title={
                            <div>
                              {titleTypeIcon("a27")}
                              <span style={{ marginLeft: "25px" }}>
                                {"软件安装"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a28"
                          title={
                            <div>
                              {titleTypeIcon("a28")}
                              <span style={{ marginLeft: "25px" }}>
                                {"进程运行"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a29"
                          title={
                            <div>
                              {titleTypeIcon("a29")}
                              <span style={{ marginLeft: "25px" }}>
                                {"服务运行"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a30"
                          title={
                            <div>
                              {titleTypeIcon("a30")}
                              <span style={{ marginLeft: "25px" }}>
                                {"启动项检查"}
                              </span>
                            </div>
                          }
                        />
                      </Anchor>
                    </div>
                  </ProCard>
                  <Divider
                    type="vertical"
                    style={{ height: clientHeight }}
                    className="divider"
                  />
                  <ProCard ghost colSpan={"calc(100% - 134px)"}>
                    <div
                      id="csy2"
                      style={{
                        overflow: "auto",
                        height: clientHeight,
                        marginTop: "10px",
                        marginLeft: "18px",
                      }}
                    >
                      <div id="b3">
                        <div id="a27">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="soft_installstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a27");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    软件安装检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="soft_installkey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对软件安装进行检测
                              </div>
                              <CfgpolicyTable
                                nameKey="soft_install"
                                headerTitle={
                                  <div className="itembuttmo0">
                                    <ProFormCheckbox.Group
                                      options={[
                                        {
                                          value: "Y",
                                          label:
                                            "必须安装的软件,满足其中一项即可",
                                        },
                                      ]}
                                      name="soft_installxor"
                                    />
                                  </div>
                                }
                                columns={soft_installcolumn}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a28">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="processstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a28");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    进程运行检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="processkey"
                              />
                            </div>
                            <div className="contentbox">
                              <div className="desccolor">
                                开启后将对进程运行进行检测
                              </div>
                              <CfgpolicyTable
                                nameKey="process"
                                headerTitle={
                                  <div className="itembuttmo0">
                                    <ProFormCheckbox.Group
                                      options={[
                                        {
                                          value: "Y",
                                          label:
                                            "必须运行的进程,满足其中一项即可",
                                        },
                                      ]}
                                      name="processxor"
                                    />
                                  </div>
                                }
                                columns={processcolumn}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a29">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="servicestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a29");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    服务运行检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="servicekey"
                              />
                            </div>
                            <div className="contentbox">
                              <CfgpolicyTable
                                nameKey="service"
                                headerTitle={
                                  <div className="desccolor">
                                    开启后将对服务运行进行检测
                                  </div>
                                }
                                columns={servicecolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                        <div id="a30">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="start_itemstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a30");
                                }}
                                addonAfter={
                                  <div className="aftercontent">启用项检查</div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="start_itemkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对以下禁止启动项进行检测
                              </div>
                              <CfgpolicyTable
                                nameKey="start_item"
                                headerTitle={
                                  <div className="desccolor">
                                    开启后将对以下禁止启动项进行检测
                                  </div>
                                }
                                columns={start_itemcolumns}
                                scrollHeight={scrollHeight}
                                formRef={formRef}
                                deleteClick={deleteClick}
                                setModalType={setModalType}
                                getAntivirusModal={getAntivirusModal}
                                mod={mod}
                              />
                            </div>
                          </ProCard>
                        </div>
                      </div>
                    </div>
                  </ProCard>
                </ProCard>
              </Tabs.TabPane>
              <Tabs.TabPane tab={"网络防护"} key="b4">
                <ProCard ghost className="buttomconbox">
                  <ProCard ghost colSpan={"136px"}>
                    <div
                      className="cfglefttabbox"
                      style={{ height: clientHeight - 3, overflowY: "auto" }}
                    >
                      <Anchor
                        affix={false}
                        showInkInFixed={false}
                        getContainer={() => document.getElementById("csy3")}
                        onClick={onAnchorChange}
                      >
                        <Link
                          href="#a31"
                          title={
                            <div>
                              {titleTypeIcon("a31")}
                              <span style={{ marginLeft: "25px" }}>
                                {"违规外联"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a32"
                          title={
                            <div>
                              {titleTypeIcon("a32")}
                              <span style={{ marginLeft: "25px" }}>
                                {"端口开放"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a33"
                          title={
                            <div>
                              {titleTypeIcon("a33")}
                              <span style={{ marginLeft: "25px" }}>
                                {"流量检测"}
                              </span>
                            </div>
                          }
                        />
                        <Link
                          href="#a34"
                          title={
                            <div>
                              {titleTypeIcon("a34")}
                              <span style={{ marginLeft: "25px" }}>
                                {"硬件安装"}
                              </span>
                            </div>
                          }
                        />
                      </Anchor>
                    </div>
                  </ProCard>
                  <Divider
                    type="vertical"
                    style={{ height: clientHeight }}
                    className="divider"
                  />
                  <ProCard ghost colSpan={"calc(100% - 134px)"}>
                    <div
                      id="csy3"
                      style={{
                        overflow: "auto",
                        height: clientHeight,
                        marginTop: "10px",
                        marginLeft: "18px",
                      }}
                    >
                      <div id="b4">
                        <div id="a31">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="netviolationstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a31");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    违规外联检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="netviolationkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对违规外联进行检测
                              </div>
                              <ProFormText
                                width={"382px"}
                                label={"检测地址IPv4"}
                                name="vioChkAddr"
                              />
                              <ProFormText
                                width={"382px"}
                                label={"检测地址IPv6"}
                                name="vioChkAddrIPV6"
                              />
                              <ProFormText
                                width={"382px"}
                                label={"上报标识"}
                                name="vioReportmark"
                              />
                              <ProFormCheckbox.Group
                                label={"实时检测"}
                                options={[
                                  {
                                    value: "Y",
                                    label: "开启实时检测",
                                  },
                                ]}
                                name="vioRealchk"
                              />
                              <ProFormRadio.Group
                                name="vioMethod"
                                fieldProps={{
                                  buttonStyle: "solid",
                                }}
                                width="226px"
                                label={"检测方式"}
                                initialValue={0}
                                options={[
                                  {
                                    value: "Y",
                                    label: "合规IP",
                                  },
                                  {
                                    value: "N",
                                    label: "违规IP",
                                  },
                                ]}
                              />
                              <EditTable
                                name={"vioConfIp"}
                                label={"合规IP"}
                                fromcolumns={vioConfIpcolumns}
                                formRef={formRef}
                                required={false}
                                maxLength={false}
                              />
                              <ProFormCheckbox.Group
                                label={"是否断网"}
                                options={[
                                  {
                                    value: "blockNoauth",
                                    label: "非授权违规断网",
                                  },
                                  {
                                    value: "blockDualnet",
                                    label: "双网互联违规断网",
                                  },
                                ]}
                                name="blockType"
                              />
                              <div className="itembuttmo0">
                                <ProFormTextArea
                                  name={"tipContent"}
                                  width={"382px"}
                                  label={"断网提示"}
                                  disabled
                                  style={{ height: "52px" }}
                                  height={"52px"}
                                  placeholder={
                                    "您好，由于您的电脑存在违规行为，网络已被管理员停止使用，请联系管理员恢复网络"
                                  }
                                />
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a32">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="port_checkstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a32");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    端口开放检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="port_checkkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对端口开放进行检测
                              </div>
                              <ProFormText
                                width={"382px"}
                                rules={
                                  [
                                    // {
                                    //   pattern: regPortList.portMult.regex,
                                    //   message: regPortList.portMult.alertText,
                                    // },
                                  ]
                                }
                                label={"禁止开启端口"}
                                name="denyPort"
                              />
                              <div className="itembuttmo0">
                                <ProFormText
                                  width={"382px"}
                                  rules={
                                    [
                                      // {
                                      //   pattern: regPortList.portMult.regex,
                                      //   message: regPortList.portMult.alertText,
                                      // },
                                    ]
                                  }
                                  label={"必须开启端口"}
                                  name="confPort"
                                />
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a33">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="flowlimitstate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a33");
                                }}
                                addonAfter={
                                  <div className="aftercontent">流量检测</div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="flowlimitkey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对流量进行检测
                              </div>
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "开启流量检测",
                                  },
                                ]}
                                name="flowContrSw"
                              />
                              <div className="itembuttmo0">
                                <ProFormText
                                  label={"流量上限"}
                                  name="flowUpperLimit"
                                  addonAfter={<div>Kbps</div>}
                                />
                              </div>
                            </div>
                          </ProCard>
                        </div>
                        <div id="a34">
                          <ProCard
                            ghost
                            className="datatenanceCard switchsizebox"
                          >
                            <div className="betweenbox">
                              <ProFormSwitch
                                fieldProps={{
                                  size: "small",
                                }}
                                name="hardwarestate"
                                onChange={(e) => {
                                  titleTypeChange(e, "a34");
                                }}
                                addonAfter={
                                  <div className="aftercontent">
                                    硬件安装检测
                                  </div>
                                }
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "Y",
                                    label: "设为关键项",
                                  },
                                ]}
                                name="hardwarekey"
                              />
                            </div>
                            <div className="contentbox fromtextbox">
                              <div className="desccolor">
                                开启后将对硬件安装进行检测
                              </div>
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "1",
                                    label: "无线网卡检测",
                                  },
                                ]}
                                name="hardwareWifi"
                              />
                              <ProFormCheckbox.Group
                                options={[
                                  {
                                    value: "1",
                                    label: "多网卡检测",
                                  },
                                ]}
                                name="hardwareNetCard"
                              />
                              <div className="itembuttmo0">
                                <ProFormCheckbox.Group
                                  options={[
                                    {
                                      value: "1",
                                      label: "随身WIFI检测",
                                    },
                                  ]}
                                  name="hardwareProtableWifi"
                                />
                              </div>
                            </div>
                          </ProCard>
                        </div>
                      </div>
                    </div>
                  </ProCard>
                </ProCard>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </ProCard>
      </DrawerForm>
      <ModalForm
        {...modalFormLayout}
        formRef={addFormRef}
        title={language("project.operate")}
        visible={antivirusModalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            closeAntivirusModal();
          },
        }}
        onVisibleChange={setAntivirusModalStatus}
        submitTimeout={2000}
        onFinish={async (values, a) => {
          save(values, modalType);
        }}
      >
        <ProFormText width={"226px"} hidden={true} name="id" />

        {/* 共享资源 */}
        {modalType == "share" ? (
          <>
            <NameText
              width={"226px"}
              label={"共享名"}
              name="shareName"
              required={true}
              max={128}
            />
            <NotesText
              width={"226px"}
              max="64"
              name="descrip"
              type="text"
              label={"描述"}
            />
          </>
        ) : (
          <></>
        )}

        {/* 文件检查 filescan */}
        {modalType == "filescan" ? (
          <>
            <ProFormRadio.Group
              name="deny"
              initialValue={"Y"}
              label={"文件存在"}
              width={"226px"}
              onChange={(checked) => {
                setFilescanDenyType(checked.target.value);
              }}
              fieldProps={{
                buttonStyle: "solid",
                optionType: "button",
              }}
              options={[
                {
                  label: "禁止文件",
                  value: "Y",
                },
                {
                  label: "必须存在文件",
                  value: "N",
                },
              ]}
            />
            <ProFormText
              width={"226px"}
              rules={[
                {
                  required: true,
                },
              ]}
              name="filepath"
              label={"文件路径"}
            />
            <ProFormText width={"226px"} name="filemd5" label={"文件MD5"} />
            <ProFormText width={"226px"} name="display" label={"安检显示"} />
            <NotesText
              width={"226px"}
              max="64"
              name="descrip"
              type="text"
              label={"描述"}
            />
            <ProFormText width={"226px"} name="repairTip" label={"修复提示"} />
            {filescanDenyType == "Y" ? (
              <></>
            ) : (
              <ProFormText
                width={"226px"}
                name="repairArg"
                label={"修复链接"}
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: regList.url.regex,
                    message: regList.url.alertText,
                  },
                ]}
              />
            )}
          </>
        ) : (
          <></>
        )}

        {/* AD域 check_adlogin */}
        {modalType == "check_adlogin" ? (
          <>
            <ProFormText
              width={"226px"}
              rules={[
                {
                  required: true,
                },
              ]}
              name="adDomain"
              label={"AD域"}
            />
            <NotesText
              width={"226px"}
              max="64"
              name="descrip"
              type="text"
              label={"描述"}
            />
          </>
        ) : (
          <></>
        )}

        {/* 浏览器主页 home_page */}
        {modalType == "home_page" ? (
          <>
            <ProFormText
              width={"226px"}
              rules={[
                {
                  required: true,
                },
              ]}
              name="browserUrl"
              label={"URL地址"}
            />
            <NotesText
              width={"226px"}
              max="64"
              name="descrip"
              type="text"
              label={"描述"}
            />
          </>
        ) : (
          <></>
        )}
        {/* 浏览器代理 proxy */}
        {modalType == "proxy" ? (
          <>
            <ProFormText
              width={"226px"}
              rules={[
                {
                  required: true,
                },
                {
                  pattern: regIpList.ip.regex,
                  message: regIpList.ip.alertText,
                },
              ]}
              name="proxyIp"
              label={"代理IP"}
            />
            <ProFormText
              width={"226px"}
              rules={[
                {
                  required: true,
                },
                // {
                //   pattern: regPortList.portMult.regex,
                //   message: regPortList.portMult.alertText,
                // },
              ]}
              name="proxyPort"
              label={"代理端口"}
            />
            <NotesText
              width={"226px"}
              max="64"
              name="descrip"
              type="text"
              label={"描述"}
            />
          </>
        ) : (
          <></>
        )}

        {/* 卓管策略检测 check_edppolicy */}
        {modalType == "check_edppolicy" ? (
          <>
            <ProFormRadio.Group
              name="deny"
              initialValue={"N"}
              label={"启动类别"}
              width={"226px"}
              fieldProps={{
                buttonStyle: "solid",
                optionType: "button",
              }}
              options={[
                {
                  label: "禁止启动",
                  value: "Y",
                },
                {
                  label: "必须启动",
                  value: "N",
                },
              ]}
            />
            <ProFormText
              width={"226px"}
              rules={[
                {
                  required: true,
                },
              ]}
              name="edpName"
              label={"EDP策略名称"}
            />
            <NotesText
              width={"226px"}
              max="64"
              name="descrip"
              type="text"
              label={"描述"}
            />
            <ProFormText width={"226px"} name="display" label={"安检显示"} />
            <ProFormText
              width={"226px"}
              name="repairTip"
              rules={[
                {
                  required: true,
                },
              ]}
              label={"修复提示"}
            />
          </>
        ) : (
          <></>
        )}

        {/* 杀毒软件 antivirus */}
        {modalType == "antivirus" ? (
          <>
            <ProFormSelect
              width={"226px"}
              options={softList}
              name="type"
              label={language("nac.mconfig.cfgpolicy.antivirusmanufacturer")}
              fieldProps={{
                fieldNames: { label: "softname", value: "softname" },
              }}
            />
            <NotesText
              width={"226px"}
              max="63"
              name="name"
              type="text"
              label={language("nac.mconfig.cfgpolicy.antivirusname")}
            />
            <NotesText
              width={"226px"}
            
              max="64"
              name="version"
              type="text"
              label={language("nac.mconfig.cfgpolicy.softwareversion")}
            />
            <NotesText
              width={"226px"}
              max="64"
              name="virusVers"
              type="text"
              label={language(
                "nac.mconfig.cfgpolicy.viruslibraryversionnumber"
              )}
            />
            <Row style={{ marginLeft: "40px" }}>
              <ProFormDigit
                label={language(
                  "nac.mconfig.cfgpolicy.viruslibraryupdateperiod"
                )}
                width="226px"
                style={{ marginTop: "5px" }}
                name="virusDays"
                max={30}
                min={1}
                fieldProps={{
                  precision: 0,
                  controls: false,
                }}
              />
              <span style={{ marginLeft: "5px", lineHeight: "32px" }}>
                {language("nac.mconfig.cfgpolicy.day")}
              </span>
            </Row>
            <ProFormText
              width={"226px"}
              rules={[
                {
                  pattern: regList.url.regex,
                  message: regList.url.alertText,
                },
              ]}
              name="virusDataUpdate"
              label={language(
                "nac.mconfig.cfgpolicy.viruslibraryupdateaddress"
              )}
            />
            <ProFormText
              width={"226px"}
              tooltip={language(
                "nac.mconfig.cfgpolicy.configsoftwaredownloadlink"
              )}
              rules={[
                {
                  required: true,
                  pattern: regList.url.regex,
                  message: regList.url.alertText,
                },
              ]}
              name="repairArg"
              label={language("nac.mconfig.cfgpolicy.fixparameters")}
            />
          </>
        ) : (
          <></>
        )}

        {/* 注册表检查 registry */}
        {modalType == "registry" ? (
          <>
            <ProFormText
              width={"226px"}
              rules={[
                {
                  required: true,
                },
              ]}
              name="regeditName"
              label={"名称"}
            />
            <ProFormText
              width={"226px"}
              name="regeditPath"
              rules={[
                {
                  required: true,
                },
              ]}
              label={"注册表路径"}
            />
            <ProFormText
              width={"226px"}
              name="regeditData"
              rules={[
                {
                  required: true,
                },
              ]}
              label={"数据"}
            />
          </>
        ) : (
          <></>
        )}
        {modalType == "OS" ? (
          <>
            <ProFormSelect
              width={"226px"}
              options={winTypeList}
              name="OSVerInfo"
              label={language("nac.mconfig.cfgpolicy.operatingsystemversion")}
              fieldProps={{
                fieldNames: { label: "name" },
              }}
            />
            <ProFormSelect
              width={"226px"}
              options={OsCheckreqList}
              name="OSCheckreqValue"
              label={language("nac.mconfig.cfgpolicy.versionrequirements")}
            />
          </>
        ) : (
          <></>
        )}
        {modalType == "sysflaw" ? (
          <>
            <NotesText
              width={"226px"}
              required={true}
              rules={[
                // {
                //   pattern: regList.cnengAndnumEngsomePunc1.regex,
                //   message: regList.cnengAndnumEngsomePunc1.alertText,
                // },
                {
                  pattern: /^[a-zA-Z0-9-\u4e00-\u9fa5]+$/,
                  message: language("project.chinesenglishnum"),
                },
              ]}
              max="255"
              name="patchname"
              type="text"
              label={language("nac.mconfig.cfgpolicy.patchname")}
            />
            <NotesText
              width={"226px"}
              required={true}
              rules={[
                // {
                //   pattern: regList.cnengAndnumEngsomePunc1.regex,
                //   message: regList.cnengAndnumEngsomePunc1.alertText,
                // },
                {
                  pattern: /^[a-zA-Z0-9-\u4e00-\u9fa5]+$/,
                  message: language("project.chinesenglishnum"),
                },
              ]}
              max="255"
              name="patchnum"
              type="text"
              label={language("nac.mconfig.cfgpolicy.parchnumber")}
            />
            {osType == "chs" ? (
              <div>
                <ProFormSelect
                  width={"226px"}
                  options={architectureList}
                  name="architecture"
                  rules={[{ required: true }]}
                  label={language(
                    "nac.mconfig.cfgpolicy.processorArchitecture"
                  )}
                />
                <NotesText
                  width={"226px"}
                  required={true}
                  max="255"
                  name="softname"
                  type="text"
                  label={language("nac.mconfig.cfgpolicy.softwarename")}
                />
                <Row style={{ marginLeft: "56px" }}>
                  <div className="checkverbox">
                    <ProFormSelect
                      width={"90px"}
                      options={checkverList}
                      name="checkver"
                      rules={[{ required: true }]}
                      label={language("nac.mconfig.cfgpolicy.softwareversion")}
                    />
                  </div>
                  <div className="softverbox">
                    <NotesText
                      width={"80px"}
                      max="64"
                      name="softver"
                      type="text"
                      label={language("nac.mconfig.cfgpolicy.versionnumber")}
                    />
                  </div>
                </Row>
              </div>
            ) : (
              <div>
                <ProFormSelect
                  width={"226px"}
                  options={sysOsverList}
                  name="sys_osver"
                  label={language(
                    "nac.mconfig.cfgpolicy.operatingsystemversion"
                  )}
                />
              </div>
            )}
            <ProFormText
              rules={[
                {
                  required: true,
                  pattern: regList.url.regex,
                  message: regList.url.alertText,
                },
              ]}
              width={"226px"}
              name="patchurl"
              label={language("nac.mconfig.cfgpolicy.patchaddress")}
            />
            <ProFormText
              width={"226px"}
              hidden={true}
              name="flawfrom"
              initialValue={1}
            />
            <ProFormRadio.Group
              name="repairauto"
              fieldProps={{
                buttonStyle: "solid",
              }}
              width="226px"
              label={language("nac.mconfig.cfgpolicy.repairmethod")}
              initialValue={0}
              options={[
                {
                  value: "Y",
                  label: language("nac.mconfig.cfgpolicy.automaticrepair"),
                },
                {
                  value: "N",
                  label: language("nac.mconfig.cfgpolicy.manualrepair"),
                },
              ]}
            />
          </>
        ) : (
          <></>
        )}

        {/* 服务运行 process */}
        {modalType == "service" ? (
          <>
            <ProFormRadio.Group
              name="deny"
              fieldProps={{
                buttonStyle: "solid",
              }}
              width="226px"
              label={language("nac.mconfig.cfgpolicy.launchcategory")}
              initialValue={"N"}
              onChange={(e) => {
                setServiceDenyStatus(e.target.value);
              }}
              options={[
                {
                  value: "Y",
                  label: language("nac.mconfig.cfgpolicy.prohibit"),
                },
                {
                  value: "N",
                  label: language("nac.mconfig.cfgpolicy.must"),
                },
              ]}
            />
            <NotesText
              width={"226px"}
              required={true}
              max="63"
              name="name"
              type="text"
              label={language("nac.mconfig.cfgpolicy.servicename")}
            />
            <NotesText
              width={"226px"}
              required={true}
              max="63"
              name="display"
              type="text"
              label={language("nac.mconfig.cfgpolicy.securitydisplay")}
            />
            <NotesText
              width={"226px"}
              max="63"
              name="descrip"
              type="text"
              label={language("nac.mconfig.cfgpolicy.describe")}
            />
            {serviceRepAuto == "N" ? (
              <ProFormText
                width={"226px"}
                rules={[
                  {
                    required: true,
                    pattern: regList.url.regex,
                    message: regList.url.alertText,
                  },
                ]}
                name="repairArg"
                label={language("nac.mconfig.cfgpolicy.fixlink")}
              />
            ) : (
              <></>
            )}
            <NotesText
              width={"226px"}
              max="63"
              name="repairTip"
              type="text"
              label={language("nac.mconfig.cfgpolicy.repairprompt")}
            />
            {serviceDenyStatus == "N" ? (
              <ProFormRadio.Group
                name="repairAuto"
                fieldProps={{
                  buttonStyle: "solid",
                }}
                onChange={(e) => {
                  setServiceRepAuto(e.target.value);
                }}
                width="226px"
                label={language("nac.mconfig.cfgpolicy.repairtype")}
                initialValue={"Y"}
                options={[
                  {
                    value: "Y",
                    label: language("nac.mconfig.cfgpolicy.automaticrepair"),
                  },
                  {
                    value: "N",
                    label: language("nac.mconfig.cfgpolicy.manualrepair"),
                  },
                ]}
              />
            ) : (
              <ProFormRadio.Group
                name="repairAuto"
                fieldProps={{
                  buttonStyle: "solid",
                }}
                onChange={(e) => {
                  setServiceRepAuto(e.target.value);
                }}
                hidden
                width="226px"
                label={language("nac.mconfig.cfgpolicy.repairtype")}
                initialValue={"Y"}
                options={[
                  {
                    value: "Y",
                    label: language("nac.mconfig.cfgpolicy.automaticrepair"),
                  },
                  {
                    value: "N",
                    label: language("nac.mconfig.cfgpolicy.manualrepair"),
                  },
                ]}
              />
            )}
          </>
        ) : (
          <></>
        )}

        {/* 进程运行 process */}
        {modalType == "process" ? (
          <>
            <ProFormRadio.Group
              name="deny"
              fieldProps={{
                buttonStyle: "solid",
              }}
              width="226px"
              label={language("nac.mconfig.cfgpolicy.launchcategory")}
              initialValue={"N"}
              onChange={(e) => {
                setProcessDenyStatus(e.target.value);
              }}
              options={[
                {
                  value: "Y",
                  label: language("nac.mconfig.cfgpolicy.prohibit"),
                },
                {
                  value: "N",
                  label: language("nac.mconfig.cfgpolicy.must"),
                },
              ]}
            />
            <NotesText
              width={"226px"}
              required={true}
              max="63"
              name="name"
              type="text"
              label={language("nac.mconfig.cfgpolicy.processname")}
            />
            <ProFormText
              width={"226px"}
              name="finger"
              // rules={[
              //   {
              //     pattern: regList.engAndnumNoPunc_32digit.regex,
              //     message: regList.engAndnumNoPunc_32digit.alertText,
              //   },
              // ]}
              label={language("nac.mconfig.cfgpolicy.processfingerprint")}
            />
            <NotesText
              width={"226px"}
              max="63"
              name="display"
              type="text"
              label={language("nac.mconfig.cfgpolicy.securitydisplay")}
            />
            <NotesText
              width={"226px"}
              max="63"
              name="descrip"
              type="text"
              label={language("nac.mconfig.cfgpolicy.describe")}
            />
            <NotesText
              width={"226px"}
              rules={[
                {
                  pattern: regList.cnengAndnumEngsomePunc1.regex,
                  message: regList.cnengAndnumEngsomePunc1.alertText,
                },
              ]}
              max="63"
              name="repairTip"
              type="text"
              label={language("nac.mconfig.cfgpolicy.repairprompt")}
            />
            {processDenyStatus == "N" ? (
              <ProFormText
                width={"226px"}
                name="repairArg"
                rules={[
                  {
                    required: true,
                    pattern: regList.url.regex,
                    message: regList.url.alertText,
                  },
                ]}
                label={language("nac.mconfig.cfgpolicy.repairaddress")}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {/* 软件安装 soft_install */}
        {modalType == "soft_install" ? (
          <>
            <ProFormRadio.Group
              name="deny"
              fieldProps={{
                buttonStyle: "solid",
              }}
              width="226px"
              label={language("nac.mconfig.cfgpolicy.launchcategory")}
              initialValue={"N"}
              onChange={(e) => {
                setSoftDenyStatus(e.target.value);
              }}
              options={[
                {
                  value: "Y",
                  label: language("nac.mconfig.cfgpolicy.prohibit"),
                },
                {
                  value: "N",
                  label: language("nac.mconfig.cfgpolicy.must"),
                },
              ]}
            />
            <NotesText
              width={"226px"}
              required={true}
              rules={[
                {
                  pattern: regList.cnengAndnumEngsomePunc1.regex,
                  message: regList.cnengAndnumEngsomePunc1.alertText,
                },
              ]}
              max="255"
              name="softName"
              type="text"
              label={language("nac.mconfig.cfgpolicy.softwarename")}
            />
            {softRepAuto == "N" ? (
              <ProFormText
                width={"226px"}
                name="repairArg"
                rules={[
                  {
                    required: true,
                    pattern: regList.url.regex,
                    message: regList.url.alertText,
                  },
                ]}
                label={language("nac.mconfig.cfgpolicy.fixlink")}
              />
            ) : (
              <></>
            )}
            <NotesText
              width={"226px"}
              rules={[
                {
                  pattern: regList.cnengAndnumEngsomePunc1.regex,
                  message: regList.cnengAndnumEngsomePunc1.alertText,
                },
              ]}
              max="63"
              name="descrip"
              type="text"
              label={language("nac.mconfig.cfgpolicy.describe")}
            />
            <NotesText
              width={"226px"}
              max="63"
              name="display"
              type="text"
              label={language("nac.mconfig.cfgpolicy.securitydisplay")}
            />
            <NotesText
              width={"226px"}
              
              max="63"
              name="repairTip"
              type="text"
              label={language("nac.mconfig.cfgpolicy.repairprompt")}
            />
            <NotesText
              width={"226px"}
              
              max="64"
              name="version"
              type="text"
              label={language("nac.mconfig.cfgpolicy.softwareversion")}
            />
            {softDenyStatus == "N" ? (
              <ProFormRadio.Group
                name="repairAuto"
                fieldProps={{
                  buttonStyle: "solid",
                }}
                onChange={(e) => {
                  setSoftRepAuto(e.target.value);
                }}
                width="226px"
                label={language("nac.mconfig.cfgpolicy.repairtype")}
                initialValue={"Y"}
                options={[
                  {
                    value: "Y",
                    label: language("nac.mconfig.cfgpolicy.automaticrepair"),
                  },
                  {
                    value: "N",
                    label: language("nac.mconfig.cfgpolicy.manualrepair"),
                  },
                ]}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {/* 启动项检查 start_item */}
        {modalType == "start_item" ? (
          <>
            <ProFormText
              width={"226px"}
              rules={[
                {
                  required: true,
                },
              ]}
              name="disableStart"
              label={"禁止启动项"}
            />
            <ProFormText width={"226px"} name="display" label={"安检显示"} />
            <NotesText
              width={"226px"}
              max="64"
              name="descrip"
              type="text"
              label={"描述"}
            />
            <ProFormText width={"226px"} name="repairTip" label={"修复提示"} />
          </>
        ) : (
          <></>
        )}
      </ModalForm>
    </div>
  );
});
export default ChildDrawer;
