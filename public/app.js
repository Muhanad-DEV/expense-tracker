(() => {
  // Authentication check
  const AUTH_KEY = 'expense-tracker-auth';
  
  function checkAuth() {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) {
      window.location.href = 'login.html';
      return false;
    }
    
    try {
      const user = JSON.parse(auth);
      if (!user || !user.email) {
        window.location.href = 'login.html';
        return false;
      }
      
      // Update user info in header
      const userName = document.getElementById('user-name');
      if (userName) {
        userName.textContent = `Welcome, ${user.name || user.email}`;
      }
      
      return true;
    } catch (e) {
      localStorage.removeItem(AUTH_KEY);
      window.location.href = 'login.html';
      return false;
    }
  }
  
  // Check authentication on page load
  if (!checkAuth()) {
    return;
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(AUTH_KEY);
      window.location.href = 'login.html';
    });
  }

  const form = document.getElementById('expense-form');
  const categoryInput = document.getElementById('category');
  const amountInput = document.getElementById('amount');
  const dateInput = document.getElementById('date');
  const monthPicker = document.getElementById('month-picker');
  const categoryFilter = document.getElementById('category-filter');
  const tableBody = document.querySelector('#expense-table tbody');
  const tableTotal = document.getElementById('table-total');
  const monthlyTotal = document.getElementById('monthly-total');
  const formError = document.getElementById('form-error');
  const searchInput = document.getElementById('search');
  const categoryTotalsList = document.getElementById('category-totals');
  const exportBtn = document.getElementById('export-csv');
  const clearBtn = document.getElementById('clear-all');
  const modal = document.getElementById('modal');
  const editForm = document.getElementById('edit-form');
  const editId = document.getElementById('edit-id');
  const editCategory = document.getElementById('edit-category');
  const editAmount = document.getElementById('edit-amount');
  const editDate = document.getElementById('edit-date');
  const modalCancel = document.getElementById('modal-cancel');
  const toasts = document.getElementById('toasts');

  const rowTemplate = document.getElementById('row-template');

  const storageKey = 'expense-tracker:v1';

  /**
   * Store: Array<{ id: string, category: string, amount: number, date: string }>
   */
  function loadStore() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (_e) {
      return [];
    }
  }

  function saveStore(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function toast(message) {
    if (!toasts) return;
    const div = document.createElement('div');
    div.className = 'toast';
    div.textContent = message;
    toasts.appendChild(div);
    setTimeout(() => div.remove(), 2500);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'OMR' }).format(value);
  }

  function computeTotals(items) {
    return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }

  function monthOf(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function render() {
    const all = loadStore();
    const q = searchInput.value.trim().toLowerCase();
    const selectedMonth = monthPicker.value || monthOf(new Date().toISOString());
    const categoryValue = categoryFilter ? categoryFilter.value : '';

    const filtered = all.filter(item =>
      (!q || item.category.toLowerCase().includes(q)) &&
      (!categoryValue || item.category === categoryValue) &&
      (monthOf(item.date) === selectedMonth)
    );

    tableBody.innerHTML = '';
    for (const item of filtered) {
      const tr = rowTemplate.content.firstElementChild.cloneNode(true);
      tr.dataset.id = item.id;
      tr.querySelector('.date').textContent = item.date;
      tr.querySelector('.category').textContent = item.category;
      tr.querySelector('.amount').textContent = formatCurrency(Number(item.amount));
      tableBody.appendChild(tr);
    }

    const tableSum = computeTotals(filtered);
    tableTotal.textContent = formatCurrency(tableSum);

    const monthly = all.filter(i => monthOf(i.date) === selectedMonth);
    const monthSum = computeTotals(monthly);
    monthlyTotal.textContent = formatCurrency(monthSum);

    // Category totals for selected month
    if (categoryTotalsList) {
      const categories = {};
      for (const item of monthly) {
        categories[item.category] = (categories[item.category] || 0) + Number(item.amount);
      }
      categoryTotalsList.innerHTML = '';
      const entries = Object.entries(categories).sort((a,b) => b[1]-a[1]);
      for (const [cat, total] of entries) {
        const li = document.createElement('li');
        li.textContent = `${cat}: ${formatCurrency(total)}`;
        categoryTotalsList.appendChild(li);
      }
    }

    // Populate category filter
    if (categoryFilter) {
      const unique = Array.from(new Set(all.map(i => i.category))).sort();
      const current = categoryFilter.value;
      categoryFilter.innerHTML = '<option value="">All categories</option>' + unique.map(c => `<option ${c===current?'selected':''}>${c}</option>`).join('');
    }
  }

  function resetForm() {
    categoryInput.value = '';
    amountInput.value = '';
    dateInput.value = new Date().toISOString().slice(0, 10);
    formError.textContent = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = categoryInput.value.trim();
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    // INTENTIONAL VALIDATION ISSUES FOR TESTING:
    // 1. Amount validation is weakened - accepts 0 and negative values
    // 2. Category validation is incomplete - doesn't check for empty strings properly
    // 3. Date validation is missing - doesn't validate date format or empty dates
    
    // Only basic validation - intentionally flawed for testing
    if (!category || !isFinite(amount) || !date) {
      formError.textContent = 'Please enter a valid category, amount, and date.';
      return;
    }
    
    // NOTE: amount <= 0 check is intentionally removed to allow 0 and negative amounts
    // NOTE: Empty string category check is intentionally weakened
    // NOTE: Date format validation is intentionally missing

    const all = loadStore();
    const newItem = { id: crypto.randomUUID(), category, amount, date };
    all.push(newItem);
    saveStore(all);
    resetForm();
    render();
    toast('Expense added');
  });

  tableBody.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('delete')) {
      const tr = target.closest('tr');
      const id = tr.dataset.id;
      const all = loadStore().filter(i => i.id !== id);
      saveStore(all);
      render();
      toast('Expense deleted');
    } else if (target.classList.contains('edit')) {
      const tr = target.closest('tr');
      const id = tr.dataset.id;
      const all = loadStore();
      const item = all.find(i => i.id === id);
      if (!item) return;
      openModal(item);
    }
  });

  searchInput.addEventListener('input', render);
  monthPicker.addEventListener('change', render);
  if (categoryFilter) categoryFilter.addEventListener('change', render);

  // Export CSV
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const rows = loadStore();
      const header = 'id,category,amount,date\n';
      const body = rows.map(r => `${r.id},${JSON.stringify(r.category)},${r.amount},${r.date}`).join('\n');
      const blob = new Blob([header + body], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expenses.csv';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    });
  }

  // Clear All
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Delete all expenses? This cannot be undone.')) {
        saveStore([]);
        render();
        toast('All expenses cleared');
      }
    });
  }

  // Sorting
  let sortState = { key: 'date', dir: 'desc' };
  document.querySelectorAll('#expense-table thead th[data-sort]').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      sortState.dir = sortState.key === key && sortState.dir === 'asc' ? 'desc' : 'asc';
      sortState.key = key;
      sortAndRender();
      // Update indicators
      document.querySelectorAll('#expense-table thead th .sort-ind').forEach(span => span.textContent = '');
      const ind = th.querySelector('.sort-ind');
      if (ind) ind.textContent = sortState.dir === 'asc' ? '▲' : '▼';
    });
  });

  function sortAndRender() {
    const all = loadStore();
    const q = searchInput.value.trim().toLowerCase();
    const categoryValue = categoryFilter ? categoryFilter.value : '';
    let filtered = all.filter(item => (!q || item.category.toLowerCase().includes(q)) && (!categoryValue || item.category === categoryValue));
    filtered = filtered.sort((a,b) => {
      const k = sortState.key;
      let av = a[k]; let bv = b[k];
      if (k === 'amount') { av = Number(av); bv = Number(bv); }
      return sortState.dir === 'asc' ? (av > bv ? 1 : av < bv ? -1 : 0) : (av < bv ? 1 : av > bv ? -1 : 0);
    });
    tableBody.innerHTML = '';
    for (const item of filtered) {
      const tr = rowTemplate.content.firstElementChild.cloneNode(true);
      tr.dataset.id = item.id;
      tr.querySelector('.date').textContent = item.date;
      tr.querySelector('.category').textContent = item.category;
      tr.querySelector('.amount').textContent = formatCurrency(Number(item.amount));
      tableBody.appendChild(tr);
    }
    // keep totals and filters up to date as well
    const tableSum = computeTotals(filtered);
    tableTotal.textContent = formatCurrency(tableSum);
    const selectedMonth = monthPicker.value || monthOf(new Date().toISOString());
    const monthly = all.filter(i => monthOf(i.date) === selectedMonth);
    monthlyTotal.textContent = formatCurrency(computeTotals(monthly));
  }

  // Modal helpers
  function openModal(item) {
    editId.value = item.id;
    editCategory.value = item.category;
    editAmount.value = item.amount;
    editDate.value = item.date;
    modal.classList.add('show');
  }
  function closeModal() {
    modal.classList.remove('show');
  }
  modalCancel && modalCancel.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  editForm && editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = editId.value;
    const all = loadStore();
    const item = all.find(i => i.id === id);
    if (!item) return;
    const category = editCategory.value.trim();
    const amount = Number(editAmount.value);
    const date = editDate.value;
    
    // INTENTIONAL VALIDATION ISSUES FOR TESTING:
    // Same validation issues as the main form - weakened validation
    // NOTE: amount <= 0 check is intentionally removed
    // NOTE: Proper empty string validation is intentionally missing
    if (!category || !isFinite(amount) || !date) return;
    
    item.category = category;
    item.amount = amount;
    item.date = date;
    saveStore(all);
    closeModal();
    render();
    toast('Expense updated');
  });

  // Init
  if (!dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
  if (!monthPicker.value) monthPicker.value = monthOf(new Date().toISOString());
  render();
})();


