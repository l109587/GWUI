
let mirrorData = {
  success: true,
  total: 3,
  data: [
    {
      id: 1000,
      iface: "eth1",
      status: 0,
      alias: "核心交换10",
      ifidx: 1,
      note: "我就测试以下1",
    },
    {
      id: 1001,
      iface: "eth2",
      status: 0,
      alias: "核心交换2",
      ifidx: 2,
      busid: "0000:06:00.0",
      note: "我就测试以下2",
    },
    {
      id: 1002,
      iface: "eth2",
      status: 0,
      alias: "核心交换2",
      ifidx: 2,
      busid: "0000:06:00.0",
      note: "我就测试以下2",
    },
  ],
};

export default function confMirror(getParam, postParam, res) {
  if (getParam.action == "showMirror") {
    mockMethod("show", mirrorData, postParam, res);
  } else if (getParam.action == "delMirror") {
    mockMethod("del", mirrorData, postParam, res);
  } else if (getParam.action == "setMirror") {
    if (postParam.op === "add") {
      mockMethod("add", mirrorData, postParam, res);
    } else if (postParam.op === "mod") {
        mockMethod("mod", mirrorData, postParam, res);
    }
  }
}
const mockMethod = (type = "show", data, param, res) => {
  let newData = data;
  switch (type) {
    case "show":
      res.json(newData);
      break;
    case "del":
      newData.data = newData?.data?.filter((item) => item.id != param.id);
      newData.total = newData?.total - 1;
      res.json({ success: true, msg: "操作成功" });
      break;
    case "add":
      delete param.op;
      delete param.token;
      const uuid  = new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2, 9) 
      newData?.data?.push({ ...param,id:uuid });
      res.json({ success: true, msg: "操作成功" });
      break;
    case "mod":
      delete param.op;
      delete param.token;
      const index = newData?.data?.findIndex((item) => item.id == param.id);
      newData.data[index] = { ...param };
      res.json({ success: true, msg: "操作成功" });
      break;
    default:
      res.json(newData);
      break;
  }
};
