import { Product, Order, DatabaseData, ProductionMetrics, ProductionStatus, ProductionSchedule } from '../types';

// Production Controller
angular.module('cofactrApp')
    .controller('ProductionController', function($scope: any, $http: any) {
        // Initialize production data
        $scope.totalProducts = 0;
        $scope.totalOrders = 0;
        $scope.totalRevenue = 0;
        $scope.averageProductionTime = 0;
        $scope.activeOrders: Order[] = [];
        $scope.products: Product[] = [];
        $scope.orders: Order[] = [];
        $scope.productionStatuses: ProductionStatus[] = [];
        $scope.defectRate = 0;
        $scope.qualityScore = 0;
        $scope.reworkRate = 0;
        $scope.machineUtilization = 0;
        $scope.workforceEfficiency = 0;
        $scope.productionSchedule: ProductionSchedule[] = [];
        
        // Load data from JSON file
        $scope.loadData = function(): void {
            $http.get('db/db.json')
                .then(function(response: any) {
                    const data: DatabaseData = response.data;
                    $scope.products = data.ProductsList || [];
                    $scope.orders = data.OrdersList || [];
                    
                    // Calculate production metrics
                    $scope.calculateProductionMetrics();
                    $scope.getActiveOrders();
                    $scope.calculateProductionStatuses();
                    $scope.generateProductionSchedule();
                    $scope.initializeCharts();
                })
                .catch(function(error: any) {
                    console.error('Error loading production data:', error);
                });
        };
        
        // Calculate production metrics
        $scope.calculateProductionMetrics = function(): void {
            $scope.totalProducts = $scope.products.length;
            $scope.totalOrders = $scope.orders.length;
            
            // Calculate total revenue from orders
            $scope.totalRevenue = $scope.orders.reduce(function(sum: number, order: Order) {
                return sum + (order.totalPrice || 0);
            }, 0);
            
            // Calculate average production time (simulated based on order complexity)
            const totalProductionTime = $scope.orders.reduce(function(sum: number, order: Order) {
                const complexity = order.products ? order.products.length : 1;
                return sum + (complexity * 2); // 2 hours per product
            }, 0);
            $scope.averageProductionTime = $scope.totalOrders > 0 ? 
                Math.round(totalProductionTime / $scope.totalOrders) : 0;
            
            // Calculate quality metrics (simulated)
            $scope.defectRate = Math.round(Math.random() * 5 + 1); // 1-6%
            $scope.qualityScore = Math.round(Math.random() * 20 + 80); // 80-100
            $scope.reworkRate = Math.round(Math.random() * 3 + 1); // 1-4%
            
            // Calculate resource utilization (simulated)
            $scope.machineUtilization = Math.round(Math.random() * 30 + 70); // 70-100%
            $scope.workforceEfficiency = Math.round(Math.random() * 25 + 75); // 75-100%
        };
        
        // Get active production orders
        $scope.getActiveOrders = function(): void {
            $scope.activeOrders = $scope.orders.filter(function(order: Order) {
                return order.orderStatus !== 'Delivered';
            }).slice(0, 10); // Show top 10 active orders
        };
        
        // Calculate production status distribution
        $scope.calculateProductionStatuses = function(): void {
            const statusCounts: { [key: string]: number } = {};
            $scope.orders.forEach(function(order: Order) {
                statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
            });
            
            $scope.productionStatuses = [
                {
                    name: 'Processing',
                    count: statusCounts['Processing'] || 0,
                    icon: 'fa-cog'
                },
                {
                    name: 'Confirmed',
                    count: statusCounts['Confirmed'] || 0,
                    icon: 'fa-check-circle'
                },
                {
                    name: 'Shipped',
                    count: statusCounts['Shipped'] || 0,
                    icon: 'fa-shipping-fast'
                },
                {
                    name: 'Delivered',
                    count: statusCounts['Delivered'] || 0,
                    icon: 'fa-check-double'
                }
            ];
        };
        
        // Generate production schedule
        $scope.generateProductionSchedule = function(): void {
            $scope.productionSchedule = [
                {
                    title: 'Order #5004 - Nike T-shirt',
                    description: 'Production of 3 units',
                    date: '2025-01-15',
                    status: 'in-progress'
                },
                {
                    title: 'Order #5005 - Adidas Sneakers',
                    description: 'Quality control and packaging',
                    date: '2025-01-16',
                    status: 'scheduled'
                },
                {
                    title: 'Order #5006 - Apple Watch',
                    description: 'Final assembly and testing',
                    date: '2025-01-17',
                    status: 'pending'
                },
                {
                    title: 'Order #5007 - Sony Headphones',
                    description: 'Component preparation',
                    date: '2025-01-18',
                    status: 'pending'
                }
            ];
        };
        
        // Get product name by ID
        $scope.getProductName = function(productId: number): string {
            const product = $scope.products.find(function(p: Product) {
                return p.id === productId;
            });
            return product ? product.name : 'Unknown Product';
        };
        
        // Get product image by ID
        $scope.getProductImage = function(productId: number): string {
            const product = $scope.products.find(function(p: Product) {
                return p.id === productId;
            });
            return product ? product.ImageURL : '';
        };
        
        // Get production status class for styling
        $scope.getProductionStatusClass = function(status: string): string {
            switch(status) {
                case 'Delivered': return 'status-delivered';
                case 'Shipped': return 'status-shipped';
                case 'Processing': return 'status-processing';
                case 'Confirmed': return 'status-confirmed';
                default: return 'status-default';
            }
        };
        
        // Get progress percentage based on status
        $scope.getProgressPercentage = function(status: string): number {
            switch(status) {
                case 'Processing': return 25;
                case 'Confirmed': return 50;
                case 'Shipped': return 75;
                case 'Delivered': return 100;
                default: return 0;
            }
        };
        
        // Update production status
        $scope.updateProductionStatus = function(order: Order): void {
            // Simulate status update
            const statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
            const currentIndex = statuses.indexOf(order.orderStatus);
            if (currentIndex < statuses.length - 1) {
                order.orderStatus = statuses[currentIndex + 1] as any;
                $scope.calculateProductionStatuses();
            }
        };
        
        // Initialize charts
        $scope.initializeCharts = function(): void {
            // Production chart
            const productionCtx = document.getElementById('productionChart') as HTMLCanvasElement;
            if (productionCtx) {
                $scope.createProductionChart(productionCtx);
            }
            
            // Efficiency chart
            const efficiencyCtx = document.getElementById('efficiencyChart') as HTMLCanvasElement;
            if (efficiencyCtx) {
                $scope.createEfficiencyChart(efficiencyCtx);
            }
        };
        
        // Create production volume chart
        $scope.createProductionChart = function(ctx: HTMLCanvasElement): void {
            const canvas = ctx;
            const context = canvas.getContext('2d');
            
            if (!context) return;
            
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate production by category
            const categoryCounts: { [key: string]: number } = {};
            $scope.orders.forEach(function(order: Order) {
                if (order.products) {
                    order.products.forEach(function(item: any) {
                        const product = $scope.products.find(function(p: Product) {
                            return p.id === item.productId;
                        });
                        if (product) {
                            categoryCounts[product.Category] = (categoryCounts[product.Category] || 0) + item.quantity;
                        }
                    });
                }
            });
            
            const categories = Object.keys(categoryCounts);
            const counts = Object.values(categoryCounts);
            const maxCount = Math.max(...counts);
            
            // Draw bar chart
            const barWidth = canvas.width / categories.length;
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'];
            
            categories.forEach(function(category: string, index: number) {
                const barHeight = (categoryCounts[category] / maxCount) * (canvas.height - 60);
                const x = index * barWidth + 10;
                const y = canvas.height - barHeight - 30;
                
                // Draw bar
                context.fillStyle = colors[index % colors.length];
                context.fillRect(x, y, barWidth - 20, barHeight);
                
                // Draw category label
                context.fillStyle = '#333';
                context.font = '10px Arial';
                context.textAlign = 'center';
                context.save();
                context.translate(x + barWidth/2, canvas.height - 10);
                context.rotate(-Math.PI/4);
                context.fillText(category, 0, 0);
                context.restore();
                
                // Draw count label
                context.fillStyle = '#333';
                context.font = '8px Arial';
                context.textAlign = 'center';
                context.fillText(categoryCounts[category].toString(), x + barWidth/2, y - 5);
            });
        };
        
        // Create efficiency chart
        $scope.createEfficiencyChart = function(ctx: HTMLCanvasElement): void {
            const canvas = ctx;
            const context = canvas.getContext('2d');
            
            if (!context) return;
            
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw efficiency gauge
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20;
            
            // Draw background circle
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            context.strokeStyle = '#E0E0E0';
            context.lineWidth = 20;
            context.stroke();
            
            // Draw efficiency arc
            const efficiency = $scope.machineUtilization;
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + (efficiency / 100) * 2 * Math.PI;
            
            context.beginPath();
            context.arc(centerX, centerY, radius, startAngle, endAngle);
            context.strokeStyle = efficiency > 80 ? '#4CAF50' : efficiency > 60 ? '#FF9800' : '#F44336';
            context.lineWidth = 20;
            context.stroke();
            
            // Draw efficiency text
            context.fillStyle = '#333';
            context.font = 'bold 16px Arial';
            context.textAlign = 'center';
            context.fillText(efficiency + '%', centerX, centerY + 5);
            
            context.font = '12px Arial';
            context.fillText('Efficiency', centerX, centerY + 25);
        };
        
        // Initialize production data on load
        $scope.loadData();
    });
