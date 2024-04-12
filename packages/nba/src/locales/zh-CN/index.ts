import resmngt  from './resmngt';
import mconfig from './mconfig';
import logmngt from './logmngt';
import nbg from './nbg';
import cfgmngt from './cfgmngt';
import illevent from './illevent';
import monconf from './monconf';
import tacindex from './tacindex';

//common
import common from './common';

export default {
    ...resmngt,
    ...mconfig,
    ...logmngt,
    ...nbg,
    ...cfgmngt,
    ...illevent,
    ...monconf,
    ...tacindex,
    ...common
}