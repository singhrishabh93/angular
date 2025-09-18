// Angular App Configuration
angular.module('cofactrApp', ['ngRoute'])
    .controller('AppController', function($scope: any, $rootScope: any, $window: any) {
        // Main app controller for global functionality
        $scope.isMobile = $window.innerWidth <= 768;
        $scope.sidebarVisible = !$scope.isMobile; // Show on desktop, hide on mobile
        
        // Listen for sidebar toggle events
        $rootScope.$on('toggleSidebar', function(event: any, visible: boolean) {
            $scope.sidebarVisible = visible !== undefined ? visible : !$scope.sidebarVisible;
            
            // Remove overlay when closing sidebar
            if (!$scope.sidebarVisible) {
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay && document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }
        });
        
        // Listen for search events
        $rootScope.$on('searchPerformed', function(event: any, query: string) {
            console.log('Search performed:', query);
            // Implement global search functionality
        });
        
        // Handle window resize
        angular.element($window).bind('resize', function() {
            $scope.$apply(function() {
                const wasMobile = $scope.isMobile;
                $scope.isMobile = $window.innerWidth <= 768;
                
                // If switching from mobile to desktop
                if (wasMobile && !$scope.isMobile) {
                    $scope.sidebarVisible = true;
                    // Remove any overlay on desktop
                    const overlay = document.querySelector('.sidebar-overlay');
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
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) {
                    document.body.removeChild(overlay);
                }
            }
        });
    })
    .config(function($routeProvider: any, $locationProvider: any) {
        // Configure hash prefix to use single # instead of #!
        $locationProvider.hashPrefix('');
        
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
                templateUrl: 'inventory/inventory.html',
                controller: 'InventoryController'
            })
            .when('/production', {
                templateUrl: 'production/production.html',
                controller: 'ProductionController'
            })
            .when('/reports', {
                templateUrl: 'reports/reports.html',
                controller: 'ReportsController'
            })
            .when('/user-access', {
                templateUrl: 'user-access/user-access.html',
                controller: 'UserAccessController'
            })
            .when('/support', {
                templateUrl: 'support/support.html',
                controller: 'SupportController'
            })
            .when('/settings', {
                templateUrl: 'settings/settings.html',
                controller: 'SettingsController'
            })
            .otherwise({
                redirectTo: '/dashboard'
            });
    });
