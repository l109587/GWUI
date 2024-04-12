import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

//nas列表
const show = { "success": true, "data": [{ "rad_mac": "11:11:11:11:11:11", "remark": "121233" }, { "rad_mac": "22:22:22:22:22:22", "remark": "2132213" }], "total": "2" }


export default function (getParam, postParam, res) {
  if (getParam.action == 'show') {
    mockMethod('show', show, postParam, res)
  }
  if (getParam.action == 'add') {
    show.data?.push(postParam);
    show.total = show?.total + 1;
    res.json({ success: true, msg: "操作成功" });
  }
  if (getParam.action == 'mod') {
      delete postParam.op;
      delete postParam.token;
      const index = show?.data?.findIndex((item) => item.rad_mac == postParam.rad_mac);
      show.data[index] = { ...postParam };
      res.json({ success: true, msg: "操作成功" });
  }
  if (getParam.action == 'del') {
    const ids = postParam.ids.split(',')
      ids.map((value)=>{
        show.data = show?.data?.filter((item) => item.rad_mac !==value);
      })
      show.total = show?.data?.length;
      res.json({ success: true, msg: "操作成功" });
  }


}

