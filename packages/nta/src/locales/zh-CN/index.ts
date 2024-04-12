import mconfig from './mconfig';
import monconf from './monconf';
import alarmdt from './alarmdt';
import ntanetaudit from './ntanetaudit';
import cfgmngt from './cfgmngt';
import resmngt from './resmngt';
import tacindex from './tacindex';
import evl from './evl';

//common
import common from './common';

export default {
    ...resmngt,
    ...mconfig,
    ...cfgmngt,
    ...monconf,
    ...alarmdt,
    ...ntanetaudit,
    ...tacindex,
    ...evl,
    ...common
}