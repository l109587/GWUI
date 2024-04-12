import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const getUpgradeVersion = { "success": true, "agentVersion": [{ "text": "Windows", "value": "win", "versions": [{ "md5": "8f6e164dedde5ae707f9bf4621d91d18", "text": "V3.1.23" }] }, { "text": "Linux", "value": "lin", "versions": [] }, { "text": "信创", "value": "chs", "versions": [] }], "identVersion": [{ "value": "", "text": "" }] }

const showUpgradePolicy = { "success": true, "total": 3, "data": [{ "id": "1000", "name": "1221", "status": "Y", "devgrpid": "1", "dgrpValue": "全网范围/12.81", "agent": "Y", "agentType": "win", "agentVersion": "V3.1.23", "agentMd5": "8f6e164dedde5ae707f9bf4621d91d18", "effectReboot": "Y", "ident": "N", "identVersion": "", "identMd5": "" }, { "id": "1001", "name": "1", "status": "Y", "devgrpid": "0", "dgrpValue": "全网范围", "agent": "Y", "agentType": "win", "agentVersion": "V3.1.23", "agentMd5": "8f6e164dedde5ae707f9bf4621d91d18", "effectReboot": "Y", "ident": "N", "identVersion": "", "identMd5": "" }, { "id": "1009", "name": "11111", "status": "Y", "devgrpid": "0", "dgrpValue": "全网范围", "agent": "Y", "agentType": "win", "agentVersion": "V3.1.23", "agentMd5": "8f6e164dedde5ae707f9bf4621d91d18", "effectReboot": "N", "ident": "N", "identVersion": "", "identMd5": "" }] }


export default function (getParam, postParam, res) {

  if (getParam.action == 'getUpgradeVersion') {
    mockMethod('show', getUpgradeVersion, postParam, res)
  }

  if (getParam.action == 'showUpgradePolicy') {
    mockMethod('show', showUpgradePolicy, postParam, res)
  }
  if (getParam.action == 'setUpgradePolicy') {
    if (postParam.opcode == 'add') {
      delete postParam.opcode;
      delete postParam.token;
      const uuid = new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2, 9)
      showUpgradePolicy?.data?.push({ ...postParam, id: uuid });
      showUpgradePolicy.total = showUpgradePolicy?.total + 1;
      res.json({ success: true, msg: "操作成功" });
    } else {
      delete postParam.opcode;
      delete postParam.token;
      const index = showUpgradePolicy?.data?.findIndex((item) => item.id == postParam.id);
      showUpgradePolicy.data[index] = { ...postParam };
      res.json({ success: true, msg: "操作成功" });
    }
  }
  if (getParam.action == 'delUpgradePolicy') {
    const id = postParam.id.split(',')
    id.map((value) => {
      showUpgradePolicy.data = showUpgradePolicy?.data?.filter((item) => item.id !== value);
    })
    showUpgradePolicy.total = showUpgradePolicy?.data?.length;
    res.json({ success: true, msg: "操作成功" });
  }

}

