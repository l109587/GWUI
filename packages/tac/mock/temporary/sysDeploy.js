export default function sysDeploy(getParam, postParam, res) {
  let json = ''
  if (getParam.action == 'showSysCert') {
    json = require('../json/sysconf/showsyscert.json');
  } else if (getParam.action == 'uploadSysCert') {
    json = require('../json/temporary/finish.json');
  }
  res.send(json)
}
