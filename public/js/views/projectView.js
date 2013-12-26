define ([
	'libs/text!tpl/project.html',
], function (projectTpl) {
	return viewProjectView = Backbone.View.extend({
		el: "#content",
		events: {
			'click #comment-btn': 'comment'
		},
		initialize: function () {
			this.template = projectTpl;
		},		
		render: function() {
			this.$el.html(_.template(this.template, {attr:this.model.attributes}));
		},
		load: function (id){
			this.model = new ProjectModel(id);
			this.model.bind('all', this.render, this);
			this.model.fetch({});
		},
		comment: function() {
			this.model.set({
				comment:$('form').toObject().comment,
				action:"comment"
			});		
			this.model.save({},{
				xhrFields:creds,
				success: function() {
					console.log("saved");
					app.alertsView.success("Saved!");
				},
				error: function(model,response){
					console.log('error');
					app.alertsView.error (response);
				}
			});
		}
	});	
})
	
