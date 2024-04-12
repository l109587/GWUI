import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const show = {"success":true,"data":[{"value":"1000","text":"123213"},{"value":"1001","text":"222222"}]}
const show1 = {"success":true,"data":[]}
const show2= {"success":true,"data":[{"value":"100022","text":"2222222"},{"value":"333","text":"3333333"}]}

export default function (getParam, postParam, res) {

  if (getParam.action == 'showRuleNameList') {
    console.log(postParam)
    if(postParam.systype == 'win'){
      mockMethod('show', show, postParam, res)
    }else if(postParam.systype == 'chs'){
      mockMethod('show', show2, postParam, res)
    }else {
      mockMethod('show', show1, postParam, res)
    }
  }

}
 
