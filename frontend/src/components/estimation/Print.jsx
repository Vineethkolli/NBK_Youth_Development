import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Printer } from 'lucide-react';

function EstimationPrint({ activeTab, stats, incomes, expenses, visibleColumns }) {
  const handlePrint = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Set title based on active tab
    let title = 'NBK Youth Estimation';
    if (activeTab === 'stats') {
      title += ' - Statistics';
    } else if (activeTab === 'income') {
      title += ' - Income';
    } else if (activeTab === 'expense') {
      title += ' - Expense';
    }

    // Add title
    doc.setFontSize(16);
    doc.text(title, 105, 15, { align: 'center' });

    if (activeTab === 'stats') {
      // Print stats
      const yPos = 30;
      doc.setFontSize(12);

      // Overall Stats
      doc.text('Overall Statistics', 14, yPos);
      const overallData = [
        ['Total Estimated Income', `₹${stats.totalEstimatedIncome}`],
        ['Total Estimated Paid Income', `₹${stats.totalEstimatedPaidIncome}`],
        ['Total Estimated Not Paid Income', `₹${stats.totalEstimatedNotPaidIncome}`],
        ['Total Estimated Expense', `₹${stats.totalEstimatedExpense}`],
        ['Balance', `₹${stats.balance}`],
      ];

      doc.autoTable({
        startY: yPos + 5,
        head: [['Category', 'Amount']],
        body: overallData,
        theme: 'grid',
      });

      // Youth Stats
      const youthData = [
        ['Total', `₹${stats.youthPaid + stats.youthNotPaid}`],
        ['Paid', `₹${stats.youthPaid}`],
        ['Not Paid', `₹${stats.youthNotPaid}`],
        ['Total Entries', stats.youthCount],
      ];

      doc.text('Youth Statistics', 14, doc.lastAutoTable.finalY + 15);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Category', 'Amount']],
        body: youthData,
        theme: 'grid',
      });

      // Villagers Stats
      const villagersData = [
        ['Total', `₹${stats.villagersPaid + stats.villagersNotPaid}`],
        ['Paid', `₹${stats.villagersPaid}`],
        ['Not Paid', `₹${stats.villagersNotPaid}`],
        ['Total Entries', stats.villagersCount],
      ];

      doc.text('Villagers Statistics', 14, doc.lastAutoTable.finalY + 15);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Category', 'Amount']],
        body: villagersData,
        theme: 'grid',
      });

    } else if (activeTab === 'income') {
      // Print income data
      const headers = ['S.No'];
      const columnKeys = Object.entries(visibleColumns)
        .filter(([_, isVisible]) => isVisible)
        .map(([key]) => key);

      columnKeys.forEach(key => {
        switch(key) {
          case 'name': headers.push('Name'); break;
          case 'previousAmount': headers.push('Previous Amount'); break;
          case 'presentAmount': headers.push('Present Amount'); break;
          case 'belongsTo': headers.push('Belongs To'); break;
          case 'status': headers.push('Status'); break;
          case 'others': headers.push('Others'); break;
        }
      });

      const body = incomes.map((income, index) => {
        const row = [index + 1];
        columnKeys.forEach(key => {
          row.push(income[key]);
        });
        return row;
      });

      doc.autoTable({
        startY: 25,
        head: [headers],
        body: body,
        theme: 'grid',
      });

    } else if (activeTab === 'expense') {
      // Print expense data
      const headers = ['S.No'];
      const columnKeys = Object.entries(visibleColumns)
        .filter(([_, isVisible]) => isVisible)
        .map(([key]) => key);

      columnKeys.forEach(key => {
        switch(key) {
          case 'purpose': headers.push('Purpose'); break;
          case 'previousAmount': headers.push('Previous Amount'); break;
          case 'presentAmount': headers.push('Present Amount'); break;
          case 'others': headers.push('Others'); break;
        }
      });

      const body = expenses.map((expense, index) => {
        const row = [index + 1];
        columnKeys.forEach(key => {
          row.push(expense[key]);
        });
        return row;
      });

      doc.autoTable({
        startY: 25,
        head: [headers],
        body: body,
        theme: 'grid',
      });
    }

    // Add footer with timestamp and page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Generated on: ${timestamp}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 14,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }

    doc.save('Estimation_Report.pdf');
  };

  return (
    <button onClick={handlePrint} className="btn-secondary">
      <Printer className="h-4 w-4 mr-2" />
      Print
    </button>
  );
}

export default EstimationPrint;