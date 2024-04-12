import { CanvasPanel, DetailPanel, EdgePanel, GroupPanel, MultiPanel, NodePanel } from 'gg-editor';

import { Card } from 'antd';
import DetailForm from './DetailForm';
import MultiDetailForm from './MultiDetailForm';
import styles from './index.less';

const KoniDetailPanel = () => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <DetailForm type="node" />
    </NodePanel>
    <EdgePanel>
    <Card type="inner" size="small" title="画布" bordered={false} />
    </EdgePanel>
    <GroupPanel>
      <DetailForm type="group" title="分组"/>
    </GroupPanel>
    <MultiPanel>
      <MultiDetailForm type="multi" />
    </MultiPanel>
    <CanvasPanel>
      <Card type="inner" size="small" title="画布" bordered={false} />
    </CanvasPanel>
  </DetailPanel>
);

export default KoniDetailPanel;
