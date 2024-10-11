// Login function
function login() {
    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "Art@123") {
        // Redirect to the attendance setup page after successful login
        window.location.href = 'attendance-setup.html';
    } else {
        document.getElementById("error-message").innerText = "Invalid credentials!";
    }
}

// Set attendance function
function setAttendance() {
    const numStudents = document.getElementById('numStudents').value;
    const subject = document.getElementById('subject').value;
    if (numStudents && numStudents > 0) {
        localStorage.setItem('numStudents', numStudents);
        localStorage.setItem('subject', subject);

        // Redirect to the attendance grid page
        window.location.href = 'attendance-grid.html';
    } else {
        alert("Please enter a valid number of students.");
    }
}

// Generate attendance grid when the grid page is loaded
if (window.location.pathname.includes('attendance-grid.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        const numStudents = localStorage.getItem('numStudents');
        generateAttendanceGrid(numStudents);
    });
}

// Generate attendance grid
function generateAttendanceGrid(numStudents) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";  // Clear previous grid
    for (let i = 1; i <= numStudents; i++) {
        const div = document.createElement("div");
        div.className = "grid-item";
        div.innerText = i;
        div.onclick = function () {
            this.classList.toggle('green');
        };
        grid.appendChild(div);
    }
}

// Download attendance as CSV
function downloadExcel() {
    const gridItems = document.querySelectorAll('.grid-item');
    const attendanceData = [];
    const subject = localStorage.getItem('subject');
    gridItems.forEach((item, index) => {
        const rollNo = index + 1;
        const status = item.classList.contains('green') ? "Yes" : "No";
        attendanceData.push([rollNo, subject, status]);
    });

    const csvContent = "data:text/csv;charset=utf-8,"
        + "Roll NO,Subject,Lecture Attended\n"
        + attendanceData.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance.csv");
    document.body.appendChild(link);
    link.click();
}

// Send attendance data to WhatsApp
function sendToWhatsApp() {
    const subject = localStorage.getItem('subject');
    
    // Get current date and time in Indian format
    const now = new Date();
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    };
    const dateTimeString = now.toLocaleString('en-IN', options);

    // Excel file URL (replace this with the actual path where your Excel file will be hosted)
    const excelFileUrl = 'https://example.com/path/to/your/attendance.xlsx';  // Replace this URL with your actual Excel file URL

    // WhatsApp URL scheme for sending text messages
    const waNumber = '8999635381';  // Fixed Indian number
    const message = `Attendance Data\nDate and Time: ${dateTimeString}\nDownload Excel: ${excelFileUrl}`;
    const waUrl = `https://wa.me/91${waNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp (on mobile, this will open the WhatsApp app)
    window.open(waUrl, '_blank');
}
