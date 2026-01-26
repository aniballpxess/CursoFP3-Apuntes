const records = JSON.parse(localStorage.getItem('records')) || [];
const tbody = document.getElementById('tableBody');

records.forEach(record => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${record.date}</td>
        <td>${record.time}</td>
        <td>${record.str_name}</td>
        <td>${record.num_count1}</td>
        <td>${record.num_count2}</td>
      `;

    tbody.appendChild(tr);
});
