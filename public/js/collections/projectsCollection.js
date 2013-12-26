define([
	'js/models/project-model'
	], function (ProjectModel) { 
	return ProjectsCollection = Backbone.Collection.extend({
	url: "/api/projects",
	// model: ProjectModel,
	parse:  function(response){
		this.limit = response.limit;
		this.total = response.total;
		this.skip = response.skip;
		return response.projects;
	}		
}); });