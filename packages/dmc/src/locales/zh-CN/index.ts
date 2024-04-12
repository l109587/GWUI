import mconfig from './mconfig';
import logmngt from './logmngt';
import analyse from './analyse';
import cfgmngt from './cfgmngt';
import alarmdt from './alarmdt';
import dmcmconfig from './dmcmconfig';
import ntanetaudit from './ntanetaudit';
import resmngt from './resmngt';
import dmcIndex from './dmcIndex';
import dispose from './dispose';

//common
import common from './common';

export default {
    ...mconfig,
    ...logmngt,
    ...analyse,
    ...cfgmngt,
    ...alarmdt,
    ...dmcmconfig,
    ...ntanetaudit,
    ...resmngt,
    ...dmcIndex,
    ...dispose,
    ...common
}