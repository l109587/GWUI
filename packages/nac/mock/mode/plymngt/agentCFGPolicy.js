import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

export default function (getParam, postParam, res) {
  if (getParam.action == 'showAgentCFGPolicy'){
    const data = mock({
      success:true,
      "data|5":[
        {
          id:"@id",
          status:'@pick(["Y", "N"])',
          name:"test",
          dgrpValue:'全网',
          keepalive:'60',
          syntimesign:'@pick(["Y", "N"])',
          showTray:'@pick(["Y", "N"])',
          dns:'@pick(["Y", "N"])',
          checkblockctl:'@pick(["0", "1", "2"])',
          showTrayName:'接入认证客户端',
          applyforquit:'@pick(["Y", "N"])',
        }
      ],
      total:5
    })
    res.json(data)
  }
}