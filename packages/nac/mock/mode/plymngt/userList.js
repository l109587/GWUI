import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const userListShow = {"success":true,"total":"2","data":[{"id":"2","status":"1","name":"21222","text":"213213","note":"","kind":"local","kindName":"\u672c\u5730\u8ba4\u8bc1\u8d26\u53f7","group":"\u5168\u90e8\u7528\u6237","gpid":"1","gpath":"1.","expire":"N","expireDate":"1970-01-01","IDCard":"","phone":"","email":"","pwdlastset":"2024-01-25 23:23:37","bindType":"dev","bindDev":"","bindMac":"","loginType":"single","loginReplace":"Y","loginNums":"1","loginArea":"N","areaAction":"permit","areaRange":"","loginTime":"N","timeAction":"permit","begTime":"0","endTime":"23","authority":"N","authorityContent":"","syncSvrName":"","replaceConfirm":"N","onlineControl":"N","onlineTimePeriod":"","onlineScale":"hour"},{"id":"1","status":"1","name":"123123","text":"123123","note":"","kind":"local","kindName":"\u672c\u5730\u8ba4\u8bc1\u8d26\u53f7","group":"\u5168\u90e8\u7528\u6237","gpid":"1","gpath":"1.","expire":"N","expireDate":"1970-01-01","IDCard":"","phone":"","email":"","pwdlastset":"2024-01-25 22:24:18","bindType":"dev","bindDev":"","bindMac":"","loginType":"single","loginReplace":"Y","loginNums":"1","loginArea":"N","areaAction":"permit","areaRange":"","loginTime":"N","timeAction":"permit","begTime":"0","endTime":"23","authority":"N","authorityContent":"","syncSvrName":"","replaceConfirm":"N","onlineControl":"N","onlineTimePeriod":"","onlineScale":"hour"}]}

const authUserListShow =  {"success":true,"total":"5","data":[{"id":"6","name":"123123","uid":"1","text":"123123","status":"1","group":"\u5168\u90e8\u7528\u6237","kindName":"\u672c\u5730\u8ba4\u8bc1\u8d26\u53f7","loginType":"single","authorityGroup":"222222","authority":"\u5168\u7f51"},{"id":"5","name":"21222","uid":"2","text":"213213","status":"1","group":"\u5168\u90e8\u7528\u6237","kindName":"\u672c\u5730\u8ba4\u8bc1\u8d26\u53f7","loginType":"single","authorityGroup":"222222","authority":"\u5168\u7f51"},{"id":"4","name":"21222","uid":"2","text":"213213","status":"1","group":"\u5168\u90e8\u7528\u6237","kindName":"\u672c\u5730\u8ba4\u8bc1\u8d26\u53f7","loginType":"single","authorityGroup":"1231","authority":""},{"id":"3","name":"123123","uid":"1","text":"123123","status":"1","group":"\u5168\u90e8\u7528\u6237","kindName":"\u672c\u5730\u8ba4\u8bc1\u8d26\u53f7","loginType":"single","authorityGroup":"1231","authority":""},{"id":"1","name":"123123","uid":"1","text":"123123","status":"1","group":"\u5168\u90e8\u7528\u6237","kindName":"\u672c\u5730\u8ba4\u8bc1\u8d26\u53f7","loginType":"single","authorityGroup":"123","authority":"\u5168\u7f51"}]}

const authGroupListShow =  [{"name":"全部分组","authority":"","note":"全部分组","id":"-1","children":[{"id":"1","name":"qwe","authority":"全网","note":"qwe"},{"id":"3","name":"bbbb","authority":"外网","note":"s"},{"id":"4","name":"dsafs","authority":"外网","note":"s"},{"id":"5","name":"22221","authority":"全网","note":"2221"},{"id":"6","name":"12","authority":"全网","note":"22"}]}]

export default function (getParam, postParam, res) {

  if (getParam.action == 'showUserInfo') {
    mockMethod('show', userListShow, postParam, res)
  }
  if (getParam.action == 'showAuthUserList') {
    mockMethod('show', authUserListShow, postParam, res)
  }
  if (getParam.action == 'getAuthGroup') {
    mockMethod('show', authGroupListShow, postParam, res)
  }
  if (getParam.action == 'setAuthGroup') {
    // mockMethod('add', authUserListShow, postParam, res)
  }

}

