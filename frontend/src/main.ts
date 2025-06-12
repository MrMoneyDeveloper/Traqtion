const API_BASE = '/api';
let authToken: string | null = null;

async function fetchJson(url: string, options: RequestInit = {}): Promise<any> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
    },
    ...options
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  return response.json();
}

async function loadData(searchTerm: string = '') {
  try {
    const persons = await fetchJson(`${API_BASE}/persons/search?term=${encodeURIComponent(searchTerm)}`);
    displayList('personsList', persons);

    const accounts = await fetchJson(`${API_BASE}/accounts`);
    displayList('accountsList', accounts);

    const transactions = await fetchJson(`${API_BASE}/transactions`);
    displayList('transactionsList', transactions);
  } catch (err: any) {
    alert(err.message);
  }
}

function displayList(elementId: string, data: any) {
  const el = document.getElementById(elementId)!;
  el.textContent = JSON.stringify(data, null, 2);
}

async function addPerson(ev: Event) {
  ev.preventDefault();
  const form = ev.target as HTMLFormElement;
  const person = {
    idNumber: (form.elements.namedItem('idNumber') as HTMLInputElement).value,
    firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
    lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
    dateOfBirth: (form.elements.namedItem('dateOfBirth') as HTMLInputElement).value
  };
  await fetchJson(`${API_BASE}/persons`, {
    method: 'POST',
    body: JSON.stringify(person)
  });
  loadData();
  form.reset();
}

async function addAccount(ev: Event) {
  ev.preventDefault();
  const form = ev.target as HTMLFormElement;
  const account = {
    accountNumber: (form.elements.namedItem('accountNumber') as HTMLInputElement).value,
    personId: parseInt((form.elements.namedItem('personId') as HTMLInputElement).value)
  };
  await fetchJson(`${API_BASE}/accounts`, {
    method: 'POST',
    body: JSON.stringify(account)
  });
  loadData();
  form.reset();
}

async function addTransaction(ev: Event) {
  ev.preventDefault();
  const form = ev.target as HTMLFormElement;
  const tx = {
    accountId: parseInt((form.elements.namedItem('txAccountId') as HTMLInputElement).value),
    amount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value),
    type: (form.elements.namedItem('type') as HTMLSelectElement).value,
    description: (form.elements.namedItem('description') as HTMLInputElement).value,
    transactionDate: (form.elements.namedItem('transactionDate') as HTMLInputElement).value
  };
  await fetchJson(`${API_BASE}/transactions`, {
    method: 'POST',
    body: JSON.stringify(tx)
  });
  loadData();
  form.reset();
}

async function doLogin(ev: Event) {
  ev.preventDefault();
  const form = ev.target as HTMLFormElement;
  const loginReq = {
    username: (form.elements.namedItem('username') as HTMLInputElement).value,
    password: (form.elements.namedItem('password') as HTMLInputElement).value
  };
  try {
    const result = await fetchJson(`${API_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify(loginReq)
    });
    authToken = result.token || result.Token;
    (document.getElementById('loginResult') as HTMLElement).textContent = `Token: ${authToken}`;
  } catch (err: any) {
    alert(err.message);
  }
  form.reset();
}

function setupForms() {
  const personForm = document.getElementById('personForm') as HTMLFormElement;
  personForm.addEventListener('submit', addPerson);

  const accountForm = document.getElementById('accountForm') as HTMLFormElement;
  accountForm.addEventListener('submit', addAccount);

  const txForm = document.getElementById('transactionForm') as HTMLFormElement;
  txForm.addEventListener('submit', addTransaction);

  const loginForm = document.getElementById('loginForm') as HTMLFormElement;
  loginForm.addEventListener('submit', doLogin);

  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  searchInput.addEventListener('input', () => loadData(searchInput.value));
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupForms();

  // tsParticles init using global variable from CDN
  // @ts-ignore
  tsParticles.load('tsparticles', {
    particles: {
      number: { value: 40 },
      size: { value: 3 },
      move: { enable: true, speed: 1 }
    }
  });
});
