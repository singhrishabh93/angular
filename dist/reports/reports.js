// Reports Controller
angular.module('cofactrApp')
    .controller('ReportsController', function ($scope, $http) {
    // Initialize reports data
    $scope.selectedDateRange = '30';
    $scope.selectedReportType = 'sales';
    $scope.totalRevenue = 0;
    $scope.totalOrders = 0;
    $scope.totalCustomers = 0;
    $scope.totalProducts = 0;
    $scope.revenueGrowth = 0;
    $scope.orderGrowth = 0;
    $scope.customerGrowth = 0;
    $scope.productGrowth = 0;
    $scope.topProducts;
    TopProduct[] = [];
    $scope.customerSegments;
    CustomerSegment[] = [];
    $scope.grossRevenue = 0;
    $scope.costOfGoods = 0;
    $scope.operatingExpenses = 0;
    $scope.netProfit = 0;
    $scope.cashIn = 0;
    $scope.cashOut = 0;
    $scope.netCashFlow = 0;
    $scope.websiteVisitors = 0;
    $scope.conversionRate = 0;
    $scope.averageOrderValue = 0;
    $scope.overallRating = 0;
    $scope.totalReviews = 0;
    $scope.returnRate = 0;
    $scope.detailedReports;
    DetailedReport[] = [];
    $scope.orders;
    Order[] = [];
    $scope.products;
    Product[] = [];
    $scope.users;
    User[] = [];
    // Load data from JSON file
    $scope.loadData = function () {
        $http.get('db/db.json')
            .then(function (response) {
            const data = response.data;
            $scope.orders = data.OrdersList || [];
            $scope.products = data.ProductsList || [];
            $scope.users = data.users || [];
            // Calculate all metrics
            $scope.calculateMetrics();
            $scope.generateTopProducts();
            $scope.generateCustomerSegments();
            $scope.generateFinancialData();
            $scope.generatePerformanceMetrics();
            $scope.generateDetailedReports();
            $scope.initializeCharts();
        })
            .catch(function (error) {
            console.error('Error loading reports data:', error);
        });
    };
    // Calculate key metrics
    $scope.calculateMetrics = function () {
        $scope.totalOrders = $scope.orders.length;
        $scope.totalCustomers = $scope.users.length;
        $scope.totalProducts = $scope.products.length;
        // Calculate total revenue
        $scope.totalRevenue = $scope.orders.reduce(function (sum, order) {
            return sum + (order.totalPrice || 0);
        }, 0);
        // Calculate growth percentages (simulated)
        $scope.revenueGrowth = Math.round(Math.random() * 20 + 5); // 5-25%
        $scope.orderGrowth = Math.round(Math.random() * 15 + 3); // 3-18%
        $scope.customerGrowth = Math.round(Math.random() * 10 + 2); // 2-12%
        $scope.productGrowth = Math.round(Math.random() * 8 + 1); // 1-9%
    };
    // Generate top products
    $scope.generateTopProducts = function () {
        const productSales = {};
        // Count sales for each product
        $scope.orders.forEach(function (order) {
            if (order.products) {
                order.products.forEach(function (item) {
                    const product = $scope.products.find(function (p) {
                        return p.id === item.productId;
                    });
                    if (product) {
                        if (!productSales[product.id]) {
                            productSales[product.id] = {
                                id: product.id,
                                name: product.name,
                                category: product.Category,
                                image: product.ImageURL,
                                sales: 0,
                                revenue: 0
                            };
                        }
                        productSales[product.id].sales += item.quantity;
                        productSales[product.id].revenue += (product.Price * item.quantity);
                    }
                });
            }
        });
        // Convert to array and sort by sales
        $scope.topProducts = Object.values(productSales)
            .sort(function (a, b) {
            return b.sales - a.sales;
        })
            .slice(0, 5);
    };
    // Generate customer segments
    $scope.generateCustomerSegments = function () {
        $scope.customerSegments = [
            {
                name: 'New Customers',
                count: Math.round($scope.totalCustomers * 0.3),
                percentage: 30
            },
            {
                name: 'Regular Customers',
                count: Math.round($scope.totalCustomers * 0.5),
                percentage: 50
            },
            {
                name: 'VIP Customers',
                count: Math.round($scope.totalCustomers * 0.2),
                percentage: 20
            }
        ];
    };
    // Generate financial data
    $scope.generateFinancialData = function () {
        $scope.grossRevenue = $scope.totalRevenue;
        $scope.costOfGoods = Math.round($scope.totalRevenue * 0.6); // 60% of revenue
        $scope.operatingExpenses = Math.round($scope.totalRevenue * 0.25); // 25% of revenue
        $scope.netProfit = $scope.grossRevenue - $scope.costOfGoods - $scope.operatingExpenses;
        $scope.cashIn = $scope.totalRevenue;
        $scope.cashOut = $scope.costOfGoods + $scope.operatingExpenses;
        $scope.netCashFlow = $scope.cashIn - $scope.cashOut;
    };
    // Generate performance metrics
    $scope.generatePerformanceMetrics = function () {
        $scope.websiteVisitors = Math.round(Math.random() * 10000 + 5000); // 5k-15k
        $scope.conversionRate = Math.round(Math.random() * 5 + 2); // 2-7%
        $scope.averageOrderValue = $scope.totalOrders > 0 ? $scope.totalRevenue / $scope.totalOrders : 0;
        $scope.overallRating = Math.round((Math.random() * 1 + 4) * 10) / 10; // 4.0-5.0
        $scope.totalReviews = Math.round(Math.random() * 500 + 100); // 100-600
        $scope.returnRate = Math.round(Math.random() * 5 + 1); // 1-6%
    };
    // Generate detailed reports
    $scope.generateDetailedReports = function () {
        $scope.detailedReports = $scope.orders.map(function (order) {
            const product = $scope.products.find(function (p) {
                return p.id === order.products[0].productId;
            });
            const user = $scope.users.find(function (u) {
                return u.id === order.userId;
            });
            return {
                date: order.orderDate,
                orderId: order.id,
                customer: user ? user.Name : 'Unknown',
                product: product ? product.name : 'Unknown',
                quantity: order.products[0].quantity,
                revenue: order.totalPrice,
                status: order.orderStatus
            };
        }).slice(0, 10); // Show last 10 orders
    };
    // Get stars for rating display
    $scope.getStars = function (rating) {
        const stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(i);
        }
        return stars;
    };
    // Get status class for styling
    $scope.getStatusClass = function (status) {
        switch (status) {
            case 'Delivered': return 'status-delivered';
            case 'Shipped': return 'status-shipped';
            case 'Processing': return 'status-processing';
            case 'Confirmed': return 'status-confirmed';
            default: return 'status-default';
        }
    };
    // Update reports based on filters
    $scope.updateReports = function () {
        console.log('Updating reports for:', $scope.selectedDateRange, 'days, type:', $scope.selectedReportType);
        // In a real application, this would filter the data based on the selected criteria
        $scope.loadData();
    };
    // Export functions
    $scope.exportReport = function () {
        console.log('Exporting report...');
        alert('Export functionality would be implemented here');
    };
    $scope.exportToPDF = function () {
        console.log('Exporting to PDF...');
        alert('PDF export functionality would be implemented here');
    };
    $scope.exportToExcel = function () {
        console.log('Exporting to Excel...');
        alert('Excel export functionality would be implemented here');
    };
    $scope.exportToCSV = function () {
        console.log('Exporting to CSV...');
        alert('CSV export functionality would be implemented here');
    };
    $scope.scheduleReport = function () {
        console.log('Scheduling report...');
        alert('Report scheduling functionality would be implemented here');
    };
    // Initialize charts
    $scope.initializeCharts = function () {
        // Revenue chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            $scope.createRevenueChart(revenueCtx);
        }
        // Order status chart
        const statusCtx = document.getElementById('orderStatusChart');
        if (statusCtx) {
            $scope.createOrderStatusChart(statusCtx);
        }
    };
    // Create revenue trend chart
    $scope.createRevenueChart = function (ctx) {
        const canvas = ctx;
        const context = canvas.getContext('2d');
        if (!context)
            return;
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Generate sample data for the last 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const revenues = [];
        for (let i = 0; i < 7; i++) {
            revenues.push(Math.round(Math.random() * 2000 + 1000)); // 1000-3000
        }
        // Draw line chart
        const maxRevenue = Math.max(...revenues);
        const chartWidth = canvas.width - 40;
        const chartHeight = canvas.height - 40;
        const stepX = chartWidth / (days.length - 1);
        const stepY = chartHeight / maxRevenue;
        // Draw grid lines
        context.strokeStyle = '#e0e0e0';
        context.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = 20 + (chartHeight / 5) * i;
            context.beginPath();
            context.moveTo(20, y);
            context.lineTo(canvas.width - 20, y);
            context.stroke();
        }
        // Draw revenue line
        context.strokeStyle = '#667eea';
        context.lineWidth = 3;
        context.beginPath();
        for (let i = 0; i < days.length; i++) {
            const x = 20 + stepX * i;
            const y = 20 + chartHeight - (revenues[i] * stepY);
            if (i === 0) {
                context.moveTo(x, y);
            }
            else {
                context.lineTo(x, y);
            }
        }
        context.stroke();
        // Draw data points
        context.fillStyle = '#667eea';
        for (let i = 0; i < days.length; i++) {
            const x = 20 + stepX * i;
            const y = 20 + chartHeight - (revenues[i] * stepY);
            context.beginPath();
            context.arc(x, y, 4, 0, 2 * Math.PI);
            context.fill();
        }
        // Draw labels
        context.fillStyle = '#333';
        context.font = '12px Arial';
        context.textAlign = 'center';
        for (let i = 0; i < days.length; i++) {
            const x = 20 + stepX * i;
            context.fillText(days[i], x, canvas.height - 5);
        }
    };
    // Create order status chart
    $scope.createOrderStatusChart = function (ctx) {
        const canvas = ctx;
        const context = canvas.getContext('2d');
        if (!context)
            return;
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Calculate status distribution
        const statusCounts = {};
        $scope.orders.forEach(function (order) {
            statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
        });
        const statuses = Object.keys(statusCounts);
        const counts = Object.values(statusCounts);
        const total = counts.reduce(function (sum, count) { return sum + count; }, 0);
        // Draw pie chart
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 30;
        let startAngle = 0;
        const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
        statuses.forEach(function (status, index) {
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
            context.font = '10px Arial';
            context.textAlign = 'center';
            context.fillText(status + ' (' + counts[index] + ')', labelX, labelY);
            startAngle += sliceAngle;
        });
    };
    // Initialize reports on load
    $scope.loadData();
});
export {};
//# sourceMappingURL=reports.js.map