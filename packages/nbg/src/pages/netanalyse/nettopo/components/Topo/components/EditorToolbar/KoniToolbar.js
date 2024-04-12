import {
  Divider,
  message,
  Space,
  Tooltip,
  Button,
  Popconfirm,
  Radio,
} from "antd";
import { Toolbar } from "gg-editor";
import ToolbarButton from "./ToolbarButton";
import styles from "./index.less";
import { language } from '@/utils/language'

const KoniToolbar = (props) => {
  const {
    graphRef = "",
    setGraphData,
    setLayoutType,
    reload,
    setLoading,
    SnapshotRender,
  } = props;
  const otherCommand = (text, command, type) => {
    return (
      <div className={styles.otherCommand}>
        <Tooltip
          title={text}
          placement="bottom"
          overlayClassName={styles.tooltip}
        >
          <span
            className="action"
            onClick={() => {
              let result = graphRef.current.propsAPI.save();
              let isColls = false;
              if (result.groups) {
                result.groups.map((item) => {
                  isColls = isColls || item.collapsed;
                });
              }
              if (isColls) {
                return message.error(language('project.netanalyse.nettopo.toolbar.alignTip'));
              }
              setLoading(true);
              setLayoutType(type);
              const refresh = () => {
                return new Promise(function (resolve, reject) {
                  setTimeout(() => {
                    reload();
                    resolve();
                  }, 100);
                });
              };
              const changelayout = () => {
                return new Promise(function (resolve, reject) {
                  setTimeout(() => {
                    const result = graphRef.current?.propsAPI.save();
                    setGraphData(result);
                    setLayoutType("");
                    resolve();
                  }, 100);
                });
              };
              const p = new Promise(function (resolve, reject) {
                setTimeout(() => {
                  setGraphData(result);
                  resolve();
                }, 500);
              });
              p.then(refresh)
                .then(changelayout)
                .then(refresh)
                .then(() => {
                  setLoading(false);
                });
            }}
          >
            <img src={require(`@/assets/images/topo/${command}.svg`)} alt="" />
          </span>
        </Tooltip>
      </div>
    );
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Toolbar className={styles.toolbar}>
        <ToolbarButton command="undo" text={language('project.netanalyse.nettopo.toolbar.undo')} />
        <ToolbarButton command="redo" text={language('project.netanalyse.nettopo.toolbar.redo')} />
        <Divider type="vertical" />
        <ToolbarButton command="copy" text={language('project.netanalyse.nettopo.toolbar.copy')} />
        <ToolbarButton command="paste" text={language('project.netanalyse.nettopo.toolbar.paste')} />
        <ToolbarButton command="delete" text={language('project.netanalyse.nettopo.toolbar.delete')} />
        <Divider type="vertical" />
        <ToolbarButton command="zoomIn" icon="zoom-in" text={language('project.netanalyse.nettopo.toolbar.zoomIn')} />
        <ToolbarButton command="zoomOut" icon="zoom-out" text={language('project.netanalyse.nettopo.toolbar.zoomOut')} />
        <ToolbarButton command="autoZoom" icon="fit-map" text={language('project.netanalyse.nettopo.toolbar.fitMap')} />
        <ToolbarButton command="resetZoom" icon="actual-size" text={language('project.netanalyse.nettopo.toolbar.actualSize')} />
        <Divider type="vertical" />
        {otherCommand(language('project.netanalyse.nettopo.toolbar.alignTop'), "alignTop", "TB")}
        {otherCommand(language('project.netanalyse.nettopo.toolbar.alignBottom'), "alignBottom", "BT")}
        {otherCommand(language('project.netanalyse.nettopo.toolbar.alignLeft'), "alignLeft", "LR")}
        {otherCommand(language('project.netanalyse.nettopo.toolbar.alignRight'), "alignRight", "RL")}
        <Divider type="vertical" />
        <ToolbarButton
          command="multiSelect"
          icon="group"
          text={language('project.netanalyse.nettopo.toolbar.group')}
        />
        <ToolbarButton command="unGroup" icon="ungroup" text={language('project.netanalyse.nettopo.toolbar.ungroup')} />
      </Toolbar>
      <Space size="small">
        {SnapshotRender}
      </Space>
    </div>
  );
};

export default KoniToolbar;
