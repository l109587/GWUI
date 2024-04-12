import { ProtableModule } from "@/components/Module";
import { useState } from "react";
import { useSelector } from "umi";
import {
  message,
  Modal,
  Tooltip,
  Popover,
} from "antd";
import {
  EditOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { language } from "@/utils/language";
import AddAuthCfg from "../components/addAuthCfg";
import SaveSvg from "@/assets/nac/save.svg";
import { post } from "@/services/https";
import { CutdropDown } from "@/common";
import styles from './index.less'

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
      dataIndex: "safe_domain_name",
      key: "safe_domain_name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "IP范围",
      dataIndex: "safe_domain_info",
      key: "safe_domain_info",
      align: "left",
      render: (text) => {
        const result = [];
        text.map((item) => {
          const protocol = item.protocol?.join("|");
          result.push(`${item.ip}:${item.port}:${item.directory}:${protocol}`);
        });
        return (
          <>
            <CutdropDown addrlist={result?.join(";")}/>
          </>
        )
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
      names.push(item.safe_domain_name);
      ids.push(item.id);
    });
    const params = { names: names.join(","), ids: ids.join(",") };
    post(
      "/cfg.php?controller=securityDomain&action=delete_securitydomain",
      params
    )
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
        apishowurl="/cfg.php?controller=securityDomain&action=get_securitydomain"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="authcfgTable"
        rowkey="id"
        columnvalue="authcfgColumnvalue"
        rowSelection={true}
        addButton={true}
        delButton={true}
        delClick={delClick}
        addClick={() => {
          setAddModalVisible(true);
        }}
      />
      <AddAuthCfg
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
