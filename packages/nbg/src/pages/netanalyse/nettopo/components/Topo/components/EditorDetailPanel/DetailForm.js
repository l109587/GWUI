import React from "react";
import { Card, Input, Select, Form, Space } from "antd";
import { withPropsAPI } from "gg-editor";
import styles from "./index.less";
import CPU from "@/assets/images/topo/cpu.svg";
import Memory from "@/assets/images/topo/memory.svg";
import { language } from "@/utils/language";
import { WarningFilled } from "@ant-design/icons";

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

class DetailForm extends React.Component {
  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }
  get allNodes() {
    const { propsAPI } = this.props;
    return propsAPI.save().nodes;
  }

  handleFieldChange = (values) => {
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      const item = getSelected()[0];
      if (!item) {
        return;
      }
      executeCommand(() => {
        update(item, {
          ...values,
        });
      });
    }, 0);
  };

  handleInputBlur = (type) => (e) => {
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };

  renderNodeDetail = () => {
    const { name, id, ifNum, termNum, cpu, mem,termWarning,onlineIfNum = 0 } = this.item.getModel();
    const highlight = this.item.getModel().highlight === "Y";
    const searchResult = this.item.getModel().searchResult;
    const isdevshow = highlight && searchResult;
    return (
      <>
        {isdevshow ? (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.accdev")}</div>
              <div>{searchResult?.swip}</div>
            </div>
            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.portname")}</div>
              <div>{searchResult?.portName}</div>
            </div>

            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.devtype")}</div>
              <div>{searchResult?.termType}</div>
            </div>
          </Space>
        ) : (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.devname")}</div>
              <div>{name}</div>
            </div>
            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.devaddr")}</div>
              <div>{id}</div>
            </div>
            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.devmonitor")}</div>
              {termWarning > 0 ? (
                <span>
                  <WarningFilled style={{ color: "red" }} />{" "}
                  {language("project.netanalyse.nettopo.iswarningtext")}
                </span>
              ) : (
                <span>{language("project.netanalyse.nettopo.safe")}</span>
              )}
            </div>
            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.portnums")}</div>
              {ifNum > 0 ? (
                <div>
                  <span style={{ color: "#0093ff" }}>{onlineIfNum}</span>/{ifNum}
                </div>
              ):(
                <span>0</span>
              )}
            </div>
            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.accdevnum")}</div>
              <div>{termNum}</div>
            </div>
            <div className={styles.detailItem}>
              <div>{language("project.netanalyse.nettopo.cpumry")}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: 105,
                }}
              >
                <img src={CPU} alt="cpu" />
                {cpu}%
                <img src={Memory} alt="memory" />
                {mem}%
              </div>
            </div>
          </Space>
        )}
      </>
    );
  };
  renderNewNodeDetail = () => {
    const { label } = this.item.getModel();
    return (
      <Form initialValues={{ label }}>
        <Item
          label={language("project.netanalyse.nettopo.name")}
          name="label"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
        >
          <Input onBlur={this.handleInputBlur("label")} />
        </Item>
      </Form>
    );
  };

  renderEdgeDetail = () => {
    const { label = "", shape = "flow-smooth" } = this.item.getModel();

    return (
      <Form initialValues={{ label, shape }}>
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur("label")} />
        </Item>
        <Item label="Shape" name="shape" {...inlineFormItemLayout}>
          <Select
            onChange={(value) => this.handleFieldChange({ shape: value })}
          >
            <Option value="flow-smooth">Smooth</Option>
            <Option value="flow-polyline">Polyline</Option>
            <Option value="flow-polyline-round">Polyline Round</Option>
          </Select>
        </Item>
      </Form>
    );
  };

  renderGroupDetail = () => {
    const { label = language("project.netanalyse.nettopo.creatgroup"), id } =
      this.item.getModel();
    const childNode = [];
    this.allNodes.map((item) => {
      if (item.parent === id) {
        childNode.push(item);
      }
    });

    return (
      <Form initialValues={{ label }}>
        <Item
          label={language("project.netanalyse.nettopo.groupname")}
          name="label"
          {...inlineFormItemLayout}
        >
          <Input onBlur={this.handleInputBlur("label")} />
        </Item>

        {childNode.map((item, index) => {
          return (
            <Item
              label={`分组成员${index + 1}:`}
              {...inlineFormItemLayout}
              key={item.id}
            >
              <div style={{ textAlign: "end" }}>
                {item.newNode === "Y" ? item.label : item.id}
              </div>
            </Item>
          );
        })}
      </Form>
    );
  };

  renderTitle = () => {
    const typeMap = {
      "core":"核心设备",
      "converge":"汇聚设备",
      "access":"接入设备",
      "servers":"服务器堆",
      "server":"服务器",
      "firewall":"防火墙",
      "router":"路由器",
      "cloud":"云",
    }
    const { title } = this.props;

    if (!this.item) {
      return null;
    }
    if (title) {
      return title;
    } else {
      if (this.item.getModel().newNode === "Y") {
        return typeMap[this.item.getModel().type] || '节点'; 
      } else {
        if (this.item.getModel().highlight === "Y"&&this.item.getModel().searchResult) {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{language("project.netanalyse.nettopo.accdev1")}</div>
              <div>{this.item.getModel().searchResult?.termip}</div>
            </div>
          );
        } else {
          return typeMap[this.item.getModel().type] || '节点';
        }
      }
    }
  };

  render() {
    const { type } = this.props;

    if (!this.item) {
      return null;
    }
    const { newNode = "N" } = this.item.getModel();
    return (
      <Card
        type="inner"
        size="default"
        title={this.renderTitle()}
        bordered={false}
        className={styles.card}
      >
        {type === "node" && newNode !== "Y" && this.renderNodeDetail()}
        {type === "node" && newNode === "Y" && this.renderNewNodeDetail()}
        {type === "group" && this.renderGroupDetail()}
      </Card>
    );
  }
}

export default withPropsAPI(DetailForm);
