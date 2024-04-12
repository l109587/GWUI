import React, { useRef, useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  ProFormSelect,
  ProFormRadio,
  DrawerForm,
  ProFormSwitch,
  ProFormDatePicker,
  ProDescriptions,
  ProFormItem,
} from "@ant-design/pro-components";
import {
  Tooltip,
  Input,
  Space,
  Modal,
  DatePicker,
  Switch,
  Button,
  message,
} from "antd";
import { post, postAsync } from "@/services/https";
import { language } from "@/utils/language";
import WebUploadr from "@/components/Module/webUploadr";
import { TableLayout } from "@/components";
const { ProtableModule } = TableLayout;
import { modalFormLayout } from "@/utils/helper";
import { NameText, NotesText } from "@/utils/fromTypeLabel";
import { useSelector } from "umi";
import { fetchAuth } from "@/utils/common";
import moment from "moment";
import styles from "./index.less";

const { Search } = Input;
const { RangePicker } = DatePicker;

export default function (params) {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const tableHeight = contentHeight - 210;
  const writable = fetchAuth();
  const dateFormat = "YYYY/MM/DD HH:mm:ss";
  const handleFormRef = useRef();

  const [incID, setIncID] = useState(0);
  const [queryVal, setQueryVal] = useState(""); //搜索框的值
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const [olddate, setOlddate] = useState(
    moment().subtract(1, "months").format(dateFormat)
  );
  const [detaliDrawerStatus, setDetaliDrawerStatus] = useState(false); //详情弹框状态
  const [handleDrawerStatus, setHandleDrawerStatus] = useState(false); //事件处置弹框状态
  const [evtDetails, setEvtDetails] = useState({}); //事件详情
  const [rowInfo, setRowInfo] = useState(false); //行数据
  let searchVal = {
    queryVal: queryVal,
    queryType: "fuzzy",
    startTime: olddate,
    endTime: newdate,
  }; //顶部搜索框值 传入接口1:内部, 2:秘密, 3:机密, 4:绝密

  const levelMap = [
    {
      label: "内部",
      value: 1,
    },
    {
      label: "秘密",
      value: 2,
    },
    {
      label: "机密",
      value: 3,
    },
    {
      label: "绝密",
      value: 4,
    },
  ];

  const disposeTypeMap = {
    1: "电话",
    2: "现场",
  };
  const secretLevelMap = {
    1: "内部",
    2: "秘密",
    3: "机密",
    4: "绝密",
  };

  const columns = [
    {
      title: "事件ID",
      dataIndex: "id",
      key: "id",
      width: "130px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "处置状态",
      dataIndex: "state",
      key: "state",
      width: "100px",
      align: "center",
      render: (text) => {
        return text == "Y" ? "已处置" : "未处置";
      },
    },
    {
      title: "研判结果",
      dataIndex: "analyze_result",
      key: "analyze_result",
      width: "100px",
      align: "center",
      render: (text) => {
        const resultMap = {
          1: "绝密",
          2: "机密",
          3: "秘密",
          4: "内部",
          5: "非密",
        };
        return resultMap[text];
      },
    },
    {
      title: "研判关键词",
      dataIndex: "key_words",
      key: "key_words",
      width: "100px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "研判人",
      dataIndex: "analyze_people",
      key: "analyze_people",
      width: "100px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "研判时间",
      dataIndex: "analyze_time",
      key: "analyze_time",
      width: "150px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "核实处置情况",
      dataIndex: "dispose_result",
      key: "dispose_result",
      width: "100px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "处置对应告警",
      dataIndex: "warning",
      key: "warning",
      width: "100px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "处置时间",
      dataIndex: "time",
      key: "time",
      align: "left",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      width: "100px",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Space>
            <a
              onClick={() => {
                showDetails(record.id);
                setRowInfo(record);
                setDetaliDrawerStatus(true);
              }}
            >
              详情
            </a>
            <Button
              type="link"
              onClick={() => {
                showDetails(record.id);
                setRowInfo(record);
                setHandleDrawerStatus(true);
              }}
              disabled={!writable||record.state === "Y"}
              style={{
                height: 24,
                padding: 0,
              }}
            >
              处置
            </Button>
          </Space>
        );
      },
    },
  ];
  //涉密事件详情回显
  const showDetails = (id) => {
    post("/cfg.php?controller=confDispose&action=showSensitiveDetail", {
      id: id,
    })
      .then((res) => {
        if (res.success) {
          setEvtDetails({ ...res.alarm, ...res.dispose });
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          placeholder="请输入"
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal);
            setIncID(incID + 1);
          }}
        />
        <RangePicker
          showTime={{ format: "HH:mm:ss" }}
          defaultValue={[
            moment(olddate, dateFormat),
            moment(newdate, dateFormat),
          ]}
          format={dateFormat}
          onChange={(val, time) => {
            setNewdate(time[1]);
            setOlddate(time[0]);
            setIncID(incID + 1);
          }}
        />
      </Space>
    );
  };
  const onClose = () => {
    console.log('调用了');
    setDetaliDrawerStatus(false);
    setRowInfo({});
    setEvtDetails({});
  };
  const onHandleClose = () => {
    setHandleDrawerStatus(false);
    setRowInfo({});
    setEvtDetails({});
    handleFormRef.current.resetFields();
  };

  const handleSave = (values) => {
    const params = { ...values, id: rowInfo.id };
    post("/cfg.php?controller=confDispose&action=disposeSensitive", params)
      .then((res) => {
        if (res.success) {
          onHandleClose();
          setIncID(incID + 1);
          res.msg && message.success(res.msg);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error);
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
        columns={columns}
        apishowurl="/cfg.php?controller=confDispose&action=showSensitiveList"
        clientHeight={tableHeight}
        columnvalue="wxyjdspColumnvalue"
        tableKey="wxyjdspTable"
        rowkey="id"
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
      />
      <DrawerForm
        {...modalFormLayout}
        width={450}
        title="详情信息"
        visible={detaliDrawerStatus}
        drawerProps={{
          destroyOnClose: true,
          bodyStyle: { padding: "0 16px 16px 16px" },
          headerStyle: { padding: 16 },
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          onClose,
          extra: (
            <div>
              <span onClick={onClose} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
        }}
        submitter={{
          render: () => {
            return (
              <Button type="primary" onClick={onClose}>
                确认
              </Button>
            );
          },
        }}
        onVisibleChange={setDetaliDrawerStatus}
      >
        <div className={styles.detailDraw}>
          <ProDescriptions column={2} title="告警信息" bordered={true}>
            <ProDescriptions.Item
              label="设备编号"
              dataIndex="device_id"
              ellipsis
            >
              {evtDetails?.device_id || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="告警编号"
              dataIndex="alarm_id"
              ellipsis
            >
              {rowInfo?.id || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="敏感信息描述"
              dataIndex="detail"
              ellipsis
            >
              {evtDetails?.sm_desc || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="高亮关键词"
              dataIndex="keyword"
              ellipsis
            >
              {evtDetails?.highlight_text || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="文件名称" dataIndex="name" ellipsis>
              {evtDetails?.filename || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="文件MD5" dataIndex="md5" ellipsis>
              {evtDetails?.file_md5 || "--"}
            </ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions column={2} title="研判信息" bordered={true}>
            <ProDescriptions.Item
              label="研判结果"
              dataIndex="device_id"
              ellipsis
            >
              {rowInfo?.analyze_result || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="研判关键词"
              dataIndex="alarm_id"
              ellipsis
            >
              {rowInfo?.key_words || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="研判人" dataIndex="detail" ellipsis>
              {rowInfo?.analyze_people || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="研判时间" dataIndex="keyword" ellipsis>
              {rowInfo?.analyze_time || "--"}
            </ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions column={2} title="处置信息" bordered={true}>
            <ProDescriptions.Item
              label="处置类型"
              dataIndex="device_id"
              ellipsis
            >
              {disposeTypeMap[evtDetails?.dispose_type] || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="处置结果"
              dataIndex="alarm_id"
              ellipsis
            >
              {evtDetails?.result || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="涉密级别" dataIndex="detail" ellipsis>
              {secretLevelMap[evtDetails?.secret_level] || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="涉密期限" dataIndex="keyword" ellipsis>
              {evtDetails?.secret_expiration || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="处置描述" dataIndex="keyword" ellipsis>
              {evtDetails?.desc || "--"}
            </ProDescriptions.Item>
          </ProDescriptions>
        </div>
      </DrawerForm>
      <DrawerForm
        {...modalFormLayout}
        width={450}
        onFinish={handleSave}
        formRef={handleFormRef}
        title="事件处置"
        visible={handleDrawerStatus}
        onVisibleChange={setHandleDrawerStatus}
        drawerProps={{
          destroyOnClose: true,
          bodyStyle: { padding: "0 16px 16px 16px" },
          headerStyle: { padding: 16 },
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          onClose:onHandleClose,
          extra: (
            <div>
              <span onClick={onHandleClose} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
        }}
      >
        <div className={styles.detailDraw} style={{ marginBottom: 14 }}>
          <ProDescriptions column={2} title="告警信息" bordered={true}>
            <ProDescriptions.Item
              label="设备编号"
              dataIndex="device_id"
              ellipsis
            >
              {evtDetails?.device_id || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="告警编号"
              dataIndex="alarm_id"
              ellipsis
            >
              {rowInfo?.id || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="敏感信息描述"
              dataIndex="detail"
              ellipsis
            >
              {evtDetails?.sm_desc || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="高亮关键词"
              dataIndex="keyword"
              ellipsis
            >
              {evtDetails?.highlight_text || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="文件名称" dataIndex="name" ellipsis>
              {evtDetails?.filename || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="文件MD5" dataIndex="md5" ellipsis>
              {evtDetails?.file_md5 || "--"}
            </ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions column={2} title="研判信息" bordered={true}>
            <ProDescriptions.Item
              label="研判结果"
              dataIndex="device_id"
              ellipsis
            >
              {rowInfo?.analyze_result || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="研判关键词"
              dataIndex="alarm_id"
              ellipsis
            >
              {rowInfo?.key_words || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="研判人" dataIndex="detail" ellipsis>
              {rowInfo?.analyze_people || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="研判时间" dataIndex="keyword" ellipsis>
              {rowInfo?.analyze_time || "--"}
            </ProDescriptions.Item>
          </ProDescriptions>
        </div>
        <div className={styles.title}>核实处置</div>
        <ProFormSelect
          name="dispose_type"
          label="处置类型"
          width="200px"
          options={[
            {
              label: "电话",
              value: 1,
            },
            {
              label: "现场",
              value: 2,
            },
          ]}
          rules={[
            {
              required: true,
              message: language("project.mandatory"),
            },
          ]}
        />
        <ProFormSelect
          name="secret_level"
          label="涉密级别"
          width="200px"
          options={levelMap}
          rules={[
            {
              required: true,
              message: language("project.mandatory"),
            },
          ]}
        />
        <ProFormDatePicker
          label="涉密期限"
          name="secret_expiration"
          width={200}
          className={styles.systime}
          rules={[
            {
              required: true,
              message: language("project.mandatory"),
            },
          ]}
        />
        <NameText
          label="处置结果"
          width={200}
          placeholder="请输入"
          name="result"
          required={true}
        />
        <NotesText label="处置描述" width={200} name="desc" />
      </DrawerForm>
    </div>
  );
}
