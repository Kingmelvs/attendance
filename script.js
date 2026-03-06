let labeledFaceDescriptors = []; // This will hold your DB users
const video = document.getElementById('video');

// 1. Load Models and then Load Users from DB
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(loadUsersFromDB);

async function loadUsersFromDB() {
    // Fetch all registered faces from your Railway PHP API
    const response = await fetch('https://your-railway.app/get_users.php');
    const users = await response.json();
    
    labeledFaceDescriptors = users.map(user => {
        const descriptions = [new Float32Array(Object.values(JSON.parse(user.face_descriptor)))];
        return new faceapi.LabeledFaceDescriptors(user.custom_id, descriptions);
    });
    
    startVideo();
}

// 2. Automated Attendance Scan
async function startAutoScan(type) {
    document.getElementById('scan-status').innerText = `Scanning for Time ${type}...`;
    
    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detections) {
        alert("No face detected. Please face the camera.");
        return;
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    const bestMatch = faceMatcher.findBestMatch(detections.descriptor);

    if (bestMatch.label === 'unknown') {
        alert("Face not recognized. Please register first.");
    } else {
        // Success! Send to Railway PHP
        submitAttendance(bestMatch.label, type);
    }
}

function submitAttendance(userId, type) {
    fetch('https://your-railway.app/attendance.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, type: type })
    })
    .then(res => res.json())
    .then(data => {
        alert(`${type} successful for ${userId}`);
        document.getElementById('scan-status').innerText = "Ready.";
    });
}

// UI Helpers
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}