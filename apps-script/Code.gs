/** Meeheng Food ERP */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index').evaluate().setTitle('Meeheng Food ERP');
}

function getDashboardSummary() {
  return {
    todaySales: 0,
    monthlySales: 0,
    lowStock: 0,
    productionToday: 0,
    message: 'Demo mode'
  };
}
