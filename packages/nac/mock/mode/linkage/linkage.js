import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

export default function (getParam, postParam, res) {
  if (getParam.action == 'get_edp_list'){
    const data = mock({
      success:true,
      "data|5":[
        {
          id:"@id",
          linkage_state:'@pick(["on", "off"])',
          srvstatus:'@pick(["-1","2"])',
          mqstatus:'@pick(["0","1"])',
          edpver:'@pick(["v1", "v2"])',
          linkage_syncset:'@pick(["on", "off"])',
          linkage_synreg:'@pick(["on", "off"])',
          uninstallinfosw:'@pick(["on", "off"])',
          synblock:'@pick(["on", "off"])',
          linkage_ip:'@ip',
          linkage_port:'8080',
          "linkage_umgip|3":[
            {
              id:"@id",
              ip:"@ip"
            }
          ],
        }
      ],
      total:5
    })
    res.json(data)
  }
}