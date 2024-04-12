module.exports = [
  {
    path: '/index/nta',
    exact: true,
    component: '@/pages/index/index.js',
  },
  {
    path: '/',
    exact: true,
    component: '@/pages/index/index.js',
  },
  {
    path: '/monitor/devstate',
    exact: true,
    component: '@/pages/monitor/devstate/index.js',
  },
  {
    path: '/monitor/flowstat',
    exact: true,
    component: '@/pages/monitor/flowstat/index.js',
  },
  {
    path: '/monitor/panalyze',
    exact: true,
    component: '@/pages/monitor/panalyze/index.js',
  },
  {
    path: '/monitor/rlogstat',
    exact: true,
    component: '@/pages/monitor/rlogstat/index.js',
  },
  {
    path: '/mconfig/mirror',
    exact: true,
    component: '@/pages/mconfig/mirror/index.js',
  },
  {
    path: '/mconfig/report',
    exact: true,
    component: '@/pages/mconfig/report/index.js',
  },
  {
    path: '/mconfig/reportcfg',
    exact: true,
    component: '@/pages/mconfig/reportcfg/index.js',
  },
  {
    path: '/mconfig/outlinetcfg',
    exact: true,
    component: '@/pages/mconfig/outlinetcfg/index.js',
  },
  {
    path: '/alarmdt/transfer',
    exact: true,
    component: '@/pages/alarmdt/transfer/index.js',
  },
  {                       
    path: '/alarmdt/filesift',
    exact: true,
    component: '@/pages/alarmdt/filesift/index.js',
  },
  {
    path: '/alarmdt/attacker',
    exact: true,
    component: '@/pages/alarmdt/attacker/index.js',
  },
  {
    path: '/alarmdt/targetadt',
    exact: true,
    component: '@/pages/alarmdt/targetadt/index.js',
  },
  {
    path: '/alarmdt/unknown',
    exact: true,
    component: '@/pages/alarmdt/unknown/index.js',
  },
  
  {
    path: '/netaudit/connect',
    exact: true,
    component: '@/pages/netaudit/connect/index.js',
  },
  {
    path: '/netaudit/webhttp',
    exact: true,
    component: '@/pages/netaudit/webhttp/index.js',
  },
  {
    path: '/netaudit/dnsreq',
    exact: true,
    component: '@/pages/netaudit/dnsreq/index.js',
  },
  {
    path: '/netaudit/email',
    exact: true,
    component: '@/pages/netaudit/email/index.js',
  },
  {
    path: '/netaudit/filetrans',
    exact: true,
    component: '@/pages/netaudit/filetrans/index.js',
  },
  {
    path: '/netaudit/ssltls',
    exact: true,
    component: '@/pages/netaudit/ssltls/index.js',
  },
  {                       
    path: '/auditevt/connect',
    exact: true,
    component: '@/pages/auditevt/connect/index.js',
  },
  {                       
    path: '/auditevt/appbevr',
    exact: true,
    component: '@/pages/auditevt/appbevr/index.js',
  },
  {                       
    path: '/auditevt/protounknown',
    exact: true,
    component: '@/pages/auditevt/protounknown/index.js',
  },
  {                       
    path: '/auditevt/protoenc',
    exact: true,
    component: '@/pages/auditevt/protoenc/index.js',
  },
  {                       
    path: '/evtlog/reportcfg',
    exact: true,
    component: '@/pages/evtlog/reportcfg/index.js',
  },
]
