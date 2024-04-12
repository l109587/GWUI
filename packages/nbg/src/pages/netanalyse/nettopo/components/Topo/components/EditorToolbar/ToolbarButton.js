import { Command } from "gg-editor";
import React from "react";
import { Tooltip } from "antd";
import styles from "./index.less";

const ToolbarButton = (props) => {
  const { command, text } = props;
  return (
    <div>
      <Command name={command}>
        <Tooltip
          title={text}
          placement="bottom"
          overlayClassName={styles.tooltip}
        >
          <span className="action">
            <img src={require(`@/assets/images/topo/${command}.svg`)} alt="" />
          </span>
        </Tooltip>
      </Command>
    </div>
  );
};

export default ToolbarButton;
