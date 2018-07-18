(function($) {
	'use strict';

	// OMTG Diagram View
	// ----------
	
	app.omtg.DiagramView = Backbone.View.extend({

		tagName : 'div',

		className : 'diagram-container',
		
		parentSelector : '#canvas', 
				
		events : {
			
			// Delete the diagram and remove its view from canvas
			'click .badge-delete' : 'deleteDiagram',
			
			'click .badge-edit' : 'edit',
			
			// Toggle the selection of the diagram
			'click' : 'handleClick',			

		    'dblclick' : 'handleDblClick',
		        
		    'mouseenter' : 'handleMouseEnter',
		    
		    'mouseleave' : 'handleMouseLeave',
		        
		    'mouseup' : 'updatePosition',
		    
		    'contextmenu' : 'openContextMenu'
		},

		initialize : function() {

			// Templates
			this.$conventional = $('#omtg-conventional-template');
			this.$georeferenced = $('#omtg-georeferenced-template');

			// Listeners
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'edit', this.edit);
			this.listenTo(this.model, 'bringtofront', this.bringToFront);
			this.listenTo(this.model, 'sendtoback', this.sendToBack);
		},

		render : function() {
			
			// Check the type of the diagram to use a proper template
			if (this.model.get("type") == 'conventional') {
				this.template = _.template(this.$conventional.html());
			} else {
				this.template = _.template(this.$georeferenced.html());
			}
			
			// Render class id
			this.el.id = this.model.get('id');
			
			// Set position
			this.$el.css({        
				'top': this.model.get('top') + 'px',
				'left': this.model.get('left') + 'px'
			});			
			
			// Render name and type
			this.$el.html(this.template(this.model.toJSON()));
			
			
			// Render attributes
			var attributes = this.model.get('attributes');						
			attributes.each(function(attribute) {				
				var attributeView = new app.omtg.AttributeView({model : attribute});
				this.$('.d-body > table > tbody').append(attributeView.render().el);
			}, this);
			
			
			// Render the `selected` state
			if(this.model.get('selected')){
				this.$el.addClass('selected');
				this.$('.badge-delete').removeClass('hidden');
				this.$('.badge-edit').removeClass('hidden');
			}
			else{
				this.$el.removeClass('selected');
			}
			
			// Render shadow
			if(app.canvas.get('diagramShadow')){
				this.$el.addClass('diagram-container-shadow');
			}
			
			app.plumbUtils.repaintAllAnchors();
			app.plumb.repaintEverything();
			
			return this;
		},
		
		handleClick : _.debounce(function(event) {
			
            if (this.doubleclicked) {
                this.doubleclicked = false; 
            } else {            	
            	this.model.toggleSelected();
            }
        }, 200),
        
        handleDblClick : function(e) {
            this.doubleclicked = true;
            this.edit.call(this, e);
        },
		
		edit : function(event) {
			 
			if(event && event.stopPropagation) 
				event.stopPropagation(); 
			
			var hasConnections = false;
			if(app.plumb.getConnections({ source: this.el.id }).length || app.plumb.getConnections({ target: this.el.id }).length)
				hasConnections = true;
		
			var modal = new app.omtg.DiagramEditorView({model : this.model, hasConnections : hasConnections});
		},
		
		deleteDiagram : function(event) {
			if(event) 
				event.stopPropagation(); 
			
			if (confirm(app.msgs.DELETE_DIAGRAM)){			
				app.plumb.detachAllConnections(this.$el);						
				
				// Remove view				 
				this.model.trigger("destroy", this.model); 
				app.canvasView.updateHistory();
			}
		},
		
		updatePosition : function(event) {
			var grid = app.canvas.get("snapToGrid");
			this.model.set({
				'left': Math.round(this.$el.position().left / grid) * grid,
				'top' : Math.round(this.$el.position().top / grid) * grid
			});
						
			var plumbConnections = app.plumb.getConnections(this.$el);
			
			for (var i = 0; i < plumbConnections.length; i++) {
				app.plumbUtils.updateLabelsPosition(plumbConnections[i]);
			}
		},
		
		handleMouseEnter : function() {
			this.$el.addClass('hovered');
			this.$('.badge-delete').removeClass('hidden');
			this.$('.badge-edit').removeClass('hidden');
		},
		
		handleMouseLeave : function() {	
			this.$el.removeClass('hovered');
			this.$('.badge-delete').addClass('hidden');
			this.$('.badge-edit').addClass('hidden');	
		},

		bringToFront : function() {
			$(this.render().el).appendTo(this.parentSelector);
		},
		
		sendToBack : function() {
			$(this.render().el).prependTo(this.parentSelector);
		},
		
		openContextMenu : function(event) { 
			event.preventDefault();			
			app.contextMenuView = new app.ContextMenuView({diagramView : this, left : event.pageX, top : event.pageY});
		}
	});

})(jQuery);