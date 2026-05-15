// ============= DATA STORAGE =============
let students = JSON.parse(localStorage.getItem('students')) || [
    { id: 'S001', name: 'John Doe', email: 'john@example.com', department: 'Computer Science', semester: 5, password: 'student123' },
    { id: 'S002', name: 'Jane Smith', email: 'jane@example.com', department: 'Engineering', semester: 3, password: 'student123' },
    { id: 'S003', name: 'Mike Johnson', email: 'mike@example.com', department: 'Business', semester: 4, password: 'student123' },
    { id: 'S004', name: 'Sarah Wilson', email: 'sarah@example.com', department: 'Computer Science', semester: 5, password: 'student123' },
    { id: 'S005', name: 'Noor Fatima', email: 'noor@example.com', department: 'Engineering', semester: 3, password: 'student123' }
];

let sessions = JSON.parse(localStorage.getItem('sessions')) || [];
let attendanceRecords = JSON.parse(localStorage.getItem('attendance')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;

// Sample attendance data for demo
if (attendanceRecords.length === 0) {
    const sampleAttendance = [
        { id: 1, sessionId: 'demo1', studentId: 'S001', studentName: 'John Doe', subject: 'DLD', timestamp: new Date().toISOString(), gpsVerified: true, pinVerified: false, status: 'Present', deviceInfo: 'Chrome', ipAddress: '127.0.0.1' },
        { id: 2, sessionId: 'demo1', studentId: 'S002', studentName: 'Jane Smith', subject: 'DLD', timestamp: new Date().toISOString(), gpsVerified: true, pinVerified: false, status: 'Present', deviceInfo: 'Chrome', ipAddress: '127.0.0.1' },
        { id: 3, sessionId: 'demo1', studentId: 'S003', studentName: 'Mike Johnson', subject: 'DLD', timestamp: new Date().toISOString(), gpsVerified: false, pinVerified: false, status: 'Absent', deviceInfo: 'Chrome', ipAddress: '127.0.0.1' },
        { id: 4, sessionId: 'demo2', studentId: 'S001', studentName: 'John Doe', subject: 'Mathematics', timestamp: new Date(Date.now() - 86400000).toISOString(), gpsVerified: true, pinVerified: false, status: 'Present', deviceInfo: 'Chrome', ipAddress: '127.0.0.1' },
        { id: 5, sessionId: 'demo2', studentId: 'S004', studentName: 'Sarah Wilson', subject: 'Mathematics', timestamp: new Date(Date.now() - 86400000).toISOString(), gpsVerified: true, pinVerified: false, status: 'Present', deviceInfo: 'Chrome', ipAddress: '127.0.0.1' },
        { id: 6, sessionId: 'demo3', studentId: 'S005', studentName: 'Noor Fatima', subject: 'Physics', timestamp: new Date(Date.now() - 172800000).toISOString(), gpsVerified: true, pinVerified: false, status: 'Present', deviceInfo: 'Chrome', ipAddress: '127.0.0.1' }
    ];
    attendanceRecords.push(...sampleAttendance);
    saveData();
}

// Demo active session
if (sessions.length === 0) {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
    sessions.push({
        id: 'active1',
        subject: 'DLD',
        description: 'DLD lecture held on Monday 8 to 10 Am',
        hasPIN: true,
        pin: '1234',
        gpsLocation: '37.7749, -122.4194',
        attendanceRadius: 100,
        expiryTime: expiryTime.toISOString(),
        isActive: true,
        createdAt: new Date().toISOString()
    });
    saveData();
}

// ============= HELPER FUNCTIONS =============
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('sessions', JSON.stringify(sessions));
    localStorage.setItem('attendance', JSON.stringify(attendanceRecords));
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.style.display = 'none';
}

function getStudentAttendancePercentage(studentId) {
    const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
    const presentCount = studentRecords.filter(r => r.status === 'Present').length;
    const total = studentRecords.length;
    return total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0;
}

// ============= LOGIN SYSTEM =============
if (document.getElementById('loginForm')) {
    const roleBtns = document.querySelectorAll('.role-btn');
    let selectedRole = 'student';
    
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedRole = btn.dataset.role;
        });
    });
    
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (selectedRole === 'student') {
            const student = students.find(s => (s.id === username || s.email === username) && s.password === password);
            if (student) {
                currentUser = { id: student.id, name: student.name, role: 'student' };
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'student.html';
            } else {
                showToast('Invalid student credentials!', 'error');
            }
        } else {
            if (username === 'admin' && password === 'admin123') {
                currentUser = { id: 'admin', name: 'Admin', role: 'admin' };
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'admin.html';
            } else {
                showToast('Invalid admin credentials!', 'error');
            }
        }
    });
}

// ============= LOGOUT =============
document.querySelectorAll('#logoutBtn').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});

