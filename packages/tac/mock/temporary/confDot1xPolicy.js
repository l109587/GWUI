export default function confDot1xPolicy(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showDot1xPolicy') {
    json = require('../json/confDot1xPolicy/showDot1xPolicy.json');
  } else if (getParam.action == 'uploadSysCert') {
    json = require('../json/temporary/finish.json');
  }
  res.send(json)
}
