import usrmngt from './usrmngt';
import ecpmngt from './ecpmngt';
import accctrl from './accctrl';
import plymngt from './plymngt';
import accbind from './accbind';
import mconfig from './mconfig';

//common
import common from './common'

export default {
    ...usrmngt,
    ...ecpmngt,
    ...accctrl,
    ...plymngt,
    ...accbind,
    ...mconfig,
    ...common
}