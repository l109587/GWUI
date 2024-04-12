import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

const radshow = {"success":true,"data":{"radcfg":{"radsw":"Y", "checksw":"N", "escapesw":"N", "auto_escape":"Y","escape_time":"60","escape_devnum":"60","acl_escape":"N","firverify":"Y", "pc":"Y", "dumb":"N", "assets":"N", "bothway":"N", "aspidauth":"N", "aspidmac":"N","multi_domain":"Y","exdomain":"baidu.com;zhuhu.com"},"radlog":{"raddebug":"Y"},"domaincfg":{"linksw":"Y", "linktype":"ad", "group":"123123123123", "domain":"www.baidu.com", "user":"123", "passwd":"12313"},"radcert":{"certsw":"N", "cert_origin":"self", "key_type":"SM2"},"radantifake":{"afsw":"Y", "afencpass":""}}}

export default function (getParam, postParam, res) {
  if (getParam.action == 'radshow') {
    res.json(radshow);
  }
  if (getParam.action == 'radset') {
    for(var key in radshow.data){
      if(postParam[key]){
        console.log(JSON.parse(postParam[key]))
        radshow.data[key] = JSON.parse(postParam[key]);
      }
    }
    res.json({ success: true, msg: "操作成功" });
  }

  if (getParam.action == 'antifakeconfig') {
    for(var key in radshow.data){
      if(postParam[key]){
        console.log(JSON.parse(postParam[key]))
        radshow.data[key] = JSON.parse(postParam[key]);
      }
    }
    res.json({ success: true, msg: "操作成功" });
  }
 
}

