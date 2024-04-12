import resmngt  from './resmngt';
import mconfig from './mconfig';
import logmngt from './logmngt';
import central from './central';
import assmngt from './assmngt';
import cfgmngt from './cfgmngt';
import tacindex from './tacindex';
import policytable from './policytable';
import apply from './apply';

//common
import common from './common';

export default {
    ...resmngt,
    ...mconfig,
    ...logmngt,
    ...central,
    ...assmngt,
    ...cfgmngt,
    ...tacindex,
    ...policytable,
    ...apply,
    ...common

}