// Header Component Controller
angular.module('cofactrApp')
    .controller('HeaderController', function ($scope, $rootScope, $window) {
    // Initialize header data
    $scope.messageCount = 2;
    $scope.notificationCount = 6;
    $scope.showUserMenu = false;
    $scope.isMobile = false;
    $scope.pageTitle = '';
    $scope.sidebarVisible = false;
    // User profile data
    $scope.userProfile;
    UserProfile = {
        name: 'John Doe',
        email: 'john.doe@matrix.shop',
        image: null, // This will use the person.svg placeholder
        role: 'Administrator'
    };
    // Check if mobile device
    $scope.checkMobile = function () {
        $scope.isMobile = $window.innerWidth <= 768;
    };
    // Initialize mobile check
    $scope.checkMobile();
    // Listen for window resize
    angular.element($window).bind('resize', function () {
        $scope.$apply(function () {
            $scope.checkMobile();
        });
    });
    // Toggle sidebar for mobile
    $scope.toggleSidebar = function () {
        $scope.sidebarVisible = !$scope.sidebarVisible;
        $rootScope.$broadcast('toggleSidebar', $scope.sidebarVisible);
        // Add overlay for mobile when opening
        if ($scope.isMobile && $scope.sidebarVisible) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay active';
            overlay.onclick = function () {
                $scope.$apply(function () {
                    $scope.sidebarVisible = false;
                    $rootScope.$broadcast('toggleSidebar', false);
                });
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            };
            document.body.appendChild(overlay);
        }
        else if ($scope.isMobile && !$scope.sidebarVisible) {
            // Remove overlay when closing
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay && document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }
    };
    // Open messages
    $scope.openMessages = function () {
        console.log('Opening messages...');
        // Implement messages functionality
        $rootScope.$broadcast('openMessages');
    };
    // Open notifications
    $scope.openNotifications = function () {
        console.log('Opening notifications...');
        // Implement notifications functionality
        $rootScope.$broadcast('openNotifications');
    };
    // Toggle user menu
    $scope.toggleUserMenu = function () {
        $scope.showUserMenu = !$scope.showUserMenu;
    };
    // Close user menu when clicking outside
    $scope.$on('$locationChangeStart', function () {
        $scope.showUserMenu = false;
    });
    // User menu actions
    $scope.viewProfile = function () {
        console.log('Viewing profile...');
        $scope.showUserMenu = false;
        $rootScope.$broadcast('viewProfile');
    };
    $scope.openSettings = function () {
        console.log('Opening settings...');
        $scope.showUserMenu = false;
        $rootScope.$broadcast('openSettings');
    };
    $scope.logout = function () {
        console.log('Logging out...');
        $scope.showUserMenu = false;
        $rootScope.$broadcast('logout');
    };
    // Listen for page title changes
    $scope.$on('pageTitleChanged', function (event, title) {
        $scope.pageTitle = title;
    });
    // Listen for notification updates
    $scope.$on('updateNotifications', function (event, data) {
        if (data.messages !== undefined) {
            $scope.messageCount = data.messages;
        }
        if (data.notifications !== undefined) {
            $scope.notificationCount = data.notifications;
        }
    });
    // Close dropdown when clicking outside
    angular.element(document).bind('click', function (event) {
        if (!angular.element(event.target).closest('.user-profile').length) {
            $scope.$apply(function () {
                $scope.showUserMenu = false;
            });
        }
    });
});
export {};
//# sourceMappingURL=header.js.map