import { useQuery } from '@tanstack/react-query';
import { getLeadsFn } from '../api/leads';
import { Users, UserCheck, UserMinus, UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['leads-stats'],
    queryFn: () => getLeadsFn({ limit: 1000 }), // Get all for simple stats in this example
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const leads = data?.data || [];
  
  const stats = [
    {
      name: 'Total Leads',
      value: leads.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'New Leads',
      value: leads.filter((l) => l.status === 'New').length,
      icon: UserPlus,
      color: 'bg-green-500',
    },
    {
      name: 'Qualified Leads',
      value: leads.filter((l) => l.status === 'Qualified').length,
      icon: UserCheck,
      color: 'bg-purple-500',
    },
    {
      name: 'Lost Leads',
      value: leads.filter((l) => l.status === 'Lost').length,
      icon: UserMinus,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Analytics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of your lead pipeline</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card flex items-center p-6"
          >
            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
              <stat.icon className={`h-8 w-8 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        {leads.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity yet.</p>
        ) : (
          <div className="space-y-4">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead._id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
