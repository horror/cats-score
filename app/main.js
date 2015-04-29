requirejs.config({
    baseUrl: 'app/',
    paths: {
        jquery: "../vendors/jquery.min",
        jqueryui: "../vendors/jquery-ui.min",
        jqpagination: "../vendors/jquery.jqpagination.min",
        underscore: "../vendors/underscore.min",
        backbone: "../vendors/backbone.min",
        classify: "../vendors/classify.min",
        dateformat: "../vendors/date.format"
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "backbone"
        },
        waitSeconds: 15
    }
});
require(['underscore', 'jquery', 'jqueryui'], function () {
    require(['backbone', 'classify', 'dateformat', 'jqpagination', 'CATS'], function () {
        require(['controller'], function () {
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
                        'models/user',
                        'rules/acm',
                        'rules/school',
                        'adapters/cats',
                        'adapters/cats_xml_hist',
                        'adapters/cats_rank_table',
                        'adapters/ifmo',
                        'adapters/codeforces',
                        'adapters/default',
                        'view',
                        'utils',
                        'extentions',
                        'skins/langs',
                    ], function () {
                        require([//we cant use skins_names array because optimization module works only with hardcoded array constant. Proof http://requirejs.org/docs/optimization.html
                            'text!skins/header_rank_table.html', 'text!skins/header_contests_list.html', 'text!skins/pagination.html', 'text!skins/footer.html',
                            'text!skins/filters/table.html',
                            'text!skins/default/table_acm.html', 'text!skins/default/table_school.html', 'text!skins/default/history.html', 'text!skins/default/contests.html',
                            'text!skins/ifmo/table_acm.html', 'text!skins/ifmo/table_school.html', 'text!skins/ifmo/history.html', 'text!skins/ifmo/contests.html',
                            'text!skins/codeforces/table_acm.html', 'text!skins/codeforces/table_school.html', 'text!skins/codeforces/history.html', 'text!skins/codeforces/contests.html',
                            'text!skins/cats/table_acm.html', 'text!skins/cats/table_school.html', 'text!skins/cats/history.html', 'text!skins/cats/contests.html',
                            'text!skins/opencup/table_acm.html', 'text!skins/opencup/table_school.html', 'text!skins/opencup/history.html', 'text!skins/opencup/contests.html',
                            //after add new skin make sure add new item to skins_names array in index.js
                        ], cats_score_init);
                    });
                });
            });
        });
    });
});


