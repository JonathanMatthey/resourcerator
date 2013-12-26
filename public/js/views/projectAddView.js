define([
	'libs/text!tpl/projectAdd.html', 
], function (projectAddTpl){
	return addProjectView = Backbone.View.extend({
		el: "#content",

		events: {
			'click #add-project-btn': 'addProject'
		},
		initialize: function () {

			this.template = projectAddTpl;
		},		
		render: function() {
			this.$el.html(_.template(this.template));
		},
		addProject: function() {
			this.model= new ProjectModel();
			// console.log(JSON.stringify($('form').serializeArray()));
			console.log($('form').toObject());			
			var formAdd = $('form').toObject();
			this.model.set('title',formAdd.title || '');
			this.model.set('text',formAdd.text);
			this.model.set('url',formAdd.url);
			this.model.save({},{
				xhrFields:creds,
				success: function() {
					console.log("added!");
					app.navigate('#projects', true);
				},
				error : function (model, response) {
					app.alertsView.error(response);
				}				
			});
		}
	});
})