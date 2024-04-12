import React, { useRef, useState } from "react";
import { useSelector } from "umi";
import {
  DrawerForm,
  ProFormCheckbox,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import EditIcon from "@/assets/nac/edit.svg";
import { ProtableModule } from "@/components/Module";
import { Modal, Tag, Tooltip } from "antd";
import { language } from "@/utils/language";
import {
  CloseOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { post } from "@/services/https";
const { confirm } = Modal;

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight);
  let clientHeight = contentHeight - 220;
  const formRef = useRef();
  const [incID, setIncID] = useState(0); //递增的id 删除/添加的时候增加触发刷新
  const [operate, setOperate] = useState("add");
  const [drawState, setDrawState] = useState(false);

  const columnsList = [
    {
      title: "编号",
      width: 100,
      dataIndex: "id",
      key: "id",
      align: "center",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 200,
      render: (text) => {
        return (
          <Tag color={text == "Y" ? "#12C189" : "rgb(119, 119, 119)"}>
            {text == "Y"
              ? language("project.enable")
              : language("project.disable")}
          </Tag>
        );
      },
    },
    {
      title: "字段名称",
      width: 280,
      dataIndex: "name",
      key: "name",
      align: "left",
      ellipsis: true,
    },
    {
      title: "是否查询字段",
      width: 200,
      dataIndex: "is_search",
      key: "is_search",
      align: "left",
      ellipsis: true,
      render: (text) => {
        return text === "Y" ? "是" : "否";
      },
    },
    {
      title: "属性",
      dataIndex: "is_sys",
      key: "is_sys",
      align: "left",
      ellipsis: true,
      render: (text) => {
        return text === "Y" ? "系统默认" : "非系统默认";
      },
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
              showDraw("open");
              setOperate("mod");
              editInfo(record);
            }}
          >
            <a>
              <img src={EditIcon} alt="" />
            </a>
          </Tooltip>
        );
      },
    },
  ];

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
      names.push(item.name);
      ids.push(item.id);
    });
    const params = { names: names.join(","), ids: ids.join(",") };
    post("/cfg.php?controller=guest&action=guest_regfield_del", params)
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

  const showDraw = (state) => {
    if (state == "open") {
      setDrawState(true);
    } else {
      formRef.current?.resetFields();
      setDrawState(false);
    }
  };

  const editInfo = (record) => {
    let values = { ...record };
    values.status = record.status === "Y" ? true : false;
    values.able_search = record.able_search === "Y" ? true : false;
    formRef.current.setFieldsValue(values);
  };

  const setList = (values) => {
    let data = {};
    data.id = values?.id;
    data.status = values.status ? "Y" : "N";
    data.name = values.name;
    data.search_change = values.id && "0";
    data.is_search = values?.is_search ? "Y" : "N";
    data.opcode = operate;
    post("/cfg.php?controller=guest&action=guest_regfield_set", data).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg);
          setIncID((incID) => incID + 1);
        } else {
          res.msg && message.error(res.msg);
        }
      }
    );
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
        apishowurl="/cfg.php?controller=guest&action=guest_regfield_get"
        incID={incID}
        clientHeight={clientHeight}
        tableKey="visitfield"
        rowkey="id"
        columnvalue="visitfieldColumnvalue"
        rowSelection={true}
        addButton={true}
        delButton={true}
        delClick={delClick}
        addClick={() => {
          showDraw("open");
          setOperate("add");
        }}
      />
      <DrawerForm
        title={operate == "add" ? "添加字段" : "修改字段"}
        formRef={formRef}
        layout="horizontal"
        labelCol={{ xs: 6 }}
        wrapperCol={{ sx: 10 }}
        drawerProps={{
          getContainer: false,
          style: {
            position: "absolute",
          },
          width: 480,
          placement: "right",
          closable: false,
          maskClosable: false,
          onClose: () => {
            showDraw("close");
          },
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
        }}
        visible={drawState}
        onOpenChange={setDrawState}
        onFinish={(values) => {
          setList(values);
        }}
      >
        <div>
          <ProFormText name="id" hidden />
          <ProFormText name="search_change" hidden />
          <ProFormSwitch
            label="状态"
            name="status"
            checkedChildren={language("project.enable")}
            unCheckedChildren={language("project.disable")}
            onChange={(e) => {
              if (formRef?.current?.getFieldsValue(["is_search"]).is_search) {
                formRef?.current?.setFieldsValue({ status: true });
              }
            }}
          />
          <ProFormCheckbox
            label="查询字段"
            name="is_search"
            onChange={(e) => {
              if (e.target.checked) {
                formRef?.current?.setFieldsValue({ status: true });
              }
            }}
          >
            开启查询字段
          </ProFormCheckbox>
          <ProFormText
            label="字段名称"
            name="name"
            width="300px"
            rules={[{ required: true, message: language("project.mandatory") }]}
          />
        </div>
      </DrawerForm>
    </div>
  );
};
