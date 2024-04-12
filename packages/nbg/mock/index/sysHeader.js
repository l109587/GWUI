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
  } else if (getParam.action == "showHomeInfo") {
    if (postParam.area === "asset" && postParam.type === "stastic") {
      json = require("../json/indexcharts/nbgIndexAsset.json");
    } else if (postParam.area === "asset" && postParam.type === "trend") {
      // json = {
      //   success: true,
      //   data: {
      //     asset: {
      //       title: "资产统计",
      //       data: [
      //         {
      //           "Date": "2009/6/12 2:00",
      //           "scales": 0.97,
      //           "rain": 0
      //         },
      //         {
      //           "Date": "2009/6/12 3:00",
      //           "scales": 0.96,
      //           "rain": 0
      //         }
      //       ],
      //     },
      //   },
      // };
      json = require("../json/indexcharts/nbgIndexTrend.json");
    } else if (postParam.area === "violate") {
      json = require("../json/indexcharts/nbgIndexViolate.json");
    } else if (postParam.area === "risk") {
      json = require("../json/indexcharts/nbgIndexRisk.json");
    } else {
      json = require("../json/indexcharts/nbgIndexInfo.json");
    }
  }
  res.send(json);
}
