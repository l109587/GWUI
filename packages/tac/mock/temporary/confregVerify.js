export default function confregVerify(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showpolicy') {
    json = require('../json/confregVerify/showpolicy.json');
  } else if (getParam.action == 'uploadSysCert') {
    json = require('../json/temporary/finish.json');
  }
  res.send(json)
}
