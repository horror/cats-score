CATS.View = Classify({
    init: function (templates, css_base_url) {
        this.templates = templates;
        this.css_base_url = css_base_url;
    },

    View_state: Backbone.Model.extend({
        defaults: {
            state: null,
            page_name: null,
            source: null,
            skin: null,
            contest_id: null,
            checked_contests: [],
            settings: null,
            lang: null,
            page: null,
            el_per_page: null
        },
        name: "ViewState"
    }),

    Router: Backbone.Router.extend({

        initialize: function (options) {
            $.extend(this, options);
        },

        routes: {
            "!show_contests_list/:source/:skin(/lang=:lang)(/page=:page)(/el_per_page=:el_per_page)(/settings=:settings)": "show_contests_list",
            "!show_rank_table/:page_name/:skin/:contestid(/lang=:lang)(/page=:page)(/el_per_page=:el_per_page)(/settings=:settings)": "show_rank_table",
        },

        show_contests_list: function (source, skin, lang, page, el_per_page, settings) {
            this.view_state.set({
                source: source,
                page_name: 'contests',
                state: 'contests_list',
                skin: skin,
                lang: lang,
                page: page,
                el_per_page: el_per_page,
                settings: JSON.parse(settings)
            });
        },

        show_rank_table: function (page_name, skin, contest_id, lang, page, el_per_page, settings) {
            this.view_state.set({
                page_name: page_name,
                state: 'rank_table',
                skin: skin,
                contest_id: contest_id,
                lang: lang,
                page: page,
                el_per_page: el_per_page,
                settings: JSON.parse(settings)
            });
        },

        generate_url: function() {
            var url = "";
            switch (this.view_state.get("state")) {
                case "rank_table":
                    url += "!show_rank_table/" +
                        this.view_state.get("page_name") +
                        "/" +
                        this.view_state.get("skin") +
                        "/" +
                        this.view_state.get("contest_id");
                    break;
                case "contests_list":
                    url += "!show_contests_list/" +
                        this.view_state.get("source") +
                        "/" +
                        this.view_state.get("skin");
                    break;
                default :
                    break;
            }
            url +=
                (this.view_state.get("lang") != null ? "/lang=" + this.view_state.get("lang") : "") +
                (this.view_state.get("page") != null ? "/page=" + this.view_state.get("page") : "") +
                (this.view_state.get("el_per_page") != null ? "/el_per_page=" + this.view_state.get("el_per_page") : "") +
                (this.view_state.get("settings") != null ? "/settings=" + JSON.stringify(this.view_state.get("settings")) : "");

            return url;
        },

        current : function() {
            var Router = this,
                fragment = Backbone.history.fragment,
                routes = _.pairs(Router.routes),
                route = null, params = null, matched;

            matched = _.find(routes, function(handler) {
                route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
                return route.test(fragment);
            });

            if(matched) {
                // NEW: Extracts the params using the internal
                // function _extractParameters
                params = Router._extractParameters(route, fragment);
                route = matched[1];
            }

            return {
                route : route,
                fragment : fragment,
                params : params
            };
        }
    }),

    View_logic: Backbone.View.extend({
        el: $("#wrapper"),

        initialize: function (options) {
            this.current_catsscore_wrapper_content_params = null;
            $.extend(this, options);
            this.view_state.bind('change', this.refresh, this);
        },

        events: {
            'change #page_name': function () {
                this.view_state.set({page_name: $("#page_name").val(), settings: null});
            },
            'change #source': function () {
                this.source($("#source").val());
            },
            'change #skin': function () {
                this.skin($("#skin").val());
            },
            'change #el_per_page': function () {
                this.view_state.set({el_per_page: $("#el_per_page").val()});
            },
            'change #rnk_contest_minutes': function () {
                this.update_rank_table({duration: {minutes : $("#rnk_contest_minutes").val(), type : $("#rnk_restriction_type").val() }});
            },
            'change #rnk_user': function () {
                this.update_rank_table({user: $("#rnk_user").val()});
            },
            'change #rnk_affiliation': function () {
                this.update_rank_table({affiliation: $("#rnk_affiliation").val()});
            },
            'change #rnk_role': function () {
                this.update_rank_table({role: $("#rnk_role").val()});
            },
            'change #cont_name': function () {
                this.filter_contests_list({ name: $("#cont_name").val() });
            },
            'change .contest_selector': function (event) {
                if (!this.with_header)
                    return;

                var contests = this.view_state.get('checked_contests');

                if ($(event.currentTarget).is(":checked"))
                    contests.push($(event.currentTarget).attr("id"));
                else
                    contests.delete_value($(event.currentTarget).attr("id"));

                this.view_state.set({checked_contests: $.merge([], contests)});

                var header = this.template("header_contests_list")({
                    'skin_list' :  this.get_available_skin_names('contests'),
                    'contests' : this.view_state.get('checked_contests'),
                    'skin' : this.skin()
                });
                $("#catsscore_header").html(header);
                $("#source").val(this.source());
                $("#skin").val(this.skin());
            },
            'click #add_series': function () {
                var params = this.current_catsscore_wrapper_content_params.models;
                var chart = CATS.App.charts[params.chart];
                var series_params = {};
                series_params.period = 1*$("#period").val();
                series_params.parameter = $("#parameter").val();
                series_params.aggregation = $("#aggregation").val();
                series_params.group_by = $("#group_by").val();
                series_params.statuses = $('input[name="statuses"]:checked').map(function() { return $(this).val(); }).get();
                series_params.problems = $('input[name="problems"]:checked').map(function() { return $(this).val(); }).get();
                series_params.user = $("#user").val();
                series_params.affiliation = $("#affiliation").val();
                series_params.color = $("input[name='color']:checked").val();
                chart.add_new_series(series_params);
                $("#catsscore_wrapper").html(this.page(this.skin(), "charts")(this.current_catsscore_wrapper_content_params));
                this.update_url_settings({chart: chart.settings()});
            },
            'change #chart_type': function () {
                var params = this.current_catsscore_wrapper_content_params.models;
                var chart = CATS.App.charts[params.chart];
                chart.chart_type =  $("#chart_type").val();
                $("#catsscore_wrapper").html(this.page(this.skin(), "charts")(this.current_catsscore_wrapper_content_params));
                this.update_url_settings({chart: chart.settings()});
            },
            'click .delete_series': function (event) {
                var params = this.current_catsscore_wrapper_content_params.models;
                var chart = CATS.App.charts[params.chart];
                chart.delete_series($(event.currentTarget).data('series'));
                $("#catsscore_wrapper").html(this.page(this.skin(), "charts")(this.current_catsscore_wrapper_content_params));
                this.update_url_settings({chart: chart.settings()});
            }
        },

        update_rank_table: function (filters) {
            if (this.current_catsscore_wrapper_content_params == null)
                return;

            var params = this.current_catsscore_wrapper_content_params.models;
            var result_table = CATS.App.result_tables[params.table];
            result_table.clean_score_board();
            $.extend(result_table.filters, filters);
            var contest_id = params.contest;
            var contest = CATS.App.contests[contest_id];
            CATS.App.rules[contest.scoring].process(contest, result_table);
            if (this.with_pagination) {
                var pagination_params = this.define_pagination_params(params);
                var pagination = this.template("pagination")({
                    current_page: this.view_state.get('page'),
                    el_per_page: this.view_state.get('el_per_page'),
                    maximum_page: pagination_params.max_page
                });
                $("#catsscore_pagination_wrapper").html(pagination);
            }
            $("#catsscore_wrapper").html(this.page(this.skin(), "table_" + contest.scoring)(this.current_catsscore_wrapper_content_params));
            this.update_url_settings({table: result_table.filters});
        },

        update_url_settings: function (settings) {
            this.view_state.set({settings: settings}, {silent: true});
            window.history.pushState('', '', '#' + this.router.generate_url());
        },

        template: function (name) {
            var tmpl = this.templates[name];
            return _.template(tmpl == undefined ? "" : tmpl);
        },

        page: function(skin, page_name) {
            var tmpl = this.templates.pages.skins[skin][page_name];
            if (tmpl == undefined)
                tmpl = this.templates.pages[page_name];

            return _.template(tmpl == undefined ? "" : tmpl);
        },

        page_settings: function(page_name) {
            var tmpl = this.templates.pages.settings[page_name];
            return _.template(tmpl == undefined ? "" : tmpl);
        },

        get_available_skin_names: function(page_name) {
            var all_skins = Object.keys(this.templates.pages.skins);
            var available_skins = [];
            for (var i = 0; i < all_skins.length; ++i) {
                var skin = all_skins[i];
                if (this.available_skin_name(skin, page_name))
                    available_skins.push(skin);
            }

            return available_skins;
        },

        available_skin_name: function(skin_name, page_name) {
            return this.templates.pages.skins[skin_name][page_name] != undefined;
        },

        detach_skin_stylesheet: function () {
            $('link#cats_score').detach();
        },

        define_skin_stylesheet: function (skin) {
            $('head').append(
                '<link id="cats_score" rel="stylesheet" href="'  + this.css_base_url + '/pages/skins/' + skin + '/style.css" type="text/css" />'
            );
        },

        refresh: function () {
            this["refresh_" + this.view_state.get("state")]();
        },

        refresh_rank_table: function() {
            var self = this;
            CATS.App.adapter_process_rank_table(function (params) {
                self.render(params);
            }, this.view_state.get("contest_id"), this.settings());
        },

        filter_contests_list: function (filters) {
            var self = this;
            $.extend(CATS.App.contest_filters, filters);
            this.update_url_settings({contests: CATS.App.contest_filters});
            CATS.App.adapter_filter_contests_list(this.source(), function (param) { self.render(param); });
        },

        refresh_contests_list: function() {
            var self = this;
            CATS.App.adapter_process_contests_list(this.source(), function (param) { self.render(param); }, this.settings());
        },

        get_table_items_count: function(params) {
            switch (this.view_state.get("state")) {
                case "rank_table":
                    return CATS.App.result_tables[params.table].score_board.length;
                case "contests_list":
                    return params.contests.length;
                default :
                    return 0;
            }
        },

        get_settings_params: function(params) {
            switch (this.page_name()) {
                case 'table':
                    var table = CATS.App.result_tables[params.table];
                    return {
                        contest_duration: CATS.App.contests[table.contests[0]].compute_duration_minutes(),
                        filters: table.filters
                    };
                case 'contests':
                    return {
                        filters: CATS.App.contest_filters,
                    };
                case 'charts':
                    return {
                        chart: CATS.App.charts[params.chart],
                        contest: CATS.App.contests[params.contest],
                        app: CATS.App,
                    };
                default :
                    return {};
            }
        },

        define_pagination_params: function(params) {
            var elem_cnt = 0, max_page = 0;
            if (this.with_pagination) {
                if (this.view_state.get('el_per_page') == null)
                    this.view_state.set({el_per_page: 50}, {silent: true});

                elem_cnt = this.get_table_items_count(params);
                max_page = Math.ceil(elem_cnt / this.view_state.get("el_per_page"));

                if (this.view_state.get('page') == null || this.view_state.get('page') > max_page)
                    this.view_state.set({page: 1}, {silent: true});
            }
            return {elem_cnt: elem_cnt, max_page: max_page};
        },

        page_have_pagination: function(page_name) {
            return page_name == 'table' || page_name == 'contests' || page_name == 'history';
        },

        render: function(params){
            var pagination_params = this.define_pagination_params(params);
            var page_name = this.page_name();
            var source = this.source();
            var skin = this.skin();

            if (page_name == "table")
                page_name += "_" + CATS.App.result_tables[params.table].scoring;

            this.detach_skin_stylesheet();
            if (this.with_css && this.available_skin_name(skin, page_name))
                this.define_skin_stylesheet(skin);

            var header = this.with_header ?
                this.template("header_" + this.view_state.get("state"))({
                    'skin_list' :  this.get_available_skin_names(page_name),
                    'contest_name' : (params.contest != undefined) ? CATS.App.contests[params.contest].name : "",
                    'contests' : this.view_state.get('checked_contests'),
                    'skin' : this.skin()
                }) :
                "";
            var footer = this.with_footer ? this.template("footer")({}) : "";
            var pagination = this.page_have_pagination(this.page_name()) && this.with_pagination ?
                this.template("pagination")({
                    current_page: this.view_state.get('page'),
                    el_per_page: this.view_state.get('el_per_page'),
                    maximum_page: pagination_params.max_page
                }) : "";

            this.current_catsscore_wrapper_content_params = {
                app: CATS.App,
                models: params,
                source: source,
                skin: skin,
                checked_contests: this.view_state.get("checked_contests"),
                lang: this.view_state.get("lang") != null ? this.view_state.get("lang") : "ru",
                next_page: this.with_pagination ? this.view_state.get("el_per_page") * (this.view_state.get("page") - 1) : 0,
                elem_cnt:  this.with_pagination ? this.view_state.get("el_per_page") * 1 : pagination_params.elem_cnt
            };
            this.$el.html(
                "<div id='catsscore_header'>" +
                header +
                "</div>" +
                "<details><summary><strong>Settings</strong></summary>" +
                    "<div id='catsscore_filters_wrapper'>" +
                    this.page_settings(this.page_name())(this.get_settings_params(params)) +
                    "</div>" +
                "</details>" +
                "<div id='catsscore_pagination_wrapper'>" +
                pagination +
                "</div>" +
                "<div id='catsscore_wrapper'>" +
                this.page(skin, page_name)(this.current_catsscore_wrapper_content_params) +
                "</div>" +
                "<div id='catsscore_footer'>" +
                footer +
                "</div>"
            );

            $("#source").val(this.source());
            $("#page_name").val(this.page_name());
            $("#skin").val(this.skin());
            $('#progress').detach();
            return this;
        },

        page_name: function (page_name) {
            if (page_name != undefined)
                this.view_state.set({page_name: page_name});
            return this.view_state.get("page_name");
        },

        source: function (source) {
            if (source != undefined)
                this.view_state.set({source: source});
            return this.view_state.get("source");
        },

        skin: function (skin) {
            if (skin != undefined)
                this.view_state.set({skin: skin});
            return this.view_state.get("skin");
        },

        settings: function (settings) {
            if (settings != undefined)
                this.view_state.set({settings: settings});
            return this.view_state.get("settings");
        },

        start: function () {
            var current = this.router.current();
            this.router.navigate(current.params != null ? current.fragment : this.default_url_hash, {trigger: true});
        }
    }),

    display : function (options) {
        var default_options = {
            with_header: true,
            with_footer: true,
            with_pagination: true,
            with_css: true,
            default_url_hash: "!show_contests_list/default/default"
        };

        var self = this;
        var view_state = new self.View_state();
        var router = new self.Router({ view_state: view_state });

        view_state.bind("change", function () {
            router.navigate(router.generate_url());
            console.log("load");
            if(!$('#progress').length) $("body").prepend("<div id='progress'><img src='app/templates/img/loading.gif' /></div>");
        });

        var view = new self.View_logic($.extend({
            view_state: view_state,
            router: router,
            templates: self.templates,
            css_base_url: self.css_base_url
        }, default_options, options));

        Backbone.history.start();
        view.start();
    }
});


