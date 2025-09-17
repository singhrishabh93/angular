// Inventory Controller
angular.module('cofactrApp')
    .controller('InventoryController', function($scope, $http) {
        // Initialize inventory data
        $scope.products = [];
        $scope.filteredProducts = [];
        $scope.categories = [];
        $scope.searchQuery = '';
        $scope.selectedCategory = '';
        $scope.sortBy = 'name';
        $scope.viewMode = 'grid';
        $scope.currentPage = 1;
        $scope.itemsPerPage = 12;
        $scope.totalPages = 0;
        
        // Statistics
        $scope.totalInventoryValue = 0;
        $scope.averagePrice = 0;
        
        // Load data from JSON file
        $scope.loadData = function() {
            $http.get('db/db.json')
                .then(function(response) {
                    var data = response.data;
                    $scope.products = data.ProductsList || [];
                    $scope.filteredProducts = $scope.products;
                    
                    // Extract unique categories
                    $scope.categories = [...new Set($scope.products.map(p => p.Category))];
                    
                    // Calculate statistics
                    $scope.calculateStats();
                    
                    // Initialize pagination
                    $scope.updatePagination();
                    
                    // Initialize chart
                    $scope.initializeCategoryChart();
                })
                .catch(function(error) {
                    console.error('Error loading inventory data:', error);
                });
        };
        
        // Calculate inventory statistics
        $scope.calculateStats = function() {
            $scope.totalInventoryValue = $scope.products.reduce(function(sum, product) {
                return sum + (product.Price || 0);
            }, 0);
            
            $scope.averagePrice = $scope.products.length > 0 ? 
                $scope.totalInventoryValue / $scope.products.length : 0;
        };
        
        // Filter products based on search and category
        $scope.filterProducts = function() {
            var filtered = $scope.products;
            
            // Filter by search query
            if ($scope.searchQuery) {
                var query = $scope.searchQuery.toLowerCase();
                filtered = filtered.filter(function(product) {
                    return product.name.toLowerCase().includes(query) ||
                           product.Category.toLowerCase().includes(query) ||
                           product.Description.toLowerCase().includes(query);
                });
            }
            
            // Filter by category
            if ($scope.selectedCategory) {
                filtered = filtered.filter(function(product) {
                    return product.Category === $scope.selectedCategory;
                });
            }
            
            $scope.filteredProducts = filtered;
            $scope.currentPage = 1;
            $scope.updatePagination();
        };
        
        // Sort products
        $scope.sortProducts = function() {
            $scope.filteredProducts.sort(function(a, b) {
                switch($scope.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'price':
                        return a.Price - b.Price;
                    case 'category':
                        return a.Category.localeCompare(b.Category);
                    default:
                        return 0;
                }
            });
        };
        
        // Toggle view mode
        $scope.toggleView = function() {
            $scope.viewMode = $scope.viewMode === 'grid' ? 'list' : 'grid';
        };
        
        // Pagination functions
        $scope.updatePagination = function() {
            $scope.totalPages = Math.ceil($scope.filteredProducts.length / $scope.itemsPerPage);
        };
        
        $scope.getPageNumbers = function() {
            var pages = [];
            var start = Math.max(1, $scope.currentPage - 2);
            var end = Math.min($scope.totalPages, $scope.currentPage + 2);
            
            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }
            
            for (var i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (end < $scope.totalPages) {
                if (end < $scope.totalPages - 1) pages.push('...');
                pages.push($scope.totalPages);
            }
            
            return pages;
        };
        
        $scope.goToPage = function(page) {
            if (page !== '...' && page >= 1 && page <= $scope.totalPages) {
                $scope.currentPage = page;
            }
        };
        
        $scope.previousPage = function() {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }
        };
        
        $scope.nextPage = function() {
            if ($scope.currentPage < $scope.totalPages) {
                $scope.currentPage++;
            }
        };
        
        // Get paginated products
        $scope.getPaginatedProducts = function() {
            var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
            var end = start + $scope.itemsPerPage;
            return $scope.filteredProducts.slice(start, end);
        };
        
        // Product management functions
        $scope.addProduct = function() {
            // TODO: Implement add product modal/form
            alert('Add Product functionality - to be implemented');
        };
        
        $scope.editProduct = function(product) {
            // TODO: Implement edit product modal/form
            alert('Edit Product: ' + product.name);
        };
        
        $scope.deleteProduct = function(product) {
            if (confirm('Are you sure you want to delete ' + product.name + '?')) {
                var index = $scope.products.indexOf(product);
                if (index > -1) {
                    $scope.products.splice(index, 1);
                    $scope.filterProducts();
                    $scope.calculateStats();
                }
            }
        };
        
        $scope.viewProduct = function(product) {
            // TODO: Implement product details modal
            alert('View Product Details: ' + product.name);
        };
        
        $scope.updateStock = function(product) {
            // TODO: Implement stock update functionality
            alert('Update Stock for: ' + product.name);
        };
        
        $scope.exportInventory = function() {
            // TODO: Implement export functionality
            alert('Export Inventory functionality - to be implemented');
        };
        
        // Initialize category chart
        $scope.initializeCategoryChart = function() {
            setTimeout(function() {
                var canvas = document.getElementById('categoryChart');
                if (canvas) {
                    $scope.createCategoryChart(canvas);
                }
            }, 100);
        };
        
        // Create category distribution chart
        $scope.createCategoryChart = function(canvas) {
            var context = canvas.getContext('2d');
            
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate category distribution
            var categoryCounts = {};
            $scope.products.forEach(function(product) {
                categoryCounts[product.Category] = (categoryCounts[product.Category] || 0) + 1;
            });
            
            var categories = Object.keys(categoryCounts);
            var counts = Object.values(categoryCounts);
            var total = counts.reduce(function(sum, count) { return sum + count; }, 0);
            
            // Draw bar chart
            var barWidth = canvas.width / categories.length;
            var maxCount = Math.max(...counts);
            var colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];
            
            categories.forEach(function(category, index) {
                var barHeight = (categoryCounts[category] / maxCount) * (canvas.height - 60);
                var x = index * barWidth + 10;
                var y = canvas.height - barHeight - 30;
                
                // Draw bar
                context.fillStyle = colors[index % colors.length];
                context.fillRect(x, y, barWidth - 20, barHeight);
                
                // Draw category label
                context.fillStyle = '#333';
                context.font = '12px Arial';
                context.textAlign = 'center';
                context.save();
                context.translate(x + barWidth/2, canvas.height - 10);
                context.rotate(-Math.PI/4);
                context.fillText(category, 0, 0);
                context.restore();
                
                // Draw count label
                context.fillStyle = '#333';
                context.font = '10px Arial';
                context.textAlign = 'center';
                context.fillText(categoryCounts[category], x + barWidth/2, y - 5);
            });
        };
        
        // Initialize inventory on load
        $scope.loadData();
    });
