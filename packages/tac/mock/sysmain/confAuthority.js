export default function confAuthority(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showAuthority') {
        json = require('../json/sysconf/showAuthority.json');
    }
    else if(getParam.action == 'showAuthorityContent') {
        json = require('../json/sysconf/showAuthorityContent.json');
    }
    res.send(json)
  }
  