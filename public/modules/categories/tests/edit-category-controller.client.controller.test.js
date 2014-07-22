'use strict';

(function() {
	// Edit category controller Controller Spec
	describe('Edit category controller Controller Tests', function() {
		// Initialize global variables
		var EditCategoryController,
			scope,
			$httpBackend,
			$stateParams,
			$location,
            modalInstance,
            Alerts;;

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
            spyOn(_Alerts_, "success");
            spyOn(_Alerts_, "error");
            Alerts = _Alerts_;
            modalInstance = {                    // Create a mock object using spies
                close: jasmine.createSpy('modalInstance.close'),
                dismiss: jasmine.createSpy('modalInstance.dismiss'),
                result: {
                    then: jasmine.createSpy('modalInstance.result.then')
                }
            };
			// Initialize the Edit category controller controller.
            EditCategoryController = $controller('EditCategoryController', {
				$scope: scope,
                $modalInstance: modalInstance,
                category: {name: 'New Category'}
			});
		}));

        it('$scope.save() should update a valid Category', inject(function(Categories) {
            // Define a sample Category put data
            var sampleCategoryPutData = new Categories({
                _id: '525cf20451979dea2c000001',
                name: 'New Category'
            });

            // Mock Category in scope
            // scope.category = sampleCategoryPutData;

            // Set PUT response
            $httpBackend.expectPUT(/categories\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.save(sampleCategoryPutData);
            $httpBackend.flush();
            expect(modalInstance.close).toHaveBeenCalled();
            expect(Alerts.success).toHaveBeenCalledWith('Category updated Successfully');
            // Test URL location to new object
            // expect($location.path()).toBe('/categories/' + sampleCategoryPutData._id);
        }));
	});
}());