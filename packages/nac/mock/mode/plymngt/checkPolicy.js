import { mockMethod } from "../../../src/utils/common";
import Mock, { mock } from "mockjs";

const show = {
  success: true,
  total: 4,
  data: [
    {
      id: "1000",
      name: "1221",
      status: "Y",
      devgrpid: "2",
      systype: "win",
      plyUuid: "6838129",
      dgrpValue: "全网范围/133",
      ruleID: "1001",
      ruleName: "222222",
      cycle: "only",
      timeCheck: "N",
      showWinSuccess: "Y",
      showWinFail: "N",
      showWinAuto: "N",
      showTrayReCheck: "N",
      showTrayCheckRes: "Y",
      showTrayRepair: "N",
    },
    {
      id: "1001",
      name: "2222",
      status: "Y",
      devgrpid: "1",
      systype: "chs",
      plyUuid: "6886422",
      dgrpValue: "全网范围/122",
      ruleID: "1003",
      ruleName: "122",
      cycle: "only",
      timeCheck: "Y",
      showWinSuccess: "N",
      showWinFail: "N",
      showWinAuto: "N",
      showTrayReCheck: "N",
      showTrayCheckRes: "N",
      showTrayRepair: "N",
    },
    {
      id: "1002",
      name: "3333",
      status: "Y",
      devgrpid: "2",
      systype: "lin",
      plyUuid: "6886638",
      dgrpValue: "全网范围/133",
      ruleID: "1002",
      ruleName: "123",
      cycle: "only",
      timeCheck: "Y",
      showWinSuccess: "N",
      showWinFail: "N",
      showWinAuto: "N",
      showTrayReCheck: "N",
      showTrayCheckRes: "N",
      showTrayRepair: "N",
    },
    {
      id: "1003",
      name: "5555",
      status: "N",
      devgrpid: "3",
      systype: "mac",
      plyUuid: "6886662",
      dgrpValue: "全网范围/111",
      ruleID: "1004",
      ruleName: "6555",
      cycle: "only",
      timeCheck: "Y",
      showWinSuccess: "N",
      showWinFail: "N",
      showWinAuto: "N",
      showTrayReCheck: "N",
      showTrayCheckRes: "N",
      showTrayRepair: "N",
    },
  ],
};

const getWeakpwdDicShow = {
  success: true,
  data: [
    {
      status: "N",
      weakpwdDic:
        "0,000,0000,000000,00000000,1,111,111111,11111111,121212,123123,001,002,007,008,12,123,1234,12345,123456,1234567,123456789,5201314,1314520,987654321,54321,123asd,123qwe,1234qwer,123abc,88888888,10th,1st,2nd,3rd,4th,5th,6th,7th,8th,9th,100,101,110,108,133,163,166,188,233,266,350,366,450,466,136,137,138,139,158,168,169,192,198,200,222,233,234,258,288,300,301,333,345,388,400,433,456,458,500,555,558,588,600,666,598,668,678,688,888,988,999,1088,1100,1188,1288,1388,1588,1688,1888,1949,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1997,1999,2000,2001,2002,2088,2100,2188,2345,2588,3000,3721,3888,4567,4728,5555,5678,5888,6666,6688,6789,6888,7788,8888,8899,9988,9999,23456,34567,45678,88888,654321,888888,6666,56789,1234567,12345678,737,777,1111,2222,3333,4321,7777,5150,1313,6969,computer,pussy,mustang,Admin,abcd,abc123,Password,fish,qwerty,database,oracle,sybase,server,baseball,Internet,super,ihavenopass,godblessyou,enable,xp,alpha,patrick,pat,administrator,harley,golf,shadow,root,sex,god,foobar,a,aaa,abc,test,test123,temp,temp123,win,pc,asdf,secret,qwer,yxcv,zxcv,home,xxx,owner,login,Login,pwd,pass,love,mypc,mypc123,admin123,werty,work,xxyyzz,z,zxcvbnm,letmein,mein,staff,guest,default,system,outlook,web,www,windows,accounts,accounting,dba,password1,homeuser,administrador,administrateur,admins,mail,cpu,memory,disk,soft,y2k,software,cdrom,rom,admin,master,card,pci,lock,ascii,knight,creative,modem,internet,intranet,isp,unlock,ftp,telnet,ibm,intel,microsoft,dell,compaq,toshiba,acer,info,aol,56k,dos,windows,win95,win98,office,word,excel,access,unix,linux,password,file,program,mp3,mpeg,jpeg,gif,bmp,billgates,chip,silicon,sony,link,word97,office97,network,ram,sun,yahoo,excite,hotmail,yeah,sina,pcweek,mac,apple,robot,key,monitor,win2000,office200,word2000,net,virus,company,tech,technolog,print,coolweb,printer,superman,hotpage,enter,myweb,download,cool,coolman,coolboy,coolgirl,netboy,netgirl,log,connect,email,hyperlink,url,hotweb,java,cgi,html,htm,homepage,icq,mykey,c,basic,delphi,pascal,anonymous,crack,hack,hacker,chinese,vcd,chat,chatroom,mud,cracker,happy,hello,room,english,netizen,frontpage,agp,netwolf,acdsee,usa,hot,site,address,news,topcool,win98,qq2000,mylove",
    },
  ],
};

export default function (getParam, postParam, res) {
  if (getParam.action == "showCheckPolicy") {
    mockMethod("show", show, postParam, res);
  } else if (getParam.action == "getWeakpwdDic") {
    mockMethod("show", getWeakpwdDicShow, postParam, res);
  } else if (getParam.action == "setCheckPolicy") {
    if (postParam.opcode == "add") {
      delete postParam.opcode;
      delete postParam.token;
      const uuid =
        new Date().getTime().toString(36) +
        "-" +
        Math.random().toString(36).substr(2, 9);
      show?.data?.push({ ...postParam, id: uuid });
      show.total = show?.total + 1;
      res.json({ success: true, msg: "操作成功" });
    } else {
      delete postParam.opcode;
      delete postParam.token;
      const index = show?.data?.findIndex((item) => item.id == postParam.id);
      show.data[index] = { ...postParam };
      res.json({ success: true, msg: "操作成功" });
    }
  }
}
