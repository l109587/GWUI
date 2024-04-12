import { ProtableModule } from "@/components/Module";
import { useState } from "react";
import { useSelector } from "umi";
import { Input, Modal, message, Popover } from "antd";
import { EditOutlined, CloseCircleFilled } from "@ant-design/icons";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import styles from "./index.less";

const { Search } = Input;
const { confirm } = Modal;

export default function () {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;

  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [queryVal, setQueryVal] = useState(""); //首个搜索框的值
  let searchVal = { value: queryVal, type: "fuzzy" }; //顶部搜索框值 传入接口

  const columnsList = [
    {
      title: "设备IP",
      width: 130,
      dataIndex: "ip",
      key: "ip",
      align: "left",
      ellipsis: true,
    },
    {
      title: "设备MAC",
      width: 130,
      dataIndex: "mac",
      key: "mac",
      align: "left",
      ellipsis: true,
    },
    {
      title: "类型",
      width: 130,
      dataIndex: "type",
      key: "type",
      align: "left",
      ellipsis: true,
    },
    {
      title: "服务器IP",
      width: 130,
      dataIndex: "serip",
      key: "serip",
      align: "left",
      ellipsis: true,
    },
    {
      title: "原因编号",
      width: 130,
      dataIndex: "reasonid",
      key: "reasonid",
      align: "left",
      ellipsis: true,
    },
    {
      title: "同步时间",
      width: 130,
      dataIndex: "synctime",
      key: "synctime",
      align: "left",
      ellipsis: true,
    },
  ];

  const tableTopSearch = () => {
    return (
      <Search
        placeholder="模糊查询"
        allowClear
        className={styles.search}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };
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
    <ProtableModule
      columns={columnsList}
      // apishowurl="/cfg.php?controller=linkage&action=get_synblock"
      apishowurl="/cfg.php?controller=securityDomain&action=get_securitydomain"
      incID={incID}
      clientHeight={clientHeight}
      tableKey="blocklistTable"
      rowkey="id"
      columnvalue="blocklistColumnvalue"
      searchText={tableTopSearch()}
      searchVal={searchVal}
      rowSelection={true}
      delButton={true}
      delClick={delClick}
    />
  );
}
