import { useState, useEffect } from "react";
import { useSelector } from "umi";
import { message, Modal, Tooltip, Tag, Switch, Form } from "antd";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import { NameText } from "@/utils/fromTypeLabel";
import {
  ProFormText,
  ProFormSelect,
  DrawerForm,
  ProFormTreeSelect,
  ProFormCheckbox,
  ProFormDigit,
  ProFormSwitch,
  ProFormItem,
} from "@ant-design/pro-components";
import styles from "./index.less";
import AddIcon from "@/assets/nac/add.svg";
import SaveSvg from "@/assets/nac/save.svg";
import { ProtableModule } from "@/components/Module";
import AddTermGroup from "../../objman/components/addtermgrp";

const { confirm } = Modal;

export default function () {
  const [drawerOpen, setDrawerOpen] = useState(false); //新建权限配置弹窗开关
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [termgrpVisible, setTermgrpVisible] = useState(false); //新建终端分组弹窗开关
  const [recordInfo, setRecordInfo] = useState({}); //权限配置名称
  const [devGrpCombo, setDevGrpCombo] = useState([]); //终端分组

  useEffect(() => {
    fetchDevGrpCombo();
  }, []);

  const [addform] = Form.useForm();

  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;

  const drawFormLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
    layout: "horizontal",
  };

  const columnsList = [
    {
      title: "状态",
      width: 80,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text, record) => {
        return (
          <Switch
            checked={text === "Y"}
            checkedChildren={language("project.open")}
            unCheckedChildren={language("project.close")}
            onChange={(state) => {
              changeStatus(record, state);
            }}
          />
        );
      },
    },
    {
      title: "策略名称",
      width: 130,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "下发对象",
      width: 130,
      dataIndex: "dgrpValue",
      key: "dgrpValue",
      align: "left",
      ellipsis: true,
    },
    {
      title: "心跳间隔",
      width: 130,
      dataIndex: "keepalive",
      key: "keepalive",
      align: "left",
      render: (text) => {
        return text + "秒";
      },
    },
    {
      title: "网关寻址",
      width: 130,
      dataIndex: "dns",
      key: "dns",
      align: "center",
      render: (text) => {
        const color = text === "Y" ? "#00c48e" : "#8e8d8d";
        return (
          <Tag color={color} style={{ margin: 0 }}>
            {text === "Y" ? "开启" : "关闭"}
          </Tag>
        );
      },
    },
    {
      title: "时间同步标识",
      width: 130,
      dataIndex: "syntimesign",
      key: "syntimesign",
      align: "center",
      render: (text) => {
        const color = text === "Y" ? "#00c48e" : "#8e8d8d";
        return (
          <Tag color={color} style={{ margin: 0 }}>
            {text === "Y" ? "开启" : "关闭"}
          </Tag>
        );
      },
    },
    {
      title: "终端阻断控制",
      width: 130,
      dataIndex: "checkblockctl",
      key: "checkblockctl",
      align: "left",
      render: (text) => {
        const textMap = {
          0: "不处理",
          1: "关键项违规阻断",
          2: "任意项违规阻断",
        };
        return textMap[text];
      },
    },
    {
      title: "托盘显示",
      width: 130,
      dataIndex: "showTray",
      key: "showTray",
      align: "center",
      render: (text) => {
        const color = text === "Y" ? "#00c48e" : "#8e8d8d";
        return (
          <Tag color={color} style={{ margin: 0 }}>
            {text === "Y" ? "开启" : "关闭"}
          </Tag>
        );
      },
    },
    {
      title: "显示名称",
      width: 130,
      dataIndex: "showTrayName",
      key: "showTrayName",
      align: "left",
      ellipsis: true,
    },
    {
      title: "终端退网开关",
      width: 130,
      dataIndex: "applyforquit",
      key: "applyforquit",
      align: "center",
      render: (text) => {
        const color = text === "Y" ? "#00c48e" : "#8e8d8d";
        return (
          <Tag color={color} style={{ margin: 0 }}>
            {text === "Y" ? "开启" : "关闭"}
          </Tag>
        );
      },
    },
    {
      title: "终端退网URL",
      width: 130,
      dataIndex: "applyforquiturl",
      key: "applyforquiturl",
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
              setRecordInfo(record);
              setDrawerOpen(true);
              addform.setFieldsValue({ ...record });
              console.log(record, "record");
            }}
          >
            <img src={SaveSvg} style={{ cursor: "pointer" }} />
          </Tooltip>
        );
      },
    },
  ];

  //更改状态
  const changeStatus = (info, state) => {
    const params = {
      name: info.name,
      ids: info.id,
      opcode: state ? "enable" : "disable",
    };
    post(
      "/cfg.php?controller=agentCFGPolicy&action=agentCFGPolicy_status",
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
      .catch(() => {
        console.log("mistake");
      });
  };

  //获取终端分组
  const fetchDevGrpCombo = () => {
    post("/cfg.php?controller=devGroupControl&action=showDevGrpComboTree")
      .then((res) => {
        setDevGrpCombo(res ? res : []);
      })
      .catch((error) => {
        console.log(error, "error");
      });
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
    const params = { name: names.join(","), id: ids.join(",") };
    post("/cfg.php?controller=agentCFGPolicy&action=delAgentCFGPolicy", params)
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
  //关闭弹窗重置数据
  const resetValues = () => {
    addform.resetFields();
    setDrawerOpen(false);
    setRecordInfo({});
  };
  //保存
  const saveInfo = (values) => {
    const opcode = Object.keys(recordInfo).length === 0 ? "add" : "modify";
    const params = { ...values, opcode, id: recordInfo.id || undefined };
    post("/cfg.php?controller=agentCFGPolicy&action=setAgentCFGPolicy", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
          resetValues();
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
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
        apishowurl="/cfg.php?controller=agentCFGPolicy&action=showAgentCFGPolicy"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="termcfgTable"
        rowkey="id"
        columnvalue="termcfgColumnvalue"
        rowSelection={true}
        addButton={true}
        delButton={true}
        delClick={delClick}
        addClick={() => {
          setDrawerOpen(true);
        }}
      />
      <DrawerForm
        {...drawFormLayout}
        title={JSON.stringify(recordInfo) == "{}" ? "添加" : "编辑"}
        form={addform}
        visible={drawerOpen}
        onVisibleChange={setDrawerOpen}
        drawerProps={{
          destroyOnClose: true,
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          bodyStyle: {
            padding: "12px 0 0 0 ",
          },
          extra: (
            <div>
              <span onClick={resetValues} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
          onClose: resetValues,
        }}
        initialValues={{
          status: "N",
          showTrayName: "接入认证客户端",
        }}
        width={480}
        onFinish={saveInfo}
      >
        <div>
          <ProFormSwitch
            label="策略状态"
            name="status"
            checkedChildren={language("project.enable")}
            unCheckedChildren={language("project.disable")}
            getValueFromEvent={(value) => {
              return value ? "Y" : "N";
            }}
            getValueProps={(value) => ({ checked: value === "Y" })}
          />
        </div>
        <NameText
          name="name"
          label="策略名称"
          width={250}
          placeholder="请输入名称"
          required={true}
        />
        <div className={styles.formAddItem}>
          <ProFormTreeSelect
            name="dgrpValue"
            label="执行对象"
            rules={[
              {
                required: true,
                message: language("project.mandatory"),
              },
            ]}
            width={250}
            fieldProps={{
              showArrow: true,
              filterTreeNode: true,
              dropdownMatchSelectWidth: false,
              labelInValue: false,
              autoClearSearchValue: true,
              treeData: devGrpCombo,
              treeNodeFilterProp: "text",
              fieldNames: {
                label: "text",
                value: "value",
              },
              allowClear: false,
              treeNodeLabelProp: "value",
              placeholder: language("project.select"),
            }}
          />
          <img
            src={AddIcon}
            alt=""
            className={styles.addicon}
            onClick={() => {
              setTermgrpVisible(true);
            }}
          />
        </div>
        <div className={styles.subtitle}>基础配置</div>
        <ProFormDigit
          label="心跳间隔"
          name="keepalive"
          min={1}
          max={180}
          width={120}
          fieldProps={{
            precision: 0,
            addonAfter: "秒",
            className: styles.numberInput,
          }}
        />
        <ProFormCheckbox
          label="网关寻址"
          name="dns"
          valuePropName="checked"
          getValueFromEvent={(value) => {
            return value.target.checked ? "Y" : "N";
          }}
          getValueProps={(value) => ({ checked: value === "Y" })}
          fieldProps={{
            className: styles.checkBox,
          }}
        >
          通过DNS请求和解析寻找网关地址
        </ProFormCheckbox>
        <div className={styles.subtitle}>NTP时间同步配置</div>
        <ProFormItem label="时间同步标识">
          <div className={styles.inlineText}>
            <ProFormCheckbox
              name="syntimesign"
              valuePropName="checked"
              getValueFromEvent={(value) => {
                return value.target.checked ? "Y" : "N";
              }}
              getValueProps={(value) => ({ checked: value === "Y" })}
              fieldProps={{
                className: styles.checkBox,
              }}
            >
              同步周期
            </ProFormCheckbox>
          </div>

          <div className={styles.inlineText}>
            <ProFormDigit
              name="timecycle"
              min={1}
              max={3600}
              width={134}
              fieldProps={{
                addonAfter: "分钟",
                className: styles.numberInput,
              }}
            />
          </div>
        </ProFormItem>
        <ProFormItem label="同步地址和端口">
          <div className={styles.inlineText} style={{ marginRight: 6 }}>
            <ProFormText
              name="timesvrip"
              width={150}
              placeholder="IP/域名"
              rules={[
                {
                  required: true,
                  message: language("project.mandatory"),
                },
              ]}
            />
          </div>
          <div className={styles.inlineText}>
            <ProFormText
              name="timesrvport"
              width={94}
              placeholder="端口"
              rules={[
                {
                  required: true,
                  message: language("project.mandatory"),
                },
              ]}
            />
          </div>
        </ProFormItem>
        <div className={styles.subtitle}>显示配置</div>
        <div className={styles.formItem}>
          <ProFormItem label="托盘显示">
            <div className={styles.inlineText}>
              <ProFormCheckbox
                name="showTray"
                valuePropName="checked"
                getValueFromEvent={(value) => {
                  return value.target.checked ? "Y" : "N";
                }}
                getValueProps={(value) => ({ checked: value === "Y" })}
                fieldProps={{
                  className: styles.checkBox,
                }}
              >
                显示名称
              </ProFormCheckbox>
            </div>

            <div className={styles.inlineText}>
              <ProFormText
                name="showTrayName"
                width={160}
                fieldProps={{
                  className: styles.input,
                }}
              />
            </div>
          </ProFormItem>
        </div>

        <div
          className={styles.subtitle}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>高级配置</span>
          <span style={{ color: "#FF5001" }}>
            请在了解其详细功能后谨慎配置！
          </span>
        </div>
        <ProFormSelect
          label="终端阻断控制"
          name="checkblockctl"
          width={250}
          placeholder={language("project.select")}
          options={[
            { label: "不处理", value: "0" },
            { label: "关键项违规阻断", value: "1" },
            { label: "任意项违规阻断", value: "2" },
          ]}
        />
        <ProFormCheckbox
          label="终端隔离控制"
          name="isolate"
          valuePropName="checked"
          getValueFromEvent={(value) => {
            return value.target.checked ? "Y" : "N";
          }}
          getValueProps={(value) => ({ checked: value === "Y" })}
          fieldProps={{
            className: styles.checkBox,
          }}
        >
          设置本地防火墙
        </ProFormCheckbox>
        <ProFormCheckbox
          label="IP-MAC保护"
          name="ipmacprotect"
          valuePropName="checked"
          getValueFromEvent={(value) => {
            return value.target.checked ? "Y" : "N";
          }}
          getValueProps={(value) => ({ checked: value === "Y" })}
          fieldProps={{
            className: styles.checkBox,
          }}
        >
          禁止修改MAC及静态IP
        </ProFormCheckbox>
        <ProFormCheckbox
          label="内联控制"
          name="blockctl"
          valuePropName="checked"
          getValueFromEvent={(value) => {
            return value.target.checked ? "Y" : "N";
          }}
          getValueProps={(value) => ({ checked: value === "Y" })}
          fieldProps={{
            className: styles.checkBox,
          }}
        >
          阻断同网段内访问已安装客户端终端
        </ProFormCheckbox>
        <ProFormCheckbox
          label="注册地址修改"
          name="mnetaddress"
          valuePropName="checked"
          getValueFromEvent={(value) => {
            return value.target.checked ? "Y" : "N";
          }}
          getValueProps={(value) => ({ checked: value === "Y" })}
          fieldProps={{
            className: styles.checkBox,
          }}
        >
          允许客户端修改要注册的网关地址
        </ProFormCheckbox>
        <ProFormCheckbox
          label="禁用终端IPv6"
          name="denyIPV6"
          valuePropName="checked"
          getValueFromEvent={(value) => {
            return value.target.checked ? "Y" : "N";
          }}
          getValueProps={(value) => ({ checked: value === "Y" })}
          fieldProps={{
            className: styles.checkBox,
          }}
        >
          禁止用户客户端IPv6地址网络
        </ProFormCheckbox>
        <div className={styles.formItem}>
          <ProFormItem label="终端退网申请">
            <div className={styles.inlineText}>
              <ProFormCheckbox
                name="applyforquit"
                valuePropName="checked"
                getValueFromEvent={(value) => {
                  return value.target.checked ? "Y" : "N";
                }}
                getValueProps={(value) => ({ checked: value === "Y" })}
                fieldProps={{
                  className: styles.checkBox,
                }}
              >
                开启
              </ProFormCheckbox>
            </div>

            <div className={styles.inlineText}>
              <ProFormText
                name="applyforquiturl"
                width={188}
                fieldProps={{
                  className: styles.input,
                }}
                placeholder="默认重定向URL地址"
              />
            </div>
          </ProFormItem>
        </div>

        <ProFormCheckbox
          label="移动终端禁用"
          name="mobiledeny"
          valuePropName="checked"
          getValueFromEvent={(value) => {
            return value.target.checked ? "Y" : "N";
          }}
          getValueProps={(value) => ({ checked: value === "Y" })}
          fieldProps={{
            className: styles.checkBox,
          }}
        >
          禁止终端通过USB接口连接移动终端
        </ProFormCheckbox>
      </DrawerForm>
      <AddTermGroup
        visible={termgrpVisible}
        setVisible={setTermgrpVisible}
        formType="modal"
        mainformRef={addform}
      />
    </div>
  );
}
