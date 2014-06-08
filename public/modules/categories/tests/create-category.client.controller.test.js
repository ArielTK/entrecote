'use strict';

(function() {
	// Create category Controller Spec
	describe('Create category Controller Tests', function() {
		// Initialize global variables
		var CreateCategoryController,
			scope,
			$httpBackend,
			$stateParams,
			$location,
            $modalInstance;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$modalInstance_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
            $modalInstance = {
                close: function (reason) {
                    
                }
            };

			// Initialize the Create category controller.
			CreateCategoryController = $controller('CreateCategoryController', {
				$scope: scope
			});
		}));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Categories) {
            // Create a sample Category object
            var sampleCategoryPostData = new Categories({
                name: 'New Category'
            });

            // Create a sample Category response
            var sampleCategoryResponse = new Categories({
                _id: '525cf20451979dea2c000001',
                name: 'New Category'
            });

            // Fixture mock form input values
            scope.name = 'New Category';

            // Set POST response
            $httpBackend.expectPOST('categories', sampleCategoryPostData).respond(sampleCategoryResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.name).toEqual('');

            // Test URL redirection after the Category was created
            // expect($location.path()).toBe('/categories/' + sampleCategoryResponse._id);
        }));
	});
}());