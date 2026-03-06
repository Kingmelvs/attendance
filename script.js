async function searchLogs() {
    const query = document.getElementById('searchQuery').value;
    const resultsDiv = document.getElementById('results-table');
    
    resultsDiv.innerHTML = "<p style='text-align:center;'>Searching...</p>";

    try {
        const response = await fetch(`https://your-railway-app.up.railway.app/search.php?q=${query}`);
        const data = await response.json();

        if (data.length === 0) {
            resultsDiv.innerHTML = "<p style='text-align:center;'>No records found.</p>";
            return;
        }

        let tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(row => {
            const badgeClass = row.type === 'IN' ? 'badge-in' : 'badge-out';
            tableHtml += `
                <tr>
                    <td><strong>${row.custom_id}</strong></td>
                    <td>${row.first_name} ${row.last_name}</td>
                    <td><span class="${badgeClass}">${row.type}</span></td>
                    <td>${new Date(row.log_time).toLocaleString()}</td>
                </tr>
            `;
        });

        tableHtml += `</tbody></table>`;
        resultsDiv.innerHTML = tableHtml;

    } catch (error) {
        resultsDiv.innerHTML = "<p style='color:red;'>Error fetching data.</p>";
    }
}
