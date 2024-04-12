import Mock from "mockjs";

export default function sysHeader(getParam, postParam, res) {
  let json = "";
  //
  if (getParam.action == "showSysChart") {
    let values = [];
    const imitateList = (tname, min, max) => {
      var dottedBase = +new Date();
      for (var i = 100; i > 0; i--) {
        var date = new Date((dottedBase += 1000 * 4));
        let now =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        values.push({
          name: tname,
          time: now,
          value: Number(date.getTime().toString().slice(-5, -3)),
        });
      }
      return values;
    };
    if (postParam.chartype == "cpu") {
      json = Mock.mock({
        success: true,
        title: "CPU状态",
        usage: "22%",
        count: 150,
        lines: imitateList("cpu", 0, 100),
      });
    } else if (postParam.chartype == "mem") {
      json = Mock.mock({
        success: true,
        title: "内存状态",
        usage: "24%",
        count: 150,
        lines: imitateList("mem", 0, 100),
      });
    }
  } else if (getParam.action == "showMOutChart") {
    json = require("../json/indexcharts/nbamoutData.json");
  } else if (getParam.action == "showMUserChart") {
    json = require("../json/indexcharts/nbashowProtable.json");
  } else if (getParam.action == "showMReportChart") {
    json = require("../json/indexcharts/nbameportChart.json");
  } else if(getParam.action == 'showAdminListName') {
    json = require('../json/indexcharts/nbaUserList.json')
  }
  //
  else if (getParam.action == "showSysInfo") {
    json = require("../json/monindex/SysInfo.json");
  }
  //
  else if (getParam.action == "showCheckStats") {
    json = require("../json/monindex/showCheckStats.json");
  }
  //
  else if (getParam.action == "showCascadeState") {
    json = require("../json/monindex/showCascadeState.json");
  }
  //
  else if (getParam.action == "showAssetsChart") {
    json = require("../json/monindex/showAssetsChart.json");
  }
  //
  else if (getParam.action == "showAssetsCtrlChart") {
    json = require("../json/monindex/showAssetsCtrlChart.json");
  }
  //
  else if (getParam.action == "showDevRegStats") {
    json = require("../json/monindex/showDevRegStats.json");
  }
  //
  else if (getParam.action == "showResList") {
    json = require("../json/monindex/showResList.json");
  }
  //
  else if (getParam.action == "showPolicyStats") {
    json = require("../json/monindex/showPolicyStats.json");
  } else if (getParam.action == "showDataStats") {
    json = require("../json/monindex/logstats.json");
  } else if (getParam.action == "showAssetChart") {
    json = require("../json/monindex/apptopchart.json");
  } else if (getParam.action == "showMFlowChart") {
    json = require("../json/indexcharts/flowchkchart.json");
  }
  res.send(json);
}