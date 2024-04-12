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
import { Tooltip, Input, Space, Tabs, DatePicker, message, Button } from "antd";
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
  const [rowInfo, setRowInfo] = useState({}); //行数据
  const [devList, setDevList] = useState([]); //设备
  const [relationIds, setRelationIds] = useState([]); //关联信息id
  const [relationInfo, setRelationInfo] = useState({ alarm: [] }); //关联信息
  const [filename, setFilename] = useState(); //处置附件名称
  let searchVal = {
    queryVal: queryVal,
    queryType: "fuzzy",
    startTime: olddate,
    endTime: newdate,
  }; //顶部搜索框值 传入接口
  const columns = [
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
      title: "预警时间",
      dataIndex: "time",
      key: "time",
      width: "150px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "预警标题",
      dataIndex: "warn_title",
      key: "warn_title",
      width: "150px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "预警级别",
      dataIndex: "warn_level",
      key: "warn_level",
      width: "100px",
      align: "left",
      ellipsis: true,
    },
    {
      title: "预警描述",
      dataIndex: "warn_desc",
      key: "warn_desc",
      align: "left",
      ellipsis: true,
    },
    {
      title: "处置时限",
      dataIndex: "expire_date",
      key: "expire_date",
      align: "left",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      width: "100px",
      align: "center",
      fixed: "right",
      render: (text, record) => {
        return (
          <Space>
            <a
              onClick={() => {
                const devs = [];
                record?.relation_events?.map((item) => {
                  devs.push(item.device_id);
                });
                setRelationIds(record?.relation_events);
                setDevList(devs);
                setRowInfo(record);
                setDetaliDrawerStatus(true);
              }}
            >
              详情
            </a>
            <Button
              type="link"
              onClick={() => {
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
    setDetaliDrawerStatus(false);
    setRowInfo({});
    setRelationIds({});
    setRelationInfo({ alarm: [] });
  };
  const onHandleClose = () => {
    setHandleDrawerStatus(false);
    setRowInfo({});
    handleFormRef.current.resetFields();
  };
  const updateFinish = (params) => {
    if (params.success) {
      setFilename(params.name)
      params.msg && message.success(params.msg);
    } else {
      params.msg && message.error(params.msg);
    }
  };

  const fetchglInfo = (value) => {
    let alarmList = [];
    relationIds.map((item) => {
      if (item.device_id === value) {
        alarmList = item.alarm_id;
      }
    });
    const params = { device_id: value, alarm_id: alarmList?.join(",") };
    post("/cfg.php?controller=confDispose&action=showAttackDetail", params)
      .then((res) => {
        if (res.success) {
          const data = { alarm: res.alarm, ...res.device };
          setRelationInfo(data);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSave = (values) => {
    const params = {
      warning_id: rowInfo.warn_id,
      dispose_result: values.dispose_result,
      dispose_file:filename
    };
    post("/cfg.php?controller=confDispose&action=disposeAttack", params)
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
        apishowurl="/cfg.php?controller=confDispose&action=showAttackList"
        clientHeight={tableHeight}
        columnvalue="wxyjdspColumnvalue"
        tableKey="wxyjdspTable"
        rowkey="warn_id"
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
      />
      <DrawerForm
        {...modalFormLayout}
        width={450}
        title="详情信息"
        visible={detaliDrawerStatus}
        onVisibleChange={setDetaliDrawerStatus}
        drawerProps={{
          destroyOnClose: true,
          bodyStyle: { padding: "0 16px" },
          headerStyle: { padding: 16 },
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          extra: (
            <div>
              <span onClick={onClose} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
          onClose,
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
      >
        <Tabs>
          <Tabs.TabPane tab="预警信息" key="1">
            <div className={styles.detailDraw}>
              <ProDescriptions column={2} title="预警信息" bordered={true}>
                <ProDescriptions.Item
                  label="预警时间"
                  dataIndex="time"
                  ellipsis
                >
                  {rowInfo?.time || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="预警编号"
                  dataIndex="warn_id"
                  ellipsis
                >
                  {rowInfo?.warn_id || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="预警标题"
                  dataIndex="warn_title"
                  ellipsis
                >
                  {rowInfo?.warn_title || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="预警级别"
                  dataIndex="warn_level"
                  ellipsis
                >
                  {rowInfo?.warn_level || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="处置时限"
                  dataIndex="expire_date"
                  ellipsis
                >
                  {rowInfo?.expire_date || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="预警描述"
                  dataIndex="warn_desc"
                  ellipsis
                >
                  {rowInfo?.warn_desc || "--"}
                </ProDescriptions.Item>
              </ProDescriptions>
              <ProDescriptions column={2} title="处置信息" bordered={true}>
                <ProDescriptions.Item
                  label="处置时间"
                  dataIndex="device_id"
                  ellipsis
                >
                  {rowInfo?.dispose_time || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="处置结果"
                  dataIndex="alarm_id"
                  ellipsis
                >
                  {rowInfo?.dispose_result || "--"}
                </ProDescriptions.Item>
              </ProDescriptions>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="关联信息" key="2">
            <div style={{ marginTop: 14 }} className={styles.devItem}>
              <ProFormSelect
                name="dev"
                label="查看设备"
                width="200px"
                options={devList}
                rules={[
                  {
                    required: true,
                    message: language("project.mandatory"),
                  },
                ]}
                fieldProps={{
                  onChange: fetchglInfo,
                  allowClear: false,
                }}
              />
            </div>
            <div className={styles.detailDraw}>
              <ProDescriptions column={2} title="设备信息" bordered={true}>
                <ProDescriptions.Item
                  label="设备类型"
                  dataIndex="type"
                  ellipsis
                >
                  {relationInfo?.type || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="设备编号"
                  dataIndex="device_id"
                  ellipsis
                >
                  {relationInfo?.device_id || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="设备名称"
                  dataIndex="detail"
                  ellipsis
                >
                  {relationInfo?.devname || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="设备IP" dataIndex="devip" ellipsis>
                  {relationInfo?.devip || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="所属部门"
                  dataIndex="user_org"
                  ellipsis
                >
                  {relationInfo?.user_org || "--"}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  label="责任人"
                  dataIndex="user_name"
                  ellipsis
                >
                  {relationInfo?.user_name || "--"}
                </ProDescriptions.Item>
              </ProDescriptions>
              {relationInfo?.alarm.length > 0 && (
                <div className={styles.title}>告警信息</div>
              )}
              {relationInfo?.alarm?.map((item) => {
                return (
                  <div style={{ marginBottom: 14 }}>
                    <ProDescriptions
                      column={2}
                      bordered={true}
                      bodyStyle={{ marginBottom: 14 }}
                    >
                      <ProDescriptions.Item
                        label="告警编号"
                        dataIndex="id"
                        ellipsis
                      >
                        {item?.id || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="告警时间"
                        dataIndex="time"
                        ellipsis
                      >
                        {item?.time || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="告警名称"
                        dataIndex="name"
                        ellipsis
                      >
                        {item?.name || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="告警级别"
                        dataIndex="risk"
                        ellipsis
                      >
                        {item?.risk || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="告警编号"
                        dataIndex="rule_id"
                        ellipsis
                      >
                        {item?.rule_id || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="策略版本"
                        dataIndex="version"
                        ellipsis
                      >
                        {item?.version || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="攻击IP"
                        dataIndex="attacker"
                        ellipsis
                      >
                        {item?.attacker || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="受害者IP"
                        dataIndex="victim"
                        ellipsis
                      >
                        {item?.victim || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="攻击类型"
                        dataIndex="attack_class"
                        ellipsis
                      >
                        {item?.attack_class || "--"}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="攻击结果"
                        dataIndex="attack_result"
                        ellipsis
                      >
                        {item?.attack_result || "--"}
                      </ProDescriptions.Item>
                    </ProDescriptions>
                  </div>
                );
              })}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </DrawerForm>
      <DrawerForm
        {...modalFormLayout}
        width={450}
        onFinish={handleSave}
        formRef={handleFormRef}
        title="预警处置"
        visible={handleDrawerStatus}
        onVisibleChange={setHandleDrawerStatus}
        drawerProps={{
          destroyOnClose: true,
          bodyStyle: { padding: "0 16px 0 16px" },
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
          <ProDescriptions column={2} title="预警信息" bordered={true}>
            <ProDescriptions.Item label="预警时间" dataIndex="time" ellipsis>
              {rowInfo?.time || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="预警编号" dataIndex="warn_id" ellipsis>
              {rowInfo?.warn_id || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="预警标题"
              dataIndex="warn_title"
              ellipsis
            >
              {rowInfo?.warn_title || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="预警级别"
              dataIndex="warn_level"
              ellipsis
            >
              {rowInfo?.warn_level || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="处置时限"
              dataIndex="expire_date"
              ellipsis
            >
              {rowInfo?.expire_date || "--"}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="预警描述"
              dataIndex="warn_desc"
              ellipsis
            >
              {rowInfo?.warn_desc || "--"}
            </ProDescriptions.Item>
          </ProDescriptions>
        </div>
        <div className={styles.title}>预警处置</div>
        <NotesText
          label="处置结果"
          width={200}
          name="dispose_result"
          required={true}
        />
        <ProFormItem label="处置附件" className={styles.upload}>
          <WebUploadr
            isAuto={true}
            upbutext="文件上传"
            maxSize={99999}
            upurl="/cfg.php?controller=confDispose&action=disposeUpload"
            isShowUploadList={true}
            maxCount={1}
            onSuccess={updateFinish}
            isUpsuccess={true}
            // autoBtnType="primary"
          />
        </ProFormItem>
      </DrawerForm>
    </div>
  );
}
