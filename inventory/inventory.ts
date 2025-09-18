import { Product, DatabaseData, InventoryStats } from '../types';

// Inventory Controller
angular.module('cofactrApp')
    .controller('InventoryController', function($scope: any, $http: any) {
        // Initialize inventory data
        $scope.products: Product[] = [];
        $scope.filteredProducts: Product[] = [];
        $scope.categories: string[] = [];
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
        $scope.loadData = function(): void {
            $http.get('db/db.json')
                .then(function(response: any) {
                    const data: DatabaseData = response.data;
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
                .catch(function(error: any) {
                    console.error('Error loading inventory data:', error);
                });
        };
        
        // Calculate inventory statistics
        $scope.calculateStats = function(): void {
            $scope.totalInventoryValue = $scope.products.reduce(function(sum: number, product: Product) {
                return sum + (product.Price || 0);
            }, 0);
            
            $scope.averagePrice = $scope.products.length > 0 ? 
                $scope.totalInventoryValue / $scope.products.length : 0;
        };
        
        // Filter products based on search and category
        $scope.filterProducts = function(): void {
            let filtered = $scope.products;
            
            // Filter by search query
            if ($scope.searchQuery) {
                const query = $scope.searchQuery.toLowerCase();
                filtered = filtered.filter(function(product: Product) {
                    return product.name.toLowerCase().includes(query) ||
                           product.Category.toLowerCase().includes(query) ||
                           product.Description.toLowerCase().includes(query);
                });
            }
            
            // Filter by category
            if ($scope.selectedCategory) {
                filtered = filtered.filter(function(product: Product) {
                    return product.Category === $scope.selectedCategory;
                });
            }
            
            $scope.filteredProducts = filtered;
            $scope.currentPage = 1;
            $scope.updatePagination();
        };
        
        // Sort products
        $scope.sortProducts = function(): void {
            $scope.filteredProducts.sort(function(a: Product, b: Product) {
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
        $scope.toggleView = function(): void {
            $scope.viewMode = $scope.viewMode === 'grid' ? 'list' : 'grid';
        };
        
        // Pagination functions
        $scope.updatePagination = function(): void {
            $scope.totalPages = Math.ceil($scope.filteredProducts.length / $scope.itemsPerPage);
        };
        
        $scope.getPageNumbers = function(): (number | string)[] {
            const pages: (number | string)[] = [];
            const start = Math.max(1, $scope.currentPage - 2);
            const end = Math.min($scope.totalPages, $scope.currentPage + 2);
            
            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (end < $scope.totalPages) {
                if (end < $scope.totalPages - 1) pages.push('...');
                pages.push($scope.totalPages);
            }
            
            return pages;
        };
        
        $scope.goToPage = function(page: number | string): void {
            if (page !== '...' && typeof page === 'number' && page >= 1 && page <= $scope.totalPages) {
                $scope.currentPage = page;
            }
        };
        
        $scope.previousPage = function(): void {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }
        };
        
        $scope.nextPage = function(): void {
            if ($scope.currentPage < $scope.totalPages) {
                $scope.currentPage++;
            }
        };
        
        // Get paginated products
        $scope.getPaginatedProducts = function(): Product[] {
            const start = ($scope.currentPage - 1) * $scope.itemsPerPage;
            const end = start + $scope.itemsPerPage;
            return $scope.filteredProducts.slice(start, end);
        };
        
        // Product management functions
        $scope.addProduct = function(): void {
            // TODO: Implement add product modal/form
            alert('Add Product functionality - to be implemented');
        };
        
        $scope.editProduct = function(product: Product): void {
            // TODO: Implement edit product modal/form
            alert('Edit Product: ' + product.name);
        };
        
        $scope.deleteProduct = function(product: Product): void {
            if (confirm('Are you sure you want to delete ' + product.name + '?')) {
                const index = $scope.products.indexOf(product);
                if (index > -1) {
                    $scope.products.splice(index, 1);
                    $scope.filterProducts();
                    $scope.calculateStats();
                }
            }
        };
        
        $scope.viewProduct = function(product: Product): void {
            // TODO: Implement product details modal
            alert('View Product Details: ' + product.name);
        };
        
        $scope.updateStock = function(product: Product): void {
            // TODO: Implement stock update functionality
            alert('Update Stock for: ' + product.name);
        };
        
        $scope.exportInventory = function(): void {
            // TODO: Implement export functionality
            alert('Export Inventory functionality - to be implemented');
        };
        
        // Initialize category chart
        $scope.initializeCategoryChart = function(): void {
            setTimeout(function() {
                const canvas = document.getElementById('categoryChart') as HTMLCanvasElement;
                if (canvas) {
                    $scope.createCategoryChart(canvas);
                }
            }, 100);
        };
        
        // Create category distribution chart
        $scope.createCategoryChart = function(canvas: HTMLCanvasElement): void {
            const context = canvas.getContext('2d');
            
            if (!context) return;
            
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate category distribution
            const categoryCounts: { [key: string]: number } = {};
            $scope.products.forEach(function(product: Product) {
                categoryCounts[product.Category] = (categoryCounts[product.Category] || 0) + 1;
            });
            
            const categories = Object.keys(categoryCounts);
            const counts = Object.values(categoryCounts);
            const total = counts.reduce(function(sum: number, count: number) { return sum + count; }, 0);
            
            // Draw bar chart
            const barWidth = canvas.width / categories.length;
            const maxCount = Math.max(...counts);
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];
            
            categories.forEach(function(category: string, index: number) {
                const barHeight = (categoryCounts[category] / maxCount) * (canvas.height - 60);
                const x = index * barWidth + 10;
                const y = canvas.height - barHeight - 30;
                
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
                context.fillText(categoryCounts[category].toString(), x + barWidth/2, y - 5);
            });
        };
        
        // Initialize inventory on load
        $scope.loadData();
    });
