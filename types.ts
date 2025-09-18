// Type definitions for the Cofactr application

export interface User {
  id: number;
  Name: string;
  Email?: string;
  avatar?: string;
  role?: string;
  status?: string;
  department?: string;
  lastLogin?: string;
  createdDate?: string;
  selected?: boolean;
}

export interface Product {
  id: number;
  name: string;
  Category: string;
  Description: string;
  Price: number;
  ImageURL: string;
  salesCount?: number;
}

export interface OrderProduct {
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  totalPrice: number;
  orderStatus: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered';
  paymentStatus: 'Pending' | 'Paid';
  ShippingAddress: string;
  products: OrderProduct[];
  product?: string;
  itemNo?: number;
  incoming?: number;
  category?: string;
  date?: string;
  quantity?: number;
  price?: number;
  paid?: boolean;
  status?: string;
}

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

export interface UserProfile {
  name: string;
  email: string;
  image: string | null;
  role: string;
}

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  averageOrderValue: number;
  ordersThisMonth: number;
  pendingPayments: number;
  deliveredOrders: number;
}

export interface InventoryStats {
  totalInventoryValue: number;
  averagePrice: number;
}

export interface ProductionMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageProductionTime: number;
  defectRate: number;
  qualityScore: number;
  reworkRate: number;
  machineUtilization: number;
  workforceEfficiency: number;
}

export interface ProductionStatus {
  name: string;
  count: number;
  icon: string;
}

export interface ProductionSchedule {
  title: string;
  description: string;
  date: string;
  status: string;
}

export interface ReportMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  productGrowth: number;
  grossRevenue: number;
  costOfGoods: number;
  operatingExpenses: number;
  netProfit: number;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  websiteVisitors: number;
  conversionRate: number;
  averageOrderValue: number;
  overallRating: number;
  totalReviews: number;
  returnRate: number;
}

export interface TopProduct {
  id: number;
  name: string;
  category: string;
  image: string;
  sales: number;
  revenue: number;
}

export interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
}

export interface DetailedReport {
  date: string;
  orderId: number;
  customer: string;
  product: string;
  quantity: number;
  revenue: number;
  status: string;
}

export interface Role {
  name: string;
  description: string;
  icon: string;
  userCount: number;
  permissions: string[];
}

export interface Permission {
  name: string;
  key: string;
}

export interface Activity {
  type: string;
  icon: string;
  title: string;
  description: string;
  user: User;
  timestamp: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireSpecial: boolean;
  expiryDays: number;
}

export interface SessionSettings {
  timeout: number;
  maxConcurrent: number;
  rememberMe: boolean;
}

export interface TwoFactorAuth {
  required: boolean;
  smsEnabled: boolean;
  appEnabled: boolean;
}

export interface SupportTicket {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string | null;
  };
  subject: string;
  priority: string;
  status: string;
  assignee: string;
  createdDate: string;
  selected?: boolean;
}

export interface KnowledgeBaseArticle {
  title: string;
  description: string;
  category: string;
  icon: string;
  views: number;
  helpful: number;
}

export interface SupportTeamMember {
  name: string;
  role: string;
  avatar: string | null;
  status: string;
  activeTickets: number;
  resolvedTickets: number;
}

export interface FAQ {
  question: string;
  answer: string;
  helpful: number;
  notHelpful: number;
  expanded: boolean;
}

export interface DatabaseData {
  users: User[];
  ProductsList: Product[];
  OrdersList: Order[];
}
