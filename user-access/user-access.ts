import { User, DatabaseData, Role, Permission, Activity, PasswordPolicy, SessionSettings, TwoFactorAuth } from '../types';

// User Access Controller
angular.module('cofactrApp')
    .controller('UserAccessController', function($scope: any, $http: any) {
        // Initialize user access data
        $scope.searchQuery = '';
        $scope.selectedRole = '';
        $scope.selectedStatus = '';
        $scope.selectAll = false;
        $scope.users: User[] = [];
        $scope.filteredUsers: User[] = [];
        $scope.totalUsers = 0;
        $scope.activeUsers = 0;
        $scope.pendingUsers = 0;
        $scope.adminUsers = 0;
        $scope.roles: Role[] = [];
        $scope.permissions: Permission[] = [];
        $scope.recentActivity: Activity[] = [];
        $scope.passwordPolicy: PasswordPolicy = {} as PasswordPolicy;
        $scope.sessionSettings: SessionSettings = {} as SessionSettings;
        $scope.twoFactorAuth: TwoFactorAuth = {} as TwoFactorAuth;
        
        // Load data from JSON file
        $scope.loadData = function(): void {
            $http.get('db/db.json')
                .then(function(response: any) {
                    const data: DatabaseData = response.data;
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
                .catch(function(error: any) {
                    console.error('Error loading user access data:', error);
                });
        };
        
        // Process users data
        $scope.processUsers = function(): void {
            $scope.users = $scope.users.map(function(user: User) {
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
        $scope.getRandomRole = function(): string {
            const roles = ['admin', 'manager', 'employee', 'viewer'];
            return roles[Math.floor(Math.random() * roles.length)];
        };
        
        // Get random status
        $scope.getRandomStatus = function(): string {
            const statuses = ['active', 'inactive', 'pending'];
            return statuses[Math.floor(Math.random() * statuses.length)];
        };
        
        // Get random department
        $scope.getRandomDepartment = function(): string {
            const departments = ['Sales', 'Marketing', 'Development', 'Support', 'HR', 'Finance'];
            return departments[Math.floor(Math.random() * departments.length)];
        };
        
        // Get random last login
        $scope.getRandomLastLogin = function(): string {
            const days = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - days);
            return date.toLocaleDateString();
        };
        
        // Get random created date
        $scope.getRandomCreatedDate = function(): string {
            const days = Math.floor(Math.random() * 365);
            const date = new Date();
            date.setDate(date.getDate() - days);
            return date.toLocaleDateString();
        };
        
        // Calculate statistics
        $scope.calculateStats = function(): void {
            $scope.totalUsers = $scope.users.length;
            $scope.activeUsers = $scope.users.filter(function(user: User) {
                return user.status === 'active';
            }).length;
            $scope.pendingUsers = $scope.users.filter(function(user: User) {
                return user.status === 'pending';
            }).length;
            $scope.adminUsers = $scope.users.filter(function(user: User) {
                return user.role === 'admin';
            }).length;
        };
        
        // Initialize roles
        $scope.initializeRoles = function(): void {
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
        $scope.initializePermissions = function(): void {
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
        $scope.hasPermission = function(role: Role, permission: Permission): boolean {
            const permissionMap: { [key: string]: string[] } = {
                'admin': ['dashboard', 'inventory', 'production', 'orders', 'reports', 'users', 'settings', 'export'],
                'manager': ['dashboard', 'inventory', 'production', 'orders', 'reports', 'export'],
                'employee': ['dashboard', 'inventory', 'production', 'orders'],
                'viewer': ['dashboard', 'reports']
            };
            
            return permissionMap[role.name] && permissionMap[role.name].includes(permission.key);
        };
        
        // Generate recent activity
        $scope.generateRecentActivity = function(): void {
            const activities: Activity[] = [
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
        $scope.initializeSecuritySettings = function(): void {
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
        $scope.filterUsers = function(): void {
            $scope.filteredUsers = $scope.users.filter(function(user: User) {
                const matchesSearch = !$scope.searchQuery || 
                    user.name.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes($scope.searchQuery.toLowerCase());
                
                const matchesRole = !$scope.selectedRole || user.role === $scope.selectedRole;
                const matchesStatus = !$scope.selectedStatus || user.status === $scope.selectedStatus;
                
                return matchesSearch && matchesRole && matchesStatus;
            });
        };
        
        // Toggle select all
        $scope.toggleSelectAll = function(): void {
            $scope.filteredUsers.forEach(function(user: User) {
                user.selected = $scope.selectAll;
            });
        };
        
        // User actions
        $scope.addUser = function(): void {
            console.log('Adding new user...');
            alert('Add User functionality would be implemented here');
        };
        
        $scope.editUser = function(user: User): void {
            console.log('Editing user:', user.name);
            alert('Edit User: ' + user.name);
        };
        
        $scope.viewUser = function(user: User): void {
            console.log('Viewing user:', user.name);
            alert('View User: ' + user.name);
        };
        
        $scope.toggleUserStatus = function(user: User): void {
            user.status = user.status === 'active' ? 'inactive' : 'active';
            $scope.calculateStats();
            console.log('Toggled user status:', user.name, user.status);
        };
        
        $scope.deleteUser = function(user: User): void {
            if (confirm('Are you sure you want to delete ' + user.name + '?')) {
                const index = $scope.users.indexOf(user);
                if (index > -1) {
                    $scope.users.splice(index, 1);
                    $scope.calculateStats();
                    $scope.filterUsers();
                }
            }
        };
        
        $scope.bulkActions = function(): void {
            const selectedUsers = $scope.filteredUsers.filter(function(user: User) {
                return user.selected;
            });
            console.log('Bulk actions for:', selectedUsers.length, 'users');
            alert('Bulk actions for ' + selectedUsers.length + ' users');
        };
        
        $scope.exportUsers = function(): void {
            console.log('Exporting users...');
            alert('Export users functionality would be implemented here');
        };
        
        // Role management
        $scope.editRole = function(role: Role): void {
            console.log('Editing role:', role.name);
            alert('Edit Role: ' + role.name);
        };
        
        $scope.viewPermissions = function(role: Role): void {
            console.log('Viewing permissions for role:', role.name);
            alert('View Permissions for: ' + role.name);
        };
        
        // Security settings
        $scope.editPasswordPolicy = function(): void {
            console.log('Editing password policy...');
            alert('Edit Password Policy functionality would be implemented here');
        };
        
        $scope.editSessionSettings = function(): void {
            console.log('Editing session settings...');
            alert('Edit Session Settings functionality would be implemented here');
        };
        
        $scope.editTwoFactorAuth = function(): void {
            console.log('Editing two-factor authentication...');
            alert('Edit Two-Factor Authentication functionality would be implemented here');
        };
        
        // Initialize user access on load
        $scope.loadData();
    });
