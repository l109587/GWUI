import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const showList = { "success": true, "data": { "auto_bind_sw": "Y", "auto_bind_ipmac": "Y", "auto_bind_asset": "Y", "auto_bind_swpos": "Y", "auto_bind_user": "Y", "ignore_iprange": "1.1.1.1" } }

//绑定列表
const devList = { "success": true, "data": [{ "status": "N", "mac": "6C:0B:84:3C:6E:42", "ip": "24.50.140.139", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "N", "mac": "40:2C:F4:EB:B1:55", "ip": "23.50.87.239", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "N", "mac": "50:E5:49:2D:6C:F1", "ip": "192.168.134.227", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "N", "mac": "18:C0:4D:1C:6F:D2", "ip": "192.168.134.56", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "N", "mac": "00:0C:29:EB:2D:8C", "ip": "192.168.134.59", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "N", "mac": "00:0C:29:08:49:23", "ip": "192.168.134.58", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "N", "mac": "B8:AE:ED:D8:30:C0", "ip": "192.168.134.60", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "N", "mac": "AA:BB:CC:DD:EE:FF", "ip": "12.34.56.78", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "N", "mac": "30:9C:23:76:CD:9F", "ip": "24.51.63.1", "ostype": "", "osinstime": "", "diskserial": "", "devname": "", "vlan": "", "swaddr": "", "swport": "", "sysuser": "", "authuser": "" }, { "status": "Y", "mac": "11:11:11:11:11:11", "ip": "2.2.2.2", "ostype": "5", "osinstime": "", "diskserial": "4", "devname": "3", "vlan": "9", "swaddr": "", "swport": "8", "sysuser": "10", "authuser": "11" }], "total": "10" }

export default function (getParam, postParam, res) {
  if (getParam.action == 'configShow') {
    res.json(showList);
  }
  if (getParam.action == 'configSet') {
    for (var key in showList.data) {
      if (postParam[key]) {
        console.log(JSON.parse(postParam[key]))
        showList.data[key] = JSON.parse(postParam[key]);
      }
    }
    res.json({ success: true, msg: "操作成功" });
  }

  if (getParam.action == 'devList') {
    res.json(devList);
  }
  if (getParam.action == 'add') {
    let row = {};
    row.status  = postParam.bd_status;
    row.mac  = postParam.bd_mac; 
    row.ip = postParam.bd_ip; 
    row.devname = postParam.bd_devname; 
    row.diskserial = postParam.bd_diskserial; 
    row.ostype = postParam.bd_ostype; 
    row.osinstime = postParam.bd_osinstime; 
    row.swaddr = postParam.bd_swaddr; 
    row.swport = postParam.bd_swport; 
    row.vlan = postParam.bd_vlan; 
    row.sysuser = postParam.bd_sysuser; 
    row.authuser = postParam.bd_authuser; 
    devList.data?.push(row);
    devList.total = devList?.total + 1;
    res.json({ success: true, msg: "操作成功" });
  }
  if (getParam.action == 'set') {
    delete postParam.token;
    let row = {};
    row.status  = postParam.bd_status;
    row.mac  = postParam.bd_mac; 
    row.ip = postParam.bd_ip; 
    row.devname = postParam.bd_devname; 
    row.diskserial = postParam.bd_diskserial; 
    row.ostype = postParam.bd_ostype; 
    row.osinstime = postParam.bd_osinstime; 
    row.swaddr = postParam.bd_swaddr; 
    row.swport = postParam.bd_swport; 
    row.vlan = postParam.bd_vlan; 
    row.sysuser = postParam.bd_sysuser; 
    row.authuser = postParam.bd_authuser; 
    const index = devList?.data?.findIndex((item) => item.mac == postParam.bd_old_mac);
    devList.data[index] = { ...row };
    res.json({ success: true, msg: "操作成功" });
}
  if (getParam.action == 'del') {
    const ids = postParam.ids.split(',')
    ids.map((value) => {
      devList.data = devList?.data?.filter((item) => item.mac !== value);
    })
    devList.total = devList?.data?.length;
    res.json({ success: true, msg: "操作成功" });
  }
}

