function Acm_rules(model) {
    this.model = model;
    this.failed_run_penalty = 20
}


Acm_rules.prototype.translate_to_history = function() {
    var self = this;
    if (self.model.name != 'table') {
        alert('u cant translate to history non table model');
        return;
    }


    var m = new History_model();
    var contest_start_time = self.model.contest_start_time;

    var team_id = 0, id = 0;
    $.each(self.model.score_board, function (i, row) {
        var team_name = row['team_name'];
        team_id++;
        $.each(row, function (k, v) {
            if (self.model.problems[k] != undefined)
                for(var i = 0; i < v['r']; ++i) {
                    id++;
                    var run = {
                        'time_since_start' : 0.1,
                        'problem_title' : self.model.problems[i],
                        'submit_time' : add_time(contest_start_time, "1"),
                        'team_name' : team_name,
                        'team_id' : team_id,
                        'is_remote' : 0,
                        'state' : 'wrong_answer',
                        'is_ooc' : 1,
                        'id' : id,
                        'last_ip' : 'localhost',
                        'code' : get_problem_code(i)};
                    if (v['s'] && i + 1 == v['r']) {
                        run['submit_time'] = add_time(contest_start_time, v['s']);
                        run['state'] = 'accepted';
                    }
                    m.runs.push(run);
                }
        });
    });

    return m;
}

Acm_rules.prototype.translate_to_table = function() {
    var self = this;
    if (self.model.name != 'history') {
        alert('u cant translate to table non history model');
        return;
    }
    var m = new Table_model();
    var contest_start_time = self.model.contest_start_time;

    var teams_problems = {}, teams = {};
    $.each(self.model.runs, function (i, row) {
        var team_name = row['team_name'];
        if (teams_problems[team_name] == undefined) {
            teams_problems[team_name] = [];
            teams[team_name] = {};
            teams[team_name]['penalty'] = 0;
            teams[team_name]['solved_cnts'] = 0;
        }
        var p_id = get_problem_id(row['code']);
        m.problems[p_id] = row['problem_title'];

        if (teams_problems[team_name][p_id] == undefined) {
            teams_problems[team_name][p_id] = {};
            teams_problems[team_name][p_id]['s'] = false;
            teams_problems[team_name][p_id]['r'] = 0;
        }

        if (!teams_problems[team_name][p_id]['s']) {
            teams_problems[team_name][p_id]['r']++;
            if (row['state'] == 'accepted') {
                var submit = string_to_date(row['submit_time']);
                teams_problems[team_name][p_id]['s'] = get_time_diff(contest_start_time, submit);
                teams[team_name]['solved_cnts']++;
                teams[team_name]['penalty'] += (teams_problems[team_name][p_id]['r'] - 1) * self.failed_run_penalty +
                    teams_problems[team_name][p_id]['s'];
            }
        }

    });

    var team_groups = [];
    $.each(teams, function (k, v) {
        if (team_groups[v['solved_cnts']] == undefined)
            team_groups[v['solved_cnts']] = [];

        team_groups[v['solved_cnts']].push({'n' : k, 'p' : v['penalty']});
    })

    for(var i = team_groups.length - 1; i >= 0; --i) {
        var group = team_groups[i].sort(function (a, b) {
            return a['p'] - b['p'];
        })
        for(var j = 0; j < group.length; ++j) {
            m.score_board.push($.extend({
                'place' : m.score_board.length + 1,
                'team_name' : group[j]['n'],
                'penalty' : group[j]['p']
            }, teams_problems[group[j]['n']]));
        }
    }

    return m;
}