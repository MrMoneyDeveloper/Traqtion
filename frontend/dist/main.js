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
function fetchJson(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}) {
        const response = yield fetch(url, Object.assign({ headers: {
                'Content-Type': 'application/json'
            } }, options));
        if (!response.ok) {
            const text = yield response.text();
            throw new Error(text || response.statusText);
        }
        return response.json();
    });
}
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const persons = yield fetchJson(`${API_BASE}/persons`);
            displayList('personsList', persons);
            const accounts = yield fetchJson(`${API_BASE}/accounts`);
            displayList('accountsList', accounts);
            const transactions = yield fetchJson(`${API_BASE}/transactions`);
            displayList('transactionsList', transactions);
        }
        catch (err) {
            alert(err);
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
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    const personForm = document.getElementById('personForm');
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
