// Angular App Configuration
angular.module('cofactrApp', ['ngRoute'])
    .controller('AppController', function($scope, $rootScope, $window) {
        // Main app controller for global functionality
        $scope.isMobile = $window.innerWidth <= 768;
        $scope.sidebarVisible = !$scope.isMobile; // Show on desktop, hide on mobile
        
        // Listen for sidebar toggle events
        $rootScope.$on('toggleSidebar', function(event, visible) {
            $scope.sidebarVisible = visible !== undefined ? visible : !$scope.sidebarVisible;
            
            // Remove overlay when closing sidebar
            if (!$scope.sidebarVisible) {
                var overlay = document.querySelector('.sidebar-overlay');
                if (overlay && document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }
        });
        
        // Listen for search events
        $rootScope.$on('searchPerformed', function(event, query) {
            console.log('Search performed:', query);
            // Implement global search functionality
        });
        
        // Handle window resize
        angular.element($window).bind('resize', function() {
            $scope.$apply(function() {
                var wasMobile = $scope.isMobile;
                $scope.isMobile = $window.innerWidth <= 768;
                
                // If switching from mobile to desktop
                if (wasMobile && !$scope.isMobile) {
                    $scope.sidebarVisible = true;
                    // Remove any overlay on desktop
                    var overlay = document.querySelector('.sidebar-overlay');
                    if (overlay && document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                }
                // If switching from desktop to mobile
                else if (!wasMobile && $scope.isMobile) {
                    $scope.sidebarVisible = false;
                }
            });
        });
        
        // Close sidebar on route change for mobile
        $rootScope.$on('$routeChangeStart', function() {
            if ($scope.isMobile) {
                $scope.sidebarVisible = false;
                var overlay = document.querySelector('.sidebar-overlay');
                if (overlay) {
                    document.body.removeChild(overlay);
                }
            }
        });
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/orders', {
                templateUrl: 'orders/orders.html',
                controller: 'OrdersController'
            })
            .when('/dashboard', {
                templateUrl: 'dashboard/dashboard.html',
                controller: 'DashboardController'
            })
            .when('/inventory', {
                template: '<div class="page-content"><h1>Inventory</h1><p>Inventory content goes here</p></div>'
            })
            .when('/production', {
                template: '<div class="page-content"><h1>Production</h1><p>Production content goes here</p></div>'
            })
            .when('/reports', {
                template: '<div class="page-content"><h1>Reports</h1><p>Reports content goes here</p></div>'
            })
            .when('/user-access', {
                template: '<div class="page-content"><h1>User Access</h1><p>User Access content goes here</p></div>'
            })
            .when('/support', {
                template: '<div class="page-content"><h1>Support</h1><p>Support content goes here</p></div>'
            })
            .when('/settings', {
                template: '<div class="page-content"><h1>Settings</h1><p>Settings content goes here</p></div>'
            })
            .otherwise({
                redirectTo: '/orders'
            });
    });
