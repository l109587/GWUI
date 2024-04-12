import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const show = {"success":true,"data":[{"name":"mgt","value":"mgt"},{"name":"eth0","value":"eth0"},{"name":"eth1","value":"eth1"},{"name":"eth2","value":"eth2"},{"name":"eth3","value":"eth3"}]};

export default function (getParam, postParam, res) {

  if (getParam.action == 'getEthList') {
    mockMethod('show', show, postParam, res)
  }

}

