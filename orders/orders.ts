import { Order, Product, User, DatabaseData } from '../types';

// Orders Controller
angular.module('cofactrApp')
    .controller('OrdersController', function($scope: any, $http: any) {
        // Load data from db.json
        $scope.orders: Order[] = [];
        $scope.products: Product[] = [];
        $scope.users: User[] = [];
        
        // Load data from db.json
        $http.get('db/db.json').then(function(response: any) {
            const data: DatabaseData = response.data;
            $scope.products = data.ProductsList || [];
            $scope.users = data.users || [];
            
            // Transform OrdersList data to match the table structure
            $scope.orders = (data.OrdersList || []).map(function(order: Order) {
                // Get product details for the first product in the order
                const firstProduct = order.products && order.products[0];
                const productDetails = $scope.products.find(function(p: Product) {
                    return p.id === firstProduct.productId;
                }) || {};
                
                // Calculate total quantity
                const totalQuantity = order.products.reduce(function(sum: number, p: any) {
                    return sum + (p.quantity || 0);
                }, 0);
                
                // Format date
                const orderDate = new Date(order.orderDate);
                const formattedDate = orderDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                
                return {
                    id: order.id,
                    product: productDetails.name || 'Unknown Product',
                    itemNo: order.id,
                    incoming: Math.floor(Math.random() * 20) + 5, // Random incoming value
                    category: productDetails.Category || 'Unknown',
                    date: formattedDate,
                    quantity: totalQuantity,
                    price: order.totalPrice,
                    paid: order.paymentStatus === 'Paid',
                    status: getStatusFromOrderStatus(order.orderStatus),
                    orderStatus: order.orderStatus,
                    paymentStatus: order.paymentStatus,
                    shippingAddress: order.ShippingAddress,
                    userId: order.userId
                };
            });
            
            // Initialize filtered orders
            $scope.filteredOrders = $scope.orders;
            filterOrders();
        }).catch(function(error: any) {
            console.error('Error loading data:', error);
            $scope.orders = [];
            $scope.filteredOrders = [];
        });
        
        // Helper function to map order status to action status
        function getStatusFromOrderStatus(orderStatus: string): string {
            switch(orderStatus) {
                case 'Delivered': return 'view';
                case 'Shipped': return 'ship';
                case 'Processing': return 'pending';
                case 'Confirmed': return 'view';
                default: return 'view';
            }
        }
        
        $scope.activeTab = 'all';
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        
        // Filter orders based on active tab
        $scope.filteredOrders: Order[] = $scope.orders;
        
        $scope.setActiveTab = function(tab: string): void {
            $scope.activeTab = tab;
            $scope.currentPage = 1;
            filterOrders();
            
            // Update indicator position after DOM update
            setTimeout(function() {
                $scope.$apply();
            }, 0);
        };
        
        $scope.getIndicatorStyle = function(): { left: string; width: string } {
            let tabIndex = 0;
            let tabWidth = 0;
            let tabLeft = 0;
            
            // Calculate which tab is active and its position
            const tabs = ['all', 'active', 'pending', 'cancelled'];
            tabIndex = tabs.indexOf($scope.activeTab);
            
            // Get the tab elements to calculate position and width
            const tabElements = document.querySelectorAll('.status-tab');
            if (tabElements && tabElements[tabIndex]) {
                const tabElement = tabElements[tabIndex] as HTMLElement;
                const tabsContainer = document.querySelector('.status-tabs') as HTMLElement;
                const containerRect = tabsContainer.getBoundingClientRect();
                const tabRect = tabElement.getBoundingClientRect();
                
                tabLeft = tabRect.left - containerRect.left;
                tabWidth = tabRect.width;
            } else {
                // Fallback calculation if elements aren't available yet
                const gap = 20; // gap between tabs
                const baseWidth = 120; // approximate tab width
                tabLeft = tabIndex * (baseWidth + gap);
                tabWidth = baseWidth;
            }
            
            return {
                'left': tabLeft + 'px',
                'width': tabWidth + 'px'
            };
        };
        
        function filterOrders(): void {
            if ($scope.activeTab === 'all') {
                $scope.filteredOrders = $scope.orders;
            } else if ($scope.activeTab === 'active') {
                $scope.filteredOrders = $scope.orders.filter(function(order: Order) {
                    return order.status === 'view' || order.status === 'ship';
                });
            } else if ($scope.activeTab === 'pending') {
                $scope.filteredOrders = $scope.orders.filter(function(order: Order) {
                    return order.status === 'pending';
                });
            } else if ($scope.activeTab === 'cancelled') {
                $scope.filteredOrders = $scope.orders.filter(function(order: Order) {
                    return order.status === 'cancelled';
                });
            }
        }
        
        $scope.getOrderCount = function(tab: string): number {
            if (tab === 'all') return $scope.orders.length;
            if (tab === 'active') {
                return $scope.orders.filter(function(order: Order) {
                    return order.status === 'view' || order.status === 'ship';
                }).length;
            }
            if (tab === 'pending') {
                return $scope.orders.filter(function(order: Order) {
                    return order.status === 'pending';
                }).length;
            }
            if (tab === 'cancelled') {
                return $scope.orders.filter(function(order: Order) {
                    return order.status === 'cancelled';
                }).length;
            }
            return 0;
        };
        
        $scope.getActionClass = function(status: string): string {
            switch(status) {
                case 'view': return 'view';
                case 'ship': return 'ship';
                case 'cancelled': return 'cancel';
                case 'pending': return 'pending';
                default: return 'view';
            }
        };
        
        $scope.getActionText = function(status: string): string {
            switch(status) {
                case 'view': return 'View Shipments';
                case 'ship': return 'Ship Order';
                case 'cancelled': return 'Cancelled';
                case 'pending': return 'Pending';
                default: return 'View';
            }
        };
        
        $scope.handleAction = function(order: Order): void {
            console.log('Action clicked for order:', order);
            // Add your action handling logic here
        };
        
        // Pagination
        $scope.totalPages = Math.ceil($scope.filteredOrders.length / $scope.itemsPerPage);
        
        $scope.getPageNumbers = function(): (number | string)[] {
            const pages: (number | string)[] = [];
            const total = $scope.totalPages;
            const current = $scope.currentPage;
            
            if (total <= 7) {
                for (let i = 1; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                if (current > 4) {
                    pages.push('...');
                }
                for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                    pages.push(i);
                }
                if (current < total - 3) {
                    pages.push('...');
                }
                pages.push(total);
            }
            
            return pages;
        };
        
        $scope.goToPage = function(page: number | string): void {
            if (page !== '...') {
                $scope.currentPage = page as number;
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
        
        // Handle window resize to update indicator position
        angular.element(window).bind('resize', function() {
            $scope.$apply();
        });
        
        // Initialize
        filterOrders();
    });
