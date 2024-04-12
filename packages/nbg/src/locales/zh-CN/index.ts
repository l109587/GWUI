import resmngt  from './resmngt';
import mconfig from './mconfig';
import monitor from './monitor';
import logmngt from './logmngt';
import analyse from './analyse';
import central from './central';
import nbg from './nbg';
import cfgmngt from './cfgmngt';
import illevent from './illevent';
import alarmdt from './alarmdt';
import prbmgt from './prbmgt';
import netanalyse from './netanalyse';
import tacindex from './tacindex';

//common
import common from './common';

export default {
    ...resmngt,
    ...mconfig,
    ...monitor,
    ...logmngt,
    ...analyse,
    ...central,
    ...nbg,
    ...cfgmngt,
    ...illevent,
    ...alarmdt,
    ...prbmgt,
    ...netanalyse,
    ...tacindex,
    ...common
}