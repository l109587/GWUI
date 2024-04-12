import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  Space,
  Switch,
  Button,
  message,
  Popconfirm,
  Tooltip,
  Tag,
} from "antd";
import {
  ModalForm,
  DrawerForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
  ProFormCheckbox,
  ProFormTextArea,
  ProFormTimePicker,
  ProFormTreeSelect
} from "@ant-design/pro-components";
import { EditOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "umi";
import { language } from "@/utils/language";
import { fetchAuth } from "@/utils/common";
import { modalFormLayout } from "@/utils/helper";
import { NameText, NotesText } from "@/utils/fromTypeLabel";
import EditTable from "@/components/Module/tinyEditTable/tinyEditTable";
import { regIpList,regMacList  } from "@/utils/regExp";
import { post } from "@/services/https";

const addTermGrp = (props) => {
  const {
    visible,
    setVisible,
    formType = "drawer",
    operate = "add",
    setOperate,
    setIncID,
    recordInfo = {},
  } = props;

  const [ipClassInfo, setIpClassInfo] = useState([]);
  const [macClassInfo, setSsidInfo] = useState([]);
  const [ipIsSave, setIpIsSave] = useState(true); // 未保存当前数据不可下发
  const [ssidIsSave, setSsidSave] = useState(true); // 未保存当前数据不可下发
  const [treeData, setTreeData] = useState([]); //上级分组

  const formRef = useRef();
  useEffect(() => {
    fetchGrpComboTree()
    if (visible && operate === "mod") {
      const ips = recordInfo.iprange ? recordInfo.iprange?.split(";") : [];
      const ipArr = [];
      ips.map((item,index) => {
        ipArr.push({ ip: item ,id:index+1});
      });
      const ssids = recordInfo.ssid ? recordInfo.ssid?.split(";") : [];
      const ssidArr = [];
      ssids.map((item,index) => {
        ssidArr.push({ ssid: item,id:index+1 });
      });
      formRef.current.setFieldsValue({
        name: recordInfo.name,
        updevgroupValue: recordInfo.upgrpvalue,
      });
      setIpClassInfo(ipArr || []);
      setSsidInfo(ssidArr || []);
    }
  }, [visible]);
  const ipColumns = [
    {
      title: "IP/IP段",
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
            pattern: regIpList.singleipv4Mask.regex,
            message: regIpList.singleipv4Mask.alertText,
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
              setIpIsSave(false);
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
            setIpClassInfo(ipClassInfo.filter((item) => item.id !== record.id));
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
  const ssidColumns = [
    {
      title: "ID",
      dataIndex: "ssid",
      key: "ssid",
      width: 230,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language("project.mandatory"),
          }
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
              setSsidSave(false);
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
            setSsidInfo(
              macClassInfo.filter((item) => item.id !== record.id)
            );
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

  const fetchGrpComboTree = ()=>{
    post("/cfg.php?controller=devGroupControl&action=showDevGrpComboTree")
      .then((res) => {
        setTreeData(res ? res : []);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }
  const fields = () => {
    return (
      <>
        <NameText
          name="name"
          label="接入分组名称"
          width={300}
          required={true}
          placeholder="请输入名称"
        />
        <ProFormTreeSelect
          name="updevgroupValue"
          label='上级分组'
          
          allowClear
          width={300}
          secondary
          rules={[
            {
              required: true,
              message: language("project.mandatory"),
            }
          ]}
          fieldProps={{
            filterTreeNode: true,
            labelInValue: true,
            showArrow: true,
            fieldNames: {
              label: "text",
              value: "value",
            },
            treeData:treeData,
            treeNodeLabelProp:'label',
            placeholder:language("project.select"),
          }}
        />
        <ProFormTextArea name="iprange" label="交换机IP范围" width={300}>
          <EditTable
            setIsSave={setIpIsSave}
            columns={ipColumns}
            // tableHeight={130}
            tableWidth={300}
            maxLength={5}
            dataSource={ipClassInfo}
            setDataSource={setIpClassInfo}
            deleteButShow={false}
          />
        </ProFormTextArea>
        <ProFormTextArea name="ssid" label="SSID" width={300}>
          <EditTable
            setIsSave={setSsidSave}
            columns={ssidColumns}
            // tableHeight={130}
            tableWidth={300}
            maxLength={5}
            dataSource={macClassInfo}
            setDataSource={setSsidInfo}
            deleteButShow={false}
          />
        </ProFormTextArea>
      </>
    );
  };
  const reset = () => {
    formRef.current.resetFields();
    setOperate && setOperate("add");
    setIpClassInfo([]);
    setSsidInfo([]);
  };
  //添加编辑信息
  const saveInfo = (values) => {
    let url = "";
    if (operate === "add") {
      url = "/cfg.php?controller=timeObject&action=add_dev_group";
    } else {
      url = "/cfg.php?controller=timeObject&action=modify_dev_group";
    }
    const ips = [];
    const ssids = [];
    ipClassInfo.map((item) => {
      ips.push(item.ip);
    });
    macClassInfo.map((item) => {
      ssids.push(item.ssid);
    });
    let params = {
      name: values.name,
      updevgroupValue: values.updevgroupValue?.value,
      class_sw_check: "Y",
      iprange: ips.join(";"),
      ssid: ssids.join(";"),
    };
    if (operate === "mod") {
      params = {
        ...params,
        id: recordInfo.id,
        oldupdevgroupValue: recordInfo.upgrpvalue,
        oldgroupname: recordInfo.name,
      };
    }
    post(url, params)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setVisible(false);
          reset();
          setIncID && setIncID((incID) => incID + 1);
          setTreeInc && setTreeInc((treeincID) => treeincID + 1);
          fetchGrpComboTree()
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  const formProps = {
    ...modalFormLayout,
    visible: visible,
    onVisibleChange: setVisible,
    formRef: formRef,
    width: 520,
    title: operate === "add" ? "添加" : "编辑",
    onFinish: (values) => {
      if (!ipIsSave || !ssidIsSave) {
        message.error(language("project.pleasesavedata"));
      } else {
        saveInfo(values);
      }
    },
  };
  return formType === "modal" ? (
    <ModalForm
      {...formProps}
      modalProps={{
        destroyOnClose: true,
        onCancel: reset,
      }}
    >
      {fields()}
    </ModalForm>
  ) : (
    <DrawerForm
      {...formProps}
      drawerProps={{
        destroyOnClose: true,
        placement: "right",
        closable: false,
        getContainer: false,
        onClose: reset,
        style: {
          position: "absolute",
        },
        extra: (
          <div>
            <span
              onClick={() => {
                setVisible(false);
                reset();
              }}
              style={{ cursor: "pointer" }}
            >
              <CloseOutlined />
            </span>
          </div>
        ),
      }}
    >
      {fields()}
    </DrawerForm>
  );
};
export default addTermGrp;
