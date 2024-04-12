import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const show = {"success":true,"data":{"sw":"Y", "bas_port":"20001"}};
const url = {"success":true,"data": {"url":"http://10.88.8.20:8080/portal"}};

export default function (getParam, postParam, res) {
  //mac白名单
  if (getParam.action == 'show') {
    res.json(show);
  }
  if (getParam.action == 'url') {
    res.json(url);
  }
  if (getParam.action == 'set') {
    for(var key in show.data){
      if(postParam[key]){
        console.log(JSON.parse(postParam[key]))
        show.data[key] = JSON.parse(postParam[key]);
      }
    }
    res.json({ success: true, msg: "操作成功" });
  }
 
}

