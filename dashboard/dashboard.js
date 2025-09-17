// Dashboard Controller
angular.module('cofactrApp')
    .controller('DashboardController', function($scope, $http) {
        // Initialize dashboard data
        $scope.totalOrders = 0;
        $scope.totalRevenue = 0;
        $scope.totalUsers = 0;
        $scope.totalProducts = 0;
        $scope.recentOrders = [];
        $scope.topProducts = [];
        $scope.averageOrderValue = 0;
        $scope.ordersThisMonth = 0;
        $scope.pendingPayments = 0;
        $scope.deliveredOrders = 0;
        $scope.users = [];
        $scope.products = [];
        $scope.orders = [];
        
        // Load data from JSON file
        $scope.loadData = function() {
            $http.get('db/db.json')
                .then(function(response) {
                    var data = response.data;
                    $scope.users = data.users || [];
                    $scope.products = data.ProductsList || [];
                    $scope.orders = data.OrdersList || [];
                    
                    // Calculate metrics
                    $scope.calculateMetrics();
                    $scope.getRecentOrders();
                    $scope.getTopProducts();
                    $scope.initializeCharts();
                })
                .catch(function(error) {
                    console.error('Error loading data:', error);
                });
        };
        
        // Calculate key metrics
        $scope.calculateMetrics = function() {
            $scope.totalOrders = $scope.orders.length;
            $scope.totalUsers = $scope.users.length;
            $scope.totalProducts = $scope.products.length;
            
            // Calculate total revenue
            $scope.totalRevenue = $scope.orders.reduce(function(sum, order) {
                return sum + (order.totalPrice || 0);
            }, 0);
            
            // Calculate average order value
            $scope.averageOrderValue = $scope.totalOrders > 0 ? $scope.totalRevenue / $scope.totalOrders : 0;
            
            // Calculate orders this month
            var currentMonth = new Date().getMonth();
            var currentYear = new Date().getFullYear();
            $scope.ordersThisMonth = $scope.orders.filter(function(order) {
                var orderDate = new Date(order.orderDate);
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
            }).length;
            
            // Calculate pending payments
            $scope.pendingPayments = $scope.orders.filter(function(order) {
                return order.paymentStatus === 'Pending';
            }).length;
            
            // Calculate delivered orders
            $scope.deliveredOrders = $scope.orders.filter(function(order) {
                return order.orderStatus === 'Delivered';
            }).length;
        };
        
        // Get recent orders (last 5)
        $scope.getRecentOrders = function() {
            $scope.recentOrders = $scope.orders
                .sort(function(a, b) {
                    return new Date(b.orderDate) - new Date(a.orderDate);
                })
                .slice(0, 5);
        };
        
        // Get top products (by sales count)
        $scope.getTopProducts = function() {
            var productSales = {};
            
            // Count sales for each product
            $scope.orders.forEach(function(order) {
                if (order.products) {
                    order.products.forEach(function(item) {
                        if (!productSales[item.productId]) {
                            productSales[item.productId] = 0;
                        }
                        productSales[item.productId] += item.quantity;
                    });
                }
            });
            
            // Get top 4 products
            $scope.topProducts = $scope.products
                .map(function(product) {
                    return {
                        ...product,
                        salesCount: productSales[product.id] || 0
                    };
                })
                .sort(function(a, b) {
                    return b.salesCount - a.salesCount;
                })
                .slice(0, 4);
        };
        
        // Get user by ID
        $scope.getUserById = function(userId) {
            return $scope.users.find(function(user) {
                return user.id === userId;
            }) || { Name: 'Unknown User' };
        };
        
        // Get product sales count
        $scope.getProductSales = function(productId) {
            var sales = 0;
            $scope.orders.forEach(function(order) {
                if (order.products) {
                    order.products.forEach(function(item) {
                        if (item.productId === productId) {
                            sales += item.quantity;
                        }
                    });
                }
            });
            return sales;
        };
        
        // Get status class for styling
        $scope.getStatusClass = function(status) {
            switch(status) {
                case 'Delivered': return 'status-delivered';
                case 'Shipped': return 'status-shipped';
                case 'Processing': return 'status-processing';
                case 'Confirmed': return 'status-confirmed';
                default: return 'status-default';
            }
        };
        
        // Initialize charts
        $scope.initializeCharts = function() {
            // Revenue chart
            var revenueCtx = document.getElementById('revenueChart');
            if (revenueCtx) {
                $scope.createRevenueChart(revenueCtx);
            }
            
            // Status chart
            var statusCtx = document.getElementById('statusChart');
            if (statusCtx) {
                $scope.createStatusChart(statusCtx);
            }
        };
        
        // Create revenue chart
        $scope.createRevenueChart = function(ctx) {
            // Simple chart implementation using canvas
            var canvas = ctx;
            var context = canvas.getContext('2d');
            
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Sample data for demonstration
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            var revenues = [1200, 1500, 1800, 1600, 2000, $scope.totalRevenue / 1000];
            
            // Draw simple bar chart
            var barWidth = canvas.width / months.length;
            var maxRevenue = Math.max(...revenues);
            
            context.fillStyle = '#4CAF50';
            months.forEach(function(month, index) {
                var barHeight = (revenues[index] / maxRevenue) * (canvas.height - 40);
                var x = index * barWidth + 10;
                var y = canvas.height - barHeight - 20;
                
                context.fillRect(x, y, barWidth - 20, barHeight);
                
                // Draw month labels
                context.fillStyle = '#333';
                context.font = '12px Arial';
                context.textAlign = 'center';
                context.fillText(month, x + (barWidth - 20) / 2, canvas.height - 5);
                context.fillStyle = '#4CAF50';
            });
        };
        
        // Create status chart
        $scope.createStatusChart = function(ctx) {
            var canvas = ctx;
            var context = canvas.getContext('2d');
            
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate status distribution
            var statusCounts = {};
            $scope.orders.forEach(function(order) {
                statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
            });
            
            var statuses = Object.keys(statusCounts);
            var counts = Object.values(statusCounts);
            var total = counts.reduce(function(sum, count) { return sum + count; }, 0);
            
            // Draw pie chart
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var radius = Math.min(centerX, centerY) - 20;
            var startAngle = 0;
            
            var colors = ['#4CAF50', '#FF9800', '#2196F3', '#F44336', '#9C27B0'];
            
            statuses.forEach(function(status, index) {
                var sliceAngle = (counts[index] / total) * 2 * Math.PI;
                
                context.beginPath();
                context.moveTo(centerX, centerY);
                context.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                context.closePath();
                context.fillStyle = colors[index % colors.length];
                context.fill();
                
                // Draw label
                var labelAngle = startAngle + sliceAngle / 2;
                var labelX = centerX + Math.cos(labelAngle) * (radius + 20);
                var labelY = centerY + Math.sin(labelAngle) * (radius + 20);
                
                context.fillStyle = '#333';
                context.font = '12px Arial';
                context.textAlign = 'center';
                context.fillText(status + ' (' + counts[index] + ')', labelX, labelY);
                
                startAngle += sliceAngle;
            });
        };
        
        // Initialize dashboard on load
        $scope.loadData();
    });
