import { mockMethod } from "../../../src/utils/common";
import Mock, { mock } from "mockjs";

const devShow = [
  {
    id: "0",
    text: "全网范围",
    value: "全网范围",
    upgrpid: "-1",
    upgrp: "",
    upgrpvalue: "",
    area: "-1",
    uuid: "0",
    iconCls: "icon-group",
    expanded: true,
    children: [
      {
        id: "1",
        text: "12.81",
        value: "全网范围/12.81",
        upgrpid: "0",
        upgrp: "全网范围",
        upgrpvalue: "全网范围",
        area: "-1",
        uuid: "2228",
        iconCls: "icon-group",
        level: "2",
        leaf: true,
      },
      {
        id: "2",
        text: "12other",
        value: "全网范围/12other",
        upgrpid: "0",
        upgrp: "全网范围",
        upgrpvalue: "全网范围",
        area: "-1",
        uuid: "2229",
        iconCls: "icon-group",
        level: "2",
        leaf: true,
      },
      {
        id: "3",
        text: "测试范围的一段",
        value: "全网范围/测试范围的一段",
        upgrpid: "0",
        upgrp: "全网范围",
        upgrpvalue: "全网范围",
        area: "-1",
        uuid: "2230",
        iconCls: "icon-group",
        level: "2",
        leaf: true,
      },
      {
        id: "65535",
        text: "未分组的",
        value: "全网范围/未分组的",
        upgrpid: "0",
        upgrp: "全网范围",
        upgrpvalue: "全网范围",
        area: "-1",
        uuid: "0",
        iconCls: "icon-group",
        level: "2",
        leaf: true,
      },
    ],
  },
];
const devList = [{"id":"0", "text":"全网范围", "value":"全网范围", "upgrpid":"-1", "upgrp":"", "upgrpvalue":"", "area":"-1", "uuid":"0", "iconCls":"icon-group", "expanded":true, "children":[{"id":"1", "text":"122", "value":"全网范围/122", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"69", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"2", "text":"133", "value":"全网范围/133", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"70", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"3", "text":"111", "value":"全网范围/111", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"71", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"4", "text":"123", "value":"全网范围/123", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"72", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"5", "text":"124", "value":"全网范围/124", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"73", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"6", "text":"1545", "value":"全网范围/1545", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"74", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"7", "text":"1653", "value":"全网范围/1653", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"75", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"8", "text":"1654", "value":"全网范围/1654", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"76", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"9", "text":"154", "value":"全网范围/154", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"77", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"10", "text":"16543", "value":"全网范围/16543", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"78", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"11", "text":"1765", "value":"全网范围/1765", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"79", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"12", "text":"1643", "value":"全网范围/1643", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"80", "iconCls":"icon-group", "level":"2", "leaf":true},{"id":"65535", "text":"未分组的", "value":"全网范围/未分组的", "upgrpid":"0", "upgrp":"全网范围", "upgrpvalue":"全网范围", "area":"-1", "uuid":"0", "iconCls":"icon-group", "level":"2", "leaf":true}]}]

export default function (getParam, postParam, res) {
  if (getParam.action == 'showDevGrpComboTree') {
    mockMethod('show', devShow, postParam, res)
  }else if(getParam.action == 'get_dev_group_list'){
    mockMethod('show', devList, postParam, res)
  } else if (getParam.action == "showDevGrpComboTree") {
    mockMethod("show", devShow, postParam, res);
  } else if (getParam.action == "get_dev_group_list") {
    const data = {
      id: "0",
      value: "全网范围",
      name: "全网范围",
      upgrpid: "-1",
      upgrpvalue: "",
      children: [
        {
          id: 1,
          value: "全网范围/测试分组1",
          name: "测试分组1",
          upgrp: "全网范围",
          upgrpid: "0",
          upgrpvalue: "全网范围",
          leaf: true,
        },
        {
          id: 2,
          value: "全网范围/测试分组2",
          name: "测试分组2",
          upgrp: "全网范围",
          upgrpid: "0",
          upgrpvalue: "全网范围",
          leaf: true,
        },
      ],
    };
    res.json(data);
  } else if (getParam.action == "get_devmember_list") {
    const data = {
      success: true,
      data: [
        {
          area: "-1",
          class_sw: "0",
          id: "0",
          ip_class: "",
          level: "1",
          mac_class: "",
          name: "全网范围",
          secret: "0",
          upgrp: "",
          upgrpi: "0",
          upgrpvalue: "",
          value: "全网范围",
        },
        {
          area: "-1",
          class_sw: "0",
          id: "1",
          ip_class: "192.168.12.14;12.2.2.2;2.2.2.2",
          level: "2",
          mac_class: "12:12:12:12:22:12;11:22:22:22:33:11",
          name: "测试分组1",
          secret: "0",
          upgrp: "全网范围",
          upgrpi: "0",
          upgrpvalue: "全网范围",
          value: "全网范围/测试分组1",
        },
        {
          area: "-1",
          class_sw: "0",
          id: "2",
          ip_class: "192.168.12.14",
          level: "2",
          mac_class: "",
          name: "测试分组2",
          secret: "0",
          upgrp: "全网范围",
          upgrpi: "0",
          upgrpvalue: "全网范围",
          value: "全网范围/测试分组2",
        },
      ],
      total: 3,
    };
    res.json(data)
  }
}
