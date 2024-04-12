import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

export default function (getParam, postParam, res) {
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