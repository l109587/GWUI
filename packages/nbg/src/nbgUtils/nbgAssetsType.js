import { TypeIcon } from "./SymbolIcon";
export const assetType = (props) => {
  let icon = props ? props?.toUpperCase() : "";
  if (icon == "PC") {
    // PC计算机
    return <TypeIcon type="icon-PC" />;
  } else if (icon == "SWITCH") {
    // 交换机
    return <TypeIcon type="icon-SWITCH" />;
  } else if (icon == "VM") {
    // VMware vSphere虚拟化平台
    return <TypeIcon type="icon-VM" />;
  } else if (icon == "CAMERA") {
    // 网络摄像头
    return <TypeIcon type="icon-CAMERA" />;
  } else if (icon == "SERVER") {
    // 服务器
    return <TypeIcon type="icon-SERVER" />;
  } else if (icon == "PRINTER") {
    // 打印机
    return <TypeIcon type="icon-PRINTER" />;
  } else if (icon == "VIDEOSERVER") {
    // 视频监控平台
    return <TypeIcon type="icon-VIDEOSERVER" />;
  } else if (icon == "MOBILE") {
    // 手持终端
    return <TypeIcon type="icon-MOBILE" />;
  } else if (icon == "PDA") {
    // 手持终端
    return <TypeIcon type="icon-MOBILE" />;
  } else if (icon == "THINCLIENT") {
    // 瘦客户端
    return <TypeIcon type="icon-THINCLIENT" />;
  } else if (icon == "MOBILEPHONE") {
    // 手机
    return <TypeIcon type="icon-MOBILEPHONE" />;
  } else if (icon == "PAD") {
    // 平板电脑
    return <TypeIcon type="icon-PAD" />;
  } else if (icon == "ROUTER") {
    // 路由器
    return <TypeIcon type="icon-ROUTER" />;
  } else if (icon == "FIREWALL") {
    // 防火墙
    return <TypeIcon type="icon-FIREWALL" />;
  } else if (icon == "GAP") {
    // 网闸
    return <TypeIcon type="icon-GAP" />;
  } else if (icon == "BASTIONHOST") {
    // 堡垒机
    return <TypeIcon type="icon-BASTIONHOST" />;
  } else if (icon == "AUTH") {
    // 身份认证
    return <TypeIcon type="icon-AUTH" />;
  } else if (icon == "WEBSCAN") {
    // WEB漏扫
    return  <TypeIcon type="icon-WEBSCAN" />;
  } else if (icon == "DDOSPROTECTION") {
    // 抗DDOS
    return <TypeIcon type="icon-DDOSPROTECTION" />;
  } else if (icon == "LOADBALANCE") {
    // 负载均衡
    return <TypeIcon type="icon-LOADBALANCE" />;
  } else if (icon == "AC") {
    // 上网行为管理
    return <TypeIcon type="icon-AC" />;
  } else if (icon == "NTC") {
    // 流量管理
    return <TypeIcon type="icon-NTC" />;
  } else if (icon == "UTM") {
    // UTM
    return <TypeIcon type="icon-UTM" />;
  } else if (icon == "WAF") {
    // WAF
    return <TypeIcon type="icon-WAF" />;
  } else if (icon == "IDS") {
    // IDS
    return <TypeIcon type="icon-IDS" />;
  } else if (icon == "VPN") {
    // VPN
    return <TypeIcon type="icon-VPN" />;
  } else if (icon == "DLP") {
    // DLP
    return <TypeIcon type="icon-DLP" />;
  } else if (icon == "DBA") {
    // 数据库审计
    return <TypeIcon type="icon-DBA" />;
  } else if (icon == "ASSET") {
    // 资产管理
    return <TypeIcon type="icon-ASSET" />;
  } else if (icon == "VDS") {
    // 脆弱性扫描
    return <TypeIcon type="icon-VDS" />;
  } else if (icon == "SAS") {
    // 安全审计
    return <TypeIcon type="icon-SAS" />;
  } else if (icon == "WIRELESS") {
    // 无线路由
    return <TypeIcon type="icon-WIRELESS" />;
  } else if (icon == "NAC") {
    // 网络准入
    return <TypeIcon type="icon-NAC" />;
  } else if (icon == "AP") {
    // 无线热点
    return <TypeIcon type="icon-AP" />;
  } else if (icon == "IPPBX") {
    // 语音网关
    return <TypeIcon type="icon-IPPBX" />;
  } else if (icon == "LOGMANAGER") {
    // 日志分析管理
    return <TypeIcon type="icon-LOGMANAGER" />;
  } else if (icon == "SAFETY") {
    // 安全产品
    return <TypeIcon type="icon-SAFETY" />;
  } else if (icon == "NETWORKDEVICE") {
    // 网络设备
    return <TypeIcon type="icon-NETWORKDEVICE" />;
  } else if (icon == "VMSERVER") {
    // 虚拟化服务器
    return <TypeIcon type="icon-VMSERVER" />;
  } else if (icon == "NAS") {
    // 网络存储
    return <TypeIcon type="icon-NAS" />;
  } else if (icon == "MCUSERVER") {
    // MCU服务器
    return <TypeIcon type="icon-MCUSERVER" />;
  } else if (icon == "ATTENDANCE") {
    // 考勤系统
    return <TypeIcon type="icon-ATTENDANCE" />;
  } else if (icon == "ADSERVER") {
    // AD域服务器
    return <TypeIcon type="icon-ADSERVER" />;
  } else if (icon == "LDAPSERVER") {
    // LDAP服务器
    return <TypeIcon type="icon-LDAPSERVER" />;
  } else if (icon == "PROXYSERVER") {
    // 代理服务器
    return <TypeIcon type="icon-PROXYSERVER" />;
  } else if (icon == "SERIALSERVER") {
    // 串口设备
    return <TypeIcon type="icon-SERIALSERVER" />;
  } else if (icon == "PRINTINGSERVER") {
    // 打印服务器
    return <TypeIcon type="icon-PRINTINGSERVER" />;
  } else if (icon == "FAXSERVER") {
    // 传真服务器
    return <TypeIcon type="icon-FAXSERVER" />;
  } else if (icon == "BIGDATA") {
    // 大数据服务器
    return <TypeIcon type="icon-BIGDATA" />;
  } else if (icon == "STORAGEDEVICE") {
    // 存储设备
    return <TypeIcon type="icon-STORAGEDEVICE" />;
  } else if (icon == "AM") {
    // 考勤机
    return <TypeIcon type="icon-AM" />;
  } else if (icon == "ATM") {
    // 自助缴费查询终端
    return <TypeIcon type="icon-ATM" />;
  } else if (icon == "UPS") {
    // UPS主机
    return <TypeIcon type="icon-UPS" />;
  } else if (icon == "MCU") {
    // 一体化视频会议终端
    return <TypeIcon type="icon-MCU" />;
  } else if (icon == "CLOUDTERMINAL") {
    // 云终端
    return <TypeIcon type="icon-CLOUDTERMINAL" />;
  } else if (icon == "SMARTMETER") {
    // 智能电表
    return <TypeIcon type="icon-SMARTMETER" />;
  } else if (icon == "POS") {
    // POS终端
    return <TypeIcon type="icon-POS" />;
  } else if (icon == "FAX") {
    // 传真机
    return <TypeIcon type="icon-FAX" />;
  } else if (icon == "SCANNER") {
    // 扫描仪
    return <TypeIcon type="icon-SCANNER" />;
  } else if (icon == "ACT") {
    // 门禁
    return <TypeIcon type="icon-ACT" />;
  } else if (icon == "VOIP") {
    // 网络电话机
    return <TypeIcon type="icon-VOIP" />;
  } else if (icon == "ONU") {
    // 光网络单元
    return <TypeIcon type="icon-ONU" />;
  } else if (icon == "APPSERVER") {
    // 应用服务器
    return <TypeIcon type="icon-APPSERVER" />;
  } else if (icon == "IPS") {
    // IPS
    return <TypeIcon type="icon-IPS" />;
  } else if (icon == "MEDIADEV") {
    // 媒体设备
    return <TypeIcon type="icon-MEDIADEV" />;
  } else if (icon == "POWER") {
    // 电力设备
    return <TypeIcon type="icon-POWER" />;
  } else if (icon == "POWERQUALITY") {
    // 电能质量在线监测装置
    return <TypeIcon type="icon-POWERQUALITY" />;
  } else if (icon == "OILCG") {
    // 油色谱在线监测装置
    return<TypeIcon type="icon-OILCG" />;
  } else if (icon == "EEAT") {
    // 用电信息采集设备
    return <TypeIcon type="icon-EEAT" />;
  } else if (icon == "BDTERMINAL") {
    // 北斗采集终端
    return <TypeIcon type="icon-BDTERMINAL" />;
  } else if (icon == "DESKTOP") {
    // 台式机
    return <TypeIcon type="icon-DESKTOP" />;
  } else if (icon == "LAPTOP") {
    // 笔记本电脑
    return <TypeIcon type="icon-LAPTOP" />;
  } else if (icon == "BRIDGE") {
    // 网桥
    return <TypeIcon type="icon-BRIDGE" />;
  } else if (icon == "TELECOMMISC") {
    // 电信设备
    return <TypeIcon type="icon-TELECOMMISC" />;
  } else if (icon == "HUB") {
    // 集线器
    return <TypeIcon type="icon-HUB" />;
  } else if (icon == "CAC") {
    // CAC在线监测装置系统
    return <TypeIcon type="icon-CAC" />;
  } else if (icon == "PEM") {
    // 动力环境监控系统
    return <TypeIcon type="icon-PEM" />;
  } else if (icon == "DNBZZGSYS") {
    // 电能表计量周转柜系统
    return <TypeIcon type="icon-DNBZZGSYS" />;
  } else if (icon == "VOIPADAPTER") {
    // VoIP适配器
    return <TypeIcon type="icon-VOIPADAPTER" />;
  } else if (icon == "POLYCOMTERMINAL") {
    // Polycom终端
    return <TypeIcon type="icon-POLYCOMTERMINAL" />;
  } else if (icon == "DVR") {
    // 数字硬盘录像机
    return <TypeIcon type="icon-DVR" />;
  } else if (icon == "NVR") {
    // 网络硬盘录像机
    return <TypeIcon type="icon-NVR" />;
  } else if (icon == "ENCODER") {
    // 编码器
    return <TypeIcon type="icon-ENCODER" />;
  } else if (icon == "GAMECONSOLE") {
    // 游戏设备
    return <TypeIcon type="icon-GAMECONSOLE" />;
  } else if (icon == "TERMINAL") {
    // Terminal
    return<TypeIcon type="icon-Terminal" />;
  } else if (icon == "TELEVISION") {
    // 电视机
    return <TypeIcon type="icon-TELEVISION" />;
  } else if (icon == "IOT") {
    // 物联网设备
    return <TypeIcon type="icon-IOT" />;
  } else if (icon == "WINDOWSSERVER") {
    // Windows服务器
    return <TypeIcon type="icon-WINDOWSSERVER" />;
  } else if (icon == "LINUXSERVER") {
    // Linux服务器
    return <TypeIcon type="icon-LINUXSERVER" />;
  } else if (icon == "VMWAREVSPHERE") {
    // VMware vSphere虚拟化平台
    return <TypeIcon type="icon-VMWAREVSPHERE" />;
  } else if (icon == "VMWAREESXI") {
    // VMware ESXi虚拟化平台
    return <TypeIcon type="icon-VMWAREESXI" />;
  } else if (icon == "VSS") {
    // 视频存储服务器
    return <TypeIcon type="icon-VSS" />;
  } else if (icon == "TERMINALSERVER") {
    // 终端服务器
    return <TypeIcon type="icon-TERMINALSERVER" />;
  } else if (icon == "REMOTEMANAGEMENT") {
    // 远程管理
    return <TypeIcon type="icon-REMOTEMANAGEMENT" />;
  } else if (icon == "VCS") {
    // 视频会议录播服务器
    return <TypeIcon type="icon-VCS" />;
  } else if (icon == "GENERAL") {
    // 一般设备
    return <TypeIcon type="icon-GENERAL" />;
  } else if (icon == "SPECIALIZED") {
    // 特定设备
    return <TypeIcon type="icon-SPECIALIZED" />;
  } else if (icon == "UNKNOWN") {
    // 未知类型
    return <TypeIcon type="icon-UNKNOWN" />;
  } else {
    // 未知类型
    return <TypeIcon type="icon-UNKNOWN" />;
  }
};
