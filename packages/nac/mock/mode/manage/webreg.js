import { mockMethod } from '../../../src/utils/common'
import Mock, { mock } from 'mockjs'

//nas列表
const show = {"success":true,"total":10,"data":[{"key":"ip","sw":"Y","status":"Y","name":"设备IP","title":"设备IP","form":"input","content":""},{"key":"mac","sw":"Y","status":"Y","name":"设备MAC","title":"设备MAC","form":"input","content":""},{"key":"register","sw":"Y","status":"Y","name":"注册人","title":"注册人","form":"input","content":""},{"key":"department","sw":"Y","status":"N","name":"部门","title":"部门","form":"input","content":""},{"key":"company","sw":"N","status":"N","name":"单位","title":"单位","form":"input","content":""},{"key":"jobnum","sw":"N","status":"N","name":"工号","title":"工号","form":"input","content":""},{"key":"telephone","sw":"N","status":"N","name":"电话","title":"电话","form":"input","content":""},{"key":"email","sw":"N","status":"N","name":"邮箱","title":"邮箱","form":"input","content":""},{"key":"model","sw":"Y","status":"N","name":"设备类型","title":"设备类型","form":"select","content":"个人电脑;WIN服务器;Linux服务器;交换机;网络摄像头;DVR;NVR;其他"},{"key":"vendor","sw":"Y","status":"N","name":"设备厂商","title":"设备厂商","form":"select","content":"海康威视;大华;宇视;天地伟业;安迅士;华为;华三;惠普;锐捷;普联技术;奥尼克斯;科达;天融信;金盾;威视达康;文安智能;中兴;神州数码;深信服;亚安智能;大华乐橙;艾普视达;创新科;飞音时代;富士;联想;超微;网神;网康;网御星云;启明星辰;绿盟;VMWARE;北信源;联软;莱克斯;汉塔;安恒信息;360;和佳软件;盈高科技;浪潮;微软;IBM;MOXA;趋势科技;其它厂商"}]}

export default function (getParam, postParam, res) {
  if (getParam.action == 'showWEBRegFieldList') {
    mockMethod('show', show, postParam, res)
  }
 
  if (getParam.action == 'mod') {
      delete postParam.op;
      delete postParam.token;
      const index = show?.data?.findIndex((item) => item.rad_mac == postParam.rad_mac);
      show.data[index] = { ...postParam };
      res.json({ success: true, msg: "操作成功" });
  }

}

