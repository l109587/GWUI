import { Card } from 'antd';
import { Minimap } from 'gg-editor';
import { language } from '@/utils/language'

const EditorMinimap = () => (
  <Card type="inner" size="small" title={language('project.netanalyse.nettopo.thumbnail')} bordered={false}>
    <Minimap height={350} />
  </Card>
);

export default EditorMinimap;
