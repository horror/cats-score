requirejs.config({
    baseUrl: 'app/',
    paths: {
        jquery: '../vendors/jquery.min',
        jqueryui: '../vendors/jquery-ui.min',
        jqpagination: '../vendors/jquery.jqpagination.min',
        underscore: '../vendors/underscore.min',
        backbone: '../vendors/backbone.min',
        classify: '../vendors/classify.min',
        dateformat: '../vendors/date.format',
        jqflot: '../vendors/jquery.flot',
        jqflotaddon: '../vendors/jquery.flot.axislabels',
        jqflotpie: '../vendors/jquery.flot.pie'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'backbone'
        },
        waitSeconds: 15
    }
});
require(['underscore', 'jquery', 'jqueryui'], function () {
    require(['backbone', 'classify', 'dateformat', 'jqflot', 'jqpagination', 'CATS'], function () {
        require([
            'adapters/cats',
            'adapters/cats_xml_hist',
            'adapters/cats_rank_table',
            'adapters/ifmo',
            'adapters/codeforces',
            'adapters/myicpc',
            'adapters/aizu',
            'adapters/domjudge',
            'adapters/codechef',
            'adapters/ioinformatics',
            'adapters/default',
            'rules/base',
            'controller',
            'jqflotaddon',
            'jqflotpie'
        ], function () {
            require(['models/entity'], function () {
                require(['models/event'], function () {
                    require([
                        'tests/cats_xml_data',
                        'tests/ifmo_html_data',
                        'tests/cats_rank_table_json_data',
                        'models/version',
                        'models/chat',
                        'models/compiler',
                        'models/contest',
                        'models/prize',
                        'models/problem',
                        'models/run',
                        'models/results_table',
                        'models/chart',
                        'models/user',
                        'rules/acm',
                        'rules/school',
                        'adapters/ifmo_xml',
                        'view',
                        'utils',
                        'extentions',
                        'templates/langs',
                    ], function () {
                        require([//we cant use skins_names array because optimization module works only with hardcoded array constant. Proof http://requirejs.org/docs/optimization.html
                            'text!templates/header_rank_table.html',
                            'text!templates/header_contests_list.html',
                            'text!templates/pagination.html',
                            'text!templates/footer.html',
                            //pages
                            'text!templates/pages/charts.html',
                            //settings
                            'text!templates/pages/settings/table.html',
                            'text!templates/pages/settings/contests.html',
                            'text!templates/pages/settings/charts.html',
                            //skins
                            //default
                            'text!templates/pages/skins/default/table_acm.html',
                            'text!templates/pages/skins/default/table_school.html',
                            'text!templates/pages/skins/default/history.html',
                            'text!templates/pages/skins/default/contests.html',
                            //ifmo
                            'text!templates/pages/skins/ifmo/table_acm.html',
                            'text!templates/pages/skins/ifmo/table_school.html',
                            'text!templates/pages/skins/ifmo/history.html',
                            'text!templates/pages/skins/ifmo/contests.html',
                            //CF
                            'text!templates/pages/skins/codeforces/table_acm.html',
                            'text!templates/pages/skins/codeforces/table_school.html',
                            'text!templates/pages/skins/codeforces/history.html',
                            'text!templates/pages/skins/codeforces/contests.html',
                            //CATS
                            'text!templates/pages/skins/cats/table_acm.html',
                            'text!templates/pages/skins/cats/table_school.html',
                            'text!templates/pages/skins/cats/history.html',
                            'text!templates/pages/skins/cats/contests.html',
                            //OPENCUP
                            'text!templates/pages/skins/opencup/table_acm.html',
                            'text!templates/pages/skins/opencup/table_school.html',
                            'text!templates/pages/skins/opencup/history.html',
                            'text!templates/pages/skins/opencup/contests.html',
                            //MyICPC
                            'text!templates/pages/skins/myicpc/table_acm.html',
                            'text!templates/pages/skins/myicpc/table_school.html',
                            'text!templates/pages/skins/myicpc/history.html',
                            'text!templates/pages/skins/myicpc/contests.html',
                            //DOMJudge
                            'text!templates/pages/skins/domjudge/table_acm.html',
                            'text!templates/pages/skins/domjudge/table_school.html',
                            'text!templates/pages/skins/domjudge/history.html',
                            'text!templates/pages/skins/domjudge/contests.html',
                            //Kattis
                            'text!templates/pages/skins/kattis/table_acm.html',
                            'text!templates/pages/skins/kattis/table_school.html',
                            'text!templates/pages/skins/kattis/history.html',
                            'text!templates/pages/skins/kattis/contests.html',
                            //URI Online Judge
                            'text!templates/pages/skins/uri/table_acm.html',
                            //AIZU Online Judge
                            'text!templates/pages/skins/aizu/table_acm.html',
                            //IOInformatics
                            'text!templates/pages/skins/ioinformatics/table_school.html'
                            //after add new skin make sure add new item in index.js
                        ], cats_score_init);
                    });
                });
            });
        });
    });
});


