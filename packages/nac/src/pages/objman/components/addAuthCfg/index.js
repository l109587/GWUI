import React, { useRef, useState, useEffect } from "react";
import {
  Input,
  Space,
  Switch,
  Button,
  message,
  Popconfirm,
  Modal,
  Tag,
  Alert,
  Tooltip,
  Select,
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
  ProFormRadio,
} from "@ant-design/pro-components";
import {
  ExclamationCircleOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector } from "umi";
import { language } from "@/utils/language";
import { fetchAuth } from "@/utils/common";
import { NameText, NotesText } from "@/utils/fromTypeLabel";
import EditTable from "@/components/Module/tinyEditTable/tinyEditTable";
import { drawFormLayout } from "@/utils/helper";
import { regPortList, regIpList } from '@/utils/regExp'
import { post } from "@/services/https";

const AddAuthCfg = (props) => {
  const {
    addVisible,
    setAddModalVisible,
    formType = "drawer",
    recordInfo = {},
    operate = "add",
    setOperate,
    setIncID,
    setDomains,
    domains,
    mainformRef
  } = props;

  const [domainInfo, setDomainInfo] = useState([]);
  const [isSave, setIsSave] = useState(true); // 未保存当前数据不可下发

  const formRef = useRef();
  useEffect(() => {
    if (addVisible && operate === "mod") {
      formRef.current.setFieldsValue({
        safe_domain_name: recordInfo.safe_domain_name,
      });
      setDomainInfo(recordInfo.safe_domain_info || []);
    }
  }, [addVisible]);
  const columns = [
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
      width: 150,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory'),
          },
          {
            pattern: regIpList.ipv4oripv6Mask.regex,
            message: regIpList.ipv4oripv6Mask.alertText,
          },
        ],
      },
    },
    {
      title: "端口",
      dataIndex: "port",
      key: "port",
      width: 80,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            pattern: regPortList.ports.regex,
            message: regPortList.ports.alertText,
          },
        ],
      },
    },
    {
      title: "目录",
      dataIndex: "directory",
      key: "directory",
      width: 120,
      ellipsis: true,
    },
    {
      title: "协议",
      dataIndex: "protocol",
      key: "protocol",
      width: 210,
      valueType: "select",
      valueEnum: {
        TCP: { text: "TCP" },
        UDP: { text: "UDP" },
        HTTP: { text: "HTTP" },
        RTSP: { text: "RTSP" },
      },
      renderFormItem: () => {
        return (
          <Select
            mode={"multiple"}
            showArrow={true}
            options={[
              { label: "TCP", value: "TCP" },
              { label: "UDP", value: "UDP" },
              { label: "HTTP", value: "HTTP" },
              { label: "RTSP", value: "RTSP" },
            ]}
          />
        );
      },
    },
    {
      title: language("project.operate"),
      valueType: "option",
      width: 80,
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
              setIsSave(false)
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
            setDomainInfo(domainInfo.filter((item) => item.id !== record.id));
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
  const modalFormLayout = {
    layout: "horizontal",
  };
  const reset = () => {
    console.log('触发');
    formRef.current.resetFields();
    setDomainInfo([])
    setOperate && setOperate("add");
  };
  const saveInfo = (values) => {
    const domainName = values.safe_domain_name
    let url = "";
    if (operate === "add") {
      url = "/cfg.php?controller=securityDomain&action=add_securitydomain";
    } else {
      url = "/cfg.php?controller=securityDomain&action=modify_securitydomain";
    }
    const params = {
      safe_domain_name: values.safe_domain_name,
      safe_domain_info: JSON.stringify(domainInfo),
    };
    post(url, params)
      .then((res) => {
        if (res.success) {
          console.log(res,'result');
          setDomains&&setDomains([...domains,{label:domainName,value:domainName}])
          res.msg && message.success(res.msg);
          setAddModalVisible(false);
          reset()
          setIncID && setIncID((incID) => incID + 1);
          setTimeout(() => {
            mainformRef.setFieldsValue({quarantine_domain_idValue:domainName})
          }, 300);
        } else {
          res.msg && message.error(res.msg);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  const tipmsg = `IP地址：支持IPv4/IPv4段/IPv4范围，IPv6/IPv6段/IPv6范围       
端口：多端口用逗号","分隔，支持叹号"!"取反，如:"!80"
目录：以"/"开头，多个用","分开，如:"/test,/dir"`;
  const fields = () => {
    return (
      <>
        <Alert
          message={tipmsg}
          type="info"
          showIcon
          style={{
            marginBottom: 12,
            whiteSpace: "pre-wrap",
            alignItems: "baseline",
          }}
        />
        <NameText
          name="safe_domain_name"
          label="名称"
          width={270}
          required={true}
          placeholder="请输入名称"
        />
        <EditTable
          setIsSave={setIsSave}
          columns={columns}
          // tableHeight={130}
          tableWidth={852}
          maxLength={5}
          dataSource={domainInfo}
          setDataSource={setDomainInfo}
          deleteButShow={false}
        />
      </>
    );
  };

  const formProps = {
    ...modalFormLayout,
    visible:addVisible,
    onVisibleChange:setAddModalVisible,
    formRef:formRef,
    width:900,
    title:operate==='add'?'添加':'编辑',
    onFinish:(values) => {
      if (!isSave) {
        message.error(language("project.pleasesavedata"));
      } else {
        saveInfo(values);
      }
    }
  }

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
                setAddModalVisible(false);
                reset()
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
export default AddAuthCfg;
