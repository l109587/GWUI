import React, { useRef, useState, useEffect } from "react";
import { Row, Col, TreeSelect, Input } from "antd";
import { DrawerForm } from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import './index.less';
import { TableLayout } from "@/components";
const { ProtableModule } = TableLayout;

const { Search } = Input;

const Policy = (props) => {
  const { visible, setVisible, operate, rowInfo } = props;

  const [zoneId, setZoneId] = useState("000000"); //区域id
  const [zoneData, setZoneData] = useState([]); //区域列表
  const drawerRef = useRef();

  const assocTbHeight = document.body.clientHeight - 265;

  //标题
  const titleMap = {
    instructions: "指令信息",
    strategy: "策略信息",
  };

  useEffect(() => {
    getZoneData();
  }, []);
  const onClose = () => {
    setVisible(false);
    setZoneId("000000");
  };

  //三种表头渲染
  const columns = [
    {
      title: "指令类型",
      dataIndex: "type",
      key: "type",
      align: "left",
      width: 100,
    },
    {
      title: "命令内容",
      dataIndex: "content",
      key: "content",
      align: "left",
      width: 110,
      ellipsis: true,
    },
    {
      title: "接收状态",
      dataIndex: "rcvState",
      key: "rcvState",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: "响应状态",
      dataIndex: "rspState",
      key: "rspState",
      align: "left",
      width: 120,
    },
    {
      title: "响应结果",
      dataIndex: "restResult",
      key: "restResult",
      align: "left",
      width: 150,
      ellipsis: true,
    },
  ];

  const strategyColumns = [
    {
      title: "策略类型",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: 100,
    },
    {
      title: "策略ID",
      dataIndex: "id",
      key: "id",
      align: "left",
      width: 110,
      ellipsis: true,
    },
    {
      title: "策略名称",
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 100,
      ellipsis: true,
    },
    {
      title: "接收状态",
      dataIndex: "rcvState",
      key: "rcvState",
      align: "left",
      width: 150,
      ellipsis: true,
    },
    {
      title: "响应状态",
      dataIndex: "rspState",
      key: "rspState",
      align: "left",
      width: 100,
    },
    {
      title: "响应结果",
      dataIndex: "restResult",
      key: "restResult",
      align: "left",
      width: 120,
    },
  ];

  // 区域管理侧边点击id处理
  const onChangeZone = (value, node) => {
    setZoneId(value); //更新选中地址id
    incAdd();
  };

  //获取区域列表
  const getZoneData = async () => {
    let data = {};
    data.type = "tree";
    data.depth = 1;
    let res = await postAsync(
      "/cfg.php?controller=confZoneManage&action=showZoneTree",
      data
    );
    if (res) {
      res.number = "000000";
      let data = [];
      data.push(res);
      setZoneData(data);
    }
  };

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  };

  /** table组件 start */
  const rowKey = (record) => record.device_id; //列表唯一值
  const tableHeight = assocTbHeight - 10; //列表高度
  const tableKey = "dspmapdevc"; //table 定义的key
  const rowSelection = false; //是否开启多选框
  const addButton = false; //增加按钮  与 addClick 方法 组合使用
  const delButton = false; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "dspmapdevccolumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl =
    operate == "strategy"
      ? "/cfg.php?controller=confTerminal&action=showTerminalPolicy"
      : "/cfg.php?controller=confTerminal&action=showTerminalCmd"; //接口路径
  const rightOptionsClose = true;
  let searchVal = {
    device_id: rowInfo.device_id,
  }; //顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    devid: { show: false },
  };
  /** table组件 end */

  return (
    <DrawerForm
      title={titleMap[operate]}
      visible={visible}
      width="800px"
      formRef={drawerRef}
      // getContainer={false}
      // style={{
      //   position: 'absolute',
      // }}
      // closable={false}
      // bodyStyle={{ backgroundColor: '#f0f2f5' }}
      onFinish={onClose}
      drawerProps={{
        className:'dspmapdevdrawfrom',
        destroyOnClose: true,
        onClose: onClose,
        bodyStyle: { padding: 16 },
        headerStyle: { padding: 16 },
        forceRender: false,
      }}
    >
      <div>
        <ProtableModule
          concealColumns={concealColumns}
          columns={operate == "strategy" ? strategyColumns : columns}
          apishowurl={apishowurl}
          incID={incID}
          clientHeight={tableHeight}
          columnvalue={columnvalue}
          tableKey={tableKey}
          searchVal={searchVal}
          rowkey={rowKey}
          delButton={delButton}
          addButton={addButton}
          rowSelection={rowSelection}
          rightOptionsClose={rightOptionsClose}
        />
      </div>
    </DrawerForm>
  );
};

export default Policy;
