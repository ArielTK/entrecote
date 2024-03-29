'use strict';

(function() {
	// Categories Controller Spec
	describe('Categories Controller Tests', function() {
		// Initialize global variables
		var CategoriesController,
		scope,
		$httpBackend,
		$stateParams,
		$location,
        Alerts;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Alerts_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
            $location = _$location_;
            spyOn(_Alerts_, "error");
            Alerts = _Alerts_

			// Initialize the Categories controller.
			CategoriesController = $controller('CategoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Category object fetched from XHR', inject(function(Categories) {
			// Create sample Category using the Categories service
			var sampleCategory = new Categories({
				name: 'New Category'
			});

			// Create a sample Categories array that includes the new Category
			var sampleCategories = [sampleCategory];

			// Set GET response
			$httpBackend.expectGET('categories').respond(sampleCategories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categories).toEqualData(sampleCategories);
		}));

		it('$scope.findOne() should create an array with one Category object fetched from XHR using a categoryId URL parameter', inject(function(Categories) {
			// Define a sample Category object
			var sampleCategory = new Categories({
				name: 'New Category'
			});

			// Set the URL parameter
			$stateParams.categoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/categories\/([0-9a-fA-F]{24})$/).respond(sampleCategory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.category).toEqualData(sampleCategory);
		}));

        /*
		it('$scope.remove() should send a DELETE request with a valid categoryId and remove the Category from the scope', inject(function(Categories) {
			// Create new Category object
			var sampleCategory = new Categories({
				_id: '525a8422f6d0f87f0e407a33'
			});
            debugger;
			// Create new Categories array and include the Category
			scope.categories = [sampleCategory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/categories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCategory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.categories.length).toBe(0);
		}));*/
	});
}());