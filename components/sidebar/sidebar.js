// Sidebar Component Controller
angular.module('cofactrApp')
    .controller('SidebarController', function($scope, $location, $rootScope) {
        
        // Initialize active item based on current route
        $scope.activeItem = $location.path() || '/dashboard';
        $scope.sidebarVisible = false; // Start closed on mobile
        $scope.isMobile = window.innerWidth <= 768;
        
        // Ensure active state is properly set on initialization
        if (!$scope.activeItem || $scope.activeItem === '/') {
            $scope.activeItem = '/dashboard';
        }
        
        // Listen for sidebar toggle events
        $rootScope.$on('toggleSidebar', function(event, visible) {
            $scope.sidebarVisible = visible !== undefined ? visible : !$scope.sidebarVisible;
        });
        
        // Close sidebar function
        $scope.closeSidebar = function() {
            $scope.sidebarVisible = false;
            $rootScope.$broadcast('toggleSidebar', false);
        };
        
        // Set active item when clicked
        $scope.setActiveItem = function(path) {
            $scope.activeItem = path;
            $location.path(path);
            // Force route change
            $scope.$apply();
        };
        
        // Check if current path is active
        $scope.isActive = function(path) {
            var currentPath = $location.path();
            return $scope.activeItem === path || currentPath === path;
        };
        
        // Handle search functionality
        $scope.onSearch = function(query) {
            if (query && query.length > 2) {
                // Emit search event to parent scope
                $rootScope.$broadcast('searchPerformed', query);
            }
        };
        
        // Listen for route changes to update active state
        $scope.$on('$routeChangeSuccess', function() {
            $scope.activeItem = $location.path();
            console.log('Route changed to:', $scope.activeItem);
            // Force digest cycle to update the view
            $scope.$apply();
        });
        
        // Menu items configuration
        $scope.menuItems = [
            {
                path: '/dashboard',
                icon: 'fas fa-th-large',
                label: 'Dashboard'
            },
            {
                path: '/inventory',
                icon: 'fas fa-box',
                label: 'Inventory'
            },
            {
                path: '/production',
                icon: 'fas fa-industry',
                label: 'Production'
            },
            {
                path: '/orders',
                icon: 'fas fa-shopping-cart',
                label: 'Orders'
            },
            {
                path: '/reports',
                icon: 'fas fa-chart-bar',
                label: 'Reports'
            },
            {
                path: '/user-access',
                icon: 'fas fa-users',
                label: 'User Access'
            },
            {
                path: '/support',
                icon: 'fas fa-exclamation-circle',
                label: 'Support'
            },
            {
                path: '/settings',
                icon: 'fas fa-cog',
                label: 'Setting'
            }
        ];
    });
