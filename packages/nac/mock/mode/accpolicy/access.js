import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const show = {"success":true,"data":[{"state":"N","mode":1,"dhcp_interface":"(null)","native_vlan":0,"sync_control":"N","isonet_gwip":"","isonet_vlan":"","dns":"","pcap_state":""}]}
const arp_show = {"success":true, "data":[{"state":"N", "arp_interface":"mgt:213;eth0:213", "block_type":"0", "block_power":"0", "block_default_gw":"Y", "cycle_block":"Y", "cycle_time":"5", "err_default":"pass"}]};

const vgw_show = {"success":true, "data":[{"state":"N", "port_control":"0", "time_id":"", "port_up_time":"0", "port_down_time":"0"}]}

export default function (getParam, postParam, res) {

  if (getParam.action == 'dhcp_get') {
    mockMethod('show', show, postParam, res)
  } else if (getParam.action == 'arp_get') {
    mockMethod('show', arp_show, postParam, res)
  } else if (getParam.action == 'vgw_get') {
    mockMethod('show', vgw_show, postParam, res)
  }

}

