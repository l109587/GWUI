import { ProtableModule } from "@/components/Module";
import { useState } from "react";
import { useSelector } from "umi";
import { Input, Modal, Tooltip, Popover } from "antd";
import { EditOutlined, CloseCircleFilled } from "@ant-design/icons";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import styles from './index.less'

 const { Search } = Input

export default function () {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;

  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [queryVal, setQueryVal] = useState(''); //首个搜索框的值
  let searchVal = { value: queryVal, type: "fuzzy" }; //顶部搜索框值 传入接口


  const columnsList = [
    {
      title: "设备名",
      width: 130,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "SID",
      width: 130,
      dataIndex: "sid",
      key: "sid",
      align: "left",
      ellipsis: true,
    },
    {
      title: "注册者",
      width: 130,
      dataIndex: "reger",
      key: "reger",
      align: "left",
      ellipsis: true,
    },
    {
      title: "工号",
      width: 130,
      dataIndex: "id",
      key: "id",
      align: "left",
      ellipsis: true,
    },
    {
      title: "终端版本",
      width: 130,
      dataIndex: "ver",
      key: "ver",
      align: "left",
      ellipsis: true,
    },
    {
      title: "组织机构",
      width: 130,
      dataIndex: "org",
      key: "org",
      align: "left",
      ellipsis: true,
    },
    {
      title: "注册单位",
      width: 130,
      dataIndex: "regposition",
      key: "regposition",
      align: "left",
      ellipsis: true,
    },
    {
      title: "邮箱",
      width: 130,
      dataIndex: "email",
      key: "email",
      align: "left",
      ellipsis: true,
    },
    {
      title: "联系电话",
      width: 130,
      dataIndex: "phone",
      key: "phone",
      align: "left",
      ellipsis: true,
    },
    {
      title: "IP",
      width: 130,
      dataIndex: "ip",
      key: "ip",
      align: "left",
      ellipsis: true,
    },
  ];

  const tableTopSearch = () => {
    return (
      <Search
        placeholder='模糊查询'
        allowClear
        className={styles.search}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    );
  };

  return (
    <ProtableModule
      columns={columnsList}
      // apishowurl="/cfg.php?controller=dev&action=get_devSync"
      apishowurl="/cfg.php?controller=securityDomain&action=get_securitydomain"
      incID={incID}
      clientHeight={clientHeight}
      tableKey="reglistTable"
      rowkey="id"
      columnvalue="reglistColumnvalue"
      searchText={tableTopSearch()}
      searchVal={searchVal}
    />
  );
}
