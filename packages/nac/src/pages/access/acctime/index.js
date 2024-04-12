import { ProtableModule } from "@/components/Module";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "umi";
import { Tag, message, Modal, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { regList, regIpList } from "@/utils/regExp";
import { language } from "@/utils/language";
import SaveSvg from "@/assets/nac/save.svg";
import AddAccessTime from "../components/addAccessTime";
import { post } from "@/services/https";

const { confirm } = Modal;

export default function () {
  const [addVisible, setAddModalVisible] = useState(false); //新建权限配置弹窗开关
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [recordInfo, setRecordInfo] = useState({}); //权限配置名称
  const [operate, setOperate] = useState("add");
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;

  const columnsList = [
    {
      title: "名称",
      width: 130,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "重复",
      dataIndex: "week",
      key: "week",
      align: "left",
      render: (text) => {
        const weekMap = {
          monday: "周一",
          tuesday: "周二",
          wednesday: "周三",
          thursday: "周四",
          friday: "周五",
          saturday: "周六",
          sunday: "周日",
        };
        const weekArr = text.split(";");
        return weekArr.map((item) => <Tag color="blue">{weekMap[item]}</Tag>);
      },
    },
    {
      title: "起始时间",
      width: 130,
      dataIndex: "start",
      key: "start",
      align: "left",
      ellipsis: true,
    },
    {
      title: "结束时间",
      width: 130,
      dataIndex: "end",
      key: "end",
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
    post("/cfg.php?controller=timeObject&action=delete_timeObject", params)
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
        apishowurl="/cfg.php?controller=timeObject&action=get_timeObject"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="acctimeTable"
        rowkey="id"
        columnvalue="acctimeColumnvalue"
        rowSelection={true}
        addButton={true}
        delButton={true}
        delClick={delClick}
        addClick={() => {
          setAddModalVisible(true);
        }}
      />
      <AddAccessTime
        addVisible={addVisible}
        setAddModalVisible={setAddModalVisible}
        formType="drawer"
        recordInfo={recordInfo}
        operate={operate}
        setOperate={setOperate}
      />
    </div>
  );
}
