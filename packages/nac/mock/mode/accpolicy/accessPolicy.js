import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

export default function (getParam, postParam, res) {
  if (getParam.action == 'show'){
    const data = mock({
      success:true,
      "data|5":[
        {
          id:"@id",
          state:'@pick(["Y", "N"])',
          name:'text',
          type:'@pick(["dev", "role"])',
          object:'全网范围/测试分组',
          authority:'全网',
          action:'@pick(["permit", "reject"])',
          from:'local',
          admin:'admin',
          createtime:'2024-02-02',
          updatetime:'2024-02-02',
          'number|+1':1,
          first:function(options){
            return options.context.currentContext.number===1
          },
          last:function(options){
            return options.context.currentContext.number===5
          }
        }
      ],
      total:5
    })
    res.json(data)
  }
}