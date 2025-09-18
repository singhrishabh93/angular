// Support Controller
angular.module('cofactrApp')
    .controller('SupportController', function ($scope, $http) {
    // Initialize support data
    $scope.searchQuery = '';
    $scope.selectedStatus = '';
    $scope.selectedPriority = '';
    $scope.selectAll = false;
    $scope.tickets;
    SupportTicket[] = [];
    $scope.filteredTickets;
    SupportTicket[] = [];
    $scope.totalTickets = 0;
    $scope.openTickets = 0;
    $scope.resolvedTickets = 0;
    $scope.urgentTickets = 0;
    $scope.knowledgeBase;
    KnowledgeBaseArticle[] = [];
    $scope.supportTeam;
    SupportTeamMember[] = [];
    $scope.faqList;
    FAQ[] = [];
    $scope.averageResponseTime = 0;
    $scope.fastestResponseTime = 0;
    $scope.resolutionRate = 0;
    $scope.overallRating = 0;
    $scope.totalReviews = 0;
    // Load data from JSON file
    $scope.loadData = function () {
        $http.get('db/db.json')
            .then(function (response) {
            const data = response.data;
            $scope.users = data.users || [];
            // Generate support data
            $scope.generateTickets();
            $scope.calculateStats();
            $scope.generateKnowledgeBase();
            $scope.generateSupportTeam();
            $scope.generateFAQ();
            $scope.calculateAnalytics();
            $scope.filterTickets();
        })
            .catch(function (error) {
            console.error('Error loading support data:', error);
        });
    };
    // Generate support tickets
    $scope.generateTickets = function () {
        const subjects = [
            'Login Issues',
            'Password Reset',
            'Order Status Inquiry',
            'Payment Problem',
            'Product Question',
            'Technical Support',
            'Account Access',
            'Billing Question',
            'Feature Request',
            'Bug Report'
        ];
        const priorities = ['low', 'medium', 'high', 'urgent'];
        const statuses = ['open', 'in-progress', 'resolved', 'closed'];
        const assignees = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown', 'Tom Davis'];
        $scope.tickets = [];
        for (let i = 1; i <= 20; i++) {
            const user = $scope.users[Math.floor(Math.random() * $scope.users.length)];
            const ticket = {
                id: 'T' + (1000 + i),
                customer: {
                    name: user.Name,
                    email: user.Email || 'user' + user.id + '@matrix.shop',
                    avatar: user.avatar || null
                },
                subject: subjects[Math.floor(Math.random() * subjects.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                assignee: assignees[Math.floor(Math.random() * assignees.length)],
                createdDate: $scope.getRandomDate(),
                selected: false
            };
            $scope.tickets.push(ticket);
        }
    };
    // Get random date
    $scope.getRandomDate = function () {
        const days = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toLocaleDateString();
    };
    // Calculate statistics
    $scope.calculateStats = function () {
        $scope.totalTickets = $scope.tickets.length;
        $scope.openTickets = $scope.tickets.filter(function (ticket) {
            return ticket.status === 'open';
        }).length;
        $scope.resolvedTickets = $scope.tickets.filter(function (ticket) {
            return ticket.status === 'resolved';
        }).length;
        $scope.urgentTickets = $scope.tickets.filter(function (ticket) {
            return ticket.priority === 'urgent';
        }).length;
    };
    // Generate knowledge base
    $scope.generateKnowledgeBase = function () {
        $scope.knowledgeBase = [
            {
                title: 'Getting Started Guide',
                description: 'Learn how to use Matrix.Shop effectively',
                category: 'getting-started',
                icon: 'fa-play-circle',
                views: Math.floor(Math.random() * 1000) + 100,
                helpful: Math.floor(Math.random() * 20) + 80
            },
            {
                title: 'Account Management',
                description: 'How to manage your account settings',
                category: 'account',
                icon: 'fa-user-cog',
                views: Math.floor(Math.random() * 800) + 50,
                helpful: Math.floor(Math.random() * 15) + 85
            },
            {
                title: 'Order Processing',
                description: 'Understanding the order process',
                category: 'orders',
                icon: 'fa-shopping-cart',
                views: Math.floor(Math.random() * 1200) + 200,
                helpful: Math.floor(Math.random() * 25) + 75
            },
            {
                title: 'Payment Methods',
                description: 'Available payment options and setup',
                category: 'payment',
                icon: 'fa-credit-card',
                views: Math.floor(Math.random() * 600) + 100,
                helpful: Math.floor(Math.random() * 20) + 80
            },
            {
                title: 'Technical Troubleshooting',
                description: 'Common technical issues and solutions',
                category: 'technical',
                icon: 'fa-tools',
                views: Math.floor(Math.random() * 900) + 150,
                helpful: Math.floor(Math.random() * 30) + 70
            },
            {
                title: 'API Documentation',
                description: 'Developer resources and API guides',
                category: 'api',
                icon: 'fa-code',
                views: Math.floor(Math.random() * 400) + 50,
                helpful: Math.floor(Math.random() * 15) + 85
            }
        ];
    };
    // Generate support team
    $scope.generateSupportTeam = function () {
        $scope.supportTeam = [
            {
                name: 'John Smith',
                role: 'Senior Support Specialist',
                avatar: null,
                status: 'online',
                activeTickets: Math.floor(Math.random() * 10) + 5,
                resolvedTickets: Math.floor(Math.random() * 50) + 20
            },
            {
                name: 'Sarah Johnson',
                role: 'Technical Support Lead',
                avatar: null,
                status: 'online',
                activeTickets: Math.floor(Math.random() * 8) + 3,
                resolvedTickets: Math.floor(Math.random() * 60) + 30
            },
            {
                name: 'Mike Wilson',
                role: 'Customer Success Manager',
                avatar: null,
                status: 'away',
                activeTickets: Math.floor(Math.random() * 6) + 2,
                resolvedTickets: Math.floor(Math.random() * 40) + 25
            },
            {
                name: 'Lisa Brown',
                role: 'Support Specialist',
                avatar: null,
                status: 'online',
                activeTickets: Math.floor(Math.random() * 12) + 4,
                resolvedTickets: Math.floor(Math.random() * 45) + 15
            }
        ];
    };
    // Generate FAQ
    $scope.generateFAQ = function () {
        $scope.faqList = [
            {
                question: 'How do I reset my password?',
                answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your email.',
                helpful: Math.floor(Math.random() * 50) + 20,
                notHelpful: Math.floor(Math.random() * 10) + 1,
                expanded: false
            },
            {
                question: 'How can I track my order?',
                answer: 'You can track your order by logging into your account and going to the "My Orders" section. You will receive email updates at each stage of the shipping process.',
                helpful: Math.floor(Math.random() * 60) + 30,
                notHelpful: Math.floor(Math.random() * 8) + 2,
                expanded: false
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely.',
                helpful: Math.floor(Math.random() * 40) + 25,
                notHelpful: Math.floor(Math.random() * 5) + 1,
                expanded: false
            },
            {
                question: 'How do I contact customer support?',
                answer: 'You can contact our support team through the support portal, email us at support@matrix.shop, or use the live chat feature on our website.',
                helpful: Math.floor(Math.random() * 35) + 15,
                notHelpful: Math.floor(Math.random() * 6) + 1,
                expanded: false
            },
            {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day return policy for all products. Items must be in original condition with tags attached. Contact support to initiate a return.',
                helpful: Math.floor(Math.random() * 45) + 20,
                notHelpful: Math.floor(Math.random() * 7) + 2,
                expanded: false
            }
        ];
    };
    // Calculate analytics
    $scope.calculateAnalytics = function () {
        $scope.averageResponseTime = Math.floor(Math.random() * 24) + 2; // 2-26 hours
        $scope.fastestResponseTime = Math.floor(Math.random() * 4) + 1; // 1-5 hours
        $scope.resolutionRate = Math.round(($scope.resolvedTickets / $scope.totalTickets) * 100);
        $scope.overallRating = Math.round((Math.random() * 1 + 4) * 10) / 10; // 4.0-5.0
        $scope.totalReviews = Math.floor(Math.random() * 200) + 50;
    };
    // Filter tickets
    $scope.filterTickets = function () {
        $scope.filteredTickets = $scope.tickets.filter(function (ticket) {
            const matchesSearch = !$scope.searchQuery ||
                ticket.subject.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                ticket.customer.name.toLowerCase().includes($scope.searchQuery.toLowerCase());
            const matchesStatus = !$scope.selectedStatus || ticket.status === $scope.selectedStatus;
            const matchesPriority = !$scope.selectedPriority || ticket.priority === $scope.selectedPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    };
    // Toggle select all
    $scope.toggleSelectAll = function () {
        $scope.filteredTickets.forEach(function (ticket) {
            ticket.selected = $scope.selectAll;
        });
    };
    // Toggle FAQ
    $scope.toggleFaq = function (faq) {
        faq.expanded = !faq.expanded;
    };
    // Get stars for rating display
    $scope.getStars = function (rating) {
        const stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(i);
        }
        return stars;
    };
    // Ticket actions
    $scope.createTicket = function () {
        console.log('Creating new ticket...');
        alert('Create Ticket functionality would be implemented here');
    };
    $scope.viewTicket = function (ticket) {
        console.log('Viewing ticket:', ticket.id);
        alert('View Ticket: ' + ticket.id);
    };
    $scope.editTicket = function (ticket) {
        console.log('Editing ticket:', ticket.id);
        alert('Edit Ticket: ' + ticket.id);
    };
    $scope.assignTicket = function (ticket) {
        console.log('Assigning ticket:', ticket.id);
        alert('Assign Ticket: ' + ticket.id);
    };
    $scope.closeTicket = function (ticket) {
        if (confirm('Are you sure you want to close ticket ' + ticket.id + '?')) {
            ticket.status = 'closed';
            $scope.calculateStats();
            console.log('Closed ticket:', ticket.id);
        }
    };
    $scope.bulkActions = function () {
        const selectedTickets = $scope.filteredTickets.filter(function (ticket) {
            return ticket.selected;
        });
        console.log('Bulk actions for:', selectedTickets.length, 'tickets');
        alert('Bulk actions for ' + selectedTickets.length + ' tickets');
    };
    $scope.exportTickets = function () {
        console.log('Exporting tickets...');
        alert('Export tickets functionality would be implemented here');
    };
    // Knowledge base actions
    $scope.viewArticle = function (article) {
        console.log('Viewing article:', article.title);
        alert('View Article: ' + article.title);
    };
    $scope.editArticle = function (article) {
        console.log('Editing article:', article.title);
        alert('Edit Article: ' + article.title);
    };
    // Support team actions
    $scope.contactMember = function (member) {
        console.log('Contacting member:', member.name);
        alert('Contact: ' + member.name);
    };
    // FAQ actions
    $scope.helpfulFaq = function (faq) {
        faq.helpful++;
        console.log('Marked FAQ as helpful:', faq.question);
    };
    $scope.notHelpfulFaq = function (faq) {
        faq.notHelpful++;
        console.log('Marked FAQ as not helpful:', faq.question);
    };
    // Quick actions
    $scope.viewKnowledgeBase = function () {
        console.log('Viewing knowledge base...');
        alert('Knowledge Base functionality would be implemented here');
    };
    $scope.contactSupport = function () {
        console.log('Starting live chat...');
        alert('Live Chat functionality would be implemented here');
    };
    $scope.scheduleCall = function () {
        console.log('Scheduling support call...');
        alert('Schedule Call functionality would be implemented here');
    };
    // Initialize support on load
    $scope.loadData();
});
export {};
//# sourceMappingURL=support.js.map