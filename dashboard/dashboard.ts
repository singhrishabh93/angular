import { DashboardMetrics, User, Product, Order, DatabaseData } from '../types';

// Dashboard Controller
angular.module('cofactrApp')
    .controller('DashboardController', function($scope: any, $http: any) {
        // Initialize dashboard data
        $scope.totalOrders = 0;
        $scope.totalRevenue = 0;
        $scope.totalUsers = 0;
        $scope.totalProducts = 0;
        $scope.recentOrders: Order[] = [];
        $scope.topProducts: Product[] = [];
        $scope.averageOrderValue = 0;
        $scope.ordersThisMonth = 0;
        $scope.pendingPayments = 0;
        $scope.deliveredOrders = 0;
        $scope.users: User[] = [];
        $scope.products: Product[] = [];
        $scope.orders: Order[] = [];
        
        // Load data from JSON file
        $scope.loadData = function(): void {
            $http.get('db/db.json')
                .then(function(response: any) {
                    const data: DatabaseData = response.data;
                    $scope.users = data.users || [];
                    $scope.products = data.ProductsList || [];
                    $scope.orders = data.OrdersList || [];
                    
                    // Calculate metrics
                    $scope.calculateMetrics();
                    $scope.getRecentOrders();
                    $scope.getTopProducts();
                    $scope.initializeCharts();
                })
                .catch(function(error: any) {
                    console.error('Error loading data:', error);
                });
        };
        
        // Calculate key metrics
        $scope.calculateMetrics = function(): void {
            $scope.totalOrders = $scope.orders.length;
            $scope.totalUsers = $scope.users.length;
            $scope.totalProducts = $scope.products.length;
            
            // Calculate total revenue
            $scope.totalRevenue = $scope.orders.reduce(function(sum: number, order: Order) {
                return sum + (order.totalPrice || 0);
            }, 0);
            
            // Calculate average order value
            $scope.averageOrderValue = $scope.totalOrders > 0 ? $scope.totalRevenue / $scope.totalOrders : 0;
            
            // Calculate orders this month
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            $scope.ordersThisMonth = $scope.orders.filter(function(order: Order) {
                const orderDate = new Date(order.orderDate);
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
            }).length;
            
            // Calculate pending payments
            $scope.pendingPayments = $scope.orders.filter(function(order: Order) {
                return order.paymentStatus === 'Pending';
            }).length;
            
            // Calculate delivered orders
            $scope.deliveredOrders = $scope.orders.filter(function(order: Order) {
                return order.orderStatus === 'Delivered';
            }).length;
        };
        
        // Get recent orders (last 5)
        $scope.getRecentOrders = function(): void {
            $scope.recentOrders = $scope.orders
                .sort(function(a: Order, b: Order) {
                    return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
                })
                .slice(0, 5);
        };
        
        // Get top products (by sales count)
        $scope.getTopProducts = function(): void {
            const productSales: { [key: number]: number } = {};
            
            // Count sales for each product
            $scope.orders.forEach(function(order: Order) {
                if (order.products) {
                    order.products.forEach(function(item: any) {
                        if (!productSales[item.productId]) {
                            productSales[item.productId] = 0;
                        }
                        productSales[item.productId] += item.quantity;
                    });
                }
            });
            
            // Get top 4 products
            $scope.topProducts = $scope.products
                .map(function(product: Product) {
                    return {
                        ...product,
                        salesCount: productSales[product.id] || 0
                    };
                })
                .sort(function(a: any, b: any) {
                    return b.salesCount - a.salesCount;
                })
                .slice(0, 4);
        };
        
        // Get user by ID
        $scope.getUserById = function(userId: number): User {
            return $scope.users.find(function(user: User) {
                return user.id === userId;
            }) || { id: 0, Name: 'Unknown User' };
        };
        
        // Get product sales count
        $scope.getProductSales = function(productId: number): number {
            let sales = 0;
            $scope.orders.forEach(function(order: Order) {
                if (order.products) {
                    order.products.forEach(function(item: any) {
                        if (item.productId === productId) {
                            sales += item.quantity;
                        }
                    });
                }
            });
            return sales;
        };
        
        // Get status class for styling
        $scope.getStatusClass = function(status: string): string {
            switch(status) {
                case 'Delivered': return 'status-delivered';
                case 'Shipped': return 'status-shipped';
                case 'Processing': return 'status-processing';
                case 'Confirmed': return 'status-confirmed';
                default: return 'status-default';
            }
        };
        
        // Initialize charts
        $scope.initializeCharts = function(): void {
            // Revenue chart
            const revenueCtx = document.getElementById('revenueChart');
            if (revenueCtx) {
                $scope.createRevenueChart(revenueCtx);
            }
            
            // Status chart
            const statusCtx = document.getElementById('statusChart');
            if (statusCtx) {
                $scope.createStatusChart(statusCtx);
            }
        };
        
        // Create revenue chart
        $scope.createRevenueChart = function(ctx: HTMLCanvasElement): void {
            // Simple chart implementation using canvas
            const canvas = ctx;
            const context = canvas.getContext('2d');
            
            if (!context) return;
            
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Sample data for demonstration
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            const revenues = [1200, 1500, 1800, 1600, 2000, $scope.totalRevenue / 1000];
            
            // Draw simple bar chart
            const barWidth = canvas.width / months.length;
            const maxRevenue = Math.max(...revenues);
            
            context.fillStyle = '#4CAF50';
            months.forEach(function(month: string, index: number) {
                const barHeight = (revenues[index] / maxRevenue) * (canvas.height - 40);
                const x = index * barWidth + 10;
                const y = canvas.height - barHeight - 20;
                
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
        $scope.createStatusChart = function(ctx: HTMLCanvasElement): void {
            const canvas = ctx;
            const context = canvas.getContext('2d');
            
            if (!context) return;
            
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate status distribution
            const statusCounts: { [key: string]: number } = {};
            $scope.orders.forEach(function(order: Order) {
                statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
            });
            
            const statuses = Object.keys(statusCounts);
            const counts = Object.values(statusCounts);
            const total = counts.reduce(function(sum: number, count: number) { return sum + count; }, 0);
            
            // Draw pie chart
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20;
            let startAngle = 0;
            
            const colors = ['#4CAF50', '#FF9800', '#2196F3', '#F44336', '#9C27B0'];
            
            statuses.forEach(function(status: string, index: number) {
                const sliceAngle = (counts[index] / total) * 2 * Math.PI;
                
                context.beginPath();
                context.moveTo(centerX, centerY);
                context.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                context.closePath();
                context.fillStyle = colors[index % colors.length];
                context.fill();
                
                // Draw label
                const labelAngle = startAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
                const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
                
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
