import { mockMethod } from "../../../src/utils/common";
import Mock, { mock } from "mockjs";

const show = {
  success: true,
  data: [
    {
      id: "0",
      name: "antivirus",
      text: "杀毒软件",
      display: "杀毒软件",
      repairTip: "请安装杀毒软件:",
    },
    {
      id: "1",
      name: "share",
      text: "共享资源",
      display: "共享资源",
      repairTip: "存在违规共享资源: ",
    },
    {
      id: "2",
      name: "sysflaw",
      text: "系统漏洞",
      display: "系统漏洞",
      repairTip: "请修复系统漏洞:",
    },
    {
      id: "3",
      name: "guest",
      text: "来宾访客",
      display: "来宾访客",
      repairTip: "请禁用Guest账户",
    },
    {
      id: "4",
      name: "remote",
      text: "远程桌面",
      display: "远程桌面",
      repairTip: "请关闭远程桌面",
    },
    {
      id: "5",
      name: "startitem",
      text: "启动项检查",
      display: "启动项检查",
      repairTip: "",
    },
    {
      id: "6",
      name: "pw",
      text: "密码策略",
      display: "密码策略",
      repairTip: "",
    },
    {
      id: "7",
      name: "ad",
      text: "AD域检查",
      display: "AD域检查",
      repairTip: "请登录AD域:",
    },
    {
      id: "8",
      name: "weakpass",
      text: "弱口令检查",
      display: "弱口令检查",
      repairTip: "弱口令账号:",
    },
    {
      id: "9",
      name: "registry",
      text: "注册表检查",
      display: "注册表检查",
      repairTip: "存在不合规的注册表项:",
    },
    {
      id: "10",
      name: "software",
      text: "软件安装",
      display: "软件安装",
      repairTip: "",
    },
    {
      id: "11",
      name: "homepage",
      text: "浏览器主页",
      display: "浏览器主页",
      repairTip: "请设置浏览器主页为:",
    },
    {
      id: "12",
      name: "service",
      text: "服务运行",
      display: "服务运行",
      repairTip: "",
    },
    {
      id: "13",
      name: "process",
      text: "进程运行",
      display: "进程运行",
      repairTip: "",
    },
    {
      id: "14",
      name: "edp-ver",
      text: "EDP版本",
      display: "EDP版本",
      repairTip: "请安装高版本EDP客户端",
    },
    {
      id: "15",
      name: "edp-ply",
      text: "EDP策略",
      display: "EDP策略",
      repairTip: "",
    },
    {
      id: "16",
      name: "office",
      text: "Office正版",
      display: "Office正版",
      repairTip: "非正版Office序列号:",
    },
    {
      id: "17",
      name: "outline",
      text: "违规外联",
      display: "违规外联",
      repairTip: "存在违规外联:",
    },
    {
      id: "18",
      name: "net-port",
      text: "端口开放",
      display: "端口开放",
      repairTip: "端口开放安检不合规: ",
    },
    {
      id: "19",
      name: "net-flow",
      text: "流量检测",
      display: "流量检测",
      repairTip: "实时流量检测已超出上限,流量上限为:_Kbps",
    },
    {
      id: "20",
      name: "firewall",
      text: "防火墙检查",
      display: "防火墙检查",
      repairTip: "防火墙安检不合规: ",
    },
    {
      id: "21",
      name: "hardware",
      text: "硬件安装",
      display: "硬件安装",
      repairTip: "存在不合规的硬件安装: ",
    },
    {
      id: "22",
      name: "proxy",
      text: "浏览器代理",
      display: "浏览器代理",
      repairTip: "请关闭浏览器代理: ",
    },
    {
      id: "23",
      name: "ieplugin",
      text: "浏览器插件",
      display: "浏览器插件",
      repairTip: "浏览器插件安检不合规: ",
    },
    {
      id: "24",
      name: "os",
      text: "操作系统",
      display: "操作系统",
      repairTip: "存在不合规的操作系统版本:",
    },
    {
      id: "25",
      name: "screen",
      text: "屏幕保护",
      display: "屏幕保护",
      repairTip: "屏幕保护安检不合规:",
    },
    {
      id: "26",
      name: "ipget",
      text: "地址获取",
      display: "地址获取",
      repairTip: "地址获取安检不合规:",
    },
    {
      id: "27",
      name: "autoplay",
      text: "自动播放",
      display: "自动播放",
      repairTip: "请关闭自动播放",
    },
    {
      id: "28",
      name: "cdburn",
      text: "光盘刻录",
      display: "光盘刻录",
      repairTip: "请关闭光盘刻录功能",
    },
    {
      id: "29",
      name: "runtime",
      text: "终端运行时间",
      display: "终端运行时间",
      repairTip: "终端已运行时间:_h,超出设定上限",
    },
    {
      id: "30",
      name: "pcname",
      text: "计算机名称",
      display: "计算机名称",
      repairTip: "计算机名称与安检策略配置不匹配,匹配规则为:",
    },
    {
      id: "31",
      name: "autoupdate",
      text: "自动更新",
      display: "自动更新",
      repairTip: "自动更新安检不合规: ",
    },
    {
      id: "32",
      name: "sysacc",
      text: "系统账号",
      display: "系统账号",
      repairTip: "系统账号安检不合规: ",
    },
    {
      id: "33",
      name: "browser",
      text: "IE浏览器",
      display: "IE浏览器",
      repairTip: "IE浏览器安检不合规: ",
    },
    {
      id: "34",
      name: "peripheral",
      text: "USB外设检查",
      display: "USB外设检查",
      repairTip: "存在不合规的外设接入:",
    },
    {
      id: "35",
      name: "filescan",
      text: "文件检查",
      display: "文件检查",
      repairTip: "",
    },
  ],
};
export default function confDot1xPolicy(getParam, postParam, res) {
  if (getParam.action == "getAll") {
    mockMethod("show", show, postParam, res);
  }
}
