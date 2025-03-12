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

  // Determine if balance is negative (shortage)
  const isShortage = stats.balance < 0;

  // Use the aggregated data from the backend
  const youthPaid = stats.youthPaid || 0;
  const youthNotPaid = stats.youthNotPaid || 0;
  const villagersPaid = stats.villagersPaid || 0;
  const villagersNotPaid = stats.villagersNotPaid || 0;

  const youthTotal = youthPaid + youthNotPaid;
  const villagersTotal = villagersPaid + villagersNotPaid;

  return (
    <div className="space-y-6">
      {/* Section 1: Estimated Income and Expense */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium flex items-center">
              <IndianRupee className="h-5 w-5 mr-2" />
              Estimated Income
            </h2>
            <p className="mt-4 text-2xl font-bold text-green-600">
              {formatAmount(stats.totalEstimatedIncome)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium flex items-center">
              <IndianRupee className="h-5 w-5 mr-2" />
              Estimated Expense
            </h2>
            <p className="mt-4 text-2xl font-bold text-red-600">
              {formatAmount(stats.totalEstimatedExpense)}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Amount Left / Shortage */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium">Amount Left</h2>
        <div className="mt-4">
          <p className={`text-2xl font-bold ${isShortage ? 'text-red-600' : 'text-green-600'}`}>
            {formatAmount(stats.balance)}
          </p>
          <p className="text-sm text-gray-600">
            {isShortage ? 'Shortage' : ''}
          </p>
        </div>
      </div>

      {/* Section 3: Youth and Villagers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium flex items-center justify-between">
            <span>Youth</span>
            <span className="text-lg font-bold">{formatAmount(youthTotal)}</span>
          </h2>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Paid: <span className="font-bold">{formatAmount(youthPaid)}</span>
            </p>
            <p className="text-sm text-gray-600">
              Not Paid: <span className="font-bold">{formatAmount(youthNotPaid)}</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium flex items-center justify-between">
            <span>Villagers</span>
            <span className="text-lg font-bold">{formatAmount(villagersTotal)}</span>
          </h2>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Paid: <span className="font-bold">{formatAmount(villagersPaid)}</span>
            </p>
            <p className="text-sm text-gray-600">
              Not Paid: <span className="font-bold">{formatAmount(villagersNotPaid)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstimationStats;
