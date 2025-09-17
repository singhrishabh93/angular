// Orders Controller
angular.module('cofactrApp')
    .controller('OrdersController', function($scope) {
        // Sample data matching the image
        $scope.orders = [
            {
                product: 'Shirt',
                itemNo: 'HK4886',
                incoming: 14,
                category: 'Molasses',
                date: '12 Feb 2024',
                quantity: 240,
                price: 8542.82,
                paid: true,
                status: 'view'
            },
            {
                product: 'Notebook',
                itemNo: 'HK4886',
                incoming: 12,
                category: 'Shirt',
                date: '12 Feb 2024',
                quantity: 140,
                price: 8542.82,
                paid: true,
                status: 'view'
            },
            {
                product: 'Laptop',
                itemNo: 'HK4886',
                incoming: 16,
                category: 'Notebook',
                date: '12 Feb 2024',
                quantity: 340,
                price: 8542.82,
                paid: false,
                status: 'cancelled'
            },
            {
                product: 'Carrots',
                itemNo: 'HK4886',
                incoming: 10,
                category: 'Carrots',
                date: '12 Feb 2024',
                quantity: 24,
                price: 8542.82,
                paid: true,
                status: 'ship'
            },
            {
                product: 'Oatmeal',
                itemNo: 'HK4886',
                incoming: 19,
                category: 'Honey',
                date: '12 Feb 2024',
                quantity: 140,
                price: 8542.82,
                paid: true,
                status: 'view'
            },
            {
                product: 'Honey',
                itemNo: 'HK4886',
                incoming: 18,
                category: 'Yeast',
                date: '12 Feb 2024',
                quantity: 240,
                price: 8542.82,
                paid: true,
                status: 'ship'
            },
            {
                product: 'Molasses',
                itemNo: 'HK4886',
                incoming: 12,
                category: 'Laptop',
                date: '12 Feb 2024',
                quantity: 340,
                price: 8542.82,
                paid: true,
                status: 'pending'
            }
        ];
        
        $scope.activeTab = 'all';
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        
        // Filter orders based on active tab
        $scope.filteredOrders = $scope.orders;
        
        $scope.setActiveTab = function(tab) {
            $scope.activeTab = tab;
            $scope.currentPage = 1;
            filterOrders();
            
            // Update indicator position after DOM update
            setTimeout(function() {
                $scope.$apply();
            }, 0);
        };
        
        $scope.getIndicatorStyle = function() {
            var tabIndex = 0;
            var tabWidth = 0;
            var tabLeft = 0;
            
            // Calculate which tab is active and its position
            var tabs = ['all', 'active', 'pending', 'cancelled'];
            tabIndex = tabs.indexOf($scope.activeTab);
            
            // Get the tab elements to calculate position and width
            var tabElements = document.querySelectorAll('.status-tab');
            if (tabElements && tabElements[tabIndex]) {
                var tabElement = tabElements[tabIndex];
                var tabsContainer = document.querySelector('.status-tabs');
                var containerRect = tabsContainer.getBoundingClientRect();
                var tabRect = tabElement.getBoundingClientRect();
                
                tabLeft = tabRect.left - containerRect.left;
                tabWidth = tabRect.width;
            } else {
                // Fallback calculation if elements aren't available yet
                var gap = 20; // gap between tabs
                var baseWidth = 120; // approximate tab width
                tabLeft = tabIndex * (baseWidth + gap);
                tabWidth = baseWidth;
            }
            
            return {
                'left': tabLeft + 'px',
                'width': tabWidth + 'px'
            };
        };
        
        function filterOrders() {
            if ($scope.activeTab === 'all') {
                $scope.filteredOrders = $scope.orders;
            } else if ($scope.activeTab === 'active') {
                $scope.filteredOrders = $scope.orders.filter(function(order) {
                    return order.status === 'view' || order.status === 'ship';
                });
            } else if ($scope.activeTab === 'pending') {
                $scope.filteredOrders = $scope.orders.filter(function(order) {
                    return order.status === 'pending';
                });
            } else if ($scope.activeTab === 'cancelled') {
                $scope.filteredOrders = $scope.orders.filter(function(order) {
                    return order.status === 'cancelled';
                });
            }
        }
        
        $scope.getOrderCount = function(tab) {
            if (tab === 'all') return $scope.orders.length;
            if (tab === 'active') {
                return $scope.orders.filter(function(order) {
                    return order.status === 'view' || order.status === 'ship';
                }).length;
            }
            if (tab === 'pending') {
                return $scope.orders.filter(function(order) {
                    return order.status === 'pending';
                }).length;
            }
            if (tab === 'cancelled') {
                return $scope.orders.filter(function(order) {
                    return order.status === 'cancelled';
                }).length;
            }
            return 0;
        };
        
        $scope.getActionClass = function(status) {
            switch(status) {
                case 'view': return 'view';
                case 'ship': return 'ship';
                case 'cancelled': return 'cancel';
                case 'pending': return 'pending';
                default: return 'view';
            }
        };
        
        $scope.getActionText = function(status) {
            switch(status) {
                case 'view': return 'View Shipments';
                case 'ship': return 'Ship Order';
                case 'cancelled': return 'Cancelled';
                case 'pending': return 'Pending';
                default: return 'View';
            }
        };
        
        $scope.handleAction = function(order) {
            console.log('Action clicked for order:', order);
            // Add your action handling logic here
        };
        
        // Pagination
        $scope.totalPages = Math.ceil($scope.filteredOrders.length / $scope.itemsPerPage);
        
        $scope.getPageNumbers = function() {
            var pages = [];
            var total = $scope.totalPages;
            var current = $scope.currentPage;
            
            if (total <= 7) {
                for (var i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                if (current > 4) {
                    pages.push('...');
                }
                for (var i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                    pages.push(i);
                }
                if (current < total - 3) {
                    pages.push('...');
                }
                pages.push(total);
            }
            
            return pages;
        };
        
        $scope.goToPage = function(page) {
            if (page !== '...') {
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
        
        // Handle window resize to update indicator position
        angular.element(window).bind('resize', function() {
            $scope.$apply();
        });
        
        // Initialize
        filterOrders();
    });
