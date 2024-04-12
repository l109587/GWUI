import React, { useRef, useState, useEffect } from "react";
import {
  Popconfirm,
  Tooltip,
  Modal,
  Tabs,
  Row,
  Col,
  Button,
  Space,
  Affix,
  Alert,
} from "antd";
import {
  ProForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormSwitch,
  ProCard,
  ProFormDigit,
  ProDescriptions,
  ProFormItem,
} from "@ant-design/pro-components";
import {
  EditOutlined,
  EditTwoTone,
  SaveOutlined,
  DeleteOutlined,
  DeleteTwoTone,
  PlusSquareTwoTone,
  CloudTwoTone,
  CloseOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useSelector } from "umi";
import styles from "./index.less";
import { language } from "@/utils/language";
import { regIpList } from '@/utils/regExp'
import EditTable from "@/components/Module/tinyEditTable/tinyEditTable";

export default function () {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 55;
  const [pdIsSave, setPdIsSave] = useState(true); // 默认未保存当前数据不可下发
  const [pdData, setPdData] = useState([]); // 代理域名列表
  const [excdIsSave, setExcdIsSave] = useState(true); // 默认未保存当前数据不可下发
  const [excdData, setExcdData] = useState([]); // 例外域名列表
  const [excipIsSave, setExcipIsSave] = useState(true); // 默认未保存当前数据不可下发
  const [excipData, setExcipData] = useState([]); // 例外IP列表
  const [pipIsSave, setPipIsSave] = useState(true); // 默认未保存当前数据不可下发
  const [pipData, setPipData] = useState([]); // 代理服务器IP列表
  const [ntaipIsSave, setNtaipIsSave] = useState(true); // 默认未保存当前数据不可下发
  const [ntaipData, setNtaipData] = useState([]); // Nta IP列表

  const formRef = useRef();
  const formleftLayout = {
    layout: "horizontal",
    // labelCol: {
    //   span: 4,
    // },
    // wrapperCol: {
    //   span: 20,
    // },
  };
  const proxyDomainTable = () => {
    const proxyDomainColumns = [
      {
        title: "域名",
        dataIndex: "domain",
        key: "domain",
        width: 230,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regIpList.domainName.regex,
              message: regIpList.domainName.alertText,
            },
          ],
        },
      },
      {
        title: language("project.operate"),
        valueType: "option",
        width: 70,
        align: "center",
        render: (text, record, _, action) => [
          <Tooltip
            placement="top"
            title={language("project.sysconf.syscert.edit")}
          >
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
                setPdIsSave(false);
              }}
            >
              <EditOutlined />
            </a>
          </Tooltip>,
          <Popconfirm
            title={language("project.sysconf.syscert.deleteTitle")}
            okText={language("project.sysconf.syscert.okText")}
            cancelText={language("project.sysconf.syscert.cancelText")}
            onConfirm={() => {
              setPdData(pdData.filter((item) => item.id !== record.id));
            }}
          >
            <Tooltip
              placement="top"
              title={language("project.sysconf.syscert.delete")}
            >
              <a key="delete" style={{ color: "red" }}>
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Popconfirm>,
        ],
      },
    ];
    return (
      <EditTable
        setIsSave={setPdIsSave}
        columns={proxyDomainColumns}
        // tableHeight={130}
        tableWidth={510}
        dataSource={pdData}
        setDataSource={setPdData}
        deleteButShow={false}
      />
    );
  };
  const excDomainTable = () => {
    const excDomainColumns = [
      {
        title: "域名",
        dataIndex: "domain",
        key: "domain",
        width: 230,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regIpList.domainName.regex,
              message: regIpList.domainName.alertText,
            },
          ],
        },
      },
      {
        title: language("project.operate"),
        valueType: "option",
        width: 70,
        align: "center",
        render: (text, record, _, action) => [
          <Tooltip
            placement="top"
            title={language("project.sysconf.syscert.edit")}
          >
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
                setExcdIsSave(false);
              }}
            >
              <EditOutlined />
            </a>
          </Tooltip>,
          <Popconfirm
            title={language("project.sysconf.syscert.deleteTitle")}
            okText={language("project.sysconf.syscert.okText")}
            cancelText={language("project.sysconf.syscert.cancelText")}
            onConfirm={() => {
              setExcdData(excdData.filter((item) => item.id !== record.id));
            }}
          >
            <Tooltip
              placement="top"
              title={language("project.sysconf.syscert.delete")}
            >
              <a key="delete" style={{ color: "red" }}>
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Popconfirm>,
        ],
      },
    ];
    return (
      <EditTable
        setIsSave={setExcdIsSave}
        columns={excDomainColumns}
        // tableHeight={130}
        tableWidth={510}
        dataSource={excdData}
        setDataSource={setExcdData}
        deleteButShow={false}
      />
    );
  };
  const excIPTable = () => {
    const excIPColumns = [
      {
        title: "IPv4/IPv4段/IPv4掩码/IPv6/IPv6段",
        dataIndex: "ip",
        key: "ip",
        width: 230,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regIpList.signIPV4OrIPV6.regex,
              message: regIpList.signIPV4OrIPV6.alertText,
            },
          ],
        },
      },
      {
        title: language("project.operate"),
        valueType: "option",
        width: 70,
        align: "center",
        render: (text, record, _, action) => [
          <Tooltip
            placement="top"
            title={language("project.sysconf.syscert.edit")}
          >
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
                setExcipIsSave(false);
              }}
            >
              <EditOutlined />
            </a>
          </Tooltip>,
          <Popconfirm
            title={language("project.sysconf.syscert.deleteTitle")}
            okText={language("project.sysconf.syscert.okText")}
            cancelText={language("project.sysconf.syscert.cancelText")}
            onConfirm={() => {
              setExcipData(excipData.filter((item) => item.id !== record.id));
            }}
          >
            <Tooltip
              placement="top"
              title={language("project.sysconf.syscert.delete")}
            >
              <a key="delete" style={{ color: "red" }}>
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Popconfirm>,
        ],
      },
    ];
    return (
      <EditTable
        setIsSave={setExcipIsSave}
        columns={excIPColumns}
        // tableHeight={130}
        tableWidth={510}
        dataSource={excipData}
        setDataSource={setExcipData}
        deleteButShow={false}
      />
    );
  };
  const proxyIPTable = () => {
    const proxyIPColumns = [
      {
        title: "IPv4/IPv4段/IPv4掩码/IPv6/IPv6段",
        dataIndex: "ip",
        key: "ip",
        width: 230,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regIpList.signIPV4OrIPV6.regex,
              message: regIpList.signIPV4OrIPV6.alertText,
            },
          ],
        },
      },
      {
        title: language("project.operate"),
        valueType: "option",
        width: 70,
        align: "center",
        render: (text, record, _, action) => [
          <Tooltip
            placement="top"
            title={language("project.sysconf.syscert.edit")}
          >
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
                setPipIsSave(false);
              }}
            >
              <EditOutlined />
            </a>
          </Tooltip>,
          <Popconfirm
            title={language("project.sysconf.syscert.deleteTitle")}
            okText={language("project.sysconf.syscert.okText")}
            cancelText={language("project.sysconf.syscert.cancelText")}
            onConfirm={() => {
              setPipData(pipData.filter((item) => item.id !== record.id));
            }}
          >
            <Tooltip
              placement="top"
              title={language("project.sysconf.syscert.delete")}
            >
              <a key="delete" style={{ color: "red" }}>
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Popconfirm>,
        ],
      },
    ];
    return (
      <EditTable
        setIsSave={setPipIsSave}
        columns={proxyIPColumns}
        // tableHeight={130}
        tableWidth={510}
        dataSource={pipData}
        setDataSource={setPipData}
        deleteButShow={false}
      />
    );
  };
  const ntaIPTable = () => {
    const ntaIPColumns = [
      {
        title: "IPv4/IPv4段/IPv4掩码/IPv6/IPv6段",
        dataIndex: "ip",
        key: "ip",
        width: 230,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: language("project.mandatory"),
            },
            {
              pattern: regIpList.signIPV4OrIPV6.regex,
              message: regIpList.signIPV4OrIPV6.alertText,
            },
          ],
        },
      },
      {
        title: language("project.operate"),
        valueType: "option",
        width: 70,
        align: "center",
        render: (text, record, _, action) => [
          <Tooltip
            placement="top"
            title={language("project.sysconf.syscert.edit")}
          >
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record.id);
                setNtaipIsSave(false);
              }}
            >
              <EditOutlined />
            </a>
          </Tooltip>,
          <Popconfirm
            title={language("project.sysconf.syscert.deleteTitle")}
            okText={language("project.sysconf.syscert.okText")}
            cancelText={language("project.sysconf.syscert.cancelText")}
            onConfirm={() => {
              setNtaipData(ntaipData.filter((item) => item.id !== record.id));
            }}
          >
            <Tooltip
              placement="top"
              title={language("project.sysconf.syscert.delete")}
            >
              <a key="delete" style={{ color: "red" }}>
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Popconfirm>,
        ],
      },
    ];
    return (
      <EditTable
        setIsSave={setNtaipIsSave}
        columns={ntaIPColumns}
        // tableHeight={130}
        tableWidth={510}
        dataSource={ntaipData}
        setDataSource={setNtaipData}
        deleteButShow={false}
      />
    );
  };
  return (
    <ProCard
      title={<span className={styles.firstTitle}>高级配置</span>}
      headStyle={{ padding: "25px 60px 0 60px" }}
      bodyStyle={{
        padding: "0 15px 25px 60px",
      }}
    >
      <ProForm
        {...formleftLayout}
        formRef={formRef}
        submitter={false}
        // onFinish={saveCfg}
        className={styles.container}
        initialValues={{
          edpver:'1'
        }}
      >
        <div
          style={{
            maxHeight: clientHeight - 110,
            overflow: "auto",
          }}
        >
          <div className={styles.title}>DNS代理</div>
          <div className={styles.inlineText}>
            <ProFormSwitch
              name="proxy_DNS"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              getValueFromEvent={(value) => {
                return value ? "on" : "off";
              }}
              getValueProps={(value) => ({ checked: value === "on" })}
            />
          </div>
          <span className={styles.swtext}>开启DNS代理</span>
          <div style={{ marginLeft: 40, display: "inline-block" }}>
            <Alert
              message="此域名不包括IP地址，最多支持20个域名。"
              type="info"
              showIcon
              className={styles.alert}
            />
          </div>
          <div className={styles.tableTitle}>代理域名列表：</div>
          {proxyDomainTable()}
          <div className={styles.tableTitle}>例外域名列表：</div>
          {excDomainTable()}
          <div className={styles.title}>HTTP代理</div>
          <div className={styles.inlineText}>
            <ProFormSwitch
              name="proxy_http"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              getValueFromEvent={(value) => {
                return value ? "on" : "off";
              }}
              getValueProps={(value) => ({ checked: value === "on" })}
            />
          </div>
          <span className={styles.swtext}>开启HTTP代理</span>
          <div className={styles.tableTitle}>例外IP列表：</div>
          {excIPTable()}
          <div className={styles.title}>检查HTTP代理报文</div>
          <div className={styles.inlineText}>
            <ProFormSwitch
              name="proxy_checkhttp"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              getValueFromEvent={(value) => {
                return value ? "on" : "off";
              }}
              getValueProps={(value) => ({ checked: value === "on" })}
            />
          </div>
          <span className={styles.swtext}>开启检查HTTP代理报文</span>
          <div className={styles.tableTitle}>代理服务器IP地址：</div>
          {proxyIPTable()}
          <div className={styles.title}>NAT设置</div>
          <div className={styles.inlineText}>
            <ProFormSwitch
              name="nta"
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              getValueFromEvent={(value) => {
                return value ? "on" : "off";
              }}
              getValueProps={(value) => ({ checked: value === "on" })}
            />
          </div>
          <span className={styles.swtext}>开启NAT设置</span>
          <div className={styles.fildItem}>
            <ProFormRadio.Group
              width={250}
              name="edpver"
              label="私接NAT处理"
              options={[
                {
                  label: "接入",
                  value: "1",
                },
                {
                  label: "阻断",
                  value: "2",
                },
                {
                  label: "放行",
                  value: "3",
                },
              ]}
            />
          </div>
          <div className={styles.inputInlineText}>
            <ProFormItem label="水印超时监测">
              <div className={styles.inputInlineText}>
                <ProFormCheckbox
                  name="overtime"
                  valuePropName="checked"
                  getValueFromEvent={(value) => {
                    return value.target.checked ? "Y" : "N";
                  }}
                  getValueProps={(value) => value === "Y"}
                  fieldProps={{
                    style: { paddingTop: 2 },
                  }}
                >
                  超过
                </ProFormCheckbox>
              </div>
              <div className={styles.inputInlineText}>
                <ProFormDigit
                  name="input-number"
                  min={1}
                  width={120}
                  fieldProps={{
                    addonAfter: "分",
                    className: styles.numberInput,
                  }}
                />
              </div>
              <span style={{ verticalAlign: "middle" }}>开始监测</span>
            </ProFormItem>
          </div>

          <div className={styles.tableTitle}>合法NAT IP列表：</div>
          {ntaIPTable()}
        </div>

        <div style={{ marginTop: 24 }}>
          <Affix offsetBottom={40}>
            <Button htmlType="submit" type="primary" icon={<SaveOutlined />}>
              保存设置
            </Button>
          </Affix>
        </div>
      </ProForm>
    </ProCard>
  );
}
