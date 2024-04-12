import { CanvasMenu, ContextMenu, EdgeMenu, GroupMenu, MultiMenu, NodeMenu } from 'gg-editor';

import MenuItem from './MenuItem';
import styles from './index.less';
import { language } from '@/utils/language'

const FlowContextMenu = () => (
  <ContextMenu className={styles.contextMenu}>
    <NodeMenu>
      <MenuItem command="copy" text={language('project.netanalyse.nettopo.toolbar.copy')}/>
      <MenuItem command="delete" text={language('project.netanalyse.nettopo.toolbar.delete')}/>
    </NodeMenu>
    <EdgeMenu>
      <MenuItem command="delete" text={language('project.netanalyse.nettopo.toolbar.delete')}/>
    </EdgeMenu>
    <GroupMenu>
      <MenuItem command="copy" text={language('project.netanalyse.nettopo.toolbar.copy')}/>
      <MenuItem command="delete" text={language('project.netanalyse.nettopo.toolbar.delete')}/>
      <MenuItem command="unGroup" icon="ungroup" text={language('project.netanalyse.nettopo.toolbar.ungroup')} />
    </GroupMenu>
    <MultiMenu>
      <MenuItem command="copy" text={language('project.netanalyse.nettopo.toolbar.copy')}/>
      <MenuItem command="paste" text={language('project.netanalyse.nettopo.toolbar.paste')}/>
      <MenuItem command="addGroup" icon="group" text={language('project.netanalyse.nettopo.toolbar.group')} />
      <MenuItem command="delete" text={language('project.netanalyse.nettopo.toolbar.delete')}/>
    </MultiMenu>
    <CanvasMenu>
      <MenuItem command="undo" text={language('project.netanalyse.nettopo.toolbar.undo')}/>
      <MenuItem command="redo" text={language('project.netanalyse.nettopo.toolbar.redo')}/>
      <MenuItem command="pasteHere" icon="paste" text={language('project.netanalyse.nettopo.toolbar.paste')} />
    </CanvasMenu>
  </ContextMenu>
);

export default FlowContextMenu;
