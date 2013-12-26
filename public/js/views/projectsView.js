define([
	'libs/text!tpl/projects.html', 
	'js/collections/projectsCollection',
	'js/views/projectsSubView'
], function (projectsTpl,ProjectsCollection, ProjectsSubView){
	return ProjectsView = Backbone.View.extend({
		el: "#content",
		template: projectsTpl,
		initialize: function() {
			this.collection = new ProjectsCollection;
			this.collection.bind('all',this.render, this);
			this.collection.model.bind('change', function(){console.log('change')}, this);
		},
		load: function(skip) {
			this.collection.url = '/api/projects/'+'?skip='+skip;
			this.collection.fetch({xhrFields:creds, 
				success: function(model) {
					console.log(model.length)
				},
				error: function(response){
					app.alertsView.error(response);
				}
			});	
		},
		render: function() {
			this.$el.html(_.template(this.template,{limit:this.collection.limit, skip:this.collection.skip}));
			var html ='';
			_.each(this.collection.models,function(model){
				$('#projects-box').append(new ProjectsSubView({model:model}).render().el);
			});
			if (((Number(this.collection.length)+Number(this.collection.skip)) < Number(this.collection.total))) {
				$('.pagination').show();
			}
			else {
				$('.pagination').hide();
			}
		}
	});
})