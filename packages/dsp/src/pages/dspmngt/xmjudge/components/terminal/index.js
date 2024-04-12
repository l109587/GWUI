import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "umi";
import { TableLayout } from "@/components";
import { post, postAsync } from "@/services/https";
import { Input, Space, DatePicker, message, Button } from "antd";
import moment from "moment";
import { CloseOutlined } from "@ant-design/icons";
import {
  DrawerForm,
  ProDescriptions,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;

const Terminal = () => {
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
    告警ID、
    告警时间、
    策略ID(-)、
    告警类型（文件操作）、
    告警信息描述（命中的关键词）、
    告警文件MD5、
    告警文件路径、
    文件名称、
    文件大小、
    高亮关键词、
    单位名称、
    主机名称、
    组织机构（ID及全路径）、
    责任人（ID及名称） 
  */

  const typeMap = {
    0: "未知操作",
    1: "重命名文件",
    2: "剪切文件",
    3: "删除到回收站",
    4: "从回收站恢复",
    5: "WIN7下文件删除",
    6: "彻底删除",
    7: "复制文件",
    8: "本地扫描",
    9: "创建文件",
    10: "文件打开",
    11: "本地拷贝到移动介质",
    12: "移动介质拷贝到本地",
    13: "移动介质拷贝到移动介质",
    14: "本地剪切到移动介质",
    15: "移动介质剪切到本地",
    16: "移动介质剪切到移动介质",
    17: "文件打印",
    18: "文件刻录",
  };

  const columns = [
    {
      title: "告警ID",
      dataIndex: "id",
      key: "id",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "告警时间",
      dataIndex: "time",
      key: "time",
      align: "left",
      ellipsis: true,
      width: 150,
    },
    {
      title: "策略ID",
      dataIndex: "ruleid",
      key: "ruleid",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "告警类型",
      dataIndex: "alertType",
      key: "alertType",
      align: "left",
      width: 100,
      ellipsis: true,
      render: (text, record) => {
        return typeMap[record.alertType];
      },
    },
    {
      title: "告警信息描述",
      dataIndex: "smdesc",
      key: "smdesc",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "告警文件MD5",
      dataIndex: "filemd5",
      key: "filemd5",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "告警文件路径",
      dataIndex: "filepath",
      key: "filepath",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "文件名称",
      dataIndex: "filename",
      key: "filename",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "文件大小",
      dataIndex: "filesize",
      key: "filesize",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "高亮关键词",
      dataIndex: "highlightText",
      key: "highlightText",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "单位名称",
      dataIndex: "company",
      key: "company",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "主机名称",
      dataIndex: "computerName",
      key: "computerName",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "组织机构",
      dataIndex: "orgpath",
      key: "orgpath",
      align: "left",
      ellipsis: true,
      width: 100,
    },
    {
      title: "责任人",
      dataIndex: "username",
      key: "username",
      align: "left",
      ellipsis: true,
      width: 100,
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
              showDraw("open", record);
            }}
          >
            研判
          </Button>
        );
      },
    },
  ];

  const rowKey = (record) => record.id;
  const [incID, setIncID] = useState(0);
  const [queryVal, setQueryVal] = useState();
  let searchVal = {
    value: queryVal,
    queryType: "fuzzy",
    startTime: olddate,
    endTime: newdate,
    devtype: "terminal",
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
    values.device_type = 5;
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
      id="terminalDiv"
      className="terminalDiv"
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
      />
      <DrawerForm
        title="研判"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        formRef={drawformRef}
        draw
        drawerProps={{
          placement: "right",
          closable: false,
          getContainer: () => document.getElementById("terminalDiv"),
          style: {
            position: "absolute",
          },
          width: "500px",
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
            <ProDescriptions.Item label="告警类型" dataIndex="alertType">
              {typeMap[rowInfo?.alertType]}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="告警信息描述"
              dataIndex="smdesc"
              span={2}
            >
              {rowInfo?.smdesc}
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
            <ProDescriptions.Item label="单位名称" dataIndex="company">
              {rowInfo?.company}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="组织机构" dataIndex="orgpath">
              {rowInfo?.orgpath}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="主机名称" dataIndex="computerName">
              {rowInfo?.computerName}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="责任人" dataIndex="username">
              {rowInfo?.username}
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

export default Terminal;
