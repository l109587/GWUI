import React, { useRef, useState, useEffect } from "react";
import {
  Popconfirm,
  Form,
  Row,
  Col,
  Button,
  Space,
  Tooltip,
  Affix,
} from "antd";
import {
  ProForm,
  ProFormText,
  ProFormRadio,
  ProFormCheckbox,
  ProFormSwitch,
  ProFormDigit,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import { SaveOutlined } from "@ant-design/icons";
import { NumberField } from "@/common/fun/formTypeCon";
import "@/utils/index.less";
import "@/common/common.less";
import "./../index.less";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import { regList, regUrlList } from "@/utils/regExp";
import { EditTable } from "@/utils/fromTypeLabel";
export default (props) => {
  const [addform] = Form.useForm();

  const { clientHeight } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        const tableDataSource = addform.getFieldsValue([
          "arp_interface",
        ]);
        addform.setFieldsValue({
          arp_interface: tableDataSource["arp_interface"].filter(
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

  const fromcolumns = [
    {
      title: "网口",
      dataIndex: "net",
      align: "left",
      width: "120px",
    },
    {
      title: "Native VLAN",
      dataIndex: "vlan",
      align: "left",
      width: "120px",
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "left",
      width: "80px",
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

  const [activeKey, setActiveKey] = useState("bh");
  const [contentList, setContentList] = useState([]);
  const [isHovering, setIsHovering] = useState("");
  const [modeStatus, setModeStatus] = useState(0);
  useEffect(() => {
    arp_get();
  }, []);

  const arp_get = () => {
    post("/cfg.php?controller=access&action=arp_get")
      .then((res) => {
        if (res.success) {
          let obj = {};
          obj.state = res.data[0]?.state == "Y" ? true : false;
          obj.block_default_gw = res.data[0]?.block_default_gw == "Y" ? ["Y"] : [];
          obj.cycle_block = res.data[0]?.cycle_block == "Y" ? ["Y"] : [];
          obj.block_type = res.data[0]?.block_type;
          obj.block_power = res.data[0]?.block_power;
          obj.cycle_time = res.data[0]?.cycle_time;
          obj.arp_interface = arrObj(res.data[0]?.arp_interface);
          addform.setFieldsValue(obj ? obj : {});
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const arrObj = (obj) => {
    let arr = obj.split(";");
    let list = [];
    arr.map((item, num) => {
      let itemList = item.split(":");
      let obj = {};
      obj.id = num;
      itemList.map((each, index) => {
        if (index == 0) {
          obj.net = each;
        } else if (index == 1) {
          obj.vlan = each;
        }
      });
      list.push(obj);
    });
    return list;
  };

  const arp_set = (values) => {
    let data = {};
    data.block_power = values.block_power;
    data.block_type = values.block_type;
    data.cycle_block = values.cycle_block;
    data.state = values.state == "Y" || values.state === true ? "Y" : "N";
    data.block_default_gw = values.block_default_gw?.length >= 1 ? "Y" : "N";
    data.cycle_block = values.cycle_block?.length >= 1 ? "Y" : "N";
    let arr = values.arp_interface ? values.arp_interface : [];
    let list = [];
    arr.map((each) => {
      list.push({ net: each.net, vlan: each.vlan});
    });
    let str = list.map((item) => Object.values(item).join(";")).join(":");
    data.arp_interface = str;
    post("/cfg.php?controller=access&action=arp_set", values)
      .then((res) => {
        if (res.success) {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  return (
    <div>
      <ProForm
        layout="horizontal"
        submitTimeout={2000}
        form={addform}
        className="profrombox"
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
                        marginTop: 14,
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
          arp_set(values);
        }}
      >
        <div
          style={{
            maxHeight: clientHeight - 100,
            overflow: "auto",
          }}
          className={"labelwidthbox"}
        >
          <div className="alinkaccessbox">
            <ProFormSwitch
              name="state"
              width={"300px"}
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              addonAfter={<div style={{ marginTop: "1px" }}>开启透明网桥</div>}
            />
          </div>
          <div className="editborderbox" style={{ width: "613px" }}>
            <EditTable
              label={"监听网口"}
              headerTitle={<div>（启用网口监听）</div>}
              position={"top"}
              name={"arp_interface"}
              fromcolumns={fromcolumns}
              required={false}
              editableKeys={editableKeys}
              setEditableRowKeys={setEditableRowKeys}
            />
          </div>
          <div className="readibuttonbox" style={{ width: "463px" }}>
            <div className="radiobox" style={{ width: "523px" }}>
              <ProFormRadio.Group
                width={"300px"}
                label={"部署模式"}
                name="block_type"
                id="block_type"
                rules={[{ required: true }]}
                options={[
                  { label: "正向阻断", value: "0" },
                  { label: "反向阻断", value: "1" },
                  { label: "双向阻断", value: "2" },
                ]}
              />
            </div>
            <ProFormRadio.Group
              width={"300px"}
              label={"阻断力度"}
              name="block_power"
              id="block_power"
              fieldProps={{
                buttonStyle: "solid",
                optionType: "button",
              }}
              initialValue={0}
              onChange={(e) => {
                setModeStatus(e.target.value);
              }}
              rules={[{ required: true }]}
              options={[
                { label: "强阻断", value: "0" },
                { label: "弱阻断", value: "1" },
              ]}
            />
          </div>
          {modeStatus === 0 ? (
            <ProFormCheckbox.Group
              label={"默认网关阻断"}
              name="block_default_gw"
              options={[
                {
                  label: "阻断终端到默认网关直接的流量",
                  value: "Y",
                },
              ]}
            />
          ) : (
            <></>
          )}

          <ProFormCheckbox.Group
            label={"周期性阻断"}
            name="cycle_block"
            options={[
              {
                label: "根据配置的周期发送阻断包阻断终端",
                value: "Y",
              },
            ]}
          />
          <NumberField
            name="cycle_time"
            label={"阻断周期"}
            marButStatus={true}
            width="160px"
            afterUnit={"秒"}
          />
        </div>
      </ProForm>
    </div>
  );
};
