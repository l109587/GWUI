import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

//mac白名单
const get_macwhite = { "success": true, "total": "2", "data": [{ "id": "1000", "name": "123123123", "macaddr": "11:11:11:11:11:11", "verify_mode": "abort", "time": "2023-08-16 14:42:19", "status": "0", "notes": "123123" }, { "id": "1001", "name": "111", "macaddr": "11:11:11:11:11:12;11:11:11:11:11:13", "verify_mode": "forever", "time": "0", "status": "1", "notes": "1111" }] }
//mac黑名单
const get_macblack = { "success": true, "total": "2", "data": [{ "id": "1000", "name": "123", "macaddr": "11:11:11:11:11:11", "verify_mode": "abort", "time": "2023-08-16 16:34:56", "status": "1", "notes": "123111" }, { "id": "1001", "name": "1222", "macaddr": "22:22:22:22:22:22;22:22:22:22:22:23", "verify_mode": "forever", "time": "0", "status": "1", "notes": "222" }] }
//ip白名单
const get_unmanage = { "success": true, "total": "2", "data": [{ "id": "1000", "name": "111", "iprange": "1.1.1.1", "verify_mode": "forever", "notes": "123", "time": "0", "status": "1", "area": "-1" }, { "id": "1001", "name": "213", "iprange": "1.21.1.1;2.2.2.2", "verify_mode": "abort", "notes": "123", "time": "2023-8-16 17:1:57", "status": "1", "area": "-1" }] }

//ip黑名单
const get_blacklist = { "success": true, "total": "2", "data": [{ "id": "1000", "name": "123123", "iprange": "2.2.2.2;2.2.2.1", "verify_mode": "forever", "notes": "123123", "area": "-1", "time": "0", "status": "1" }, { "id": "1001", "name": "222", "iprange": "2.2.2.4", "verify_mode": "abort", "notes": "222", "area": "-1", "time": "2023-8-16 17:20:34", "status": "1" }] }

//服务器白名单
const add_serverwhite = {"success":true,"total":"2","data":[{"id":"1000","name":"11212","iprange":"1.1.1.1","notes":""},{"id":"1001","name":"1222","iprange":"11.1.1.1;11.1.1.2","notes":"12"}]}

export default function (getParam, postParam, res) {
  //mac白名单
  if (getParam.action == 'get_macwhite') {
    mockMethod('show', get_macwhite, postParam, res)
  }
  if (getParam.action == 'add_macwhite') {
    mockMethod(postParam.op, get_macwhite, postParam, res)
  }
  if (getParam.action == 'modify_macwhite') {
    mockMethod(postParam.op, get_macwhite, postParam, res)
  }
  if (getParam.action == 'del_macwhite') {
    mockMethod('del', get_macwhite, postParam, res)
  }

  //mac黑名单
  if (getParam.action == 'get_macblack') {
    mockMethod('show', get_macblack, postParam, res)
  }
  if (getParam.action == 'add_macblack') {
    mockMethod(postParam.op, get_macblack, postParam, res)
  }
  if (getParam.action == 'modify_macblack') {
    mockMethod(postParam.op, get_macblack, postParam, res)
  }
  if (getParam.action == 'del_macblack') {
    mockMethod('del', get_macblack, postParam, res)
  }

  //ip白名单
  if (getParam.action == 'get_unmanage') {
    mockMethod('show', get_unmanage, postParam, res)
  }
  if (getParam.action == 'add_unmanage') {
    mockMethod(postParam.op, get_unmanage, postParam, res)
  }
  if (getParam.action == 'modify_unmanage') {
    mockMethod(postParam.op, get_unmanage, postParam, res)
  }
  if (getParam.action == 'del_unmanage') {
    mockMethod('del', get_unmanage, postParam, res)
  }

  //ip黑名单
  if (getParam.action == 'get_blacklist') {
    mockMethod('show', get_blacklist, postParam, res)
  }
  if (getParam.action == 'add_blacklist') {
    mockMethod(postParam.op, get_blacklist, postParam, res)
  }
  if (getParam.action == 'modify_blacklist') {
    mockMethod(postParam.op, get_blacklist, postParam, res)
  }
  if (getParam.action == 'del_blacklist') {
    mockMethod('del', get_blacklist, postParam, res)
  }

    //服务器白名单
    if (getParam.action == 'get_servers') {
      mockMethod('show', add_serverwhite, postParam, res)
    }
    if (getParam.action == 'add_serverwhite') {
      mockMethod(postParam.op, add_serverwhite, postParam, res)
    }
    if (getParam.action == 'modify_serverwhite') {
      mockMethod(postParam.op, add_serverwhite, postParam, res)
    }
    if (getParam.action == 'del_serverwhite') {
      mockMethod('del', add_serverwhite, postParam, res)
    }
}

