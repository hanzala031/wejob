
import React from 'react';
import { DollarSign, CheckCircle, Send, Eye, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-xs">
        <span className={`flex items-center font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          <ArrowUpRight size={14} className="mr-1" />
          {trend}
        </span>
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

interface DashboardStatsProps {
    stats?: {
        earnings: string;
        completedJobs: number;
        proposalsSent: number;
        views: string;
    }
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const data = stats || {
      earnings: "$8,250",
      completedJobs: 42,
      proposalsSent: 128,
      views: "1.5k"
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <StatCard 
        title="Total Earnings" 
        value={data.earnings} 
        icon={<DollarSign size={22} />} 
        trend="24%" 
        trendUp={true} 
        color="bg-green-500"
      />
      <StatCard 
        title="Jobs Completed" 
        value={data.completedJobs} 
        icon={<CheckCircle size={22} />} 
        trend="12%" 
        trendUp={true} 
        color="bg-blue-500"
      />
      <StatCard 
        title="Proposals Sent" 
        value={data.proposalsSent} 
        icon={<Send size={22} />} 
        trend="8%" 
        trendUp={true} 
        color="bg-purple-500"
      />
      <StatCard 
        title="Profile Views" 
        value={data.views} 
        icon={<Eye size={22} />} 
        trend="5%" 
        trendUp={true} 
        color="bg-orange-500"
      />
    </div>
  );
};

export default DashboardStats;
