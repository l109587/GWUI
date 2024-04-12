export default function assetMapping(getParam, postParam, res) {
  let json = '';
  if (getParam.action == 'showAssetClassify') {
    json = require('../json/admlog/assettree.json');
  } else if (getParam.action == 'getTelnetList') {
    json = require('../json/monitor/getTtelnetList.json');
  } else if (getParam.action == 'showARPList') {
    json = require('../json/monitor/showARPList.json');
  }
  else if (getParam.action == 'getSnmpModelList') {
    json = require('../json/monitor/showSnmpModeList.json');
  }
  else if (getParam.action == 'showSnmpTempList') {
    json = require('../json/monitor/showSnmpTempList.json');
  }
  else if (getParam.action == 'showAssetList') {
    json = require('../json/admlog/assetlist.json');
  }
  else if (getParam.action == 'showIdentifyConf') {
    json = require('../json/sysconf/assetIdentification.json');
  }
  else if (getParam.action == 'showAssetTypeList') {
    json = require('../json/sysconf/showAssetTypeList.json');
  }
  else if (getParam.action == 'showAssetGroupList') {
    json = require('../json/sysconf/showAssetGroupList.json');
  }
  else if (getParam.action == 'showMonitorTask') {
    json = require('../json/temporary/montasktable.json');
  }
  else if (getParam.action == 'showMonitorSituation') {
    json = require('../json/temporary/moncard.json');
  }
  else if (getParam.action == 'showVioOutline') {
    json = require('../json/analyse/illout.json')
  }
  else if (getParam.action == 'showVioNetcross') {
    json = require('../json/analyse/series.json')
  }
  else if (getParam.action == 'showVioInline') {
    json = require('../json/analyse/showVioInline.json')
  }
  else if (getParam.action == 'showVioInSummary') {
    json = require('../json/analyse/showVioInSummary.json')
  }
  else if (getParam.action == 'showVioSrvSummary') {
    json = require('../json/analyse/visrvsummary.json')
  }
  else if (getParam.action == 'showVioService') {
    json = require('../json/analyse/showVioService.json')
  }
  else if (getParam.action == 'filterAssetList') {
    json = require('../json/analyse/assetsfillter.json')
  }
  else if (getParam.action == 'filterVioOutline') {
    json = require('../json/analyse/illoutfillter.json')
  }
  else if (getParam.action == 'filterVioInline') {
    json = require('../json/analyse/illinnfillter.json')
  }
  else if (getParam.action == 'filterVioNetcross') {
    json = require('../json/analyse/seriesfillter.json')
  }
  else if (getParam.action == 'filterVioService') {
    json = require('../json/analyse/serverfillter.json')
  }
  else if (getParam.action == 'showResource') {
    json = require('../json/analyse/resmaptable.json')
  }
  else if (getParam.action == 'showMatrix') {
    json = require('../json/analyse/showMatrix.json')
  }
  else if (getParam.action == 'showProbeDetail') {
    json = require('../json/analyse/showProbeDetail.json')
  }
  else if (getParam.action == 'showResourceSummary') {
    json = require('../json/analyse/resmapsummary.json')
  } else if (getParam.action == 'showRiskAnalysis') {
    json = require('../json/analyse/resrisk.json')
  } else if (getParam.action == 'filterRiskAnalysis') {
    json = require('../json/analyse/resriskfilter.json')
  } else if (getParam.action == 'showRiskPercepCfg') {
    json = require('../json/monitor/riskperce.json')
  }
  else if (getParam.action == 'showSwitchDiscovery') {
    json = require('../json/monitor/showSwitchDiscovery.json')
  }
  else if (getParam.action == 'getSwitchlist') {
    json = require('../json/monitor/switchlist.json')
  }
  else if (getParam.action == 'showSwitchDetail') {
    json = require('../json/monitor/showSwitchDetail.json')
  }
  else if (getParam.action == 'showPortTerm') {
    json = require('../json/monitor/showPortTerm.json')
  }
  else if (getParam.action == 'showPortMAC') {
    json = require('../json/monitor/showPortMAC.json')
  }
  else if (getParam.action == 'getSwitchVenderList') {
    json = require('../json/monitor/venderList.json')
  }
  else if (getParam.action == 'showTopology') {
    json = require('../json/monitor/showTopo.json')
  }
  else if (getParam.action == 'showTopoList') {
    json = require('../json/monitor/showTopoList.json')
  }
  else if (getParam.action == 'getSwitchip') {
    json = require('../json/monitor/showswitchip.json')
  }
  else if (getParam.action == 'getPortName') {
    json = require('../json/monitor/getProtName.json')
  }
  else {
  }
  res.send(json);
}
