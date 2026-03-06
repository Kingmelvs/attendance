// Palitan mo ito ng actual na URL ng iyong Railway app
const RAILWAY_API_URL = "https://your-railway-app.up.railway.app"; 

async function searchLogs() {
    const query = document.getElementById('searchQuery').value;
    const resultsDiv = document.getElementById('results-table');
    
    // Loading State
    resultsDiv.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
            <p style="margin-top:10px;">Searching records...</p>
        </div>
    `;

    try {
        // Fetching data from Railway
        const response = await fetch(`${RAILWAY_API_URL}/search.php?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();

        if (data.length === 0) {
            resultsDiv.innerHTML = `
                <div style="text-align:center; padding: 20px; color: var(--text-muted);">
                    <i class="fas fa-search-minus" style="font-size: 2rem;"></i>
                    <p>No records found for "${query}"</p>
                </div>
            `;
            return;
        }

        // Build Table
        let tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Type</th>
                        <th>Date & Time</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(row => {
            // Gumamit ng badges base sa type (IN/OUT)
            const badgeClass = row.type === 'IN' ? 'badge badge-in' : 'badge badge-out';
            const icon = row.type === 'IN' ? 'fa-arrow-right' : 'fa-arrow-left';
            
            // Format Date (Halimbawa: Oct 24, 2023 - 2:30 PM)
            const dateObj = new Date(row.log_time);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            }) + " | " + dateObj.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            tableHtml += `
                <tr>
                    <td><code style="background:#f1f5f9; padding:2px 5px; border-radius:4px;">${row.custom_id}</code></td>
                    <td style="font-weight:600;">${row.first_name} ${row.last_name}</td>
                    <td>
                        <span class="${badgeClass}">
                            <i class="fas ${icon}" style="font-size:10px;"></i> ${row.type}
                        </span>
                    </td>
                    <td style="color: var(--text-muted); font-size: 0.85rem;">${formattedDate}</td>
                </tr>
            `;
        });

        tableHtml += `</tbody></table>`;
        resultsDiv.innerHTML = tableHtml;

    } catch (error) {
        console.error("Search Error:", error);
        resultsDiv.innerHTML = `
            <div style="text-align:center; padding: 20px; color: var(--danger);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
                <p>Error connecting to database. Please check your Railway deployment.</p>
            </div>
        `;
    }
}
