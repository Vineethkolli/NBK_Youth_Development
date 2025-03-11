function EstimatedStats({ stats }) {
    return (
      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Estimated Stats</h2>
        <div className="mb-2">
          <h3 className="font-semibold">Income</h3>
          <p>Current Estimated Income: {stats.income.currentEstimatedIncome}</p>
          <p>Income Paid: {stats.income.paid}</p>
          <p>Income Not Paid: {stats.income.notPaid}</p>
        </div>
        <div className="mb-2">
          <h3 className="font-semibold">Expense</h3>
          <p>Current Estimated Expense: {stats.expense.currentEstimatedExpense}</p>
        </div>
        <div>
          <h3 className="font-semibold">Balance</h3>
          <p>{stats.balance >= 0 ? `Balance Left: ${stats.balance}` : `Shortage: ${-stats.balance}`}</p>
        </div>
      </div>
    );
  }
  
  export default EstimatedStats;
  