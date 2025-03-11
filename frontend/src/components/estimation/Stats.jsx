import { IndianRupee } from 'lucide-react';

function EstimationStats({ stats }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium flex items-center">
          <IndianRupee className="h-5 w-5 mr-2" />
          Current Estimated Income
        </h2>
        <div className="mt-4 space-y-2">
          <p className="text-2xl font-bold text-green-600">
            {formatAmount(stats.totalEstimatedIncome)}
          </p>
          <div className="text-sm text-gray-600">
            <p>Paid: {formatAmount(stats.totalEstimatedPaidIncome)}</p>
            <p>Not Paid: {formatAmount(stats.totalEstimatedNotPaidIncome)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium flex items-center">
          <IndianRupee className="h-5 w-5 mr-2" />
          Current Estimated Expense
        </h2>
        <div className="mt-4">
          <p className="text-2xl font-bold text-red-600">
            {formatAmount(stats.totalEstimatedExpense)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium flex items-center">
          <IndianRupee className="h-5 w-5 mr-2" />
          Balance
        </h2>
        <div className="mt-4">
          <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatAmount(stats.balance)}
          </p>
          <p className="text-sm text-gray-600">
            {stats.balance >= 0 ? 'Balance Left' : 'Shortage'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EstimationStats;