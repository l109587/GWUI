import { useState, useEffect } from "react";
import { useSelector } from "umi";
import { message, Modal, Tooltip, Space, Switch, Form, Button } from "antd";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import { NameText } from "@/utils/fromTypeLabel";
import {
  ProFormText,
  ProFormSelect,
  DrawerForm,
  ProFormDateTimePicker,
  ProFormSwitch,
} from "@ant-design/pro-components";
import styles from "./index.less";
import AddIcon from "@/assets/nac/add.svg";
import SaveSvg from "@/assets/nac/save.svg";
import Examine from "@/assets/nac/examine.svg";
import { ProtableModule } from "@/components/Module";
import { regList } from "@/utils/regExp";
import AddAuthCfg from "../../objman/components/addAuthCfg";

const { confirm } = Modal;

export default function () {
  const [drawerOpen, setDrawerOpen] = useState(false); //新建权限配置弹窗开关
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [recordInfo, setRecordInfo] = useState({}); //权限配置名称
  const [addAuthCfgVisible, setAddAuthCfgVisible] = useState(false); //新建权限配置弹窗开关
  const [domains, setDomains] = useState([]); //保存临时隔离区域

  const [approveDdrawerOpen, setApproveDdrawerOpen] = useState(false); //审批弹窗

  useEffect(() => {
    fetchDomain();
  }, []);

  const [addform] = Form.useForm();
  const [approveFormRef] = Form.useForm();

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
      title: "访客名称",
      width: 130,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "审批状态",
      width: 130,
      dataIndex: "approve",
      key: "approve",
      align: "left",
      ellipsis: true,
    },
    {
      title: "身份证号",
      width: 130,
      dataIndex: "IDCard",
      key: "IDCard",
      align: "left",
      ellipsis: true,
    },
    {
      title: "所属公司",
      width: 130,
      dataIndex: "company",
      key: "company",
      align: "left",
      ellipsis: true,
    },
    {
      title: "部门",
      width: 130,
      dataIndex: "department",
      key: "department",
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
      title: "访问原由",
      width: 130,
      dataIndex: "reason",
      key: "reason",
      align: "left",
      ellipsis: true,
    },
    {
      title: "接待人",
      width: 130,
      dataIndex: "receiver",
      key: "receiver",
      align: "left",
      ellipsis: true,
    },
    {
      title: "使用期限",
      width: 160,
      dataIndex: "expire",
      key: "expire",
      align: "left",
      ellipsis: true,
    },
    {
      title: "剩余时间",
      width: 130,
      dataIndex: "remaintime",
      key: "remaintime",
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
          <Space size={12}>
            <Tooltip
              title="审批"
              arrowPointAtCenter
              onClick={() => {
                setRecordInfo(record);
                setApproveDdrawerOpen(true);
                approveFormRef.setFieldsValue(record);
              }}
            >
              <img src={Examine} alt="" style={{ cursor: "pointer" }} />
            </Tooltip>
            <Tooltip
              title={language("project.edit")}
              arrowPointAtCenter
              onClick={() => {
                setRecordInfo(record);
                setDrawerOpen(true);
                addform.setFieldsValue(record);
              }}
            >
              <img src={SaveSvg} style={{ cursor: "pointer" }} />
            </Tooltip>
          </Space>
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
    post("/cfg.php?controller=guest&action=guest_status", params)
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

  //获取隔离区域
  const fetchDomain = () => {
    post("/cfg.php?controller=securityDomain&action=show_securitydomain")
      .then((res) => {
        setDomains(res.data ? res.data : []);
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
    const params = { names: names.join(","), ids: ids.join(",") };
    post("/cfg.php?controller=guest&action=delete_agentCFGPolicy", params)
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
  //关闭审批弹窗重置数据
  const resetAprValues = () => {
    approveFormRef.resetFields();
    setApproveDdrawerOpen(false);
    setRecordInfo({});
  };
  //保存
  const saveInfo = (values) => {
    const opcode = Object.keys(recordInfo).length === 0 ? "add" : "modify";
    const params = { ...values, opcode, id: recordInfo.id || undefined };
    post("/cfg.php?controller=guest&action=set_guest_info", params)
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
  //通过
  const passHandle = (values) => {
    const params = { ...values, status: "Y", id: recordInfo.id };
    post("/cfg.php?controller=guest&action=guest_approve", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
          resetAprValues();
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };
  //驳回
  const rejecthandel = () => {
    const values = approveFormRef.getFieldsValue([
      "authority",
      "expire",
      "athcode",
    ]);
    const params = { ...values, status: "N", id: recordInfo.id };
    post("/cfg.php?controller=guest&action=guest_approve", params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
          resetAprValues();
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };
  //分配上网码
  const allocation = () => {
    post("/cfg.php?controller=guest&action=get_athcode")
      .then((res) => {
        if (res.success) {
          addform.setFieldsValue({ athcode: res.athcode });
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
        apishowurl="/cfg.php?controller=guest&action=show_guest_info"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="guestlistTable"
        rowkey="id"
        columnvalue="guestlistColumnvalue"
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
          status: false,
          // athcode: "234fedrf",
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
          />
        </div>
        <NameText
          name="name"
          label="访客名称"
          width={250}
          placeholder="此为访客登录账户"
          required={true}
        />
        <NameText
          name="IDCard"
          label="身份证号"
          width={250}
          required={true}
          rules={[
            {
              pattern: regList.idcard.regex,
              message: regList.idcard.alertText,
            },
          ]}
        />
        <NameText name="company" label="所属公司" width={250} required={true} />
        <NameText name="department" label="部门" width={250} required={true} />
        <NameText
          name="phone"
          label="联系电话"
          width={250}
          required={true}
          rules={[
            {
              pattern: regList.phone.regex,
              message: regList.phone.alertText,
            },
          ]}
        />
        <NameText name="reason" label="访问原由" width={250} required={true} />
        <NameText name="receiver" label="接待人" width={250} required={true} />
        <ProFormDateTimePicker name="expire" label="有效期" width={250} />
        <div className={styles.formAddItem}>
          <ProFormSelect
            label="访问区域"
            name="authority"
            width={250}
            placeholder="请添加访问区域"
            options={domains}
          />
          <img
            src={AddIcon}
            className={styles.addicon}
            onClick={(e) => {
              setAddAuthCfgVisible(true);
            }}
          />
        </div>
        <div className={styles.disabledItem}>
          <ProFormText
            name="athcode"
            label="上网码"
            width={250}
            disabled={true}
            fieldProps={{
              suffix: (
                <span
                  style={{ color: "#1677FF", cursor: "pointer" }}
                  onClick={allocation}
                >
                  分配
                </span>
              ),
            }}
            placeholder={null}
          />
        </div>
      </DrawerForm>
      <DrawerForm
        {...drawFormLayout}
        title="审批"
        form={approveFormRef}
        visible={approveDdrawerOpen}
        onVisibleChange={setApproveDdrawerOpen}
        drawerProps={{
          destroyOnClose: true,
          placement: "right",
          closable: false,
          getContainer: false,
          style: {
            position: "absolute",
          },
          bodyStyle: { padding: "0 0 24px 0" },
          extra: (
            <div>
              <span onClick={resetAprValues} style={{ cursor: "pointer" }}>
                <CloseOutlined />
              </span>
            </div>
          ),
          onClose: resetAprValues,
        }}
        submitter={{
          render: (props, doms) => {
            return [
              doms[0],
              <Button
                type="primary"
                onClick={() => {
                  approveFormRef.submit();
                }}
              >
                通过
              </Button>,
              <Button type="primary" danger onClick={rejecthandel}>
                驳回
              </Button>,
            ];
          },
        }}
        width={480}
        onFinish={passHandle}
      >
        <div className={styles.subtitle}>注册信息</div>
        <div className={styles.infoContainer}>
          <div className={styles.infoBox}>
            <div className={styles.infoItem}>
              <div className={styles.infolabel}>访客名称：</div>
              <div className={styles.infotext}>{recordInfo.name}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infolabel}>身份证号：</div>
              <div className={styles.infotext}>{recordInfo.IDCard}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infolabel}>所属公司：</div>
              <div className={styles.infotext}>{recordInfo.company}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infolabel}>部门：</div>
              <div className={styles.infotext}>{recordInfo.department}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infolabel}>联系电话：</div>
              <div className={styles.infotext}>{recordInfo.phone}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infolabel}>访问原由：</div>
              <div className={styles.infotext}>{recordInfo.reason}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infolabel}>接待人：</div>
              <div className={styles.infotext}>{recordInfo.receiver}</div>
            </div>
          </div>
        </div>
        <div className={styles.subtitle}>审核操作</div>
        <div className={styles.formAprAddItem}>
          <ProFormSelect
            label="访问区域"
            name="authority"
            width={250}
            placeholder="请添加访问区域"
            options={domains}
          />
          <img
            src={AddIcon}
            className={styles.addicon}
            onClick={(e) => {
              setAddAuthCfgVisible(true);
            }}
          />
        </div>
        <ProFormDateTimePicker name="expire" label="有效期" width={250} />
        <div className={styles.disabledItem}>
          <ProFormText
            name="athcode"
            label="上网码"
            width={250}
            disabled={true}
            fieldProps={{
              suffix: (
                <span style={{ color: "#1677FF", cursor: "pointer" }}>
                  分配
                </span>
              ),
            }}
            placeholder={null}
          />
        </div>
      </DrawerForm>
      <AddAuthCfg
        addVisible={addAuthCfgVisible}
        setAddModalVisible={setAddAuthCfgVisible}
        formType="modal"
        mainformRef={addform}
      />
    </div>
  );
}
