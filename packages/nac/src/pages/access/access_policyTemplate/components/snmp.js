import React, { useRef, useState, useEffect } from "react";
import {
  message,
  Form,
  Popconfirm,
  Tabs,
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
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormSwitch,
} from "@ant-design/pro-components";
import { language } from "@/utils/language";
import { post, postAsync } from "@/services/https";
import { SaveOutlined } from "@ant-design/icons";
import "@/utils/index.less";
import "@/common/common.less";
import "./../index.less";
import AddAccessTime from "@/pages/access/components/addAccessTime";
import AddIcon from "@/assets/nac/add.svg";
import DelIcon from "@/assets/nac/del.svg";
import EditIcon from "@/assets/nac/saEdit.svg";
import { regList, regUrlList } from "@/utils/regExp";
import { NumberField } from "@/common/fun/formTypeCon";
import { EditTable } from "@/utils/fromTypeLabel";
export default (props) => {
  const { clientHeight } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addAccTimeVisible, setAddAccTimeVisible] = useState(false); //新建准入时段弹窗开关

  const [editableKeys, setEditableRowKeys] = useState(); //每行编辑的id
  const renderRemove = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        setConfirmLoading(false);
        const tableDataSource = addform.getFieldsValue(["addrlistinfo"]);
        addform.setFieldsValue({
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

  const [addform] = Form.useForm();
  const [timecombox, setTimecombox] = useState([]);
  const [modeStatus, setModeStatus] = useState(0);
  const [forwardMode, setForwardMode] = useState(true)
  const [autoBindList, setAutoBindList] = useState([]);

  useEffect(() => {
    fetchTimecombox();
    get_port_control_cond();
    vgw_get();
  }, []);

  //获取准入时段
  const fetchTimecombox = () => {
    post("/cfg.php?controller=timeObject&action=get_timeObject_combox")
      .then((res) => {
        if (res.success) {
          setTimecombox(res.data);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  //获取控制条件内容
  const get_port_control_cond = () => {
    post("/cfg.php?controller=vgw&action=get_port_control_cond")
      .then((res) => {
        if (res.success) {
          let list = [];
          res.data?.map((item) => {
            let obj = {};
            obj.label = item.value;
            obj.value = item.reason;
            list.push(obj);
          });
          console.log(list);
          setAutoBindList(list);
        }
      })
      .catch(() => {
        console.log("mistake");
      });
  };

  const vgw_get = () => {
    post("/cfg.php?controller=access&action=vgw_get")
      .then((res) => {
        if (res.success) {
          let obj = {};
          obj.state = res.data[0]?.state == "Y" ? true : false;
          obj.block_default_gw = res.data[0]?.block_default_gw == "Y" ? ["Y"] : [];
          obj.cycle_block = res.data[0]?.cycle_block == "Y" ? ["Y"] : [];
          obj.block_type = res.data[0]?.block_type;
          obj.block_power = res.data[0]?.block_power;
          obj.cycle_time = res.data[0]?.cycle_time;
          obj.vgw_interface = arrObj(res.data[0]?.vgw_interface);
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
          radiusSave(values);
        }}
      >
        <div
          style={{
            maxHeight: clientHeight - 100,
            overflow: "auto",
          }}
        >
          <div className="alinkaccessbox">
            <ProFormSwitch
              name="linksw"
              width={"300px"}
              checkedChildren={language("project.open")}
              unCheckedChildren={language("project.close")}
              addonAfter={<div style={{ marginTop: "1px" }}>开启SNMP准入</div>}
            />
          </div>
          <div className="readibuttonbox" style={{ width: "463px" }}>
            <ProFormRadio.Group
              width={"300px"}
              label={"控制方式"}
              name="port_control"
              id="port_control"
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
                { label: "端口控制", value: 0 },
                { label: "VLAN控制", value: 1 },
              ]}
            />
          </div>

          {modeStatus === 0 ? (
            <>
              <NumberField
                name="port_down_time"
                label={"端口关闭时间"}
                min={2}
                max={999}
                width="160px"
                rules={[
                  { required: true, message: language("project.mandatory") },
                ]}
                placeholder={" "}
                afterUnit={"秒"}
                afterText={"(5-3600)"}
              />
              <NumberField
                name="port_up_time"
                label={"离线接入心跳超时时间"}
                min={2}
                max={999}
                width="160px"
                rules={[
                  { required: true, message: language("project.mandatory") },
                ]}
                placeholder={" "}
                afterUnit={"秒"}
                afterText={"(5-3600)"}
              />

              <div>
                <ProFormSelect
                  label="控制时段"
                  width={"298px"}
                  name="sys_type"
                  placeholder={language("project.select")}
                  options={timecombox}
                  addonAfter={
                    <div>
                      <img
                        src={AddIcon}
                        alt=""
                        className={"addiconoption"}
                        onClick={() => {
                          setAddAccTimeVisible(true);
                        }}
                      />
                    </div>
                  }
                />
              </div>

              <div className="pcheckbox">
                <ProFormCheckbox.Group
                  label={"控制条件"}
                  name="auto_bind_ipmac"
                  options={autoBindList}
                />
              </div>
            </>
          ) : (
            <>
              <ProFormSelect
                width={"300px"}
                label="VLAN切换方式"
                name="sys_type"
                placeholder={language("project.select")}
                options={[
                  { label: "中继模式", value: '0' },
                  { label: "服务器模式", value: "1" },
                ]}
              />
              <ProFormText
                label={"隔离VLAN"}
                width={"300px"}
                name="bd_diskserial"
              />
              <ProFormCheckbox.Group
                label={"隔离转发"}
                name="isolate_forward"
                onChange={(e)=>{
                  let status = true;
                  if(e.length >= 1){
                    status = false; 
                  }
                  setForwardMode(status);
                }}
                options={[
                  {
                    label: "开启后对隔离VLAN正常数据进行转发",
                    value: "Y",
                  },
                ]}
              />
              <ProFormCheckbox.Group
                label={"HUB控制"}
                name="hub_cutvlan"
                disabled={forwardMode}
                options={[
                  {
                    label: "开启后对HBU/非网关交换机进行VLAN隔离控制",
                    value: "Y",
                  },
                ]}
              />
              <ProFormCheckbox.Group
                label={"WAP控制"}
                name="wap_cutvlan"
                disabled={forwardMode}
                options={[
                  {
                    label: "开启对无线AP进行VLAN隔离控制",
                    value: "Y",
                  },
                ]}
              />
              <div 
              className="editborderbox"
               style={{ width: "713px" }}>
                <EditTable
                  label={"监听网口"}
                  headerTitle={<div>（启用网口监听）</div>}
                  position={"top"}
                  name={"addrlistinfo"}
                  fromcolumns={fromcolumns}
                  disabled={forwardMode}
                  required={false}
                  editableKeys={editableKeys}
                  setEditableRowKeys={setEditableRowKeys}
                />
              </div>
            </>
          )}
        </div>
      </ProForm>
      <AddAccessTime
        addVisible={addAccTimeVisible}
        setAddModalVisible={setAddAccTimeVisible}
        formType="modal"
        fetchTimecombox={fetchTimecombox}
        mainaddform={addform}
      />
    </div>
  );
};
