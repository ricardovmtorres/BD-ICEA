// Namespaces

var ENTER_KEY = 13;
var ESC_KEY = 27;
var LEFT_ARROW_KEY = 37;
var TOP_ARROW_KEY = 38;
var RIGHT_ARROW_KEY = 39;
var DOWN_ARROW_KEY = 40;
var DELETE_KEY = 46;
var B_KEY = 66;
var C_KEY = 67;
var D_KEY = 68;
var F_KEY = 70;
var V_KEY = 86;
var Z_KEY = 90;
var F1_KEY = 112;
var F2_KEY = 113;

var app = {
	// OMT-G namespace
	omtg : {},

	msgs : {
		DELETE_CONNECTION: "This connection will be detached. Are you sure?",
		DELETE_DIAGRAM: "This diagram will be removed. All its connection will be detached. Are you sure?",
		DELETE_DIAGRAMS: "The selected diagrams will be removed. All their connections will be detached. Are you sure?",
		EMPTY_PROJECT: "Project is empty, there is nothing to export!",
		NOT_EMPTY_PROJECT: "Project is not empty",
	},
};

$(function () {
	'use strict';
	
	// Diagrams
	app.classTools = new app.Tools([
	     { name : 'entidade', model : 'omtgDiagram', tooltip: 'Polygon', icon: 'imgs/omtg/polygon.png' },
	]);

	
	// Relations
	app.relationshipTools = new app.Tools([
	     { name : 'umum', model : 'omtgRelation', tooltip: 'Association', icon: 'imgs/relation/association.png' },
	     { name : 'umn', model : 'omtgRelation', tooltip: 'Spatial Association', icon: 'imgs/relation/spatial-association.png' },
	     { name : 'num', model : 'omtgRelation', tooltip: 'Aggregation', icon: 'imgs/relation/aggregation.png' },
	     { name : 'nn', model : 'omtgRelation', tooltip: 'Spatial Aggregation', icon: 'imgs/relation/spatial-aggregation.png' },
	]);

	
	// List of toolboxes
	app.toolboxes = new app.Toolboxes([
	     {name: "Classes", tools : app.classTools},
	     {name: "Relationships", tools : app.relationshipTools}
	]);	

	// Canvas Model
	app.canvas = new app.Canvas();
	
	// Initialize Backbone views.
	app.bodyView = new app.BodyView();
	app.navbarView = new app.NavbarView({el: $('#collapse')});
	app.toolboxesView = new app.ToolboxesView({el: $('#section-sidebar'), model: app.toolboxes});
	app.canvasView = new app.CanvasView({el: '#canvas', model: app.canvas});
	
});
