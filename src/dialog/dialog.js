angular.module('ui.bootstrap.dialog', [])
.provider("$dialog", function(){
	"use strict";
	var defaults = {
		backdrop: true
	};

	this.options = {};

	this.$get = ["$document","$compile","$rootScope","$controller", function ($document, $compile, $rootScope, $controller) {
		var body = $document.find('body');

		// the actual $dialog service
		return {
			open: function(opts){
				
			}
		};
	}];
});