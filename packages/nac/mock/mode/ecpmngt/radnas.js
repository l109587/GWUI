import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

//nas列表
const nasShow = {"success":true,"total":2,"data":[{"id":"1000", "name":"QQQ", "swips":"1.1.1.1;2.2.2.2", "secret":"QQQQQQ", "note":"QWE", "pap":"Y", "chap":"Y", "md5":"N"}, {"id":"1001", "name":"11111", "swips":"4.4.4.4", "secret":"22222", "note":"33333", "pap":"Y", "chap":"Y", "md5":"N"}]}


export default function (getParam, postParam, res) {
  if (getParam.action == 'show') {
    mockMethod('show', nasShow, postParam, res)
  }
  if (getParam.action == 'add') {
    mockMethod(postParam.op, nasShow, postParam, res)
  }
  if (getParam.action == 'mod') {
    mockMethod(postParam.op, nasShow, postParam, res)
  }
  if (getParam.action == 'del') {
    mockMethod('del', nasShow, postParam, res)
  }


}

