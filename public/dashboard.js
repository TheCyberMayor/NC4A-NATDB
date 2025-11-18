// Dashboard JavaScript
let allOfficers = [];
let filteredOfficers = [];
let currentPage = 1;
const itemsPerPage = 10;
let charts = {};

// API Base URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://nc4a-natdb.onrender.com/api';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Load all data
async function loadData() {
    try {
        showLoading();
        const response = await fetch(`${API_URL}/officers/all`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        allOfficers = data.officers || [];
        filteredOfficers = [...allOfficers];

        updateStatistics();
        populateFilters();
        renderCharts();
        renderTable();
        hideLoading();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('tableBody').innerHTML = `
            <tr><td colspan="8" class="loading">Error loading data: ${error.message}</td></tr>
        `;
    }
}

// Update statistics cards
function updateStatistics() {
    const totalOfficers = allOfficers.length;
    
    const seniorRanks = ['Air Commodore', 'Group Captain', 'Wing Commander', 'Squadron Leader'];
    const seniorOfficers = allOfficers.filter(o => seniorRanks.includes(o.rank)).length;
    const juniorOfficers = totalOfficers - seniorOfficers;
    
    const commands = new Set(allOfficers.map(o => o.command)).size;

    document.getElementById('totalOfficers').textContent = totalOfficers;
    document.getElementById('seniorOfficers').textContent = seniorOfficers;
    document.getElementById('juniorOfficers').textContent = juniorOfficers;
    document.getElementById('totalCommands').textContent = commands;
}

// Populate filter dropdowns
function populateFilters() {
    const ranks = [...new Set(allOfficers.map(o => o.rank))].sort();
    const commands = [...new Set(allOfficers.map(o => o.command))].sort();
    const states = [...new Set(allOfficers.map(o => o.state))].sort();

    const rankSelect = document.getElementById('filterRank');
    const commandSelect = document.getElementById('filterCommand');
    const stateSelect = document.getElementById('filterState');

    ranks.forEach(rank => {
        rankSelect.innerHTML += `<option value="${rank}">${rank}</option>`;
    });

    commands.forEach(command => {
        commandSelect.innerHTML += `<option value="${command}">${command}</option>`;
    });

    states.forEach(state => {
        stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
    });
}

// Apply filters
function applyFilters() {
    const rankFilter = document.getElementById('filterRank').value;
    const commandFilter = document.getElementById('filterCommand').value;
    const stateFilter = document.getElementById('filterState').value;
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase();

    filteredOfficers = allOfficers.filter(officer => {
        const matchesRank = !rankFilter || officer.rank === rankFilter;
        const matchesCommand = !commandFilter || officer.command === commandFilter;
        const matchesState = !stateFilter || officer.state === stateFilter;
        const matchesSearch = !searchQuery || 
            officer.surname.toLowerCase().includes(searchQuery) ||
            officer.firstName.toLowerCase().includes(searchQuery) ||
            officer.email.toLowerCase().includes(searchQuery) ||
            officer.phoneNumber.includes(searchQuery) ||
            officer.serviceNumber.toLowerCase().includes(searchQuery);

        return matchesRank && matchesCommand && matchesState && matchesSearch;
    });

    currentPage = 1;
    renderTable();
}

// Clear filters
function clearFilters() {
    document.getElementById('filterRank').value = '';
    document.getElementById('filterCommand').value = '';
    document.getElementById('filterState').value = '';
    document.getElementById('searchQuery').value = '';
    applyFilters();
}

// Render charts
function renderCharts() {
    renderRankChart();
    renderCommandChart();
    renderStateChart();
    renderGenderChart();
}

// Rank distribution chart
function renderRankChart() {
    const ctx = document.getElementById('rankChart').getContext('2d');
    const rankCounts = {};
    
    allOfficers.forEach(officer => {
        rankCounts[officer.rank] = (rankCounts[officer.rank] || 0) + 1;
    });

    if (charts.rankChart) charts.rankChart.destroy();

    charts.rankChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(rankCounts),
            datasets: [{
                label: 'Number of Officers',
                data: Object.values(rankCounts),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Command distribution chart
function renderCommandChart() {
    const ctx = document.getElementById('commandChart').getContext('2d');
    const commandCounts = {};
    
    allOfficers.forEach(officer => {
        commandCounts[officer.command] = (commandCounts[officer.command] || 0) + 1;
    });

    if (charts.commandChart) charts.commandChart.destroy();

    charts.commandChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(commandCounts),
            datasets: [{
                data: Object.values(commandCounts),
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(234, 179, 8, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// State distribution chart
function renderStateChart() {
    const ctx = document.getElementById('stateChart').getContext('2d');
    const stateCounts = {};
    
    allOfficers.forEach(officer => {
        stateCounts[officer.state] = (stateCounts[officer.state] || 0) + 1;
    });

    // Get top 10 states
    const sortedStates = Object.entries(stateCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    if (charts.stateChart) charts.stateChart.destroy();

    charts.stateChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedStates.map(s => s[0]),
            datasets: [{
                label: 'Number of Officers',
                data: sortedStates.map(s => s[1]),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Gender distribution chart
function renderGenderChart() {
    const ctx = document.getElementById('genderChart').getContext('2d');
    const genderCounts = { Male: 0, Female: 0 };
    
    allOfficers.forEach(officer => {
        if (officer.gender in genderCounts) {
            genderCounts[officer.gender]++;
        }
    });

    if (charts.genderChart) charts.genderChart.destroy();

    charts.genderChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(genderCounts),
            datasets: [{
                data: Object.values(genderCounts),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Render table
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredOfficers.slice(start, end);

    const tbody = document.getElementById('tableBody');
    
    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">No officers found</td></tr>';
        return;
    }

    tbody.innerHTML = pageData.map((officer, index) => `
        <tr>
            <td>${start + index + 1}</td>
            <td>${officer.surname} ${officer.firstName}</td>
            <td>${officer.rank}</td>
            <td>${officer.serviceNumber}</td>
            <td>${officer.command}</td>
            <td>${officer.state}</td>
            <td>${officer.email}<br>${officer.phoneNumber}</td>
            <td>${new Date(officer.submissionTimestamp).toLocaleDateString()}</td>
        </tr>
    `).join('');

    renderPagination();
    updateShowingInfo();
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredOfficers.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    let html = '';
    
    if (currentPage > 1) {
        html += `<button onclick="changePage(${currentPage - 1})">Previous</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<button disabled>...</button>';
        }
    }
    
    if (currentPage < totalPages) {
        html += `<button onclick="changePage(${currentPage + 1})">Next</button>`;
    }
    
    pagination.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    renderTable();
}

// Update showing info
function updateShowingInfo() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, filteredOfficers.length);
    document.getElementById('showingInfo').textContent = 
        `Showing ${start}-${end} of ${filteredOfficers.length} officers`;
}

// Export data
function exportData(format) {
    if (filteredOfficers.length === 0) {
        alert('No data to export!');
        return;
    }

    switch (format) {
        case 'csv':
            exportCSV();
            break;
        case 'json':
            exportJSON();
            break;
        case 'excel':
            exportExcel();
            break;
    }
}

// Export as CSV
function exportCSV() {
    const headers = ['S/N', 'Surname', 'First Name', 'Middle Name', 'Rank', 'Service Number', 
                     'Command', 'Email', 'Phone', 'Gender', 'State', 'LGA', 'Date of Birth', 'Submission Date'];
    
    const rows = filteredOfficers.map((officer, index) => [
        index + 1,
        officer.surname,
        officer.firstName,
        officer.middleName || '',
        officer.rank,
        officer.serviceNumber,
        officer.command,
        officer.email,
        officer.phoneNumber,
        officer.gender,
        officer.state,
        officer.lga,
        officer.dateOfBirth,
        new Date(officer.submissionTimestamp).toLocaleString()
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    downloadFile(csv, 'officers_data.csv', 'text/csv');
}

// Export as JSON
function exportJSON() {
    const json = JSON.stringify(filteredOfficers, null, 2);
    downloadFile(json, 'officers_data.json', 'application/json');
}

// Export as Excel
function exportExcel() {
    const data = filteredOfficers.map((officer, index) => ({
        'S/N': index + 1,
        'Surname': officer.surname,
        'First Name': officer.firstName,
        'Middle Name': officer.middleName || '',
        'Rank': officer.rank,
        'Service Number': officer.serviceNumber,
        'Command': officer.command,
        'Email': officer.email,
        'Phone': officer.phoneNumber,
        'Gender': officer.gender,
        'State': officer.state,
        'LGA': officer.lga,
        'Date of Birth': officer.dateOfBirth,
        'Submission Date': new Date(officer.submissionTimestamp).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Officers');
    XLSX.writeFile(wb, 'officers_data.xlsx');
}

// Download file helper
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Refresh data
function refreshData() {
    loadData();
}

// Loading helpers
function showLoading() {
    document.getElementById('tableBody').innerHTML = 
        '<tr><td colspan="8" class="loading">Loading data...</td></tr>';
}

function hideLoading() {
    // Loading is removed when table is rendered
}
