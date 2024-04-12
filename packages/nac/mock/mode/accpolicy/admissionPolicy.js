import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

export default function (getParam, postParam, res) {
  if (getParam.action == 'getAll'){
    const data = mock({
      success:true,
      "data|5":[
        {
          id:"@id",
          status:'@pick(["Y", "N"])',
          name:'text',
          add_user_name:'admin',
          agent_group_id:'全网范围/测试分组',
          algid:'接入位置/全局接入范围',
          dev_type_name:'所有终端',
          dev_type:'1',
          dev_type_name:'所有终端',
          sys_type:'1',
          access_time_id:'一直生效',
          access_mode:'@pick(["check", "forbid","allow"])',//准入方式
          reg_verify_policy:'',//注册审核策略
          checkaction:'1',//安全检查
          auth:'@pick(["", "portal","ukey"])',//身份认证
          blockinfo:'1',//阻断提示
          quarantine_domain_id:'全网',//隔离区域
          is_guest_access:'@pick(["Y","N"])',
          is_delay_access:'@pick(["Y","N"])',
          delay_date:"",//延迟日期
          op_time:'2024-02-02',
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