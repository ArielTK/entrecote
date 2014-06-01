'use strict';

angular.module('core').service('Alerts', ['notify',
	function(notify) {
		// Alerts service logic
        notify.config({
            duration: 6000
        });

		// Public API
		return {
			notify: function (msg) {
                notify({
                    message: msg,
                    template:'templates/gmail-template.html',
                    position:'center'
                });
            }
		};
	}
]);