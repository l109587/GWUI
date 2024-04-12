import { Command } from 'gg-editor';
import React from 'react';
import styles from './index.less';

const upperFirst = (str) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l) => l.toUpperCase());

const MenuItem = (props) => {
  const { command, icon, text } = props;
  return (
    <Command name={command}>
      <div className={styles.item}>
        <span>{text || upperFirst(command)}</span>
      </div>
    </Command>
  );
};

export default MenuItem;
