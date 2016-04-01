CATS.Model.Contest = Classify(CATS.Model.Entity, {
    init: function () {
        this.$$parent();
        this.type = "contest";
        this.name = null;
        this.url = null;
        this.problems_url = null;
        this.full_name = null;
        this.affiliation = null;
        this.start_time = null;
        this.finish_time = null;
        this.freeze_time = null;
        this.unfreeze_time = null;
        this.is_open_registration = null;
        this.scoring = null;//*: "acm", "school"
        this.is_all_results_visible = true;
        this.problems = [];
        this.users = [];
        this.prizes = [];
        this.runs = [];
    },

    add_object: function (obj) {
        if ($.inArray(obj.id, this[obj.type + "s"]) == -1)
            this[obj.type + "s"].push(obj.id);
    },

    sort_runs: function () {
        this.runs.sort(function (a, b) {
            return CATS.App.runs[a].start_processing_time - CATS.App.runs[b].start_processing_time;
        });
    },

    get_problem_index: function (p_id) {
        for(var i = 0; i < this.problems.length; ++i)
            if (this.problems[i] == p_id)
                return i;

        return null;
    },

    get_problems_stats: function () {
        var stats = {};
        for(var i = 0; i < this.problems.length; ++i) {
            stats[this.problems[i]] = {runs: 0, sols: 0, points: 0, first_accept: this.compute_duration_minutes(), last_accept: 0};
        }
        for(var i = 0; i < this.runs.length; ++i) {
            var run = CATS.App.runs[this.runs[i]];

            stats[run.problem].runs++;
            stats[run.problem].sols += run.status == "accepted" ? 1 : 0;
            stats[run.problem].points += run.points;
            if (run.status == 'accepted') {
                var time = CATS.App.utils.get_time_diff(this.start_time, run.start_processing_time);
                stats[run.problem].first_accept = Math.min(time, stats[run.problem].first_accept);
                stats[run.problem].last_accept = Math.max(time, stats[run.problem].last_accept);
            }
        }

        return stats;
    },

    compute_duration_minutes: function () {
        return CATS.App.utils.get_time_diff(this.start_time, this.finish_time);
    }
});
