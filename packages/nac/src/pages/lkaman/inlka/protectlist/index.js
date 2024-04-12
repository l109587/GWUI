import { ProtableModule } from "@/components/Module";
import { useState } from "react";
import { useSelector } from "umi";
import { Input, Modal, message, DatePicker,Space  } from "antd";
import { EditOutlined, CloseCircleFilled } from "@ant-design/icons";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import moment from "moment";
import styles from "./index.less";

const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

export default function () {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;
  const dateFormat = 'YYYY/MM/DD HH:mm:ss';

  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [queryVal, setQueryVal] = useState(""); //首个搜索框的值
  const [begDate, setBegDate] = useState(
    moment().subtract(1, "months").format(dateFormat)
  );
  const [endDate, setEndDate] = useState(moment().format(dateFormat));

  let searchVal = {
    value: queryVal,
    type: "fuzzy",
    start_time: begDate,
    end_time: endDate,
  }; //顶部搜索框值 传入接口

  const columnsList = [
    {
      title: "IP",
      width: 130,
      dataIndex: "ip",
      key: "ip",
      align: "left",
      ellipsis: true,
    },
    {
      title: "EDP服务器IP",
      width: 130,
      dataIndex: "serip",
      key: "serip",
      align: "left",
      ellipsis: true,
    },
    {
      title: "引用计数",
      width: 130,
      dataIndex: "number",
      key: "number",
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
      <Space>
        <Search
          placeholder="模糊查询"
          allowClear
          className={styles.search}
          onSearch={(queryVal) => {
            setQueryVal(queryVal);
            setIncID(incID + 1);
          }}
        />
        <RangePicker
          // showTime={{ format: 'HH:mm:ss' }}
          showTime
          defaultValue={[
            moment(begDate, dateFormat),
            moment(endDate, dateFormat),
          ]}
          format={dateFormat}
          onChange={(val, time) => {
            setEndDate(time[1]);
            setBegDate(time[0]);
            setIncID(incID + 1);
          }}
        />
      </Space>
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
      // apishowurl="/cfg.php?controller=linkage&action=getEDPprotect"
      apishowurl="/cfg.php?controller=securityDomain&action=get_securitydomain"
      incID={incID}
      clientHeight={clientHeight}
      tableKey="protectlistTable"
      rowkey="id"
      columnvalue="protectlistColumnvalue"
      searchText={tableTopSearch()}
      searchVal={searchVal}
      rowSelection={true}
      delButton={true}
      delClick={delClick}
    />
  );
}
