// Update this line at the top of your script.js
const RAILWAY_API_URL = "https://attendance-production-b630.up.railway.app";
const video = document.getElementById('video');
const statusBubble = document.getElementById('status-bubble');
let labeledFaceDescriptors = [];

// 1. Load Models & Start Everything
async function init() {
    statusBubble.innerText = "Loading AI Models...";
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        ]);
        
        statusBubble.innerText = "Syncing Database...";
        await loadUsersFromDB();
        startVideo();
    } catch (err) {
        console.error("Initialization Error:", err);
        statusBubble.innerText = "Error loading AI. Check console.";
    }
}

// 2. Start Camera
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => {
            video.srcObject = stream;
            statusBubble.innerText = "System Ready";
        })
        .catch(err => {
            console.error("Camera Error:", err);
            statusBubble.innerText = "Camera Access Denied";
        });
}

// 3. Load Users from DB (Para sa Comparison mamaya)
async function loadUsersFromDB() {
    try {
        const response = await fetch(`${RAILWAY_API_URL}/get_users.php`); // Gawa tayo nito mamaya
        const users = await response.json();
        
        labeledFaceDescriptors = users.map(user => {
            const descArray = new Float32Array(Object.values(JSON.parse(user.face_descriptor)));
            return new faceapi.LabeledFaceDescriptors(user.custom_id, [descArray]);
        });
    } catch (err) {
        console.log("No existing users found or connection error.");
    }
}

// 4. Registration Function
async function registerUser() {
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;

    if (!fname || !lname) {
        alert("Please fill in your name.");
        return;
    }

    statusBubble.innerText = "Capturing face...";
    const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

    if (detection) {
        const userData = {
            fname: fname,
            lname: lname,
            descriptor: Array.from(detection.descriptor)
        };

        try {
            const response = await fetch(`${RAILWAY_API_URL}/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const result = await response.json();
            
            if (result.status === "success") {
                alert(`Registered Successfully! ID: ${result.id}`);
                location.reload(); // Refresh para ma-update ang listahan ng mukha
            }
        } catch (err) {
            alert("Registration failed. Check Railway connection.");
        }
    } else {
        alert("Face not detected. Look directly at the camera.");
        statusBubble.innerText = "Ready";
    }
}

// 5. Automated Attendance (Time In/Out)
async function startAutoScan(type) {
    if (labeledFaceDescriptors.length === 0) {
        alert("No registered users in database.");
        return;
    }

    statusBubble.innerText = `Scanning for ${type}...`;
    
    const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

    if (detection) {
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

        if (bestMatch.label === 'unknown') {
            alert("Face not recognized. Please register first.");
            statusBubble.innerText = "Ready";
        } else {
            submitAttendance(bestMatch.label, type);
        }
    } else {
        alert("No face detected.");
        statusBubble.innerText = "Ready";
    }
}

async function submitAttendance(userId, type) {
    try {
        const response = await fetch(`${RAILWAY_API_URL}/attendance.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, type: type })
        });
        const result = await response.json();
        if (result.status === "success") {
            alert(`✅ ${type} Recorded: ${userId}`);
            statusBubble.innerText = "Success!";
            setTimeout(() => { statusBubble.innerText = "Ready"; }, 2000);
        }
    } catch (err) {
        alert("Error saving attendance.");
    }
}

// 6. Updated Search Logs Function (As requested)
async function searchLogs() {
    const query = document.getElementById('searchQuery').value;
    const resultsDiv = document.getElementById('results-table');
    
    resultsDiv.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
            <p style="margin-top:10px;">Searching records...</p>
        </div>
    `;

    try {
        const response = await fetch(`${RAILWAY_API_URL}/search.php?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.length === 0) {
            resultsDiv.innerHTML = `<div style="text-align:center; padding: 20px;">No records found.</div>`;
            return;
        }

        let tableHtml = `<table><thead><tr><th>ID</th><th>Full Name</th><th>Type</th><th>Date & Time</th></tr></thead><tbody>`;

        data.forEach(row => {
            const badgeClass = row.type === 'IN' ? 'badge badge-in' : 'badge badge-out';
            const icon = row.type === 'IN' ? 'fa-arrow-right' : 'fa-arrow-left';
            const dateObj = new Date(row.log_time);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + " | " + dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            tableHtml += `
                <tr>
                    <td><code>${row.custom_id}</code></td>
                    <td style="font-weight:600;">${row.first_name} ${row.last_name}</td>
                    <td><span class="${badgeClass}"><i class="fas ${icon}"></i> ${row.type}</span></td>
                    <td style="color: var(--text-muted); font-size: 0.85rem;">${formattedDate}</td>
                </tr>`;
        });

        tableHtml += `</tbody></table>`;
        resultsDiv.innerHTML = tableHtml;
    } catch (error) {
        resultsDiv.innerHTML = `<p style="color:red; text-align:center;">Error connecting to Railway.</p>`;
    }
}

// Run Initialization
init();

