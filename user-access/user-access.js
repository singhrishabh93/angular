// User Access Controller
angular.module('cofactrApp')
    .controller('UserAccessController', function($scope, $http) {
        // Initialize user access data
        $scope.searchQuery = '';
        $scope.selectedRole = '';
        $scope.selectedStatus = '';
        $scope.selectAll = false;
        $scope.users = [];
        $scope.filteredUsers = [];
        $scope.totalUsers = 0;
        $scope.activeUsers = 0;
        $scope.pendingUsers = 0;
        $scope.adminUsers = 0;
        $scope.roles = [];
        $scope.permissions = [];
        $scope.recentActivity = [];
        $scope.passwordPolicy = {};
        $scope.sessionSettings = {};
        $scope.twoFactorAuth = {};
        
        // Load data from JSON file
        $scope.loadData = function() {
            $http.get('db/db.json')
                .then(function(response) {
                    var data = response.data;
                    $scope.users = data.users || [];
                    
                    // Process users data
                    $scope.processUsers();
                    $scope.calculateStats();
                    $scope.initializeRoles();
                    $scope.initializePermissions();
                    $scope.generateRecentActivity();
                    $scope.initializeSecuritySettings();
                    $scope.filterUsers();
                })
                .catch(function(error) {
                    console.error('Error loading user access data:', error);
                });
        };
        
        // Process users data
        $scope.processUsers = function() {
            $scope.users = $scope.users.map(function(user) {
                return {
                    id: user.id,
                    name: user.Name,
                    email: user.Email || 'user' + user.id + '@matrix.shop',
                    role: $scope.getRandomRole(),
                    status: $scope.getRandomStatus(),
                    department: $scope.getRandomDepartment(),
                    avatar: user.avatar || null,
                    lastLogin: $scope.getRandomLastLogin(),
                    createdDate: $scope.getRandomCreatedDate(),
                    selected: false
                };
            });
        };
        
        // Get random role
        $scope.getRandomRole = function() {
            var roles = ['admin', 'manager', 'employee', 'viewer'];
            return roles[Math.floor(Math.random() * roles.length)];
        };
        
        // Get random status
        $scope.getRandomStatus = function() {
            var statuses = ['active', 'inactive', 'pending'];
            return statuses[Math.floor(Math.random() * statuses.length)];
        };
        
        // Get random department
        $scope.getRandomDepartment = function() {
            var departments = ['Sales', 'Marketing', 'Development', 'Support', 'HR', 'Finance'];
            return departments[Math.floor(Math.random() * departments.length)];
        };
        
        // Get random last login
        $scope.getRandomLastLogin = function() {
            var days = Math.floor(Math.random() * 30);
            var date = new Date();
            date.setDate(date.getDate() - days);
            return date.toLocaleDateString();
        };
        
        // Get random created date
        $scope.getRandomCreatedDate = function() {
            var days = Math.floor(Math.random() * 365);
            var date = new Date();
            date.setDate(date.getDate() - days);
            return date.toLocaleDateString();
        };
        
        // Calculate statistics
        $scope.calculateStats = function() {
            $scope.totalUsers = $scope.users.length;
            $scope.activeUsers = $scope.users.filter(function(user) {
                return user.status === 'active';
            }).length;
            $scope.pendingUsers = $scope.users.filter(function(user) {
                return user.status === 'pending';
            }).length;
            $scope.adminUsers = $scope.users.filter(function(user) {
                return user.role === 'admin';
            }).length;
        };
        
        // Initialize roles
        $scope.initializeRoles = function() {
            $scope.roles = [
                {
                    name: 'admin',
                    description: 'Full system access and user management',
                    icon: 'fa-shield-alt',
                    userCount: $scope.adminUsers,
                    permissions: ['read', 'write', 'delete', 'admin']
                },
                {
                    name: 'manager',
                    description: 'Department management and reporting',
                    icon: 'fa-user-tie',
                    userCount: $scope.users.filter(u => u.role === 'manager').length,
                    permissions: ['read', 'write', 'report']
                },
                {
                    name: 'employee',
                    description: 'Standard user access',
                    icon: 'fa-user',
                    userCount: $scope.users.filter(u => u.role === 'employee').length,
                    permissions: ['read', 'write']
                },
                {
                    name: 'viewer',
                    description: 'Read-only access',
                    icon: 'fa-eye',
                    userCount: $scope.users.filter(u => u.role === 'viewer').length,
                    permissions: ['read']
                }
            ];
        };
        
        // Initialize permissions
        $scope.initializePermissions = function() {
            $scope.permissions = [
                { name: 'Dashboard Access', key: 'dashboard' },
                { name: 'Inventory Management', key: 'inventory' },
                { name: 'Production Control', key: 'production' },
                { name: 'Order Management', key: 'orders' },
                { name: 'Reports & Analytics', key: 'reports' },
                { name: 'User Management', key: 'users' },
                { name: 'System Settings', key: 'settings' },
                { name: 'Data Export', key: 'export' }
            ];
        };
        
        // Check if role has permission
        $scope.hasPermission = function(role, permission) {
            var permissionMap = {
                'admin': ['dashboard', 'inventory', 'production', 'orders', 'reports', 'users', 'settings', 'export'],
                'manager': ['dashboard', 'inventory', 'production', 'orders', 'reports', 'export'],
                'employee': ['dashboard', 'inventory', 'production', 'orders'],
                'viewer': ['dashboard', 'reports']
            };
            
            return permissionMap[role.name] && permissionMap[role.name].includes(permission.key);
        };
        
        // Generate recent activity
        $scope.generateRecentActivity = function() {
            var activities = [
                {
                    type: 'login',
                    icon: 'fa-sign-in-alt',
                    title: 'User Login',
                    description: 'User logged into the system',
                    user: $scope.users[0],
                    timestamp: '2 minutes ago'
                },
                {
                    type: 'create',
                    icon: 'fa-user-plus',
                    title: 'New User Created',
                    description: 'New user account was created',
                    user: $scope.users[1],
                    timestamp: '1 hour ago'
                },
                {
                    type: 'update',
                    icon: 'fa-edit',
                    title: 'User Updated',
                    description: 'User profile was updated',
                    user: $scope.users[2],
                    timestamp: '3 hours ago'
                },
                {
                    type: 'delete',
                    icon: 'fa-trash',
                    title: 'User Deleted',
                    description: 'User account was removed',
                    user: $scope.users[3],
                    timestamp: '1 day ago'
                }
            ];
            
            $scope.recentActivity = activities;
        };
        
        // Initialize security settings
        $scope.initializeSecuritySettings = function() {
            $scope.passwordPolicy = {
                minLength: 8,
                requireSpecial: true,
                expiryDays: 90
            };
            
            $scope.sessionSettings = {
                timeout: 30,
                maxConcurrent: 3,
                rememberMe: true
            };
            
            $scope.twoFactorAuth = {
                required: false,
                smsEnabled: true,
                appEnabled: true
            };
        };
        
        // Filter users
        $scope.filterUsers = function() {
            $scope.filteredUsers = $scope.users.filter(function(user) {
                var matchesSearch = !$scope.searchQuery || 
                    user.name.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes($scope.searchQuery.toLowerCase());
                
                var matchesRole = !$scope.selectedRole || user.role === $scope.selectedRole;
                var matchesStatus = !$scope.selectedStatus || user.status === $scope.selectedStatus;
                
                return matchesSearch && matchesRole && matchesStatus;
            });
        };
        
        // Toggle select all
        $scope.toggleSelectAll = function() {
            $scope.filteredUsers.forEach(function(user) {
                user.selected = $scope.selectAll;
            });
        };
        
        // User actions
        $scope.addUser = function() {
            console.log('Adding new user...');
            alert('Add User functionality would be implemented here');
        };
        
        $scope.editUser = function(user) {
            console.log('Editing user:', user.name);
            alert('Edit User: ' + user.name);
        };
        
        $scope.viewUser = function(user) {
            console.log('Viewing user:', user.name);
            alert('View User: ' + user.name);
        };
        
        $scope.toggleUserStatus = function(user) {
            user.status = user.status === 'active' ? 'inactive' : 'active';
            $scope.calculateStats();
            console.log('Toggled user status:', user.name, user.status);
        };
        
        $scope.deleteUser = function(user) {
            if (confirm('Are you sure you want to delete ' + user.name + '?')) {
                var index = $scope.users.indexOf(user);
                if (index > -1) {
                    $scope.users.splice(index, 1);
                    $scope.calculateStats();
                    $scope.filterUsers();
                }
            }
        };
        
        $scope.bulkActions = function() {
            var selectedUsers = $scope.filteredUsers.filter(function(user) {
                return user.selected;
            });
            console.log('Bulk actions for:', selectedUsers.length, 'users');
            alert('Bulk actions for ' + selectedUsers.length + ' users');
        };
        
        $scope.exportUsers = function() {
            console.log('Exporting users...');
            alert('Export users functionality would be implemented here');
        };
        
        // Role management
        $scope.editRole = function(role) {
            console.log('Editing role:', role.name);
            alert('Edit Role: ' + role.name);
        };
        
        $scope.viewPermissions = function(role) {
            console.log('Viewing permissions for role:', role.name);
            alert('View Permissions for: ' + role.name);
        };
        
        // Security settings
        $scope.editPasswordPolicy = function() {
            console.log('Editing password policy...');
            alert('Edit Password Policy functionality would be implemented here');
        };
        
        $scope.editSessionSettings = function() {
            console.log('Editing session settings...');
            alert('Edit Session Settings functionality would be implemented here');
        };
        
        $scope.editTwoFactorAuth = function() {
            console.log('Editing two-factor authentication...');
            alert('Edit Two-Factor Authentication functionality would be implemented here');
        };
        
        // Initialize user access on load
        $scope.loadData();
    });
