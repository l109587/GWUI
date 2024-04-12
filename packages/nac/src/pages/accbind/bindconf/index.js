import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Button, message, Popconfirm, Affix, Space, Tooltip } from "antd";
import {
  ProForm,
  ProFormCheckbox,
  ProFormSwitch,
  ProCard,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post } from "@/services/https";
import { SaveOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./index.less";
import { EditTable } from "@/utils/fromTypeLabel";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
let H = document.body.clientHeight - 100;
var clientHeight = H;
export default () => {
  const formRef = useRef();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        const tableDataSource = formRef.current.getFieldsValue([
          "addrlistinfo",
        ]);
        formRef.current.setFieldsValue({
          addrlistinfo: tableDataSource["addrlistinfo"].filter(
            (item) => item.id != record.id
          ),
        });
      }}
      key="popconfirm"
      title={language("project.delconfirm")}
      okButtonProps={{
        loading: confirmLoading,
      }}
      okText={language("project.yes")}
      cancelText={language("project.no")}
    >
      <a>{text}</a>
    </Popconfirm>
  );
  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const fromcolumns = [
    {
      title: language("accctrl.bindconf.iporipmask"),
      dataIndex: "ignore_iprange",
      align: "left",
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: "80px",
      align: "center",
      render: (text, record, _, action) => [
        <>
          <Space>
            <Tooltip placement="top" title={language("project.edit")}>
              <a
                onClick={() => {
                  action.startEditable?.(record.id);
                }}
              >
                <img src={EditIcon} alt="" />
              </a>
            </Tooltip>

            {renderRemove(
              <Tooltip placement="top" title={language("project.del")}>
                <a>
                  <img src={DelIcon} alt="" />
                </a>
              </Tooltip>,
              record
            )}
          </Space>
        </>,
      ],
    },
  ];

  useEffect(() => {
    // configShow();
  }, []);

  const configShow = () => {
    post("/cfg.php?controller=devbind&action=configShow")
      .then((res) => {
        if (res.success) {
          let info = res.data ? res.data : {};
          let data = {};
          data.auto_bind_sw = info.auto_bind_sw == "Y" ? ["Y"] : [];
          data.auto_bind_ipmac = info.auto_bind_ipmac == "Y" ? ["Y"] : [];
          data.auto_bind_asset = info.auto_bind_asset == "Y" ? "Y" : "";
          data.auto_bind_swpos = info.auto_bind_swpos == "Y" ? "Y" : "";
          data.auto_bind_user = info.auto_bind_user == "Y" ? ["Y"] : [];
          let addrlist = info.ignore_iprange
            ? info.ignore_iprange.split(";")
            : [];
          let rowKey = [];
          let defaultDataInfo = [];
          console.log(addrlist);
          addrlist.map((item, index) => {
            defaultDataInfo.push({ id: index + 1, ignore_iprange: item });
            rowKey.push(index + 1);
          });
          data.addrlistinfo = defaultDataInfo;
          formRef.current.setFieldsValue(data);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const save = (info) => {
    let addrlist = [];
    let count = 0;
    if (info.addrlistinfo) {
      count = info.addrlistinfo.length;
    }
    if (count > 0) {
      info.addrlistinfo.map((item) => {
        addrlist.push(item.ignore_iprange);
      });
      addrlist = addrlist.join(";");
    } else {
      addrlist = "";
    }
    let data = {};
    data.auto_bind_sw = info.auto_bind_sw?.indexOf("Y") >= 0 ? "Y" : "N";
    data.auto_bind_ipmac = info.auto_bind_ipmac?.indexOf("Y") >= 0 ? "Y" : "N";
    data.auto_bind_asset = info.auto_bind_asset?.indexOf("Y") >= 0 ? "Y" : "N";
    data.auto_bind_swpos = info.auto_bind_swpos?.indexOf("Y") >= 0 ? "Y" : "N";
    data.auto_bind_user = info.auto_bind_user?.indexOf("Y") >= 0 ? "Y" : "N";
    data.ignore_iprange = addrlist;
    post("/cfg.php?controller=devbind&action=configShow")
      .then((res) => {
        if (!res.success) {
          message.error(res.msg);
          return false;
        } else {
          message.success(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div className="bndconfbox" style={{ height: clientHeight }}>
      <ProCard ghost title={"绑定配置"}>
        <ProForm
          formRef={formRef}
          submitTimeout={2000}
          className="bndconffrombox"
          submitter={{
            render: (props, doms) => {
              return [
                <Affix offsetBottom={40}>
                  <Row>
                    <Col span={14}>
                      <Button
                        type="primary"
                        style={{
                          borderRadius: 5,
                          marginTop: 15,
                        }}
                        onClick={() => {
                          props.submit();
                        }}
                      >
                        <SaveOutlined />
                        {language("project.savesettings")}
                      </Button>
                    </Col>
                  </Row>
                </Affix>,
              ];
            },
          }}
          onFinish={(values) => {
            save(values);
          }}
        >
          <div
            style={{
              maxHeight: clientHeight - 125,
              overflow: "auto",
            }}
          >
            <ProCard title={language("accctrl.bindconf.autobindipormac")} ghost>
              <div className="fromitembuttom">
                <ProFormCheckbox.Group
                  name="auto_bind_ipmac"
                  options={[
                    {
                      label: language(
                        "accctrl.bindconf.terminalfirstbinddefalutipormac"
                      ),
                      value: "Y",
                    },
                  ]}
                />
              </div>
              <div style={{ width: "555px", marginLeft: "22px" }}>
                <div style={{ color: "#BFBFBF" }}>
                  {language("accctrl.bindconf.ignoreipaotodefalut")}
                </div>
                <div>
                  <EditTable
                    label={false}
                    position={"top"}
                    style={{
                      width: "395px",
                    }}
                    name={"addrlistinfo"}
                    fromcolumns={fromcolumns}
                    required={false}
                    editableKeys={editableKeys}
                    setEditableRowKeys={setEditableRowKeys}
                  />
                </div>
              </div>
            </ProCard>
            <ProCard title="绑定数据状态" className="procardborderbox" ghost>
              <div>
                <ProFormCheckbox.Group
                  name="auto_bind_asset"
                  options={[
                    {
                      label: "自动添加的绑定数据状态为关闭",
                      value: "Y",
                    },
                  ]}
                />
              </div>
            </ProCard>
            <ProCard
              title="自动绑定其他属性"
              className="procardborderbox"
              ghost
            >
              <ProFormCheckbox.Group
                name="auto_bind_asset"
                options={[
                  {
                    label: language(
                      "accctrl.bindconf.terminalfirstregistrationautodefalutassets"
                    ),
                    value: "Y",
                  },
                ]}
              />
              <ProFormCheckbox.Group
                name="auto_bind_swpos"
                options={[
                  {
                    label: language(
                      "accctrl.bindconf.terminalfirstbinddefalutposition"
                    ),
                    value: "Y",
                  },
                ]}
              />
              <div>
                <ProFormCheckbox.Group
                  name="auto_bind_user"
                  options={[
                    {
                      label: language(
                        "accctrl.bindconf.terminalfirstbingdefalutuser"
                      ),
                      value: "Y",
                    },
                  ]}
                />
              </div>
            </ProCard>
            <ProCard title="交换机绑定配置" className="procardborderbox" ghost>
              <ProFormCheckbox.Group
                name="auto_bind_asset"
                options={[
                  {
                    label: "开启交换机与终端绑定检查",
                    value: "Y",
                  },
                ]}
              />
              <ProFormCheckbox.Group
                name="auto_bind_swpos"
                options={[
                  {
                    label: "通过Portal认证自动绑定交换机和终端",
                    value: "Y",
                  },
                ]}
              />
              <ProFormCheckbox.Group
                name="auto_bind_user"
                options={[
                  {
                    label: "开启交换机端口与合规终端绑定检查",
                    value: "Y",
                  },
                ]}
              />
              <div>
                <ProFormCheckbox.Group
                  name="auto_bind_user"
                  options={[
                    {
                      label: "开启交换机端口与阻断终端绑定检查",
                      value: "Y",
                    },
                  ]}
                />
              </div>
            </ProCard>
          </div>
        </ProForm>
      </ProCard>
    </div>
  );
};
