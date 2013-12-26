define([
	'libs/text!tpl/projectsSub.html',
	'libs/text!tpl/projectsEdit.html',
	'js/models/project-model'
	], function (
	projectsSubTpl,
	projectsEditTpl,
	ProjectModel ) {
	return ProjectView = Backbone.View.extend({
		tagName: "p",
		className: "project-item",
		// model: ProjectModel,
		template: projectsSubTpl,	
		modalEl: "#edit-box",
		// modalBody: '.modal-body',
		events: {
			'click .edit-project': 'edit',
			'click .like-project': 'like',
			'click .allocate-project': 'allocate',
			// 'click .deallocate-project': 'deallocate',
			'click .watch-project': 'watch',
			'click .save-project': 'save',
			'click .remove': 'remove',
			'mousedown .allocation': 'dragAllocation',
			'click .allocation__action--remove': 'deallocate',
			'click .allocation__action--split': 'splitAllocation',
			'click .allocation-drop': 'projectClick'
		},
		initialize: function(options) {
			this.model = new ProjectModel (options.model);
			this.model.bind('change',this.render,this);
			this.model.bind('clean',this.clean,this);
			// console.log(this.model.url());
			// this.model.url) {return'/api/projects/'+this.model.id};
			// console.log(this.model.url);
		},
		render: function(){
			console.log('inside of render projects-sub-view')
			//hack to remove backdrop from TB modal because modal('hide') is not working due to not existence of the modal by this time
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
			this.$el.html(_.template(this.template,{attr:this.model.attributes}));
			return this;
		},
		clean: function(){
			console.log('inside of clean projects-sub-view')			
			this.$el.remove();
		},
		edit: function(){			
			var editBox = this.$el.find('.edit-box');
			editBox.html(_.template(projectsEditTpl,{attr:this.model.attributes}));
			editBox.find('.modal').modal('show');
		},
		save: function() {
			// console.log(this.model);
			// console.log('before: '+this.model.id);
			// console.log('before: '+this.model.url);			
			// console.log(this.model);
			var editBox = this.$el.find('.edit-box').find('form').toObject();
			this.model.attributes.title = editBox.title;
			this.model.attributes.text = editBox.text;
			// this.model.set('text', editBox.text);
			this.model.attributes.url = editBox.url;
			// console.log(editBox.text);
			// console.log(this.model.attributes.text);
			this.model.save({},{
				success: function (model) {
					app.alertsView.success("Saved!");										
				},
				error: function(model, response){
					app.alertsView.error (response);
				}
			});
		},
		close:function(){
			$(this.modalEl).modal('hide');			
		},
		splitAllocation:function(e){
			var $allocation = $('.allocation.dragged').first();
			var allocationId = $allocation.attr('data-allocation-id');
			var allocationDisplayName = $allocation.find('.display-name').html();
			var allocationUserId = $allocation.find('.user-id').html();
			this.model.attributes.allocationId = allocationId;
			this.model.attributes.action = "splitAllocation";
			this.model.attributes.allocate = true;
			this.model.attributes.allocation = {
				userId : allocationUserId,
				displayName : allocationDisplayName
			};
			this.model.save({			
			},{
				xhrFields:creds, 
				success: function(model) {
					app.alertsView.success("You've split the allocation!");	
					model.trigger('change');
				},
				error: function(model, response){
					app.alertsView.error (response);
				}
			});	
		},
		dragAllocation:function(e){
			var $allocation = $(e.currentTarget);
			$('.allocation.dragged').removeClass('dragged');
			$allocation.addClass('dragged');
		},
		projectClick:function(){
			console.log('projectsBoxClick');
			var $allocation = $('.allocation.dragged').first();
			if ($allocation.length > 0){
				this.allocate();
				$('.allocation.dragged').removeClass('dragged');
			}
		},
		watch: function(){
			if (!this.model.attributes.watches || this.model.attributes.watches.indexOf(app.headerView.model.attributes._id)<0) {
				this.model.attributes.action = "watch";
				this.model.attributes.watch = true;
				this.model.save({			
				},{
					xhrFields:creds, 
					success: function(model) {	
						app.alertsView.success("You're watching the project now!");						
						model.trigger('change');
					},
					error: function(model, response){
						app.alertsView.error (response);
					}
				});
			}
			else {
				// app.alertsView.collection.add ({text: "You can't watch twice", status: "2", error:"3"});
				app.alertsView.error ("You can't watch twice");
			}
		},
		like: function(){

			if (!this.model.attributes.likes || this.model.attributes.likes.indexOf(app.headerView.model.attributes._id)<0) {
				this.model.attributes.action = "like";
				this.model.attributes.like = true;
				this.model.save({			
				},{
					xhrFields:creds, 
					success: function(model) {
						app.alertsView.success("You like the project now!");	
						model.trigger('change');
					},
					error: function(model, response){
						app.alertsView.error (response);
					}
				});			
			}
			else {
				app.alertsView.error ("You can't like twice");
			}
		},
		allocate: function(){
			// get target allocation id
			var $allocation = $('.allocation.dragged').first();
			var allocationId = $allocation.attr('data-allocation-id');
			var allocationDisplayName = $allocation.find('.display-name').html();
			this.model.attributes.action = "allocate";
			this.model.attributes.allocate = true;
			this.model.attributes.allocation = {
				userId : allocationId,
				displayName : allocationDisplayName
			};
			this.model.save({			
			},{
				xhrFields:creds, 
				success: function(model) {
					app.alertsView.success("You're allocated to this project!");	
					model.trigger('change');
				},
				error: function(model, response){
					app.alertsView.error (response);
				}
			});			
		},
		deallocate: function(){
			var $allocation = $('.allocation.dragged').first();
			var allocationId = $allocation.attr('data-allocation-id');
			this.model.attributes.action = "deallocate";
			this.model.attributes.allocate = false;
			this.model.attributes.allocationId = allocationId;
			this.model.save({			
			},{
				xhrFields:creds, 
				success: function(model) {
					app.alertsView.success("You're deallocated from this project!");	
					model.trigger('change');
				},
				error: function(model, response){
					app.alertsView.error (response);
				}
			});			
		},
		remove: function () {

			this.model.destroy({
				success: function(model,response){
					console.log(app.alertsView.collection);		
					app.alertsView.success("Deleted!");
					model.trigger('clean');					
					console.log(model)
				},
				error: function(model, response){
					console.log(model);					
					console.log(response);					
					app.alertsView.error (response);
				}
			});		
		}
	});
});