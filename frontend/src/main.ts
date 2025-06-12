const API_BASE = '/api';

async function fetchJson(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  return response.json();
}

async function loadData() {
  try {
    const persons = await fetchJson(`${API_BASE}/persons`);
    displayList('personsList', persons);

    const accounts = await fetchJson(`${API_BASE}/accounts`);
    displayList('accountsList', accounts);

    const transactions = await fetchJson(`${API_BASE}/transactions`);
    displayList('transactionsList', transactions);
  } catch (err) {
    alert(err);
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

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  const personForm = document.getElementById('personForm') as HTMLFormElement;
  personForm.addEventListener('submit', addPerson);

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
