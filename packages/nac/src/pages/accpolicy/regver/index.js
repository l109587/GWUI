import { ProtableModule } from "@/components/Module";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "umi";
import { formleftLayout, drawFormLayout } from "@/utils/helper";
import { Tag, message, Modal, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { regList, regIpList } from "@/utils/regExp";
import { language } from "@/utils/language";
import SaveSvg from "@/assets/nac/save.svg";
import AddRegVerify from "../components/addRegVerify";
import { post } from "@/services/https";

const { confirm } = Modal;

export default function () {
  const [addVisible, setAddModalVisible] = useState(false); //新建注册审核弹窗开关
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [recordInfo, setRecordInfo] = useState({}); //策略信息
  const [operate, setOperate] = useState("add");
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;

  const columnsList = [
    {
      title: "名称",
      width: 150,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "注册方式",
      width: 100,
      dataIndex: "reg_type",
      key: "reg_type",
      align: "center",
      render: (text) => {
        let color = text == "1" ? "cyan" : "volcano";
        const regTypeMap = {
          1: "客户端",
          2: "WEB",
        };
        return (
          <Tag color={color} style={{ width: 52, marginRight: 0 }}>
            {regTypeMap[text]}
          </Tag>
        );
      },
    },
    {
      title: "审核方式",
      width: 100,
      dataIndex: "verify_type",
      key: "verify_type",
      align: "left",
      render: (text) => {
        const verTypeMap = {
          0: "不审核",
          1: "自动审核",
          2: "人工审核",
        };
        return verTypeMap[text];
      },
    },
    {
      title: "处理方式",
      width: 100,
      dataIndex: "deal_type",
      key: "deal_type",
      align: "center",
      render: (text) => {
        let color = text == "0" ? "#FF0000" : "#fab52b";
        const dealTypeMap = {
          0: "阻断",
          1: "告警",
        };
        return <Tag color={color}>{dealTypeMap[text]}</Tag>;
      },
    },
    {
      title: "下载地址",
      dataIndex: "agent_url",
      key: "agent_url",
      align: "left",
      ellipsis: true,
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
              setAddModalVisible(true);
            }}
          >
            <img src={SaveSvg} style={{ cursor: "pointer" }} />
          </Tooltip>
        );
      },
    },
  ];

  //批量删除
  const delClick = (selectedRowKeys, dataList, selectRecord) => {
    const sum = selectedRowKeys.length;
    confirm({
      icon: <CloseCircleFilled style={{ color: "red" }} />,
      title: language("project.delconfirm"),
      content: language("project.cancelcon", { sum: sum }),
      className: "delModal",
      okType: "danger",
      onOk: () => {
        delconfirm(selectRecord);
      },
    });
  };
  //确定删除
  const delconfirm = (selectRecord) => {
    const names = [];
    const ids = [];
    selectRecord.map((item) => {
      names.push(item.name);
      ids.push(item.id);
    });
    const params = { names: names.join(","), ids: ids.join(",") };
    post("/cfg.php?controller=reg_verify&action=reg_verify_policy_del", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
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
      <ProtableModule
        columns={columnsList}
        apishowurl="/cfg.php?controller=reg_verify&action=reg_verify_policy_show"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="regverTable"
        rowkey="id"
        columnvalue="regverColumnvalue"
        rowSelection={true}
        delButton={true}
        addButton={true}
        delClick={delClick}
        addClick={() => {
          setAddModalVisible(true);
        }}
      />
      <AddRegVerify
        addVisible={addVisible}
        setAddModalVisible={setAddModalVisible}
        formType="drawer"
        formInitialValues={recordInfo}
        operate={operate}
        setOperate={setOperate}
      />
    </div>
  );
}