// ============= STUDENT DASHBOARD =============
if (window.location.pathname.includes('student.html')) {
    if (!currentUser) window.location.href = 'index.html';
    
    const currentStudent = students.find(s => s.id === currentUser.id);
    
    document.getElementById('studentName').textContent = currentStudent?.name || 'Student';
    document.getElementById('studentId').textContent = currentStudent?.id || '';
    
    updateStudentStats();
    loadRecentAttendance();
    updateSessionStatus();
    startQRTimer();
    setupClickableCards();
    
    function updateStudentStats() {
        if (!currentStudent) return;
        
        const studentRecords = attendanceRecords.filter(r => r.studentId === currentStudent.id);
        const totalSessions = studentRecords.length;
        const presentDays = studentRecords.filter(r => r.status === 'Present').length;
        const percentage = totalSessions > 0 ? ((presentDays / totalSessions) * 100).toFixed(1) : 0;
        
        document.getElementById('totalAttendance').textContent = totalSessions;
        document.getElementById('attendancePercentage').textContent = `${percentage}%`;
        document.getElementById('presentDays').textContent = presentDays;
        document.getElementById('totalSessions').textContent = totalSessions;
    }
    
    function loadRecentAttendance() {
        const studentRecords = attendanceRecords.filter(r => r.studentId === currentStudent?.id).slice(-5);
        const tbody = document.querySelector('#recentAttendanceTable tbody');
        if (tbody) {
            tbody.innerHTML = studentRecords.map(record => `
                <tr>
                    <td>${new Date(record.timestamp).toLocaleDateString()}</td>
                    <td>${record.subject}</td>
                    <td>${new Date(record.timestamp).toLocaleTimeString()}</td>
                    <td><span class="status-badge ${record.status === 'Present' ? 'active' : 'inactive'}">${record.status}</span></td>
                </tr>
            `).join('');
        }
    }
    
    function updateSessionStatus() {
        const activeSession = sessions.find(s => s.isActive);
        const statusEl = document.getElementById('sessionStatus');
        if (statusEl) {
            if (activeSession) {
                statusEl.textContent = `Active: ${activeSession.subject}`;
                statusEl.className = 'status-badge active';
            } else {
                statusEl.textContent = 'No Active Session';
                statusEl.className = 'status-badge inactive';
            }
        }
    }
    
    function startQRTimer() {
        if (window.qrTimerInterval) clearInterval(window.qrTimerInterval);
        
        window.qrTimerInterval = setInterval(() => {
            const activeSession = sessions.find(s => s.isActive);
            const timerElement = document.getElementById('qrTimer');
            const statusElement = document.getElementById('qrStatus');
            const pinRequiredElement = document.getElementById('pinRequired');
            
            if (timerElement && activeSession && activeSession.expiryTime) {
                const now = new Date();
                const expiry = new Date(activeSession.expiryTime);
                const diff = expiry - now;
                
                if (diff <= 0) {
                    timerElement.textContent = 'Expired';
                    if (statusElement) statusElement.textContent = 'Expired';
                    activeSession.isActive = false;
                    saveData();
                    updateSessionStatus();
                } else {
                    const minutes = Math.floor(diff / 60000);
                    const seconds = Math.floor((diff % 60000) / 1000);
                    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    if (statusElement) statusElement.textContent = 'Active';
                    if (pinRequiredElement) pinRequiredElement.textContent = activeSession.hasPIN ? 'Yes' : 'No';
                }
            } else if (timerElement) {
                timerElement.textContent = 'No Active Session';
                if (statusElement) statusElement.textContent = 'Inactive';
            }
        }, 1000);
    }
    
    function setupClickableCards() {
        const cards = document.querySelectorAll('.stat-card.clickable');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const statType = card.dataset.stat;
                showStudentDetailModal(statType);
            });
        });
    }
    
    function showStudentDetailModal(statType) {
        const currentStudent = students.find(s => s.id === currentUser.id);
        const studentRecords = attendanceRecords.filter(r => r.studentId === currentStudent.id);
        const presentRecords = studentRecords.filter(r => r.status === 'Present');
        const absentRecords = studentRecords.filter(r => r.status === 'Absent');
        
        let title = '';
        let content = '';
        
        switch(statType) {
            case 'total':
                title = `📊 Total Attendance (${studentRecords.length} Records)`;
                content = `
                    <div class="attendance-detail-list">
                        ${studentRecords.map(record => `
                            <div class="attendance-detail-item ${record.status === 'Present' ? 'present' : 'absent'}">
                                <span><strong>${record.subject}</strong></span>
                                <span>${new Date(record.timestamp).toLocaleDateString()}</span>
                                <span class="status-badge ${record.status === 'Present' ? 'active' : 'inactive'}">${record.status}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
            case 'percentage':
                const percentage = studentRecords.length > 0 ? ((presentRecords.length / studentRecords.length) * 100).toFixed(1) : 0;
                title = `📈 Attendance Percentage: ${percentage}%`;
                content = `
                    <div class="stats-summary">
                        <p><strong>Present:</strong> ${presentRecords.length} days</p>
                        <p><strong>Absent:</strong> ${absentRecords.length} days</p>
                        <p><strong>Total Sessions:</strong> ${studentRecords.length}</p>
                        <div class="chart-bars" style="margin-top: 20px;">
                            <div class="chart-item">
                                <div class="chart-bar present-bar" style="width: ${percentage}%">${percentage}%</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'present':
                title = `✅ Present Days (${presentRecords.length})`;
                content = `
                    <div class="attendance-detail-list">
                        ${presentRecords.map(record => `
                            <div class="attendance-detail-item present">
                                <span><strong>${record.subject}</strong></span>
                                <span>${new Date(record.timestamp).toLocaleDateString()}</span>
                                <span>${new Date(record.timestamp).toLocaleTimeString()}</span>
                            </div>
                        `).join('')}
                        ${presentRecords.length === 0 ? '<p>No present records found.</p>' : ''}
                    </div>
                `;
                break;
            case 'totalSessions':
                const uniqueSubjects = [...new Set(studentRecords.map(r => r.subject))];
                title = `📚 Sessions by Subject (${studentRecords.length} Total)`;
                content = `
                    <div class="subject-list">
                        ${uniqueSubjects.map(subject => {
                            const subjectRecords = studentRecords.filter(r => r.subject === subject);
                            const subjectPresent = subjectRecords.filter(r => r.status === 'Present').length;
                            return `
                                <div class="subject-item">
                                    <span class="subject-name">${subject}</span>
                                    <span>Present: ${subjectPresent}/${subjectRecords.length}</span>
                                    <span class="subject-percentage">${((subjectPresent/subjectRecords.length)*100).toFixed(0)}%</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                break;
        }
        
        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        if (modal && modalTitle && modalContent) {
            modalTitle.textContent = title;
            modalContent.innerHTML = content;
            modal.style.display = 'flex';
        }
    }
    
    // Navigation
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = link.dataset.page;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`${page}Page`).classList.add('active');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (page === 'history') loadHistoryPage();
        });
    });
    
    function loadHistoryPage() {
        const currentStudent = students.find(s => s.id === currentUser.id);
        const studentRecords = attendanceRecords.filter(r => r.studentId === currentStudent?.id);
        const tbody = document.querySelector('#attendanceHistoryTable tbody');
        if (tbody) {
            tbody.innerHTML = studentRecords.map(record => `
                <tr>
                    <td>${new Date(record.timestamp).toLocaleDateString()}</td>
                    <td>${record.subject}</td>
                    <td>${new Date(record.timestamp).toLocaleTimeString()}</td>
                    <td>${record.gpsVerified ? '✅ Verified' : '⚠️ Unknown'}</td>
                    <td><span class="status-badge ${record.status === 'Present' ? 'active' : 'inactive'}">${record.status}</span></td>
                </tr>
            `).join('');
        }
    }
    
    // QR Scanner Simulation
    if (document.getElementById('simulateScanBtn')) {
        document.getElementById('simulateScanBtn').addEventListener('click', () => {
            const activeSession = sessions.find(s => s.isActive);
            if (!activeSession) {
                showToast('No active session available!', 'error');
                return;
            }
            
            if (activeSession.expiryTime && new Date(activeSession.expiryTime) < new Date()) {
                showToast('QR Code has expired!', 'error');
                return;
            }
            
            const alreadyMarked = attendanceRecords.some(r => r.sessionId === activeSession.id && r.studentId === currentUser?.id);
            if (alreadyMarked) {
                showToast('You have already marked attendance for this session!', 'error');
                return;
            }
            
            if (activeSession.hasPIN) {
                openPINModal(activeSession);
            } else {
                markAttendance(activeSession);
            }
        });
    }
    
    function openPINModal(session) {
        const modal = document.getElementById('pinModal');
        if (modal) modal.style.display = 'flex';
        window.currentSessionForPIN = session;
    }
    
    window.verifyPIN = function() {
        const pin = document.getElementById('pinInput').value;
        if (pin === window.currentSessionForPIN.pin) {
            closePINModal();
            markAttendance(window.currentSessionForPIN);
        } else {
            showToast('Invalid PIN!', 'error');
        }
    };
    
    window.closePINModal = function() {
        const modal = document.getElementById('pinModal');
        if (modal) modal.style.display = 'none';
        const pinInput = document.getElementById('pinInput');
        if (pinInput) pinInput.value = '';
    };
    
    function markAttendance(session) {
        const gpsVerified = confirm('Allow location access for GPS verification?');
        
        if (!gpsVerified) {
            showToast('GPS verification failed! Attendance rejected.', 'error');
            return;
        }
        
        const currentStudent = students.find(s => s.id === currentUser.id);
        
        const record = {
            id: Date.now(),
            sessionId: session.id,
            studentId: currentUser.id,
            studentName: currentStudent.name,
            subject: session.subject,
            timestamp: new Date().toISOString(),
            gpsVerified: true,
            pinVerified: session.hasPIN,
            status: 'Present',
            deviceInfo: navigator.userAgent,
            ipAddress: '127.0.0.1'
        };
        
        attendanceRecords.push(record);
        saveData();
        showToast('✅ Attendance marked successfully!', 'success');
        updateStudentStats();
        loadRecentAttendance();
    }
}

// ============= ADMIN DASHBOARD =============
if (window.location.pathname.includes('admin.html')) {
    if (!currentUser || currentUser.role !== 'admin') window.location.href = 'index.html';
    
    updateAdminStats();
    loadRecentAttendanceRecords();
    loadStudentsTable();
    loadAllAttendanceRecords();
    loadActiveSessions();
    loadReportsData();
    setupAdminClickableCards();
    setupStudentRowClick();
    
    function updateAdminStats() {
        const totalStudents = students.length;
        const totalSessions = sessions.length;
        const activeSessions = sessions.filter(s => s.isActive).length;
        const todayRecords = attendanceRecords.filter(r => {
            const today = new Date().toDateString();
            return new Date(r.timestamp).toDateString() === today;
        });
        const todaysPercentage = students.length > 0 ? ((todayRecords.length / students.length) * 100).toFixed(1) : 0;
        const presentCount = todayRecords.length;
        const absentCount = students.length - presentCount;
        
        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('totalSessions').textContent = totalSessions;
        document.getElementById('todaysAttendance').textContent = `${todaysPercentage}%`;
        document.getElementById('activeSessions').textContent = activeSessions;
        
        const presentBar = document.getElementById('presentBar');
        const absentBar = document.getElementById('absentBar');
        const presentCountEl = document.getElementById('presentCount');
        const absentCountEl = document.getElementById('absentCount');
        
        if (presentBar) {
            const percentage = students.length > 0 ? (presentCount / students.length) * 100 : 0;
            presentBar.style.width = `${percentage}%`;
            presentBar.textContent = `${presentCount} Present`;
        }
        if (absentBar) {
            const percentage = students.length > 0 ? (absentCount / students.length) * 100 : 0;
            absentBar.style.width = `${percentage}%`;
            absentBar.textContent = `${absentCount} Absent`;
        }
        if (presentCountEl) presentCountEl.textContent = presentCount;
        if (absentCountEl) absentCountEl.textContent = absentCount;
    }
    
    function loadRecentAttendanceRecords() {
        const recentRecords = attendanceRecords.slice(-10).reverse();
        const tbody = document.querySelector('#recentAttendanceTable tbody');
        if (tbody) {
            tbody.innerHTML = recentRecords.map(record => `
                <tr class="clickable-row" onclick="showStudentAttendance('${record.studentId}')">
                    <td>${record.studentName}</td>
                    <td>${record.studentId}</td>
                    <td>${record.subject}</td>
                    <td>${new Date(record.timestamp).toLocaleTimeString()}</td>
                    <td>${record.gpsVerified ? '✅' : '❌'}</td>
                    <td><span class="status-badge ${record.status === 'Present' ? 'active' : 'inactive'}">${record.status}</span></td>
                </tr>
            `).join('');
        }
    }
    
    function loadStudentsTable() {
        const tbody = document.querySelector('#studentsTable tbody');
        if (tbody) {
            tbody.innerHTML = students.map(student => {
                const percentage = getStudentAttendancePercentage(student.id);
                return `
                    <tr class="clickable-row" onclick="showStudentAttendance('${student.id}')">
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.department}</td>
                        <td>${student.semester}</td>
                        <td><span class="percentage-badge ${percentage >= 75 ? 'good' : percentage >= 50 ? 'average' : 'poor'}">${percentage}%</span></td>
                        <td>
                            <button class="action-btn edit-btn" onclick="event.stopPropagation(); editStudent('${student.id}')">Edit</button>
                            <button class="action-btn delete-btn" onclick="event.stopPropagation(); deleteStudent('${student.id}')">Delete</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }
    
    function loadAllAttendanceRecords() {
        const tbody = document.querySelector('#allAttendanceTable tbody');
        if (tbody) {
            tbody.innerHTML = attendanceRecords.slice().reverse().map(record => `
                <tr class="clickable-row" onclick="showStudentAttendance('${record.studentId}')">
                    <td>${record.studentName}</td>
                    <td>${record.studentId}</td>
                    <td>${record.subject}</td>
                    <td>${new Date(record.timestamp).toLocaleDateString()}</td>
                    <td>${new Date(record.timestamp).toLocaleTimeString()}</td>
                    <td>${record.gpsVerified ? '✅' : '❌'}</td>
                    <td>${record.pinVerified ? '✅' : '❌'}</td>
                    <td><span class="status-badge ${record.status === 'Present' ? 'active' : 'inactive'}">${record.status}</span></td>
                </tr>
            `).join('');
        }
    }
    
    function loadActiveSessions() {
        const activeSessionsList = document.getElementById('activeSessionsList');
        const activeSessions = sessions.filter(s => s.isActive);
        
        if (activeSessionsList) {
            if (activeSessions.length === 0) {
                activeSessionsList.innerHTML = '<p>No active sessions</p>';
            } else {
                activeSessionsList.innerHTML = activeSessions.map(session => `
                    <div class="session-card active">
                        <div onclick="showSessionDetails('${session.id}')" style="cursor: pointer; flex: 1;">
                            <h4>${session.subject}</h4>
                            <p>${session.description}</p>
                            <small>Expires: ${new Date(session.expiryTime).toLocaleTimeString()}</small>
                            ${session.hasPIN ? `<small> | PIN: ${session.pin}</small>` : ''}
                        </div>
                        <button class="btn-danger" onclick="closeSession('${session.id}')">Close Session</button>
                    </div>
                `).join('');
            }
        }
    }
    
    function loadReportsData() {
        // Calculate top performer
        let topStudent = null;
        let highestPercentage = 0;
        
        students.forEach(student => {
            const percentage = getStudentAttendancePercentage(student.id);
            if (percentage > highestPercentage) {
                highestPercentage = percentage;
                topStudent = student;
            }
        });
        
        document.getElementById('topStudentName').textContent = topStudent ? `${topStudent.name} (${highestPercentage}%)` : '-';
        
        // Calculate low attendance (<75%)
        const lowAttendance = students.filter(s => getStudentAttendancePercentage(s.id) < 75 && getStudentAttendancePercentage(s.id) > 0);
        document.getElementById('lowAttendanceCount').textContent = lowAttendance.length;
        
        // Calculate perfect attendance (100%)
        const perfectAttendance = students.filter(s => getStudentAttendancePercentage(s.id) == 100 && attendanceRecords.filter(r => r.studentId === s.id).length > 0);
        document.getElementById('perfectAttendanceCount').textContent = perfectAttendance.length;
        
        // Most active subject
        const subjectCount = {};
        attendanceRecords.forEach(record => {
            subjectCount[record.subject] = (subjectCount[record.subject] || 0) + 1;
        });
        let mostActive = '';
        let maxCount = 0;
        for (const [subject, count] of Object.entries(subjectCount)) {
            if (count > maxCount) {
                maxCount = count;
                mostActive = subject;
            }
        }
        document.getElementById('mostActiveSubject').textContent = mostActive || '-';
        
        // Subject-wise performance
        const subjects = [...new Set(attendanceRecords.map(r => r.subject))];
        const subjectWiseList = document.getElementById('subjectWiseList');
        if (subjectWiseList) {
            subjectWiseList.innerHTML = subjects.map(subject => {
                const subjectRecords = attendanceRecords.filter(r => r.subject === subject);
                const presentCount = subjectRecords.filter(r => r.status === 'Present').length;
                const percentage = subjectRecords.length > 0 ? ((presentCount / subjectRecords.length) * 100).toFixed(1) : 0;
                return `
                    <div class="subject-item" onclick="showSubjectDetails('${subject}')">
                        <span class="subject-name">${subject}</span>
                        <span>Present: ${presentCount}/${subjectRecords.length}</span>
                        <span class="subject-percentage">${percentage}%</span>
                    </div>
                `;
            }).join('');
        }
        
        // Search functionality
        const searchBtn = document.getElementById('searchStudentBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = document.getElementById('searchStudent').value.toLowerCase();
                const foundStudents = students.filter(s => s.id.toLowerCase().includes(searchTerm) || s.name.toLowerCase().includes(searchTerm));
                const resultDiv = document.getElementById('studentSearchResult');
                if (resultDiv) {
                    if (foundStudents.length === 0) {
                        resultDiv.innerHTML = '<p>No students found.</p>';
                    } else {
                        resultDiv.innerHTML = `
                            <div class="attendance-detail-list">
                                ${foundStudents.map(student => {
                                    const percentage = getStudentAttendancePercentage(student.id);
                                    const studentRecords = attendanceRecords.filter(r => r.studentId === student.id);
                                    return `
                                        <div class="attendance-detail-item present" onclick="showStudentAttendance('${student.id}')" style="cursor: pointer;">
                                            <div>
                                                <strong>${student.name}</strong> (${student.id})
                                                <br>
                                                <small>Attendance: ${percentage}% | Total: ${studentRecords.length} sessions</small>
                                            </div>
                                            <span class="percentage-badge ${percentage >= 75 ? 'good' : percentage >= 50 ? 'average' : 'poor'}">${percentage}%</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        `;
                    }
                }
            });
        }
    }
    
    function setupAdminClickableCards() {
        const cards = document.querySelectorAll('.stat-card.clickable');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const statType = card.dataset.adminStat;
                if (statType) {
                    switch(statType) {
                        case 'students':
                            document.querySelector('.nav-link[data-page="students"]').click();
                            break;
                        case 'sessions':
                            document.querySelector('.nav-link[data-page="sessions"]').click();
                            break;
                        case 'today':
                            showTodayAttendanceDetails();
                            break;
                        case 'active':
                            document.querySelector('.nav-link[data-page="sessions"]').click();
                            break;
                    }
                }
            });
        });
        
        // Chart click
        const chart = document.getElementById('attendanceChart');
        if (chart) {
            chart.addEventListener('click', () => {
                showTodayAttendanceDetails();
            });
        }
        
        // Report cards
        const reportCards = document.querySelectorAll('[data-report]');
        reportCards.forEach(card => {
            card.addEventListener('click', () => {
                const reportType = card.dataset.report;
                switch(reportType) {
                    case 'topStudent':
                        showTopPerformers();
                        break;
                    case 'lowAttendance':
                        showLowAttendanceStudents();
                        break;
                    case 'perfectAttendance':
                        showPerfectAttendanceStudents();
                        break;
                    case 'mostActive':
                        showMostActiveSubjectDetails();
                        break;
                }
            });
        });
    }
    
    function setupStudentRowClick() {
        window.showStudentAttendance = function(studentId) {
            const student = students.find(s => s.id === studentId);
            if (!student) return;
            
            const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
            const presentRecords = studentRecords.filter(r => r.status === 'Present');
            const percentage = studentRecords.length > 0 ? ((presentRecords.length / studentRecords.length) * 100).toFixed(1) : 0;
            
            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modal && modalTitle && modalContent) {
                modalTitle.textContent = `📊 ${student.name} (${student.id}) - ${percentage}% Attendance`;
                modalContent.innerHTML = `
                    <div class="stats-summary">
                        <p><strong>Department:</strong> ${student.department}</p>
                        <p><strong>Semester:</strong> ${student.semester}</p>
                        <p><strong>Total Present:</strong> ${presentRecords.length} days</p>
                        <p><strong>Total Absent:</strong> ${studentRecords.length - presentRecords.length} days</p>
                        <p><strong>Total Sessions:</strong> ${studentRecords.length}</p>
                        <div class="chart-bars" style="margin-top: 20px;">
                            <div class="chart-item">
                                <div class="chart-bar present-bar" style="width: ${percentage}%">${percentage}%</div>
                            </div>
                        </div>
                        <h4 style="margin-top: 20px;">📝 Session Details:</h4>
                        <div class="attendance-detail-list">
                            ${studentRecords.map(record => `
                                <div class="attendance-detail-item ${record.status === 'Present' ? 'present' : 'absent'}">
                                    <span><strong>${record.subject}</strong></span>
                                    <span>${new Date(record.timestamp).toLocaleDateString()}</span>
                                    <span>${new Date(record.timestamp).toLocaleTimeString()}</span>
                                    <span class="status-badge ${record.status === 'Present' ? 'active' : 'inactive'}">${record.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                modal.style.display = 'flex';
            }
        };
        
        window.showSessionDetails = function(sessionId) {
            const session = sessions.find(s => s.id === sessionId);
            if (!session) return;
            
            const sessionRecords = attendanceRecords.filter(r => r.sessionId === sessionId);
            const studentsWhoAttended = [...new Set(sessionRecords.map(r => r.studentId))];
            
            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modal && modalTitle && modalContent) {
                modalTitle.textContent = `📚 ${session.subject} Session Details`;
                modalContent.innerHTML = `
                    <div class="stats-summary">
                        <p><strong>Description:</strong> ${session.description}</p>
                        <p><strong>Created:</strong> ${new Date(session.createdAt).toLocaleString()}</p>
                        <p><strong>Expires:</strong> ${new Date(session.expiryTime).toLocaleString()}</p>
                        <p><strong>Students Attended:</strong> ${studentsWhoAttended.length}/${students.length}</p>
                        <p><strong>Attendance Rate:</strong> ${((studentsWhoAttended.length / students.length) * 100).toFixed(1)}%</p>
                        <h4 style="margin-top: 20px;">👨‍🎓 Students Present:</h4>
                        <div class="attendance-detail-list">
                            ${sessionRecords.map(record => `
                                <div class="attendance-detail-item present" onclick="showStudentAttendance('${record.studentId}')" style="cursor: pointer;">
                                    <span><strong>${record.studentName}</strong> (${record.studentId})</span>
                                    <span>${new Date(record.timestamp).toLocaleTimeString()}</span>
                                    <span>${record.gpsVerified ? '✅ GPS' : '❌ GPS'}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                modal.style.display = 'flex';
            }
        };
        
        window.showSubjectDetails = function(subject) {
            const subjectRecords = attendanceRecords.filter(r => r.subject === subject);
            const presentCount = subjectRecords.filter(r => r.status === 'Present').length;
            const uniqueStudents = [...new Set(subjectRecords.map(r => r.studentId))];
            
            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modal && modalTitle && modalContent) {
                modalTitle.textContent = `📖 ${subject} - Detailed Report`;
                modalContent.innerHTML = `
                    <div class="stats-summary">
                        <p><strong>Total Sessions:</strong> ${subjectRecords.length}</p>
                        <p><strong>Total Present:</strong> ${presentCount}</p>
                        <p><strong>Attendance Rate:</strong> ${((presentCount / subjectRecords.length) * 100).toFixed(1)}%</p>
                        <p><strong>Unique Students:</strong> ${uniqueStudents.length}</p>
                        <h4 style="margin-top: 20px;">📝 Attendance Records:</h4>
                        <div class="attendance-detail-list">
                            ${subjectRecords.map(record => `
                                <div class="attendance-detail-item ${record.status === 'Present' ? 'present' : 'absent'}" onclick="showStudentAttendance('${record.studentId}')" style="cursor: pointer;">
                                    <span><strong>${record.studentName}</strong> (${record.studentId})</span>
                                    <span>${new Date(record.timestamp).toLocaleDateString()}</span>
                                    <span class="status-badge ${record.status === 'Present' ? 'active' : 'inactive'}">${record.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                modal.style.display = 'flex';
            }
        };
        
        window.showTodayAttendanceDetails = function() {
            const todayRecords = attendanceRecords.filter(r => {
                const today = new Date().toDateString();
                return new Date(r.timestamp).toDateString() === today;
            });
            const presentStudents = todayRecords.map(r => ({ id: r.studentId, name: r.studentName }));
            const absentStudents = students.filter(s => !presentStudents.find(p => p.id === s.id));
            
            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modal && modalTitle && modalContent) {
                modalTitle.textContent = `📅 Today's Attendance (${new Date().toLocaleDateString()})`;
                modalContent.innerHTML = `
                    <div class="stats-summary">
                        <p><strong>Total Students:</strong> ${students.length}</p>
                        <p><strong>Present:</strong> ${presentStudents.length}</p>
                        <p><strong>Absent:</strong> ${absentStudents.length}</p>
                        <div class="chart-bars" style="margin-top: 20px;">
                            <div class="chart-item">
                                <div class="chart-bar present-bar" style="width: ${(presentStudents.length / students.length) * 100}%">${((presentStudents.length / students.length) * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                        <h4 style="margin-top: 20px;">✅ Present Students:</h4>
                        <div class="attendance-detail-list">
                            ${presentStudents.map(student => `
                                <div class="attendance-detail-item present" onclick="showStudentAttendance('${student.id}')" style="cursor: pointer;">
                                    <span><strong>${student.name}</strong> (${student.id})</span>
                                </div>
                            `).join('')}
                        </div>
                        <h4 style="margin-top: 20px;">❌ Absent Students:</h4>
                        <div class="attendance-detail-list">
                            ${absentStudents.map(student => `
                                <div class="attendance-detail-item absent" onclick="showStudentAttendance('${student.id}')" style="cursor: pointer;">
                                    <span><strong>${student.name}</strong> (${student.id})</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                modal.style.display = 'flex';
            }
        };
        
        window.showTopPerformers = function() {
            const studentsWithPercentage = students.map(s => ({
                ...s,
                percentage: getStudentAttendancePercentage(s.id)
            })).filter(s => s.percentage > 0).sort((a, b) => b.percentage - a.percentage);
            
            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modal && modalTitle && modalContent) {
                modalTitle.textContent = `🏆 Top Performers`;
                modalContent.innerHTML = `
                    <div class="attendance-detail-list">
                        ${studentsWithPercentage.map((student, index) => `
                            <div class="attendance-detail-item present" onclick="showStudentAttendance('${student.id}')" style="cursor: pointer;">
                                <span><strong>#${index + 1}</strong> ${student.name} (${student.id})</span>
                                <span class="percentage-badge good">${student.percentage}%</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                modal.style.display = 'flex';
            }
        };
        
        window.showLowAttendanceStudents = function() {
            const lowAttendanceStudents = students.filter(s => {
                const percentage = getStudentAttendancePercentage(s.id);
                return percentage < 75 && percentage > 0;
            }).sort((a, b) => getStudentAttendancePercentage(a.id) - getStudentAttendancePercentage(b.id));
            
            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modal && modalTitle && modalContent) {
                modalTitle.textContent = `⚠️ Students with Low Attendance (<75%)`;
                modalContent.innerHTML = `
                    <div class="attendance-detail-list">
                        ${lowAttendanceStudents.map(student => `
                            <div class="attendance-detail-item absent" onclick="showStudentAttendance('${student.id}')" style="cursor: pointer;">
                                <span><strong>${student.name}</strong> (${student.id})</span>
                                <span class="percentage-badge poor">${getStudentAttendancePercentage(student.id)}%</span>
                            </div>
                        `).join('')}
                        ${lowAttendanceStudents.length === 0 ? '<p>No students with low attendance.</p>' : ''}
                    </div>
                `;
                modal.style.display = 'flex';
            }
        };
        
        window.showPerfectAttendanceStudents = function() {
            const perfectStudents = students.filter(s => {
                const percentage = getStudentAttendancePercentage(s.id);
                return percentage == 100 && attendanceRecords.filter(r => r.studentId === s.id).length > 0;
            });
            
            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modal && modalTitle && modalContent) {
                modalTitle.textContent = `⭐ Perfect Attendance (100%)`;
                modalContent.innerHTML = `
                    <div class="attendance-detail-list">
                        ${perfectStudents.map(student => `
                            <div class="attendance-detail-item present" onclick="showStudentAttendance('${student.id}')" style="cursor: pointer;">
                                <span><strong>${student.name}</strong> (${student.id})</span>
                                <span>${student.department}</span>
                            </div>
                        `).join('')}
                        ${perfectStudents.length === 0 ? '<p>No students with perfect attendance.</p>' : ''}
                    </div>
                `;
                modal.style.display = 'flex';
            }
        };
        
        window.showMostActiveSubjectDetails = function() {
            const subjectCount = {};
            attendanceRecords.forEach(record => {
                subjectCount[record.subject] = (subjectCount[record.subject] || 0) + 1;
            });
            let mostActive = '';
            let maxCount = 0;
            for (const [subject, count] of Object.entries(subjectCount)) {
                if (count > maxCount) {
                    maxCount = count;
                    mostActive = subject;
                }
            }
            
            if (mostActive) {
                showSubjectDetails(mostActive);
            }
        };
    }
    
    // Navigation
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            const page = link.dataset.page;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`${page}Page`).classList.add('active');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (page === 'records') loadAllAttendanceRecords();
            if (page === 'students') loadStudentsTable();
            if (page === 'sessions') loadActiveSessions();
            if (page === 'reports') loadReportsData();
            if (page === 'dashboard') updateAdminStats();
        });
    });
    
    // Create Session Form
    const createSessionForm = document.getElementById('createSessionForm');
    if (createSessionForm) {
        const enablePINCheckbox = document.getElementById('enablePIN');
        const pinField = document.getElementById('pinField');
        
        if (enablePINCheckbox) {
            enablePINCheckbox.addEventListener('change', (e) => {
                if (pinField) pinField.style.display = e.target.checked ? 'block' : 'none';
            });
        }
        
        createSessionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const subject = document.getElementById('subjectName').value;
            const description = document.getElementById('sessionDesc').value;
            const expiryMinutes = parseInt(document.getElementById('expiryMinutes').value);
            const hasPIN = document.getElementById('enablePIN').checked;
            const pin = hasPIN ? document.getElementById('sessionPIN').value : null;
            const gpsLocation = document.getElementById('gpsLocation').value;
            const attendanceRadius = parseInt(document.getElementById('attendanceRadius').value);
            
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
            
            const newSession = {
                id: Date.now().toString(),
                subject,
                description,
                hasPIN,
                pin,
                gpsLocation,
                attendanceRadius,
                expiryTime: expiryTime.toISOString(),
                isActive: true,
                createdAt: new Date().toISOString()
            };
            
            sessions.push(newSession);
            saveData();
            showToast('Session created successfully!', 'success');
            createSessionForm.reset();
            if (pinField) pinField.style.display = 'none';
            loadActiveSessions();
            updateAdminStats();
        });
    }
    
    // Student Management
    window.editStudent = function(id) {
        const student = students.find(s => s.id === id);
        if (student) {
            document.getElementById('modalTitle').textContent = 'Edit Student';
            document.getElementById('editStudentId').value = student.id;
            document.getElementById('studentIdInput').value = student.id;
            document.getElementById('studentNameInput').value = student.name;
            document.getElementById('studentEmail').value = student.email;
            document.getElementById('studentDept').value = student.department;
            document.getElementById('studentSemester').value = student.semester;
            document.getElementById('studentPassword').value = student.password;
            document.getElementById('studentModal').style.display = 'flex';
        }
    };
    
    window.deleteStudent = function(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            students = students.filter(s => s.id !== id);
            attendanceRecords = attendanceRecords.filter(r => r.studentId !== id);
            saveData();
            loadStudentsTable();
            loadAllAttendanceRecords();
            updateAdminStats();
            loadReportsData();
            showToast('Student deleted successfully!', 'success');
        }
    };
    
    window.closeSession = function(sessionId) {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            session.isActive = false;
            saveData();
            loadActiveSessions();
            updateAdminStats();
            showToast('Session closed successfully!', 'success');
        }
    };
    
    // Add Student Button
    const addStudentBtn = document.getElementById('addStudentBtn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Add Student';
            document.getElementById('studentForm').reset();
            document.getElementById('editStudentId').value = '';
            document.getElementById('studentModal').style.display = 'flex';
        });
    }
    
    // Student Form Submit
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const editId = document.getElementById('editStudentId').value;
            const studentData = {
                id: document.getElementById('studentIdInput').value,
                name: document.getElementById('studentNameInput').value,
                email: document.getElementById('studentEmail').value,
                department: document.getElementById('studentDept').value,
                semester: parseInt(document.getElementById('studentSemester').value),
                password: document.getElementById('studentPassword').value
            };
            
            if (editId) {
                const index = students.findIndex(s => s.id === editId);
                if (index !== -1) students[index] = studentData;
                showToast('Student updated successfully!', 'success');
            } else {
                if (students.find(s => s.id === studentData.id)) {
                    showToast('Student ID already exists!', 'error');
                    return;
                }
                students.push(studentData);
                showToast('Student added successfully!', 'success');
            }
            
            saveData();
            loadStudentsTable();
            updateAdminStats();
            loadReportsData();
            closeStudentModal();
        });
    }
    
    // Export CSV
    const exportBtn = document.getElementById('exportCSVBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            let csv = 'Student Name,Student ID,Subject,Date,Time,GPS Status,PIN Status,Status\n';
            attendanceRecords.forEach(record => {
                csv += `${record.studentName},${record.studentId},${record.subject},${new Date(record.timestamp).toLocaleDateString()},${new Date(record.timestamp).toLocaleTimeString()},${record.gpsVerified ? 'Verified' : 'Failed'},${record.pinVerified ? 'Verified' : 'None'},${record.status}\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendance_records_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('CSV exported successfully!', 'success');
        });
    }
}

window.closeStudentModal = function() {
    const modal = document.getElementById('studentModal');
    if (modal) modal.style.display = 'none';
};

window.closeDetailModal = function() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.style.display = 'none';
};

// Add CSS for percentage badges
const style = document.createElement('style');
style.textContent = `
    .percentage-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
    }
    .percentage-badge.good {
        background: #d4edda;
        color: #155724;
    }
    .percentage-badge.average {
        background: #fff3cd;
        color: #856404;
    }
    .percentage-badge.poor {
        background: #f8d7da;
        color: #721c24;
    }
    .clickable-row {
        cursor: pointer;
    }
    .clickable-row:hover {
        background: #f0f0f0 !important;
    }
`;
document.head.appendChild(style);