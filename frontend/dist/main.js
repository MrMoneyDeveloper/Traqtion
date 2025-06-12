"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE = '/api';
let authToken = null;
function fetchJson(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}) {
        const response = yield fetch(url, Object.assign({ headers: Object.assign({ 'Content-Type': 'application/json' }, (authToken ? { 'Authorization': `Bearer ${authToken}` } : {})) }, options));
        if (!response.ok) {
            const text = yield response.text();
            throw new Error(text || response.statusText);
        }
        return response.json();
    });
}
function loadData() {
    return __awaiter(this, arguments, void 0, function* (searchTerm = '') {
        try {
            const persons = yield fetchJson(`${API_BASE}/persons/search?term=${encodeURIComponent(searchTerm)}`);
            displayList('personsList', persons);
            const accounts = yield fetchJson(`${API_BASE}/accounts`);
            displayList('accountsList', accounts);
            const transactions = yield fetchJson(`${API_BASE}/transactions`);
            displayList('transactionsList', transactions);
        }
        catch (err) {
            alert(err.message);
        }
    });
}
function displayList(elementId, data) {
    const el = document.getElementById(elementId);
    el.textContent = JSON.stringify(data, null, 2);
}
function addPerson(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        ev.preventDefault();
        const form = ev.target;
        const person = {
            idNumber: form.elements.namedItem('idNumber').value,
            firstName: form.elements.namedItem('firstName').value,
            lastName: form.elements.namedItem('lastName').value,
            dateOfBirth: form.elements.namedItem('dateOfBirth').value
        };
        yield fetchJson(`${API_BASE}/persons`, {
            method: 'POST',
            body: JSON.stringify(person)
        });
        loadData();
        form.reset();
    });
}
function addAccount(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        ev.preventDefault();
        const form = ev.target;
        const account = {
            accountNumber: form.elements.namedItem('accountNumber').value,
            personId: parseInt(form.elements.namedItem('personId').value)
        };
        yield fetchJson(`${API_BASE}/accounts`, {
            method: 'POST',
            body: JSON.stringify(account)
        });
        loadData();
        form.reset();
    });
}
function addTransaction(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        ev.preventDefault();
        const form = ev.target;
        const tx = {
            accountId: parseInt(form.elements.namedItem('txAccountId').value),
            amount: parseFloat(form.elements.namedItem('amount').value),
            type: form.elements.namedItem('type').value,
            description: form.elements.namedItem('description').value,
            transactionDate: form.elements.namedItem('transactionDate').value
        };
        yield fetchJson(`${API_BASE}/transactions`, {
            method: 'POST',
            body: JSON.stringify(tx)
        });
        loadData();
        form.reset();
    });
}
function doLogin(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        ev.preventDefault();
        const form = ev.target;
        const loginReq = {
            username: form.elements.namedItem('username').value,
            password: form.elements.namedItem('password').value
        };
        try {
            const result = yield fetchJson(`${API_BASE}/login`, {
                method: 'POST',
                body: JSON.stringify(loginReq)
            });
            authToken = result.token || result.Token;
            document.getElementById('loginResult').textContent = `Token: ${authToken}`;
        }
        catch (err) {
            alert(err.message);
        }
        form.reset();
    });
}
function setupForms() {
    const personForm = document.getElementById('personForm');
    personForm.addEventListener('submit', addPerson);
    const accountForm = document.getElementById('accountForm');
    accountForm.addEventListener('submit', addAccount);
    const txForm = document.getElementById('transactionForm');
    txForm.addEventListener('submit', addTransaction);
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', doLogin);
    const searchInput = document.getElementById('searchInput');
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
