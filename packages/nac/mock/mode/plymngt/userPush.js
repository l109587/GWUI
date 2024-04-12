import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const pushShow = {"success":true,"total":3,"data":[{"id":"1000","name":"12312","status":"Y","note":"3123","type":"ACCESS_GW","addr":"12.1.1.1","port":28443,"appkey":"123123"},{"id":"1001","name":"1","status":"Y","note":"2","type":"ACCESS_GW","addr":"1.1.1.1","port":28443,"appkey":"4"},{"id":"1002","name":"3","status":"Y","note":"3","type":"ACCESS_GW","addr":"3.3.3.3","port":28443,"appkey":"3"}]}

export default function (getParam, postParam, res) {

  if (getParam.action == 'showUserPush') {
    mockMethod('show', pushShow, postParam, res)
  }else if(getParam.action == 'setUserPush'){
    pushShow.data?.push(postParam);
    pushShow.total = pushShow?.total + 1;
    res.json({ success: true, msg: "操作成功" });
  }

}

