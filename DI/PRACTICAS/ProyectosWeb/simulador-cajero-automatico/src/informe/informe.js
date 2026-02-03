import { Record, loadRecords, saveRecords } from '../record';

const tbody = document.getElementById('tableBody');

const records = loadRecords();

records.forEach(record => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');

    td.textContent = record.date;
    tr.appendChild(td);
    td.textContent = record.time;
    tr.appendChild(td);
    td.textContent = record.action;
    tr.appendChild(td);
    td.textContent = record.withdrawal_amount;
    tr.appendChild(td);
    td.textContent = record.balance;
    tr.appendChild(td);

    tbody.appendChild(tr);
});
