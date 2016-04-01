CATS.Model.Run = Classify(CATS.Model.Event, {
    init: function () {
        this.$$parent();
        this.type = "run";
        this.problem = null;//*: id
        this.user = null;//*: id
        this.contest = null;
        this.compiler = null;
        this.source = null;
        this.status = null;
        /*:
         "not_processed"*, "processing",
         "accepted", "partial", "compile_error", "runtime_error",
         "wrong_answer", "presentation_error", "memory_limit", "timie_limit", "idleness_limit",
         "security_violation", "unhandled_error", "ignored", "rejected", "challenged"?
         passed_test_count: \d+ (failed_test - 1)*/
        this.points = null;//: \d+
        this.start_processing_time = null;
        this.finish_processing_time = null;
        this.processor = null;
        this.ip = null;
        //tests: [...TODO]
        this.consumed = null;//?: { time: seconds, memory: bytes }
    },

    minutes_since_start: function () {
        if (this.minutes_since_start_cache === undefined)
            this.minutes_since_start_cache =
                (this.start_processing_time - CATS.App.contests[this.contest].start_time) / (1000 * 60);
        return this.minutes_since_start_cache;
    },

});
