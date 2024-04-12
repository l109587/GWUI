import Mock from "mockjs";
import { mockMethod } from "../../src/utils/common";
let assetLabelList = {
  success: true,
  total: 2,
  data: [
    {
      label: "标签1",
      value: "标签1",
    },
    {
      label: "标签2",
      value: "标签2",
    },
    {
      label: "标签3",
      value: "标签3",
    },
    {
      label: "标签4",
      value: "标签4",
    },
    {
      label: "标签5",
      value: "标签5",
    },
    {
      label: "标签6",
      value: "标签6",
    },
    {
      label: "标签7",
      value: "标签7",
    },
    {
      label: "标签8",
      value: "标签8",
    },
    {
      label: "标签9",
      value: "标签9",
    },
    {
      label: "标签10",
      value: "标签10",
    },
    {
      label: "标签11",
      value: "标签11",
    },
  ],
};

 let snapshot = []
export default function assetMapping(getParam, postParam, res) {
  let json = "";
  if (getParam.action == "showAssetClassify") {
    json = require("../json/admlog/assettree.json");
    res.send(json);
  } else if (getParam.action == "getTelnetList") {
    json = require("../json/monitor/getTtelnetList.json");
    res.send(json);
  } else if (getParam.action == "showARPList") {
    json = require("../json/monitor/showARPList.json");
    res.send(json);
  } else if (getParam.action == "getSnmpModelList") {
    json = require("../json/monitor/showSnmpModeList.json");
    res.send(json);
  } else if (getParam.action == "showSnmpTempList") {
    json = require("../json/monitor/showSnmpTempList.json");
    res.send(json);
  } else if (getParam.action == "showAssetList") {
    json = require("../json/admlog/assetlist.json");
    res.send(json);
  } else if (getParam.action == "showIdentifyConf") {
    json = require("../json/sysconf/assetIdentification.json");
    res.send(json);
  } else if (getParam.action == "showMonitorTask") {
    json = require("../json/temporary/montasktable.json");
    res.send(json);
  } else if (getParam.action == "showMonitorSituation") {
    json = require("../json/temporary/moncard.json");
    res.send(json);
  } else if (getParam.action == "showVioOutline") {
    json = require("../json/analyse/illout.json");
    res.send(json);
  } else if (getParam.action == "showVioNetcross") {
    json = require("../json/analyse/series.json");
    res.send(json);
  } else if (getParam.action == "showVioInline") {
    json = require("../json/analyse/showVioInline.json");
    res.send(json);
  } else if (getParam.action == "showVioInSummary") {
    json = require("../json/analyse/showVioInSummary.json");
    res.send(json);
  } else if (getParam.action == "showVioSrvSummary") {
    json = require("../json/analyse/visrvsummary.json");
    res.send(json);
  } else if (getParam.action == "showVioService") {
    json = require("../json/analyse/showVioService.json");
    res.send(json);
  } else if (getParam.action == "filterAssetList") {
    json = require("../json/analyse/assetsfillter.json");
    res.send(json);
  } else if (getParam.action == "filterVioOutline") {
    json = require("../json/analyse/illoutfillter.json");
    res.send(json);
  } else if (getParam.action == "filterVioInline") {
    json = require("../json/analyse/illinnfillter.json");
    res.send(json);
  } else if (getParam.action == "filterVioNetcross") {
    json = require("../json/analyse/seriesfillter.json");
    res.send(json);
  } else if (getParam.action == "filterVioService") {
    json = require("../json/analyse/serverfillter.json");
    res.send(json);
  } else if (getParam.action == "showResource") {
    json = require("../json/analyse/resmaptable.json");
    res.send(json);
  } else if (getParam.action == "showMatrix") {
    json = require("../json/analyse/showMatrix.json");
    res.send(json);
  } else if (getParam.action == "showProbeDetail") {
    json = require("../json/analyse/showProbeDetail.json");
    res.send(json);
  } else if (getParam.action == "showResourceSummary") {
    json = require("../json/analyse/resmapsummary.json");
    res.send(json);
  } else if (getParam.action == "showRiskAnalysis") {
    json = require("../json/analyse/resrisk.json");
    res.send(json);
  } else if (getParam.action == "filterRiskAnalysis") {
    json = require("../json/analyse/resriskfilter.json");
    res.send(json);
  } else if (getParam.action == "showRiskPercepCfg") {
    json = require("../json/monitor/riskperce.json");
    res.send(json);
  } else if (getParam.action == "showSwitchDiscovery") {
    json = require("../json/monitor/showSwitchDiscovery.json");
    res.send(json);
  } else if (getParam.action == "getSwitchlist") {
    json = require("../json/monitor/switchlist.json");
    res.send(json);
  } else if (getParam.action == "showSwitchDetail") {
    const detail = Mock.mock({
      success: true,
      total: 52,
      data: {
        id: 1,
        name: "H3C",
        online: "1",
        ip: "192.168.12.133",
        mac: "",
        active: "",
        vender: "H3C",
        icon: "/resource/images/topology/logo_h3c.png",
        model: "--",
        cpu: "88",
        memory: "80",
        sysName: "H3C",
        ifNum: 52,
        bdcount: 2,
        termWarning: '@pick([0, 1, 5])',
        normalifNum:11,
        warningifNum:18,
        stopedifNum:1,
        "term|52": [
          {
            "ifIndex|+1": 1,
            "portId|+1": 1,
            ifName: "GigabitEthernet1/0/1",
            alias: "GigabitEthernet1/0/1接口内容描述",
            status: '@pick(["0", "1", "2"])',
            ifDowntime: "1659443429",
            link: "@pick([1, 2, 3])",
            initVlan: "12",
            currentVlan: "12",
            guesVlan: "0",
            adminDown: "0",
            ifType: "6",
            phyMac: "6C:E5:F7:BC:7E:49",
            inBps: "20G",
            inFlowWarn: 0,
            outBps: "30G",
            outFlowWarn: 0,
            macCnt: 2,
            termNum: "@pick([0,1,5,20])",
            name: "::",
            devType: "",
            ip: "@ip",
            mac: "00:00:00:00:00:00",
            icon: "/resource/images/topology/nac_tp_pc.png",
            aclmode: "0",
            termWarning: "@pick([0,1,5])",
            isStoped: '@pick(["Y", "N"])',
            rate: "1000M",
          },
        ],
      },
    });
    res.send(detail);
  } else if (getParam.action == "showPortTerm") {
    json = require("../json/monitor/showPortTerm.json");
    res.send(json);
  } else if (getParam.action == "searchTermFrom") {
    const data = {
      success:true,
      type:"PC计算机",
      total:4,
      data:[
        {
          swip:'192.168.134.162',
          portName:'GigabitEthernet1/0/20'
        },
        {
          swip:'192.168.134.163',
          portName:'GigabitEthernet1/0/22'
        },
        {
          swip:'192.168.134.161',
          portName:'GigabitEthernet1/0/24'
        },
        {
          swip:'192.168.134.164',
          portName:'GigabitEthernet1/0/25'
        }
      ]
    };
    res.send(data);
  } else if (getParam.action == "showTopoIcons") {
    let topoIcons = {
      success: true,
      data: [
        {
          uid: "0",
          name: "核心设备",
          thumbUrl: "core_dev.png",
          type: "core",
        },
        {
          uid: "1",
          name: "汇聚设备",
          thumbUrl: "@/assets/images/topo/converge_dev.png",
          type: "converge",
        },
        {
          uid: "2",
          name: "接入设备",
          thumbUrl: "@/assets/images/topo/access_dev.png",
          type: "access",
        },
        {
          uid: "3",
          name: "服务器堆",
          thumbUrl: "@/assets/images/topo/access_dev.png",
          type: "servers",
        },
        {
          uid: "4",
          name: "服务器",
          thumbUrl: "@/assets/images/topo/access_dev.png",
          type: "server",
        },
        {
          uid: "5",
          name: "防火墙",
          thumbUrl: "@/assets/images/topo/access_dev.png",
          type: "firewall",
        },
        {
          uid: "6",
          name: "路由器",
          thumbUrl: "@/assets/images/topo/access_dev.png",
          type: "router",
        },
        {
          uid: "7",
          name: "云",
          thumbUrl: "@/assets/images/topo/access_dev.png",
          type: "cloud",
        },
      ],
    };
    res.send(topoIcons);
  } else if (getParam.action == "setSnapshot") {
    if(postParam.op==='add'){
      snapshot.push({id:Date.now(),name:'快照'})
    }else{
      delete postParam.op
      const index = snapshot.findIndex((item) => item.id == postParam.id);
      snapshot[index].name = postParam.name
    }
    const data = {
      success:true,
      msg:'操作成功'
    }
    res.send(data);
  } else if (getParam.action == "showSnapshot") { 
    const data = {
      success:true,
      data:snapshot
    }
    res.send(data);
  }else if (getParam.action == "delSnapshot") {
    console.log(postParam.id,'postParam.id');
    snapshot = snapshot.filter((item)=>item.id!=postParam.id)
    console.log(snapshot,'snapshot');
    const data = {
      success:true,
      msg:'删除成功'
    }
    res.send(data);
  }else if (getParam.action == "showPortMAC") {
    const terminfo = Mock.mock({
      success: true,
      total: 3,
      "data|20": [
        {
          ip: "@ip",
          mac: "00:25:90:A7:6D:4D",
          isWarning: '@pick(["Y", "N"])',
          isStoped: '@pick(["Y", "N"])',
          devType: "PC计算机",
          ipCnt: 1,
          devType: "未知终端",
          sysType: "未知系统",
          macVendor: "Hangzhou H3C Technologies Co.,Limited",
          macVendorAbbr: "H3C"
        },
      ],
    });
    res.send(terminfo);
  } else if (getParam.action == "getSwitchVenderList") {
    json = require("../json/monitor/venderList.json");
    res.send(json);
  } else if (getParam.action == "showTopologys") {
    json = require("../json/monitor/showTopo.json");
    res.send(json);
  } else if (getParam.action == "showTopology") {
    json = require("../json/monitor/afterCountTopos.json");
    res.send(json);
  } else if (getParam.action == "showTopoList") {
    json = require("../json/monitor/showTopoList.json");
    res.send(json);
  } else if (getParam.action == "getSwitchip") {
    json = require("../json/monitor/showswitchip.json");
    res.send(json);
  } else if (getParam.action == "getPortName") {
    json = require("../json/monitor/getProtName.json");
    res.send(json);
  } else if (getParam.action == "assetIdentify") {
    json = require("../json/upload/exportBackupConf.json");
    res.send(json);
  } else if (getParam.action == "assetIdentifyResult") {
    json = require("../json/upload/nocode.json");
    res.send(json);
  } else if (getParam.action == "assetExtract") {
    json = {
      success: true,
      data: {
        mac: "11:22:22:33:44:55",
        vendor: "微软",
        type: "个人电脑",
        os: "linux",
        port: "445,8080",
        model: "V14-G2-ITL",
        protocol: "SSH2,HTTP",
      },
    };
    res.send(json);
  } else if (getParam.action == "assetDetaInfo") {
    json = require("../json/analyse/assetDetailsInfo.json");
    res.send(json);
  } else if (getParam.action == "showTermDetail") {
    const terminfo = Mock.mock({
      success: true,
      total: 3,
      "data|20": [
        {
          termId: "@id",
          termIp: "@ip",
          termMac: "00:25:90:A7:6D:4D",
          isWarning: '@pick(["Y", "N"])',
          isStoped: '@pick(["Y", "N"])',
          termType: "PC计算机",
        },
      ],
    });
    res.send(json);
  } else if (getParam.action == "assetVendorSelect") {
    json = {
      success: true,
      total: "6",
      data: [
        {
          value: "Aaeon",
          label: "Aaeon",
        },
        {
          value: "Acer",
          label: "Acer",
        },
        {
          value: "Advantech",
          label: "Advantech",
        },
        {
          value: "Amazon",
          label: "Amazon",
        },
        {
          value: "American Megatrends",
          label: "American Megatrends",
        },
        {
          value: "Apple",
          label: "Apple",
        },
        {
          value: "American",
          label: "American",
        },
        {
          value: "XIAOMI",
          label: "XIAOMI",
        }
      ],
    };
    res.send(json);
  } else if (getParam.action == 'exportResource') {
    if (postParam.op == 'export') {
      json = require("../json/upload/exportBackupConf.json")
    } else if (postParam.op == 'rdnext') {
      json = require('../json/upload/nocode.json')
    } else if (postParam.op == 'dnload') {
      json = require('../json/upload/file.json')
    }
    res.send(json);
  } else if (getParam.action == "showReportFormData") {

    const reportFormData = [
      {
        title: "综述信息",
        key: "mainInfo",
        children: [
          {
            title: "任务信息",
            key: "taskInfo",
            content: [
              {
                type: "panel",
                data: [
                  {
                    name: "assets",
                    value: 71,
                  },
                  {
                    name: "sysvbe",
                    value: 3,
                  },
                  {
                    name: "weakpwd",
                    value: 16,
                  },
                  {
                    name: "portopen",
                    value: 23,
                  },
                  {
                    name: "illoutline",
                    value: 17,
                  },
                  {
                    name: "illinline",
                    value: 5,
                  },
                  {
                    name: "illservice",
                    value: 19,
                  },
                ],
              },
              {
                type: "text",
                data: [
                  "违规外联是指内网计算机连接互联网，可能造成数据泄露被入侵的严重安全事件。违规外联是指内网计算机连接互联网，可能造成数据泄露被入侵的严重安全事件。违规外联是指内网计算机连接互联网，可能造成数据泄露被入侵的严重安全事件。违规外联是指内网计算机连接互联网，可能造成数据泄露被入侵的严重安全事件。",
                  "违规外联是指内网计算机连接互联网，可能造成数据泄露被入侵的严重安全事件。违规外联是指内网计算机连接互联网，可能造成数据泄露被入侵的严重安全事件。",
                ],
              },
              {
                type: "table",
                data: {
                  dataSource: [
                    {
                      index: "1",
                      name: "检测到目标URL存在http host头攻击漏洞",
                      pageNum: 2,
                      appearNum: 1,
                    },
                    {
                      index: "2",
                      name: "检测到会话cookie中缺少HttpOnly属性",
                      pageNum: 32,
                      appearNum: 2,
                    },
                    {
                      index: "3",
                      name: "检测到会话cookie中缺少Secure属性",
                      pageNum: 32,
                      appearNum: 2,
                    },
                    {
                      index: "4",
                      name: "检测到目标URL存在内部IP地址泄露",
                      pageNum: 32,
                      appearNum: 2,
                    },
                  ],
                  columns: [
                    {
                      title: "序号",
                      dataIndex: "index",
                      key: "index",
                    },
                    {
                      title: "漏洞名称",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "影响页面个数",
                      dataIndex: "pageNum",
                      key: "pageNum",
                    },
                    {
                      title: "出现次数",
                      dataIndex: "appearNum",
                      key: "appearNum",
                    },
                  ],
                },
              },
            ],
            children: [
              {
                title: "三级标题",
                key: "thirdInfo",
                content: [
                  {
                    type: "bar",
                    data: [
                      {
                        name: "PC计算机",
                        value: 27,
                      },
                      {
                        name: "交换机",
                        value: 25,
                      },
                      {
                        name: "虚拟机",
                        value: 3,
                      },
                      {
                        name: "路由器",
                        value: 35,
                      },
                      {
                        name: "路由器",
                        value: 33,
                      },
                      {
                        name: "路由器",
                        value: 44,
                      },
                      {
                        name: "路由器",
                        value: 23,
                      },
                      {
                        name: "路由器",
                        value: 1,
                      },
                      {
                        name: "路由器",
                        value: 65,
                      },
                      {
                        name: "设备",
                        value: 12,
                      },
                      {
                        name: "打印机",
                        value: 33,
                      },
                      {
                        name: "笔记本电脑",
                        value: 34,
                      },
                      {
                        name: "无线路由",
                        value: 152,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            title: "风险分布",
            key: "riskdInfo",
            content: [
              {
                type: "pie",
                data: [
                  {
                    name: "高风险",
                    value: 27,
                  },
                  {
                    name: "中风险",
                    value: 25,
                  },
                  {
                    name: "低风险",
                    value: 18,
                  },
                  {
                    name: "无风险",
                    value: 152,
                  },
                ],
              },
            ],
            children: [
              {
                title: "页面风险界别分布",
                key: "pageriskInfo",
                content: [
                  {
                    type: "pie",
                    data: [
                      {
                        name: "高风险",
                        value: 27,
                      },
                      {
                        name: "中风险",
                        value: 25,
                      },
                      {
                        name: "低风险",
                        value: 18,
                      },
                      {
                        name: "无风险",
                        value: 152,
                      },
                    ],
                  },
                ],
                children: [],
              },
            ],
          },
        ],
      },
      {
        title: "漏洞列表",
        key: "loopListInfo",
        content: [],
        children: [
          {
            title: "漏洞分布",
            key: "loopd",
            content: [
              {
                type: "column",
                data: [
                  {
                    type: "严重",
                    value: 38,
                  },
                  {
                    type: "高危",
                    value: 52,
                  },
                  {
                    type: "中危",
                    value: 61,
                  },
                  {
                    type: "低危",
                    value: 145,
                  },
                ],
              },
            ],
            children: [],
          },
        ],
      },
      {
        title: "安全建议",
        key: "ansug",
        content:
          "弱口令是指仅包含简单数字和字母的口令，例如“123”、“abc”等，因为这样的口令很容易被别人破解，从而使用户的计算机面临风险。",
        children: [],
      },
    ];

    setTimeout(() => {
      json = require("../json/monitor/showReportFormData.json");
      res.send(json);
    }, 0);
  }

  let mappingTypeList = Mock.mock({
    success: true,
    total: 20,
    "data|20": [
      {
        "id|+1": 0,
        group:
          '@pick(["网络设备", "用户设备", "服务器", "哑终端", "移动设备"])',
        "groupId|+1": 0,
        name: '@pick(["个人电脑", "交换机", "存储服务器", "摄像头", "自建"])',
        icon: '@pick(["pc", "switch", "nas", "camera", "custom"])',
        "speciesnum|300-500": 420,
        count: '@pick(["45", "65", "33", "24", "81"])',
        property: '@pick(["0", "1"])',
      },
    ],
  });
  if (getParam.action == "showAssetTypeList") {
    mockMethod("show", mappingTypeList, postParam, res);
  }
  if (getParam.action == "delAssetTypeInfo") {
    mockMethod("del", mappingTypeList, postParam, res);
  }
  if (getParam.action == "setAssetTypeInfo") {
    mockMethod("mod", mappingTypeList, postParam, res);
  }
  if (getParam.action == "addAssetGroup") {
    mockMethod("add", mappingTypeList, postParam, res);
  }
  if (getParam.action == "addAssetType") {
    mockMethod("add", mappingTypeList, postParam, res);
  }
  if (getParam.action == "modAssetTypeGroup") {
    mockMethod("mod", mappingTypeList, postParam, res);
  }
  let groupList = {
    success: true,
    total: 5,
    data: [
      {
        id: 0,
        text: "用户设备",
        property: 0,
        select: false,
      },
      {
        id: 1,
        text: "网络设备",
        property: 0,
        select: false,
      },
      {
        id: 2,
        text: "服务器",
        property: 0,
        select: false,
      },
      {
        id: 3,
        text: "哑终端",
        property: 0,
      },
      {
        id: 353,
        text: "自定义",
        property: 1,
      },
    ],
  };
  if (getParam.action == "showAssetGroupList") {
    mockMethod("show", groupList, postParam, res);
  }
  if (getParam.action == "setAssetGroup") {
    mockMethod("mod", groupList, postParam, res);
  }
  if (getParam.action == "delAssetGroup") {
    mockMethod("del", groupList, postParam, res);
  }
  if (getParam.action == "showTotalAssets") {
    mockMethod(
      "show",
      {
        success: true,
        data: {
          assettypesnum: 72,
          assetspeciesnum: null,
          assetfingerprintnum: "12325",
        },
      },
      postParam,
      res
    );
  }

  if (getParam.action == "assetTypeSelect") {
    mockMethod(
      "show",
      {
        success: true,
        data: [
          {
            value: "0",
            label: "PC计算机",
            icon: "pc",
          },
          {
            value: "1",
            label: "虚拟机",
            icon: "VM",
          },
          {
            value: "2",
            label: "移动设备",
            icon: "Mobile",
          },
          {
            value: "65535",
            label: "未知类型",
            icon: "unknown",
          },
        ],
      },
      postParam,
      res
    );
  }

  let fingerprintList = {
    success: true,
    total: 2,
    data: [
      {
        id: 1,
        state: 0,
        name: "first",
        os: "linux",
        mac: "11:22:22:33:44:55",
        port: "445,8080",
        protocol: "SSH,HTTP",
        banner: "banner1",
        keywords: "keywords1",
        matchnums: "3",
        portSt: "1",
        portocolSt: "2",
        assettype: "pc",
        assetvalue: "0",
        vendor: "DELL",
        assetmodel: "V14-G2-ITL",
      },
      {
        id: 2,
        state: 1,
        name: "second",
        os: "uos",
        mac: "11:22:22:33:44:55",
        port: "445,8080",
        protocol: "SSH,HTTP",
        banner: "banner2",
        keywords: "PC",
        matchnums: "5",
        portSt: "1",
        portocolSt: "3",
        assettype: "VM",
        assetvalue: "1",
        vendor: "DELL",
        assetmodel: "V14-G2-ITL",
      },
    ],
  };
  if (getParam.action == "showFingerprintList") {
    mockMethod("show", fingerprintList, postParam, res);
  }
  if (getParam.action == "setFingerprintList") {
    mockMethod("set", fingerprintList, postParam, res);
  }
  if (getParam.action == "newFingerprint") {
    mockMethod("add", fingerprintList, postParam, res);
  }
  if (getParam.action == "delFingerprintList") {
    mockMethod("del", fingerprintList, postParam, res);
  }
  let riskVulList = {
    success: true,
    total: 16,
    data: [
      {
        id: 1,
        level: 1,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "",
      },
      {
        id: 2,
        level: 2,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 3,
        level: 3,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 4,
        level: 4,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 1,
        level: 1,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 2,
        level: 2,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 3,
        level: 3,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 4,
        level: 4,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 1,
        level: 1,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 2,
        level: 2,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 3,
        level: 3,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 4,
        level: 4,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 1,
        level: 1,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 2,
        level: 2,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 3,
        level: 3,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
      {
        id: 4,
        level: 4,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskType: "代码问题",
        riskName: "SSH弱口令",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        findTM: "2022-06-06 11:10",
      },
    ],
  };
  if (getParam.action == "showRiskVulList") {
    mockMethod("show", riskVulList, postParam, res);
  }
  let riskIpList = {
    success: true,
    total: 15,
    data: [
      {
        id: 1,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        icon: "pc",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "地址",
        switchINF: "GigabitEtherent1/0/12",
        VLAN: "vlan",
      },
      {
        id: 2,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 3,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 1,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        icon: "pc",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "地址",
        switchINF: "GigabitEtherent1/0/12",
        VLAN: "vlan",
      },
      {
        id: 2,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 3,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 1,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        icon: "pc",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "地址",
        switchINF: "GigabitEtherent1/0/12",
        VLAN: "vlan",
      },
      {
        id: 2,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 3,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 1,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        icon: "pc",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "地址",
        switchINF: "GigabitEtherent1/0/12",
        VLAN: "vlan",
      },
      {
        id: 2,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 3,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 1,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        icon: "pc",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "地址",
        switchINF: "GigabitEtherent1/0/12",
        VLAN: "vlan",
      },
      {
        id: 2,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
      {
        id: 3,
        risknum: 15,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        type: "个人电脑",
        os: "linux",
        app: ["北信源网络接入控制系统", "一体化平台"],
        switchIP: "",
        switchINF: "",
        VLAN: "",
      },
    ],
  };
  if (getParam.action == "showRiskVulIPs") {
    mockMethod("show", riskIpList, postParam, res);
  }
  let riskExpandIpList = Mock.mock({
    success: true,
    total: 4,
    "data|4": [
      {
        "id|1-20": 5,
        riskName: "SSH弱口令111111",
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        level: 4,
        riskType: "",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
        findTM: "2022-06-06 11:10",
      },
    ],
  });
  if (getParam.action == "showRiskVulsByIP") {
    mockMethod("show", riskExpandIpList, postParam, res);
  }
  let riskFlawList = {
    success: true,
    total: 2,
    data: [
      {
        id: 1,
        riskName: "SSH弱口令",
        ipsnum: 15,
        riskid: "CNNVD-202308-2158",
        riskCveId: "CVE-2023-4559",
        level: 1,
        riskType: "代码问题",
        riskInfo:
          "Bettershop LaikeTui存在代码问题漏洞，该漏洞源于组件 POST Request Handler中的 index.php?module=api&action=user&m=upload 存在一些未知函数，导致上传不受限制",
      },
    ],
  };
  if (getParam.action == "showRiskVulVuls") {
    mockMethod("show", riskFlawList, postParam, res);
  }
  let riskFlawExpandList = Mock.mock({
    success: true,
    total: 1,
    "data|3": [
      {
        "id|1-20": 2,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        findTM: "2022-06-06 11:10",
        type: "个人电脑",
        os: "linux",
      },
    ],
  });
  if (getParam.action == "showRiskIPByVul") {
    mockMethod("show", riskFlawExpandList, postParam, res);
  }
  let riskWeakList = {
    success: true,
    total: 1,
    data: [
      {
        id: 1,
        level: 3,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskName: "SSH弱口令",
        riskInfo: "导致敏感信息泄露，严重情况可导致服务器被入侵控制",
        riskid: "CNNVD-202308-2158",
        findTM: "2022-06-06 11:10",
        verifyInfo: "{'user': 'root', 'pass': '123456'}",
      },
    ],
  };
  if (getParam.action == "showRiskWeakList") {
    mockMethod("show", riskWeakList, postParam, res);
  }
  if (getParam.action == "delRiskWeakList") {
    mockMethod("del", riskWeakList, postParam, res);
  }
  let riskPortOpenList = {
    success: true,
    total: 2,
    data: [
      {
        id: 1,
        level: 2,
        addr: "192.168.1.1",
        mac: "11:22:22:33:44:55",
        devName: "my-pc",
        riskName: "高危端口开放",
        riskInfo:
          "可能导致高危端口对应的高危服务对外暴露，进而被攻击者利用及控制",
        findTM: "2022-06-06 11:10",
        verifyInfo: "{'22': 'SSH'}",
      },
    ],
  };
  if (getParam.action == "showRiskPortList") {
    mockMethod("show", riskPortOpenList, postParam, res);
  }
  if (getParam.action == "showAclMng") {
    res.json({
      success: true,
      data: {
        showAcl: "Y",
      },
    });
  }

  if (getParam.action == "addAssetLabel") {
    assetLabelList.data.push({
      label: postParam.label,
      value: postParam.label,
    });
    res.send({
      success: true,
      msg: "操作成功",
    });
  }
  if (getParam.action == "delAssetLabel") {
    assetLabelList.data = assetLabelList.data.filter(
      (item) => item.label !== postParam.label
    );
    res.send({
      success: true,
      msg: "操作成功",
    });
  }
  if (getParam.action == "assetLabelSelect") {
    mockMethod("show", assetLabelList, postParam, res);
  }
}
