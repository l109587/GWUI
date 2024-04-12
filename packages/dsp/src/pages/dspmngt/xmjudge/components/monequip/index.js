import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "umi";
import { TableLayout } from "@/components";
import { post, postAsync } from "@/services/https";
import { message, Input, Space, DatePicker, Button } from "antd";
import moment from "moment";
import { CloseOutlined } from "@ant-design/icons";
import {
  DrawerForm,
  ProDescriptions,
  ProFormText,
  ProFormSelect,
} from "@ant-design/pro-components";
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const Monequip = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  const clientHeight = contentHeight - 260;
  const dateFormat = "YYYY/MM/DD HH:mm:ss";
  const [olddate, setOlddate] = useState(
    moment().subtract(1, "months").format(dateFormat)
  );
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const drawformRef = useRef();
  const [drawState, setDrawState] = useState(false);
  const [rowInfo, setRowInfo] = useState({});
  /* 
  未用字段：
  payloadDetail:负载详情
filetime:文件生成时间
isUpload:是否上传（0：未 1：上传）
oriFilenameEncode:文件名编码
checksum：文件MD5
filetype：文件类型(1:文档 2:图片 3:文本/网页 4:压缩包 5:邮件) */

  const payloadTypeMap = {
    1: "Web 相关协议",
    2: "Dns协议",
    3: "电子邮件类应用",
    4: "网盘类应用",
    5: "文件传输类应用",
    6: "即时通信类应用",
    99: "其它类型负载",
  };

  const renderType = (alertType) => {
    if (alertType == "1") {
      return "关键词检测";
    } else if (alertType == "2") {
      return "文件MD5";
    } else {
      return "其他";
    }
  };

  const columns = [
    {
      title: "告警ID",
      dataIndex: "id",
      key: "id",
      width: 150,
      ellipsis: true,
      align: "left",
    },
    {
      title: "告警时间",
      dataIndex: "time",
      key: "time",
      width: 150,
      ellipsis: true,
      align: "left",
    },
    {
      title: "策略ID",
      dataIndex: "ruleid",
      key: "ruleid",
      width: 100,
      ellipsis: true,
      align: "left",
    },
    {
      title: "策略类型",
      dataIndex: "alertType",
      key: "alertType",
      width: 120,
      ellipsis: true,
      align: "left",
      filters: true,
      filterMultiple: false,
      valueEnum: {
        1: { text: "关键词检测" },
        2: { text: "文件MD5" },
      },
      render: (text, record) => {
        return renderType(record.alertType);
      },
    },
    {
      title: "策略描述",
      dataIndex: "ruleDesc",
      key: "ruleDesc",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "告警文件MD5",
      dataIndex: "filemd5",
      key: "filemd5",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    // {
    //   title: "告警级别", /* 毛病 */
    //   dataIndex: "level",
    //   key: "level",
    //   width: 100,
    //   ellipsis: true,
    //   align: "left",
    // },
    {
      title: "文件传播时间",
      dataIndex: "transmitTime",
      key: "transmitTime",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "文件名称",
      dataIndex: "filename",
      key: "filename",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "文件大小",
      dataIndex: "filesize",
      key: "filesize",
      width: 100,
      ellipsis: true,
      align: "left",
    },
    {
      title: "告警文件内嵌路径",
      dataIndex: "smInpath",
      key: "smInpath",
      width: 100,
      ellipsis: true,
      align: "left",
    },
    {
      title: "告警文件摘要",
      dataIndex: "smSummary",
      key: "smSummary",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    /*     {
      title: "实际告警文件",
      dataIndex: "sm_inpath",
      key: "sm_inpath",
      width: 120,
      ellipsis: true,
      align: "left",
    }, */
    // {
    //   title: "告警信息描述", /* 牟总字段有 */
    //   dataIndex: "sm_desc",
    //   key: "sm_desc",
    //   width: 120,
    //   ellipsis: true,
    //   align: "left",
    // },
    {
      title: "高亮关键词",
      dataIndex: "highlightText",
      key: "highlightText",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "源IP",
      dataIndex: "sip",
      key: "sip",
      width: "120px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "源端口",
      dataIndex: "sport",
      key: "sport",
      width: "100px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "源MAC",
      dataIndex: "smac",
      key: "smac",
      width: "130px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "目的IP",
      dataIndex: "dip",
      key: "dip",
      width: "120px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "目的端口",
      dataIndex: "dport",
      key: "dport",
      width: "100px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "目的MAc",
      dataIndex: "dmac",
      key: "dmac",
      width: "130px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "文件传输方向",
      dataIndex: "fileDirection",
      key: "fileDirection",
      width: 120,
      ellipsis: true,
      align: "left",
      render: (text, record) => {
        if (record.fileDirection == 1) {
          return "发送";
        } else if (record.fileDirection == 2) {
          return "接收";
        } else {
          return "未知";
        }
      },
    },
    {
      title: "发送者信息",
      dataIndex: "sender",
      key: "sender",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "接收者信息",
      dataIndex: "receiver",
      key: "receiver",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "应用层协议",
      dataIndex: "appProtocol",
      key: "appProtocol",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "应用名称",
      dataIndex: "appName",
      key: "appName",
      width: 100,
      ellipsis: true,
      align: "left",
    },
    {
      title: "负载数据类型",
      dataIndex: "payloadType",
      key: "payloadType",
      width: 140,
      ellipsis: true,
      align: "left",
      render: (text, record) => {
        return payloadTypeMap[record.payloadType];
      },
    },
    {
      title: "负载数据详情",
      dataIndex: "payloadDetail",
      key: "payloadDetail",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "扩展信息",
      dataIndex: "extend",
      key: "extend",
      width: 120,
      ellipsis: true,
      align: "left",
    },
    {
      title: "操作",
      align: "center",
      valueType: "option",
      fixed: "right",
      width: 100,
      render: (text, record, _, action) => {
        return (
          <Button
            size="small"
            type="link"
            disabled={record.state === "Y" ? true : false}
            onClick={() => {
              setRowInfo(record);
              showDraw("open");
            }}
          >
            研判
          </Button>
        );
      },
    },
  ];

  const rowKey = (record) => record.id;
  const concealColumns = {};
  const [incID, setIncID] = useState(0);
  const [queryVal, setQueryVal] = useState();
  let searchVal = {
    value: queryVal,
    queryType: "fuzzy",
    startTime: olddate,
    endTime: newdate,
    devtype: "device",
    policytype: "keyword/filemd5",
  };

  const showSearch = () => {
    return (
      <Space>
        <Search
          placeholder="请输入"
          allowClear
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal);
            setIncID((incID) => incID + 1);
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
            setIncID((incID) => incID + 1);
          }}
        />
      </Space>
    );
  };

  const showDraw = (state) => {
    if (state == "open") {
      setDrawState(true);
    } else {
      drawformRef.current.resetFields();
      setDrawState(false);
    }
  };

  const handleSet = (values) => {
    values.alarm_id = rowInfo.id;
    values.device_type = 1;
    post("/cfg.php?controller=confDispose&action=addSensitive", values).then(
      (res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        }
        message.success(res.msg);
        showDraw("close");
        setIncID((incID) => incID + 1);
      }
    );
  };

  return (
    <div
      id="monequipDiv"
      className="monequipDiv"
      style={{
        position: "relative",
        height: clientHeight + 190,
        overflow: "hidden",
      }}
    >
      <ProtableModule
        clientHeight={clientHeight}
        searchText={showSearch()}
        searchVal={searchVal}
        incID={incID}
        rowkey={rowKey}
        tableKey="terminal"
        columns={columns}
        apishowurl="/cfg.php?controller=logDispose&action=showSensitive"
        columnvalue="terminalColumnvalue"
        rowSelection={false}
        delButton={false}
        concealColumns={concealColumns}
      />
      <DrawerForm
        title="研判"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        formRef={drawformRef}
        drawerProps={{
          placement: "right",
          closable: false,
          getContainer: () => document.getElementById("monequipDiv"),
          style: {
            position: "absolute",
          },
          width: 500,
          extra: (
            <div>
              <span
                onClick={() => {
                  showDraw("close");
                }}
                style={{ cursor: "pointer" }}
              >
                <CloseOutlined />
              </span>
            </div>
          ),
          onClose: () => {
            showDraw("close");
          },
          className: "xmjudgeDrawer",
          bodyStyle: {
            paddingTop: 0,
          },
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        visible={drawState}
        onVisibleChange={setDrawState}
        onFinish={(values) => {
          handleSet(values);
        }}
      >
        <div>
          <ProDescriptions column={2} title="告警信息" bordered={true}>
            <ProDescriptions.Item label="告警时间" dataIndex="time">
              {rowInfo?.time}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="策略类型" dataIndex="alertType">
              {renderType(rowInfo?.alertType)}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="告警信息描述"
              dataIndex="sm_desc"
              span={2}
            >
              {rowInfo?.sm_desc}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="高亮关键词"
              dataIndex="highlightText"
              span={2}
            >
              {rowInfo?.highlightText}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="文件名称" dataIndex="filename">
              {rowInfo?.filename}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="文件大小" dataIndex="filesize">
              {rowInfo?.filesize}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="发送者信息" dataIndex="sender">
              {rowInfo?.sender}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="接收者信息" dataIndex="receiver">
              {rowInfo?.receiver}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="应用名称" dataIndex="appName">
              {rowInfo?.appName}
            </ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions title="事件研判"></ProDescriptions>
          <ProFormSelect
            label="研判结果"
            name="analyze_result"
            options={[
              { value: 1, label: "绝密" },
              { value: 2, label: "机密" },
              { value: 3, label: "秘密" },
              { value: 4, label: "内部" },
              { value: 5, label: "非密" },
            ]}
          />
          <ProFormText label="研判关键词" name="key_words" />
        </div>
      </DrawerForm>
    </div>
  );
};

export default Monequip;
