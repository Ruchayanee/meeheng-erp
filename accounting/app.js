function setupExpenseButton(){
  const btn=document.getElementById('saveExpenseBtn');
  if(btn){
    btn.addEventListener('click',()=>{
      alert('Expense system ready');
    });
  }
}

document.addEventListener('DOMContentLoaded',setupExpenseButton);