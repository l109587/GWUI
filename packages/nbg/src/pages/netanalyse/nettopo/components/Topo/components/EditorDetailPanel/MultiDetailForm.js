import React from "react";
import { Card, Input, Select, Form, Space } from "antd";
import { withPropsAPI } from "gg-editor";
import styles from "./index.less";

class MultiDetailForm extends React.Component {
  get items() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected();
  }
  get allNodes() {
    const { propsAPI } = this.props;
    return propsAPI.save().nodes;
  }
  renderTitle = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{`接入终端(${this.items.length})`}</div>
        <div>{this.items[0].getModel().searchResult.termip}</div>
      </div>
    );
  };
  render() {
    if (!this.items) {
      return null;
    }
    const isHighlightPanel = this.items[0]?.getModel().highlight === "Y";
    return (
      <>
        {isHighlightPanel ? (
          <Card
            type="inner"
            size="default"
            title={this.renderTitle()}
            bordered={false}
            className={styles.card}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {this.items.map((item,index) => {
                return (
                  <>
                    <div className={styles.detailItem}>
                      <div>接入设备{index+1}：</div>
                      <div>{item.getModel().searchResult.swip}</div>
                    </div>
                    <div className={styles.detailItem}>
                      <div>接口名称：</div>
                      <div>{item.getModel().searchResult.portName}</div>
                    </div>
                  </>
                );
              })}

              <div className={styles.detailItem}>
                <div>终端类型：</div>
                <div>{this.items[0].getModel().searchResult.termType}</div>
              </div>
            </Space>
          </Card>
        ) : (
          <Card type="inner" size="small" title="画布" bordered={false} />
        )}
      </>
    );
  }
}
export default withPropsAPI(MultiDetailForm);
