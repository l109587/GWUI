module.exports = [
  {
    path: "/",
    exact: true,
    component: "@/pages/index/index.js",
  },
  {
    path: "/index/dmc",
    exact: true,
    component: "@/pages/index/index.js",
  },
  {
    path: '/mconfig/attachchk',
    exact: true,
    component: '@/pages/mconfig/attachchk/index.js',
  },
  {
    path: '/mconfig/transmchk',
    exact: true,
    component: '@/pages/mconfig/transmchk/index.js',
  },
  {
    path: '/mconfig/filefit',
    exact: true,
    component: '@/pages/mconfig/filefit/index.js',
  },
  {
    path: '/mconfig/targetidt',
    exact: true,
    component: '@/pages/mconfig/targetidt/index.js',
  },
  {
    path: '/mconfig/targetadt',
    exact: true,
    component: '@/pages/mconfig/targetadt/index.js',
  },
  {
    path: '/mconfig/behavioradt',
    exact: true,
    component: '@/pages/mconfig/behavioradt/index.js',
  },
  {
    path: '/mconfig/blkwhtl',
    exact: true,
    component: '@/pages/mconfig/blkwhtl/index.js',
  },
  {
    path: '/cfgmngt/ctrlcmd',
    exact: true,
    component: '@/pages/cfgmngt/ctrlcmd/index.js',
  },
  {
    path: '/cfgmngt/ruleinfo',
    exact: true,
    component: '@/pages/cfgmngt/ruleinfo/index.js',
  },
  {
    path: '/cfgmngt/devlist',
    exact: true,
    component: '@/pages/cfgmngt/devlist/index.js',
  },
  {
    path: '/cfgmngt/devlist/:id',
    exact: true,
    component: '@/pages/cfgmngt/devlist/[id]/index.js',
  },
  {
    path: '/cfgmngt/reglist',
    exact: true,
    component: '@/pages/cfgmngt/reglist/index.js',
  },
  {
    path: '/cfgmngt/basecfg',
    exact: true,
    component: '@/pages/cfgmngt/basecfg/index.js',
  },
  {
    path: '/cfgmngt/ftpimport',
    exact: true,
    component: '@/pages/cfgmngt/ftpimport/index.js',
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
    path: '/auditevt/activeobj',
    exact: true,
    component: '@/pages/auditevt/activeobj/index.js',
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
    path: '/evtlog/alarmcfg',
    exact: true,
    component: '@/pages/evtlog/alarmcfg/index.js',
  },
  {
    path: '/evtlog/alarmevt',
    exact: true,
    component: '@/pages/evtlog/alarmevt/index.js',
  },
  {
    path: '/evtlog/reportcfg',
    exact: true,
    component: '@/pages/evtlog/reportcfg/index.js',
  },
  {
    path: '/evtlog/evtsystem',
    exact: true,
    component: '@/pages/evtlog/evtsystem/index.js',
  },
  {
    path: '/evtlog/evtdevice',
    exact: true,
    component: '@/pages/evtlog/evtdevice/index.js',
  },
  {
    path: '/dispose/sensitive',
    exact: true,
    component: '@/pages/dispose/sensitive/index.js',
  },
  {
    path: '/dispose/attack',
    exact: true,
    component: '@/pages/dispose/attack/index.js',
  },

]