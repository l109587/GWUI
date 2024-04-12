import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  message,
  Modal,
  Popover,
  Tooltip,
} from "antd";
import { post } from "@/services/https";
import {
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { language } from "@/utils/language";
import SaveSvg from "@/assets/nac/save.svg";
import "@/utils/index.less";
import "./index.less";
import { TableLayout, LeftTree, CardModal } from "@/components";
import AddAceGrp from "../components/addacegrp";
import { CutdropDown } from "@/common";
const { ProtableModule } = TableLayout;

const { confirm } = Modal;

let clientHeight = document.body.clientHeight - 285;

export default () => {
  const columns = [
    {
      title: "接入分组名称",
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "上级分组",
      dataIndex: "upgrpvalue",
      key: "upgrpvalue",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "交换机IP范围",
      dataIndex: "iprange",
      key: "iprange",
      align: "left",
      render: (text,record) => {
        // const ips = text ? text.split(";") : [];
        // const content = (
        //   <ul className="infoul">
        //     {ips.map((item) => {
        //       return <li>{item}</li>;
        //     })}
        //   </ul>
        // );
        // return (
        //   <Popover
        //     content={content}
        //     placement="bottomLeft"
        //     overlayClassName="pop"
        //   >
        //     <span style={{ cursor: "pointer" }}>{text}</span>{" "}
        //   </Popover>
        // );
        return (
          <>
            <CutdropDown addrlist={record.iprange} />
          </>
        )
      },
    },
    {
      title: "SSID",
      dataIndex: "ssids",
      key: "ssids",
      align: "left",
      width: 250,
      render: (text) => {
        const ips = text ? text.split(";") : [];
        const content = (
          <ul className="infoul">
            {ips.map((item) => {
              return <li>{item}</li>;
            })}
          </ul>
        );
        return (
          <Popover
            content={content}
            placement="bottomLeft"
            overlayClassName="pop"
          >
            <span style={{ cursor: "pointer" }}>{text}</span>{" "}
          </Popover>
        );
      },
    },
    {
      title: "操作",
      width: 100,
      dataIndex: "operate",
      key: "operate",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Tooltip
            title={language("project.edit")}
            arrowPointAtCenter
            onClick={() => {
              setOperate("mod");
              setRecordInfo(record);
              setAcegrpVisible(true);
              // mod(record, 'mod');
            }}
          >
             <img src={SaveSvg} style={{ cursor: "pointer" }} />
          </Tooltip>
        );
      },
    },
  ];

  const [zoneId, setZoneId] = useState();

  //添加/编辑终端分组弹窗
  const [recordInfo, setRecordInfo] = useState({}); //选中的终端分组信息
  const [operate, setOperate] = useState("add");
  const [acegrpVisible, setAcegrpVisible] = useState(false);
  const formRef = useRef();
  const [treeValue, setTreeValue] = useState();
  const [treeData, setTreeData] = useState([]);

  /** 左侧树形组件 start */
  const treeUrl =
    "/cfg.php?controller=devGroupControl&action=get_dev_group_list";
  const leftTreeData = {};
  const [treeInc, setTreeInc] = useState(0);

  /** table组件 start */
  const rowKey = (record) => record.id; //列表唯一值
  const tableHeight = clientHeight - 10; //列表高度
  const tableKey = "zoneconf"; //table 定义的key
  const rowSelection = true; //是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = "acegrpColumnvalue"; //设置默认显示的 key 变动 set.strot 存储key
  const apishowurl =
    "/cfg.php?controller=devGroupControl&action=get_devmember_list"; //接口路径

  //删除弹框
  const delClick = (selectedRowKeys, dataList) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: "delclickbox",
      icon: <ExclamationCircleOutlined />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      onOk() {
        delList(selectedRowKeys, dataList);
      },
    });
  };

  //添加按钮点击触发
  const addClick = () => {
    setAcegrpVisible(true);
  };

  /** table组件 end */

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  };

  useEffect(() => {
    if (treeValue) {
      setTimeout(function () {
        formRef.current.setFieldsValue({ gpname: treeValue });
      }, 100);
    }
  }, [treeValue]);

  //区域管理处理
  const getTree = (res) => {
    const treeInfoData = [res.node];
    setTreeData(treeInfoData);
    let zID = 1;
    if (res.defaultPath) {
      zID = res.node.id;
    }
    setZoneId(zID);
    incAdd();
  };

  // 区域管理侧边点击id处理
  const onSelectLeft = (selectedKeys, info) => {
    setZoneId(selectedKeys[0]); //更新选中地址id
    incAdd();
  };

  /* 删除数据 */
  const delList = (selectedRowKeys) => {
    const ids = selectedRowKeys.join(",");
    post("/cfg.php?controller=algmng&action=deletegroup", { id: ids })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        setTreeInc(treeInc + 1);
        incAdd();
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <CardModal
        title="接入分组"
        cardHeight={clientHeight + 182}
        leftContent={
          <LeftTree
            getTree={getTree}
            onSelectLeft={onSelectLeft}
            treeInc={treeInc}
            treeUrl={treeUrl}
            leftTreeData={leftTreeData}
          />
        }
        rightContent={
          <ProtableModule
            columns={columns}
            apishowurl={apishowurl}
            incID={incID}
            clientHeight={tableHeight}
            columnvalue={columnvalue}
            tableKey={tableKey}
            rowkey={rowKey}
            delButton={delButton}
            delClick={delClick}
            addButton={addButton}
            addClick={addClick}
            rowSelection={rowSelection}
          />
        }
      />
      <AddAceGrp
        visible={acegrpVisible}
        setVisible={setAcegrpVisible}
        setIncID={setIncID}
        setTreeInc={setTreeInc}
        operate={operate}
        setOperate={setOperate}
        recordInfo={recordInfo}
      />
    </div>
  );
};
