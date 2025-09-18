var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Settings Controller
angular.module('cofactrApp')
    .controller('SettingsController', function ($scope, $http, $timeout) {
    // Initialize settings data
    $scope.activeTab = 'general';
    $scope.settings = {
        company: {
            name: 'Matrix.Shop',
            email: 'contact@matrixshop.com',
            phone: '+1 (555) 123-4567',
            address: '123 Business St, City, State 12345'
        },
        system: {
            timezone: 'EST',
            dateFormat: 'MM/DD/YYYY',
            currency: 'USD'
        },
        notifications: {
            email: {
                newOrders: true,
                lowStock: true,
                payments: true,
                reports: false
            },
            push: {
                enabled: true,
                sound: true
            }
        },
        security: {
            twoFactor: false,
            sessionTimeout: true
        },
        appearance: {
            theme: 'light',
            fontSize: 'medium',
            compactMode: false,
            showAnimations: true
        },
        integrations: {
            paypal: {
                enabled: false,
                clientId: '',
                secret: ''
            },
            stripe: {
                enabled: true,
                publishableKey: '',
                secretKey: ''
            },
            fedex: {
                enabled: false
            },
            ups: {
                enabled: false
            }
        }
    };
    // Password form
    $scope.passwordForm = {
        current: '',
        new: '',
        confirm: ''
    };
    // Login history
    $scope.loginHistory = [
        {
            time: '2024-01-15 10:30 AM',
            ip: '192.168.1.100',
            location: 'New York, NY',
            status: 'success'
        },
        {
            time: '2024-01-14 2:15 PM',
            ip: '192.168.1.100',
            location: 'New York, NY',
            status: 'success'
        },
        {
            time: '2024-01-13 9:45 AM',
            ip: '10.0.0.50',
            location: 'Remote',
            status: 'success'
        }
    ];
    // Set active tab
    $scope.setActiveTab = function (tab) {
        $scope.activeTab = tab;
    };
    // Set theme
    $scope.setTheme = function (theme) {
        $scope.settings.appearance.theme = theme;
        applyTheme(theme);
    };
    // Apply theme to the application
    function applyTheme(theme) {
        var body = document.body;
        body.classList.remove('light-theme', 'dark-theme', 'auto-theme');
        body.classList.add(theme + '-theme');
        // Store theme preference
        localStorage.setItem('theme', theme);
    }
    // Toggle integration
    $scope.toggleIntegration = function (integration) {
        $scope.settings.integrations[integration].enabled = !$scope.settings.integrations[integration].enabled;
    };
    // Change password
    $scope.changePassword = function () {
        if (!$scope.passwordForm.current || !$scope.passwordForm.new || !$scope.passwordForm.confirm) {
            showNotification('Please fill in all password fields', 'error');
            return;
        }
        if ($scope.passwordForm.new !== $scope.passwordForm.confirm) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        if ($scope.passwordForm.new.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return;
        }
        // Simulate password change
        $timeout(function () {
            showNotification('Password changed successfully', 'success');
            $scope.passwordForm = {
                current: '',
                new: '',
                confirm: ''
            };
        }, 1000);
    };
    // Save settings
    $scope.saveSettings = function () {
        // Save to localStorage
        localStorage.setItem('appSettings', JSON.stringify($scope.settings));
        // Show success message
        showNotification('Settings saved successfully', 'success');
        // Apply theme if changed
        applyTheme($scope.settings.appearance.theme);
    };
    // Reset settings
    $scope.resetSettings = function () {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            // Reset to default values
            $scope.settings = {
                company: {
                    name: 'Matrix.Shop',
                    email: 'contact@matrixshop.com',
                    phone: '+1 (555) 123-4567',
                    address: '123 Business St, City, State 12345'
                },
                system: {
                    timezone: 'EST',
                    dateFormat: 'MM/DD/YYYY',
                    currency: 'USD'
                },
                notifications: {
                    email: {
                        newOrders: true,
                        lowStock: true,
                        payments: true,
                        reports: false
                    },
                    push: {
                        enabled: true,
                        sound: true
                    }
                },
                security: {
                    twoFactor: false,
                    sessionTimeout: true
                },
                appearance: {
                    theme: 'light',
                    fontSize: 'medium',
                    compactMode: false,
                    showAnimations: true
                },
                integrations: {
                    paypal: {
                        enabled: false,
                        clientId: '',
                        secret: ''
                    },
                    stripe: {
                        enabled: true,
                        publishableKey: '',
                        secretKey: ''
                    },
                    fedex: {
                        enabled: false
                    },
                    ups: {
                        enabled: false
                    }
                }
            };
            // Apply default theme
            applyTheme('light');
            showNotification('Settings reset to defaults', 'success');
        }
    };
    // Show notification
    function showNotification(message, type) {
        // Create notification element
        var notification = document.createElement('div');
        notification.className = "notification notification-".concat(type);
        notification.innerHTML = "\n                <i class=\"fas fa-".concat(type === 'success' ? 'check-circle' : 'exclamation-circle', "\"></i>\n                <span>").concat(message, "</span>\n            ");
        // Add to page
        document.body.appendChild(notification);
        // Show notification
        $timeout(function () {
            notification.classList.add('show');
        }, 100);
        // Hide and remove notification
        $timeout(function () {
            notification.classList.remove('show');
            $timeout(function () {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    // Load settings from localStorage
    function loadSettings() {
        var savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            try {
                var parsedSettings = JSON.parse(savedSettings);
                $scope.settings = __assign(__assign({}, $scope.settings), parsedSettings);
                // Apply saved theme
                applyTheme($scope.settings.appearance.theme);
            }
            catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }
    // Initialize settings
    loadSettings();
    // Watch for settings changes to auto-save
    $scope.$watch('settings', function (newSettings, oldSettings) {
        var _a;
        if (oldSettings && newSettings !== oldSettings) {
            // Auto-save certain settings
            if (newSettings.appearance && newSettings.appearance.theme !== ((_a = oldSettings.appearance) === null || _a === void 0 ? void 0 : _a.theme)) {
                applyTheme(newSettings.appearance.theme);
            }
        }
    }, true);
});
