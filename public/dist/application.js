'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'entrecote';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngGrid'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categories');'use strict';
ApplicationConfiguration.registerModule('common');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('categories').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Categories', 'categories', 'dropdown', '/categories', 'fa-align-justify', false, 'admin');
    // Menus.addSubMenuItem('topbar', 'categories', 'List Categories', 'categories');
    Menus.addSubMenuItem('topbar', 'categories', 'New Category', 'openNewCategoryWindow', '/categories', false, 'admin');
  }
]);'use strict';
//Setting up route
angular.module('categories').config([
  '$stateProvider',
  function ($stateProvider) {
    // Categories state routing
    $stateProvider.state('listCategories', {
      url: '/categories',
      templateUrl: 'modules/categories/views/list-categories.client.view.html'
    });
  }
]);'use strict';
// Categories controller
angular.module('categories').controller('CategoriesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Categories',
  '$modal',
  'Alerts',
  function ($scope, $stateParams, $location, Authentication, Categories, $modal, Alerts) {
    $scope.authentication = Authentication;
    $scope.authentication.validateSignin();
    $scope.selectedCategory = [];
    $scope.gridOptions = {
      data: 'categories',
      multiSelect: false,
      showFooter: true,
      selectedItems: $scope.selectedCategory,
      columnDefs: [
        {
          field: 'name',
          displayName: 'Name'
        },
        {
          field: 'description',
          displayName: 'Description'
        },
        {
          field: 'created',
          displayName: 'Created Date',
          cellFilter: 'date'
        },
        {
          field: 'user.displayName',
          displayName: 'User'
        }
      ]
    };
    $scope.gridSearchFunc = function () {
      $scope.find();
    };
    $scope.openNewCategoryWindow = function () {
      var createModal = $modal.open({
          templateUrl: 'modules/categories/views/category.client.view.html',
          controller: 'CreateCategoryController'
        });
      createModal.result.then(function () {
        $scope.find();
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
    $scope.openEditCategoryWindow = function (category) {
      if ($scope.selectedCategory.length > 0) {
        var createModal = $modal.open({
            templateUrl: 'modules/categories/views/category.client.view.html',
            controller: 'EditCategoryController',
            resolve: {
              category: function () {
                return category;
              }
            }
          });
        createModal.result.then(function () {
          $scope.find();
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      } else {
        Alerts.error('Please select Category to update');
      }
    };
    // Remove existing Category
    $scope.remove = function (category) {
      if (category) {
        var message = 'Are you sure you want to delete category: ' + category.name;
        Alerts.confirm(message, function (e) {
          if (e) {
            category.$remove();
            $scope.find();
            Alerts.success('Category deleted successfully');
          }
        });
      } else {
        Alerts.error('Please select Category to delete');
      }
    };
    // Find a list of Categories
    $scope.find = function () {
      if (typeof $scope.gridSearchData !== 'undefined' && $scope.gridSearchData !== '') {
        $scope.categories = Categories.search({ searchData: $scope.gridSearchData });  // $scope.selectedCategory = [];
      } else {
        $scope.categories = Categories.query();  // $scope.selectedCategory = [];
      }
    };
    // Find existing Category
    $scope.findOne = function () {
      $scope.category = Categories.get({ categoryId: $stateParams.categoryId });
    };
  }
]);'use strict';
angular.module('categories').controller('CreateCategoryController', [
  '$scope',
  '$modalInstance',
  'Categories',
  'Alerts',
  function ($scope, $modalInstance, Categories, Alerts) {
    $scope.modalTitle = 'Create New Category';
    $scope.closeModal = function () {
      $modalInstance.dismiss('cancel');
    };
    // Create new Category
    $scope.save = function (categoryParam) {
      $scope.isLoading = true;
      // Create new Category object
      var category = new Categories({
          name: categoryParam.name,
          description: categoryParam.description
        });
      // Redirect after save
      category.$save(function (response) {
        $modalInstance.close(response);
        Alerts.success('Category Added Successfully');
        $scope.isLoading = false;
      }, function (errorResponse) {
        Alerts.error(errorResponse.data.message);
        $scope.isLoading = false;
      });
    };
  }
]);'use strict';
angular.module('categories').controller('EditCategoryController', [
  '$scope',
  '$modalInstance',
  'category',
  'Alerts',
  function ($scope, $modalInstance, category, Alerts) {
    $scope.category = category;
    $scope.modalTitle = 'Edit Category ' + category.name;
    $scope.closeModal = function () {
      $modalInstance.dismiss('cancel');
    };
    // Update existing Category
    $scope.save = function (category) {
      $scope.isLoading = true;
      category.$update(function () {
        $modalInstance.close();
        Alerts.success('Category updated Successfully');
        $scope.isLoading = false;
      }, function (errorResponse) {
        if (errorResponse.data.message !== undefined) {
          Alerts.error(errorResponse.data.message);
        } else {
          Alerts.error(errorResponse.data);
        }
        $scope.isLoading = false;
      });
    };
  }
]);'use strict';
//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', [
  '$resource',
  function ($resource) {
    return $resource('categories/:categoryId', {
      categoryId: '@_id',
      searchData: '@_searchData'
    }, {
      update: { method: 'PUT' },
      search: {
        method: 'GET',
        isArray: true,
        url: 'categories/search/:searchData'
      }
    });
  }
]);'use strict';
angular.module('core').directive('focusMe', [
  '$timeout',
  function ($timeout) {
    return {
      link: function postLink(scope, element, attrs) {
        $timeout(function () {
          element[0].focus();
        }, 100);
      }
    };
  }
]);'use strict';
angular.module('core').directive('gridSearch', function () {
  return { template: '<form style="display:inline;"  ng-submit="gridSearchFunc()"><input type="search" placeholder="Search" class="input-search hidden-xs hidden-sm fa fa-search" focus-me ng-model="gridSearchData"></form>' };
});'use strict';
angular.module('core').directive('loading', [
  '$compile',
  function ($compile) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var updateElement = function (newValue, oldValue) {
          if (newValue !== undefined && newValue !== oldValue) {
            if (newValue === true) {
              element.addClass('loading-mask');
              element.prop('disabled', true);
              $compile(element)(scope);
            } else {
              element.removeClass('loading-mask');
              element.prop('disabled', false);
              $compile(element)(scope);
            }
          }
        };
        updateElement(scope.loading, null);
        scope.$watch('loading', updateElement);
      },
      scope: { loading: '=' }
    };
  }
]);'use strict';
angular.module('core').directive('stretchHeight', [
  'Sizer',
  function (Sizer) {
    return {
      scope: { heightToRemove: '=stretchHeight' },
      link: function (scope, element, attrs) {
        Sizer.updateElementSizeToStrech(element, scope.heightToRemove);
        Sizer.getWindowElement().on('resize', function (event) {
          Sizer.updateElementSizeToStrech(element, scope.heightToRemove);
        });
      }
    };
  }
]);'use strict';
angular.module('common').directive('tableList', [function () {
    return {
      templateUrl: 'modules/common/templates/table-list.client.template.html',
      restrict: 'A',
      scope: {
        options: '=',
        data: '='
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  }]);'use strict';
angular.module('common').factory('Alerts', [function () {
    // Alerts service logic
    var _alertify = {}, dialogs = {}, isopen = false, keys = {
        ENTER: 13,
        ESC: 27,
        SPACE: 32
      }, queue = [], $, btnCancel, btnOK, btnReset, btnResetBack, btnFocus, elCallee, elCover, elDialog, elLog, form, input, getTransitionEvent;
    /**
         * Markup pieces
         * @type {Object}
         */
    dialogs = {
      buttons: {
        holder: '<nav class="alertify-buttons">{{buttons}}</nav>',
        submit: '<button type="submit" class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</button>',
        ok: '<button class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</button>',
        cancel: '<button class="alertify-button alertify-button-cancel" id="alertify-cancel">{{cancel}}</button>'
      },
      input: '<div class="alertify-text-wrapper"><input type="text" class="alertify-text" id="alertify-text"></div>',
      message: '<p class="alertify-message">{{message}}</p>',
      log: '<article class="alertify-log{{class}}">{{message}}</article>'
    };
    /**
         * Return the proper transitionend event
         * @return {String}    Transition type string
         */
    getTransitionEvent = function () {
      var t, type, supported = false, el = document.createElement('fakeelement'), transitions = {
          'WebkitTransition': 'webkitTransitionEnd',
          'MozTransition': 'transitionend',
          'OTransition': 'otransitionend',
          'transition': 'transitionend'
        };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          type = transitions[t];
          supported = true;
          break;
        }
      }
      return {
        type: type,
        supported: supported
      };
    };
    /**
         * Shorthand for document.getElementById()
         *
         * @param  {String} id    A specific element ID
         * @return {Object}       HTML element
         */
    $ = function (id) {
      return document.getElementById(id);
    };
    /**
         * Alertify private object
         * @type {Object}
         */
    _alertify = {
      labels: {
        ok: 'OK',
        cancel: 'Cancel'
      },
      delay: 5000,
      buttonReverse: false,
      buttonFocus: 'ok',
      transition: undefined,
      addListeners: function (fn) {
        var hasOK = typeof btnOK !== 'undefined', hasCancel = typeof btnCancel !== 'undefined', hasInput = typeof input !== 'undefined', val = '', self = this, ok, cancel, common, key, reset;
        // ok event handler
        ok = function (event) {
          if (typeof event.preventDefault !== 'undefined')
            event.preventDefault();
          common(event);
          if (typeof input !== 'undefined')
            val = input.value;
          if (typeof fn === 'function') {
            if (typeof input !== 'undefined') {
              fn(true, val);
            } else
              fn(true);
          }
          return false;
        };
        // cancel event handler
        cancel = function (event) {
          if (typeof event.preventDefault !== 'undefined')
            event.preventDefault();
          common(event);
          if (typeof fn === 'function')
            fn(false);
          return false;
        };
        // common event handler (keyup, ok and cancel)
        common = function (event) {
          self.hide();
          self.unbind(document.body, 'keyup', key);
          self.unbind(btnReset, 'focus', reset);
          if (hasOK)
            self.unbind(btnOK, 'click', ok);
          if (hasCancel)
            self.unbind(btnCancel, 'click', cancel);
        };
        // keyup handler
        key = function (event) {
          var keyCode = event.keyCode;
          if (keyCode === keys.SPACE && !hasInput || hasInput && keyCode === keys.ENTER)
            ok(event);
          if (keyCode === keys.ESC && hasCancel)
            cancel(event);
        };
        // reset focus to first item in the dialog
        reset = function (event) {
          if (hasInput)
            input.focus();
          else if (!hasCancel || self.buttonReverse)
            btnOK.focus();
          else
            btnCancel.focus();
        };
        // handle reset focus link
        // this ensures that the keyboard focus does not
        // ever leave the dialog box until an action has
        // been taken
        this.bind(btnReset, 'focus', reset);
        this.bind(btnResetBack, 'focus', reset);
        // handle OK click
        if (hasOK)
          this.bind(btnOK, 'click', ok);
        // handle Cancel click
        if (hasCancel)
          this.bind(btnCancel, 'click', cancel);
        // listen for keys, Cancel => ESC
        this.bind(document.body, 'keyup', key);
        if (!this.transition.supported) {
          this.setFocus();
        }
      },
      bind: function (el, event, fn) {
        if (typeof el.addEventListener === 'function') {
          el.addEventListener(event, fn, false);
        } else if (el.attachEvent) {
          el.attachEvent('on' + event, fn);
        }
      },
      handleErrors: function () {
        if (typeof global.onerror !== 'undefined') {
          var self = this;
          global.onerror = function (msg, url, line) {
            self.error('[' + msg + ' on line ' + line + ' of ' + url + ']', 0);
          };
          return true;
        } else {
          return false;
        }
      },
      appendButtons: function (secondary, primary) {
        return this.buttonReverse ? primary + secondary : secondary + primary;
      },
      build: function (item) {
        var html = '', type = item.type, message = item.message, css = item.cssClass || '';
        html += '<div class="alertify-dialog">';
        html += '<a id="alertify-resetFocusBack" class="alertify-resetFocus" href="#">Reset Focus</a>';
        if (_alertify.buttonFocus === 'none')
          html += '<a href="#" id="alertify-noneFocus" class="alertify-hidden"></a>';
        // doens't require an actual form
        if (type === 'prompt')
          html += '<div id="alertify-form">';
        html += '<article class="alertify-inner">';
        html += dialogs.message.replace('{{message}}', message);
        if (type === 'prompt')
          html += dialogs.input;
        html += dialogs.buttons.holder;
        html += '</article>';
        if (type === 'prompt')
          html += '</div>';
        html += '<a id="alertify-resetFocus" class="alertify-resetFocus" href="#">Reset Focus</a>';
        html += '</div>';
        switch (type) {
        case 'confirm':
          html = html.replace('{{buttons}}', this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.ok));
          html = html.replace('{{ok}}', this.labels.ok).replace('{{cancel}}', this.labels.cancel);
          break;
        case 'prompt':
          html = html.replace('{{buttons}}', this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.submit));
          html = html.replace('{{ok}}', this.labels.ok).replace('{{cancel}}', this.labels.cancel);
          break;
        case 'alert':
          html = html.replace('{{buttons}}', dialogs.buttons.ok);
          html = html.replace('{{ok}}', this.labels.ok);
          break;
        default:
          break;
        }
        elDialog.className = 'alertify alertify-' + type + ' ' + css;
        elCover.className = 'alertify-cover';
        return html;
      },
      close: function (elem, wait) {
        // Unary Plus: +'2' === 2
        var timer = wait && !isNaN(wait) ? +wait : this.delay, self = this, hideElement, transitionDone;
        // set click event on log messages
        this.bind(elem, 'click', function () {
          hideElement(elem);
        });
        // Hide the dialog box after transition
        // This ensure it doens't block any element from being clicked
        transitionDone = function (event) {
          event.stopPropagation();
          // unbind event so function only gets called once
          self.unbind(this, self.transition.type, transitionDone);
          // remove log message
          elLog.removeChild(this);
          if (!elLog.hasChildNodes())
            elLog.className += ' alertify-logs-hidden';
        };
        // this sets the hide class to transition out
        // or removes the child if css transitions aren't supported
        hideElement = function (el) {
          // ensure element exists
          if (typeof el !== 'undefined' && el.parentNode === elLog) {
            // whether CSS transition exists
            if (self.transition.supported) {
              self.bind(el, self.transition.type, transitionDone);
              el.className += ' alertify-log-hide';
            } else {
              elLog.removeChild(el);
              if (!elLog.hasChildNodes())
                elLog.className += ' alertify-logs-hidden';
            }
          }
        };
        // never close (until click) if wait is set to 0
        if (wait === 0)
          return;
        // set timeout to auto close the log message
        setTimeout(function () {
          hideElement(elem);
        }, timer);
      },
      dialog: function (message, type, fn, placeholder, cssClass) {
        // set the current active element
        // this allows the keyboard focus to be resetted
        // after the dialog box is closed
        elCallee = document.activeElement;
        // check to ensure the alertify dialog element
        // has been successfully created
        var check = function () {
          if (elLog && elLog.scrollTop !== null && (elCover && elCover.scrollTop !== null))
            return;
          else
            check();
        };
        // error catching
        if (typeof message !== 'string')
          throw new Error('message must be a string');
        if (typeof type !== 'string')
          throw new Error('type must be a string');
        if (typeof fn !== 'undefined' && typeof fn !== 'function')
          throw new Error('fn must be a function');
        // initialize alertify if it hasn't already been done
        this.init();
        check();
        queue.push({
          type: type,
          message: message,
          callback: fn,
          placeholder: placeholder,
          cssClass: cssClass
        });
        if (!isopen)
          this.setup();
        return this;
      },
      extend: function (type) {
        if (typeof type !== 'string')
          throw new Error('extend method must have exactly one paramter');
        return function (message, wait) {
          this.log(message, type, wait);
          return this;
        };
      },
      hide: function () {
        var transitionDone, self = this;
        // remove reference from queue
        queue.splice(0, 1);
        // if items remaining in the queue
        if (queue.length > 0)
          this.setup(true);
        else {
          isopen = false;
          // Hide the dialog box after transition
          // This ensure it doens't block any element from being clicked
          transitionDone = function (event) {
            event.stopPropagation();
            // unbind event so function only gets called once
            self.unbind(elDialog, self.transition.type, transitionDone);
          };
          // whether CSS transition exists
          if (this.transition.supported) {
            this.bind(elDialog, this.transition.type, transitionDone);
            elDialog.className = 'alertify alertify-hide alertify-hidden';
          } else {
            elDialog.className = 'alertify alertify-hide alertify-hidden alertify-isHidden';
          }
          elCover.className = 'alertify-cover alertify-cover-hidden';
          // set focus to the last element or body
          // after the dialog is closed
          elCallee.focus();
        }
      },
      init: function () {
        // ensure legacy browsers support html5 tags
        document.createElement('nav');
        document.createElement('article');
        document.createElement('section');
        // cover
        if ($('alertify-cover') === null) {
          elCover = document.createElement('div');
          elCover.setAttribute('id', 'alertify-cover');
          elCover.className = 'alertify-cover alertify-cover-hidden';
          document.body.appendChild(elCover);
        }
        // main element
        if ($('alertify') === null) {
          isopen = false;
          queue = [];
          elDialog = document.createElement('section');
          elDialog.setAttribute('id', 'alertify');
          elDialog.className = 'alertify alertify-hidden';
          document.body.appendChild(elDialog);
        }
        // log element
        if ($('alertify-logs') === null) {
          elLog = document.createElement('section');
          elLog.setAttribute('id', 'alertify-logs');
          elLog.className = 'alertify-logs alertify-logs-hidden';
          document.body.appendChild(elLog);
        }
        // set tabindex attribute on body element
        // this allows script to give it focus
        // after the dialog is closed
        document.body.setAttribute('tabindex', '0');
        // set transition type
        this.transition = getTransitionEvent();
      },
      log: function (message, type, wait) {
        // check to ensure the alertify dialog element
        // has been successfully created
        var check = function () {
          if (elLog && elLog.scrollTop !== null)
            return;
          else
            check();
        };
        // initialize alertify if it hasn't already been done
        this.init();
        check();
        elLog.className = 'alertify-logs';
        this.notify(message, type, wait);
        return this;
      },
      notify: function (message, type, wait) {
        var log = document.createElement('article');
        log.className = 'alertify-log' + (typeof type === 'string' && type !== '' ? ' alertify-log-' + type : '');
        log.innerHTML = message;
        // append child
        elLog.appendChild(log);
        // triggers the CSS animation
        setTimeout(function () {
          log.className = log.className + ' alertify-log-show';
        }, 50);
        this.close(log, wait);
      },
      set: function (args) {
        var k;
        // error catching
        if (typeof args !== 'object' && args instanceof Array)
          throw new Error('args must be an object');
        // set parameters
        for (k in args) {
          if (args.hasOwnProperty(k)) {
            this[k] = args[k];
          }
        }
      },
      setFocus: function () {
        if (input) {
          input.focus();
          input.select();
        } else
          btnFocus.focus();
      },
      setup: function (fromQueue) {
        var item = queue[0], self = this, transitionDone;
        // dialog is open
        isopen = true;
        // Set button focus after transition
        transitionDone = function (event) {
          event.stopPropagation();
          self.setFocus();
          // unbind event so function only gets called once
          self.unbind(elDialog, self.transition.type, transitionDone);
        };
        // whether CSS transition exists
        if (this.transition.supported && !fromQueue) {
          this.bind(elDialog, this.transition.type, transitionDone);
        }
        // build the proper dialog HTML
        elDialog.innerHTML = this.build(item);
        // assign all the common elements
        btnReset = $('alertify-resetFocus');
        btnResetBack = $('alertify-resetFocusBack');
        btnOK = $('alertify-ok') || undefined;
        btnCancel = $('alertify-cancel') || undefined;
        /*btnFocus  = (_alertify.buttonFocus === 'cancel') ? btnCancel : ((_alertify.buttonFocus === 'none') ? $('alertify-noneFocus') : btnOK), input = $('alertify-text') || undefined;*/
        form = $('alertify-form') || undefined;
        // add placeholder value to the input field
        if (typeof item.placeholder === 'string' && item.placeholder !== '')
          input.value = item.placeholder;
        if (fromQueue)
          this.setFocus();
        this.addListeners(item.callback);
      },
      unbind: function (el, event, fn) {
        if (typeof el.removeEventListener === 'function') {
          el.removeEventListener(event, fn, false);
        } else if (el.detachEvent) {
          el.detachEvent('on' + event, fn);
        }
      }
    };
    // Public API
    return {
      alert: function (message, fn, cssClass) {
        _alertify.dialog(message, 'alert', fn, '', cssClass);
        return this;
      },
      confirm: function (message, fn, cssClass) {
        _alertify.dialog(message, 'confirm', fn, '', cssClass);
        return this;
      },
      extend: _alertify.extend,
      init: _alertify.init,
      log: function (message, type, wait) {
        _alertify.log(message, type, wait);
        return this;
      },
      prompt: function (message, fn, placeholder, cssClass) {
        _alertify.dialog(message, 'prompt', fn, placeholder, cssClass);
        return this;
      },
      success: function (message, wait) {
        _alertify.log(message, 'success', wait);
        return this;
      },
      error: function (message, wait) {
        _alertify.log(message, 'error', wait);
        return this;
      },
      set: function (args) {
        _alertify.set(args);
      },
      labels: _alertify.labels,
      debug: _alertify.handleErrors
    };
  }]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
    $scope.clickSubItem = function (funcName) {
      $scope.funcName();
    };
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  '$location',
  function ($scope, Authentication, $location) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    if (!$scope.authentication.user) {
      $location.path('/signin');
    }
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          if (this.roles.isArray) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          } else if (typeof this.roles === 'string') {
            if (this.roles === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, iconClass, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        iconClass: iconClass,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
angular.module('core').service('Sizer', [
  '$window',
  function ($window) {
    var window = angular.element($window);
    this.updateElementSizeToStrech = function (element, heightToRemove) {
      element.css('height', window.height() - heightToRemove + 'px');
    };
    this.getWindowElement = function () {
      return window;
    };
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  'Alerts',
  function ($scope, $http, $location, Authentication, Alerts) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        // $scope.error = response.message;
        Alerts.error(response.message);
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        Alerts.error(response.message);
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  'Alerts',
  function ($scope, $http, $location, Users, Authentication, Alerts) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      var user = new Users($scope.user);
      $scope.isLoading = true;
      user.$update(function (response) {
        $scope.isLoading = false;
        Alerts.success('Profile Saved Successfully');
        Authentication.user = response;
        $scope.user = Authentication.user;
      }, function (response) {
        Alerts.error(response.data.message);
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [
  '$location',
  function ($location) {
    var _this = this;
    _this._data = { user: window.user };
    _this._data.validateSignin = function () {
      if (!_this._data.user) {
        $location.path('');
      }
    };
    return _this._data;
  }
]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);