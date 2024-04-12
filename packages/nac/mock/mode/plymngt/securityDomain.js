import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const domainShow = {"success":true,"data":[{"text":"全网","value":"全网"},{"text":"内网","value":"内网"},{"text":"外网","value":"外网"}]}


export default function (getParam, postParam, res) {

  if (getParam.action == 'show_securitydomain') {
    mockMethod('show', domainShow, postParam, res)
  }
  if (getParam.action == 'get_securitydomain'){
    const data = mock({
      success:true,
      "data|5":[
        {
          id:"@id",
          safe_domain_name:'@name',
          "safe_domain_info|3":[
            {
              id:'@id',
              ip:'@ip',
              port:'8000',
              directory:'/www/dist',
              protocol:['HTTP','UDP']
            }
          ],
        }
      ],
      total:5
    })
    res.json(data)
  }
  if (getParam.action == 'add_securitydomain'){
    const data = mock({
      success:true,
      msg:'添加成功',
      id:'001',
      safe_domain_name:postParam.safe_domain_name
    })
    res.json(data)
  }

}

