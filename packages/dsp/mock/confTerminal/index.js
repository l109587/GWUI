import { mockMethod } from "../../src/utils/common";
import Mock, { mock } from "mockjs";

const show = {
  success: true,
  data: [
    {
      onstate: 0,
      regstate: "0",
      authstate: "0",
      device_id: "220409012001",
      host_name: "xxx",
      ip: "192.168.12.100",
      mac: "98:FA:9B:C2:83:47",
      netmask: "255.255.255.0",
      geteway: "192.168.12.1",
      os: "xxx",
      arch: "xxx",
      department: "xxx",
      user_name: "xxx",
      lasttime: "4",
      soft_version: "xxx",
      cpu_info: { physical_id: 0, core: 8, clock: 1.8 },
      disk_info: { size: 500, serial: "ST10000NM0011" },
      certsn: "010FB0FFAD9B7B9FB587245C3EECC0BDC58D8929",
      mem_total: "4096",
      memo: "xxx",
    },
  ],
};

export default function (getParam, postParam, res) {
  if (getParam.action == "showList") {
    mockMethod("show", show, postParam, res);
  }
}
