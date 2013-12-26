define([], function () { 
	return ProjectModel = Backbone.Model.extend({	
	url: '/api/projects',
	initialize: function (opt) {
		if (opt && !_.isObject(opt)) {
			this.url = "/api/projects/"+opt;
			this.id = opt;
			// console.log(this.url);
		}
		else {
			if (opt && opt.attributes && opt.attributes._id) {
				this.id = opt.attributes._id;
				this.url = '/api/projects/'+this.id;
			}
			// console.log(this.url);
		}

	}
});
});