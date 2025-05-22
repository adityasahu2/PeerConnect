// DOM Elements
const welcomeSection = document.getElementById('welcome-section');
const dashboardSection = document.getElementById('dashboard');
const profileSection = document.getElementById('profile');
const browseSection = document.getElementById('browse');
const connectionsSection = document.getElementById('connections');
const navLinks = document.querySelectorAll('.nav-link');
const profileForm = document.getElementById('profile-form');
const profileView = document.getElementById('profile-view');
const profileFormContainer = document.getElementById('profile-form-container');
const createProfileBtn = document.getElementById('create-profile-btn');
const editProfileBtn = document.getElementById('edit-profile-btn');
const welcomeMessage = document.getElementById('welcome-message');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const studentsGrid = document.getElementById('students-grid');
const connectionsContainer = document.getElementById('connections-container');
const studentSearch = document.getElementById('student-search');
const searchBtn = document.getElementById('search-btn');
const filterDepartment = document.getElementById('filter-department');
const filterYear = document.getElementById('filter-year');
const filterInterests = document.getElementById('filter-interests');
const recentActivity = document.getElementById('recent-activity');
const connectionsCount = document.getElementById('connections-count');
const skillsMatched = document.getElementById('skills-matched');
const projectTags = document.getElementById('project-tags');
const topbarProfilePicture = document.getElementById('topbar-profile-picture');

// Elements for Suggested Connections
const suggestedConnectionsContainer = document.getElementById('suggested-connections');

// Profile Tab Switching
const profileTabButtons = document.querySelectorAll('.profile-tab');
const profileTabPanes = document.querySelectorAll('.profile-tab-pane');

// Get additional DOM elements for filters
const toggleFiltersBtn = document.getElementById('toggle-filters');
const advancedFilters = document.getElementById('advanced-filters');
const studentsLoader = document.getElementById('students-loader');
const clearFiltersBtn = document.getElementById('clear-filters');

// Additional DOM elements for Connections page
const totalConnectionsElement = document.getElementById('total-connections');
const pendingRequestsElement = document.getElementById('pending-requests');
const tabButtons = document.querySelectorAll('.tab-button');
const connectionTabPanes = document.querySelectorAll('.connection-tab-pane');
const pendingConnectionsContainer = document.getElementById('pending-container');

// Mock pending connection requests
let pendingRequests = [
    {
        id: 101,
        name: "Alex Thompson",
        year: "Junior",
        department: "Computer Science",
        bio: "Passionate about AI and machine learning. Looking for study partners for advanced algorithms.",
        skills: ["Programming", "Machine Learning", "Data Analysis"],
        projects: ["AI Research", "Mobile App Development"],
        profilePicture: null
    },
    {
        id: 102,
        name: "Jamie Rodriguez",
        year: "Sophomore",
        department: "Engineering",
        bio: "Mechanical engineering student interested in sustainable design and renewable energy.",
        skills: ["CAD Design", "3D Printing", "Prototyping"],
        projects: ["Renewable Energy", "Robotics"],
        profilePicture: null
    }
];

// State Management
let currentUser = null;
let connections = [];
let sentRequests = [];
let filteredStudents = [...mockStudents];

// Initialize application
function init() {
    // Check if a user profile exists in localStorage
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        // Hide welcome message, show dashboard
        welcomeSection.classList.add('hidden');
        showTab('dashboard');
        updateProfileView();
        loadConnections();
        updateDashboardStats();
        displayRecentActivity();
        displaySuggestedConnections();

        // Initialize connections page
        initializeConnectionsPage();
    } else {
        // Show welcome message with create profile button
        welcomeSection.classList.remove('hidden');
        showTab('dashboard');
    }

    // Load connections and sent requests from localStorage
    const savedConnections = localStorage.getItem('connections');
    if (savedConnections) {
        connections = JSON.parse(savedConnections);
    }

    const savedRequests = localStorage.getItem('sentRequests');
    if (savedRequests) {
        sentRequests = JSON.parse(savedRequests);
    }

    // Initialize the browse section
    displayStudents(filteredStudents);
    updateConnectionsView();
    displayPendingRequests();
    updateConnectionCounts();
}

// Navigation and Tab Switching
function showTab(tabId) {
    // Hide all tab content
    dashboardSection.classList.add('hidden');
    profileSection.classList.add('hidden');
    browseSection.classList.add('hidden');
    connectionsSection.classList.add('hidden');

    // Show the selected tab
    document.getElementById(tabId).classList.remove('hidden');

    // Update active nav link
    navLinks.forEach(link => {
        if (link.dataset.tab === tabId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Add event listeners to nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.dataset.tab;
        showTab(tabId);
    });
});

// Profile Management
createProfileBtn.addEventListener('click', () => {
    showTab('profile');
});

editProfileBtn.addEventListener('click', () => {
    // Pre-fill the form with current user data
    document.getElementById('name').value = currentUser.name;
    document.getElementById('college-id').value = currentUser.collegeId;
    document.getElementById('year').value = currentUser.year;
    document.getElementById('department').value = currentUser.department;
    document.getElementById('bio').value = currentUser.bio || '';
    document.getElementById('skills').value = currentUser.skills.join(', ');
    document.getElementById('projects').value = currentUser.projects.join(', ');

    // Show form, hide profile view
    profileView.classList.add('hidden');
    profileFormContainer.classList.remove('hidden');
});

profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const formData = new FormData(profileForm);
    const name = formData.get('name');
    const collegeId = formData.get('collegeId');
    const year = formData.get('year');
    const department = formData.get('department');
    const bio = formData.get('bio');
    const skills = formData.get('skills').split(',').map(skill => skill.trim()).filter(skill => skill);
    const projects = formData.get('projects').split(',').map(project => project.trim()).filter(project => project);

    // Handle profile picture (we'll just store null for now since we're not uploading files)
    let profilePicture = null;
    const profilePictureInput = document.getElementById('profile-picture');
    if (profilePictureInput.files.length > 0) {
        // In a real app, we would upload the file and get a URL
        // For this demo, we'll create a data URL
        const reader = new FileReader();
        reader.onload = function (event) {
            profilePicture = event.target.result;
            saveProfile(name, collegeId, year, department, bio, skills, projects, profilePicture);
        };
        reader.readAsDataURL(profilePictureInput.files[0]);
    } else {
        // Use existing profile picture if editing
        profilePicture = currentUser ? currentUser.profilePicture : null;
        saveProfile(name, collegeId, year, department, bio, skills, projects, profilePicture);
    }
});

function saveProfile(name, collegeId, year, department, bio, skills, projects, profilePicture) {
    // Create or update user object
    const isNewUser = !currentUser;
    currentUser = {
        id: isNewUser ? Date.now() : currentUser.id,
        name,
        collegeId,
        year,
        department,
        bio,
        skills,
        projects,
        profilePicture
    };

    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update UI
    updateProfileView();
    displaySuggestedConnections();

    // Show success toast
    showToast(`Profile ${isNewUser ? 'created' : 'updated'} successfully!`);

    // If this is a new profile, hide welcome message and show dashboard
    if (isNewUser) {
        welcomeSection.classList.add('hidden');
        showTab('dashboard');

        // Add a profile update activity
        addActivity('profile', 'You created your profile');
    } else {
        // Add a profile update activity
        addActivity('profile', 'You updated your profile information');
    }

    // Update dashboard stats
    updateDashboardStats();
}

function updateProfileView() {
    if (!currentUser) return;

    // Update profile view with user data
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-year-dept').textContent = `${currentUser.year} - ${currentUser.department}`;
    document.getElementById('profile-bio').textContent = currentUser.bio || 'No bio added yet.';

    // Update profile picture
    const profilePicDisplay = document.getElementById('profile-picture-display');
    if (currentUser.profilePicture) {
        profilePicDisplay.innerHTML = `<img src="${currentUser.profilePicture}" alt="${currentUser.name}" />`;
    } else {
        profilePicDisplay.innerHTML = `<i class="fas fa-user"></i>`;
    }
    // Update topbar profile picture as well
    updateTopbarProfilePicture();

    // Update skills and projects
    const profileSkills = document.getElementById('profile-skills');
    const profileProjects = document.getElementById('profile-projects');

    profileSkills.innerHTML = '';
    currentUser.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = skill;
        profileSkills.appendChild(tag);
    });

    profileProjects.innerHTML = '';
    currentUser.projects.forEach(project => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = project;
        profileProjects.appendChild(tag);
    });

    // Show profile view, hide form
    profileView.classList.remove('hidden');
    profileFormContainer.classList.add('hidden');

    // Initialize profile tabs
    initProfileTabs();
}

// Browse Students
function displayStudents(students) {
    studentsGrid.innerHTML = '';

    if (students.length === 0) {
        studentsGrid.innerHTML = '<p class="empty-state">No students match your search criteria.</p>';
        return;
    }

    students.forEach(student => {
        // Skip current user
        if (currentUser && student.id === currentUser.id) return;

        // Create student card
        const studentCard = document.createElement('div');
        studentCard.className = 'student-card';

        // Determine if we've already sent a connection request
        const isConnected = connections.some(conn => conn.id === student.id);
        const requestSent = sentRequests.includes(student.id);

        // Calculate common interests (for skill matching)
        let commonSkills = [];
        let commonProjects = [];

        if (currentUser) {
            commonSkills = student.skills.filter(skill =>
                currentUser.skills.some(userSkill =>
                    userSkill.toLowerCase() === skill.toLowerCase()
                )
            );

            commonProjects = student.projects.filter(project =>
                currentUser.projects.some(userProject =>
                    userProject.toLowerCase() === project.toLowerCase()
                )
            );
        }

        studentCard.innerHTML = `
            <div class="student-card-header">
                <div class="student-profile-pic">
                    ${student.profilePicture
                ? `<img src="${student.profilePicture}" alt="${student.name}" />`
                : `<i class="fas fa-user"></i>`}
                </div>
                <div class="student-info">
                    <h3>${student.name}</h3>
                    <p>${student.year} - ${student.department}</p>
                </div>
            </div>
            <div class="student-card-body">
                <p>${student.bio}</p>
                <div class="student-interests">
                    <h4>Skills & Interests</h4>
                    <div class="tag-container">
                        ${student.skills.map(skill =>
                    `<span class="tag ${commonSkills.includes(skill) ? 'tag-match' : ''}">${skill}</span>`
                ).join('')}
                    </div>
                </div>
                <div class="student-projects">
                    <h4>Project Areas</h4>
                    <div class="tag-container">
                        ${student.projects.map(project =>
                    `<span class="tag ${commonProjects.includes(project) ? 'tag-match' : ''}">${project}</span>`
                ).join('')}
                    </div>
                </div>
                ${commonSkills.length > 0 || commonProjects.length > 0 ?
                `<p class="match-info"><i class="fas fa-check-circle"></i> You have ${commonSkills.length + commonProjects.length} shared interests!</p>`
                : ''}
            </div>
            <div class="student-card-footer">
                ${isConnected
                ? `<button class="btn btn-secondary" disabled>Connected</button>`
                : requestSent
                    ? `<button class="btn btn-secondary" disabled>Request Sent</button>`
                    : `<button class="btn btn-primary connect-btn" data-id="${student.id}">Connect</button>`}
            </div>
        `;

        studentsGrid.appendChild(studentCard);
    });

    // Add event listeners to connect buttons
    const connectButtons = document.querySelectorAll('.connect-btn');
    connectButtons.forEach(button => {
        button.addEventListener('click', handleConnect);
    });
}

function handleConnect(e) {
    const studentId = parseInt(e.target.dataset.id);

    // Find student in our mock data
    const student = mockStudents.find(s => s.id === studentId);

    if (!student) return;

    // In a real app, this would send an API request
    // For our demo, we'll simulate accepting after a short delay
    sentRequests.push(studentId);

    // Save to localStorage
    localStorage.setItem('sentRequests', JSON.stringify(sentRequests));

    // Show toast notification
    showToast(`Connection request sent to ${student.name}`);

    // Update the button
    e.target.textContent = 'Request Sent';
    e.target.disabled = true;
    e.target.classList.remove('btn-primary');
    e.target.classList.add('btn-secondary');

    // Simulate response after 2 seconds
    setTimeout(() => {
        // Add to connections
        connections.push(student);

        // Remove from sent requests
        sentRequests = sentRequests.filter(id => id !== studentId);

        // Save to localStorage
        localStorage.setItem('connections', JSON.stringify(connections));
        localStorage.setItem('sentRequests', JSON.stringify(sentRequests));

        // Show toast notification
        showToast(`${student.name} accepted your connection request!`);

        // Update connections view
        updateConnectionsView();

        // Add activity
        addActivity('connection', `You connected with ${student.name}`);

        // Update dashboard stats
        updateDashboardStats();

        // Refresh the browse view to update buttons
        applyFilters();
    }, 2000);
}

// Connections View
function updateConnectionsView() {
    if (connections.length === 0) {
        connectionsContainer.innerHTML = `<p class="empty-state">
                                    <i class="fas fa-user-friends"></i>
                                    No connections yet. Start browsing to connect with peers!
                                </p>`;
        connectionsContainer.style.gridTemplateColumns = '1fr';
        return;
    }
    connectionsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    
    connectionsContainer.innerHTML = '';

    connections.forEach(student => {
        // Calculate common interests
        let commonSkills = [];
        let commonProjects = [];

        if (currentUser) {
            commonSkills = student.skills.filter(skill =>
                currentUser.skills.some(userSkill =>
                    userSkill.toLowerCase() === skill.toLowerCase()
                )
            );

            commonProjects = student.projects.filter(project =>
                currentUser.projects.some(userProject =>
                    userProject.toLowerCase() === project.toLowerCase()
                )
            );
        }

        const connectionCard = document.createElement('div');
        connectionCard.className = 'student-card';
        connectionCard.dataset.studentId = student.id;
        connectionCard.innerHTML = `
            <div class="student-card-header">
                <div class="student-profile-pic">
                    ${student.profilePicture 
                        ? `<img src="${student.profilePicture}" alt="${student.name}" />` 
                        : `<i class="fas fa-user"></i>`}
                </div>
                <div class="student-info">
                    <h3>${student.name}</h3>
                    <p>${student.year} - ${student.department}</p>
                </div>
            </div>
            <div class="student-card-body">
                <p>${student.bio}</p>
                <div class="student-interests">
                    <h4>Skills & Interests</h4>
                    <div class="tag-container">
                        ${student.skills.map(skill => 
                            `<span class="tag ${commonSkills.includes(skill) ? 'tag-match' : ''}">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="student-projects">
                    <h4>Project Areas</h4>
                    <div class="tag-container">
                        ${student.projects.map(project => 
                            `<span class="tag ${commonProjects.includes(project) ? 'tag-match' : ''}">${project}</span>`
                        ).join('')}
                    </div>
                </div>
                ${commonSkills.length > 0 || commonProjects.length > 0 ? 
                    `<p class="match-info"><i class="fas fa-check-circle"></i> You have ${commonSkills.length + commonProjects.length} shared interests!</p>` 
                    : ''}
            </div>
            <div class="student-card-footer">
                <button class="btn btn-primary message-btn" data-id="${student.id}">Message</button>
                <button class="btn btn-danger delete-connection-btn" data-id="${student.id}">
                    <i class="fas fa-user-minus"></i> Remove
                </button>
            </div>
        `;

        connectionsContainer.appendChild(connectionCard);
    });

   // Add event listeners to message buttons
    const messageButtons = document.querySelectorAll('.message-btn');
    messageButtons.forEach(button => {
        button.addEventListener('click', handleMessageClick);
    });
    
    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-connection-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteConnection);
    });
}

// Function to handle delete connection button click
function handleDeleteConnection(e) {
    const studentId = parseInt(e.target.dataset.id);
    const student = connections.find(c => c.id === studentId);
    
    if (!student) return;
    
    // Show confirmation dialog
    if (confirm(`Are you sure you want to remove ${student.name} from your connections?`)) {
        // Remove connection
        connections = connections.filter(conn => conn.id !== studentId);
        
        // Save to localStorage
        localStorage.setItem('connections', JSON.stringify(connections));
        
        // Show toast notification
        showToast(`${student.name} has been removed from your connections`);
        
        // Update connections view
        updateConnectionsView();
        updateConnectionCounts();
        
        // Add activity
        addActivity('connection', `You removed ${student.name} from your connections`);
        
        // Update dashboard stats
        updateDashboardStats();
        displayStudents(filteredStudents)
    }
}

// Function to handle message button click
function handleMessageClick(e) {
    const studentId = parseInt(e.target.dataset.id);
    const student = connections.find(c => c.id === studentId);
    
    if (!student) return;
    
    // Remove any existing chat box
    const existingChat = document.querySelector('.chat-box');
    if (existingChat) existingChat.remove();
    
    // Create chat box
    const chatBox = document.createElement('div');
    chatBox.className = 'chat-box';
    chatBox.innerHTML = `
        <div class="chat-header">
            <div class="chat-user-info">
                <div class="chat-user-pic">
                    ${student.profilePicture 
                        ? `<img src="${student.profilePicture}" alt="${student.name}" />` 
                        : `<i class="fas fa-user"></i>`}
                </div>
                <h3>${student.name}</h3>
            </div>
            <button class="chat-close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="chat-messages">
            <div class="chat-welcome">
                <p>This is the beginning of your conversation with ${student.name}</p>
            </div>
            <!-- Mock messages for demo -->
            <div class="chat-message received">
                <p>Hi there! Thanks for connecting.</p>
                <span class="message-time">3:45 PM</span>
            </div>
        </div>
        <div class="chat-input-area">
            <textarea class="chat-input" placeholder="Type a message..."></textarea>
            <button class="chat-send-btn">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;

    // Apply current theme to chat box
    applyChatBoxTheme(chatBox);
    
    // Add chat box to the page
    document.body.appendChild(chatBox);
    
    // Focus the input
    const chatInput = chatBox.querySelector('.chat-input');
    chatInput.focus();
    
    // Add event listener to close button
    const closeBtn = chatBox.querySelector('.chat-close-btn');
    closeBtn.addEventListener('click', () => {
        chatBox.remove();
    });
    
    // Add event listener to send button
    const sendBtn = chatBox.querySelector('.chat-send-btn');
    sendBtn.addEventListener('click', () => handleSendMessage(chatInput, chatBox, student));
    
    // Add event listener for enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(chatInput, chatBox, student);
        }
    });
    
    // Add activity
    addActivity('message', `You started a conversation with ${student.name}`);
}

// Function to apply current theme to chat box
function applyChatBoxTheme(chatBox) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        chatBox.classList.add('dark-mode');
        // Force apply dark mode styles
        chatBox.style.backgroundColor = '#1f2937';
        chatBox.style.borderColor = '#374151';
        
        // Apply to messages container
        const messagesContainer = chatBox.querySelector('.chat-messages');
        if (messagesContainer) {
            messagesContainer.style.backgroundColor = '#1f2937';
        }
        
        // Apply to input area
        const inputArea = chatBox.querySelector('.chat-input-area');
        if (inputArea) {
            inputArea.style.backgroundColor = '#374151';
            inputArea.style.borderColor = '#4b5563';
        }
        
        // Apply to input
        const input = chatBox.querySelector('.chat-input');
        if (input) {
            input.style.backgroundColor = '#1f2937';
            input.style.color = '#f9fafb';
            input.style.borderColor = '#4b5563';
        }
        
        // Apply to welcome message
        const welcome = chatBox.querySelector('.chat-welcome');
        if (welcome) {
            welcome.style.backgroundColor = '#374151';
            welcome.style.color = '#d1d5db';
        }
        
        // Apply to received messages
        const receivedMessages = chatBox.querySelectorAll('.received');
        receivedMessages.forEach(msg => {
            msg.style.backgroundColor = '#374151';
            msg.style.color = '#f9fafb';
        });
        
    } else {
        chatBox.classList.remove('dark-mode');
        // Reset to light mode styles
        chatBox.style.backgroundColor = '#ffffff';
        chatBox.style.borderColor = '#e1e5e9';
        
        // Reset messages container
        const messagesContainer = chatBox.querySelector('.chat-messages');
        if (messagesContainer) {
            messagesContainer.style.backgroundColor = '#ffffff';
        }
        
        // Reset input area
        const inputArea = chatBox.querySelector('.chat-input-area');
        if (inputArea) {
            inputArea.style.backgroundColor = '#f8fafc';
            inputArea.style.borderColor = '#e1e5e9';
        }
        
        // Reset input
        const input = chatBox.querySelector('.chat-input');
        if (input) {
            input.style.backgroundColor = '#ffffff';
            input.style.color = '#1f2937';
            input.style.borderColor = '#d1d5db';
        }
        
        // Reset welcome message
        const welcome = chatBox.querySelector('.chat-welcome');
        if (welcome) {
            welcome.style.backgroundColor = '#f8fafc';
            welcome.style.color = '#64748b';
        }
        
        // Reset received messages
        const receivedMessages = chatBox.querySelectorAll('.received');
        receivedMessages.forEach(msg => {
            msg.style.backgroundColor = '#f1f5f9';
            msg.style.color = '#1e293b';
        });
    }
}

// Enhanced handleSendMessage to apply theme to new messages
function handleSendMessage(chatInput, chatBox, student) {
    const messageText = chatInput.value.trim();
    
    if (!messageText) return;
    
    // Get current time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message sent';
    messageEl.innerHTML = `
        <p>${messageText}</p>
        <span class="message-time">${timeString}</span>
    `;
    
    // Add message to chat
    const chatMessages = chatBox.querySelector('.chat-messages');
    chatMessages.appendChild(messageEl);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate response after 1-2 seconds
    setTimeout(() => {
        // Create response message
        const responseEl = document.createElement('div');
        responseEl.className = 'chat-message received';
        
        // Generate a simple response based on the student's interests
        const responses = [
            `I'm actually working on a project related to ${student.projects[0]} right now!`,
            `Great to hear from you! I'd love to collaborate on something involving ${student.skills[0]}.`,
            `I've been looking for someone to study with. Are you free this weekend?`,
            `Thanks for reaching out! I'm interested in learning more about your experience with ${currentUser.skills[0]}.`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        responseEl.innerHTML = `
            <p>${randomResponse}</p>
            <span class="message-time">${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
        `;
        
        // Apply theme to the new received message
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            responseEl.style.backgroundColor = '#374151';
            responseEl.style.color = '#f9fafb';
        }
        
        // Add response to chat
        chatMessages.appendChild(responseEl);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000 + Math.random() * 1000);
}

// Search and Filter
searchBtn.addEventListener('click', applyFilters);
studentSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyFilters();
    }
});

filterDepartment.addEventListener('change', applyFilters);
filterYear.addEventListener('change', applyFilters);
filterInterests.addEventListener('change', applyFilters);

function applyFilters() {
    // Show loading animation
    studentsLoader.style.display = 'flex';

    // Hide students grid while loading
    studentsGrid.style.display = 'none';

    // Get filter values
    const searchQuery = studentSearch.value.toLowerCase();
    const departmentFilter = filterDepartment.value;
    const yearFilter = filterYear.value;
    const interestFilter = filterInterests.value;

    // Simulate loading delay (remove this in production with real data)
    setTimeout(() => {
        filteredStudents = mockStudents.filter(student => {
            // Filter by search query
            const matchesSearch =
                student.name.toLowerCase().includes(searchQuery) ||
                student.department.toLowerCase().includes(searchQuery) ||
                student.skills.some(skill => skill.toLowerCase().includes(searchQuery)) ||
                student.projects.some(project => project.toLowerCase().includes(searchQuery));

            // Filter by department
            const matchesDepartment = !departmentFilter || student.department === departmentFilter;

            // Filter by year
            const matchesYear = !yearFilter || student.year === yearFilter;

            // Filter by interest
            const matchesInterest = !interestFilter ||
                student.skills.some(skill => skill.toLowerCase() === interestFilter.toLowerCase()) ||
                student.projects.some(project => project.toLowerCase() === interestFilter.toLowerCase());

            return matchesSearch && matchesDepartment && matchesYear && matchesInterest;
        });

        // Hide loading animation
        studentsLoader.style.display = 'none';

        // Show students grid
        studentsGrid.style.display = 'grid';

        // Update display
        displayStudents(filteredStudents);

        // Add browse activity if there are results
        if (filteredStudents.length > 0) {
            addActivity('browse', `You browsed ${filteredStudents.length} student profiles`);
        }
    }, 800); // Simulated loading time of 800ms
}

// Dashboard Features
function displayRecentActivity() {
    if (!recentActivity) return;

    // Get activities from localStorage or use mock data
    let activities = JSON.parse(localStorage.getItem('recentActivity')) || mockRecentActivity;

    if (activities.length === 0) {
        recentActivity.innerHTML = '<p class="empty-state">No recent activity</p>';
        return;
    }

    recentActivity.innerHTML = '';

    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Display only the 5 most recent activities
    activities.slice(0, 5).forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';

        // Format the timestamp
        const activityDate = new Date(activity.timestamp);
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(activityDate);

        // Set icon based on activity type
        let icon;
        switch (activity.type) {
            case 'connection':
                icon = 'fa-user-plus';
                break;
            case 'profile':
                icon = 'fa-id-card';
                break;
            case 'browse':
                icon = 'fa-search';
                break;
            default:
                icon = 'fa-bell';
        }

        activityItem.innerHTML = `
            <p><i class="fas ${icon}"></i> ${activity.description}</p>
            <p class="activity-time">${formattedDate}</p>
        `;

        recentActivity.appendChild(activityItem);
    });
}

function addActivity(type, description) {
    // Get existing activities or initialize empty array
    let activities = JSON.parse(localStorage.getItem('recentActivity')) || [];

    // Add new activity
    const newActivity = {
        id: Date.now(),
        type,
        description,
        timestamp: new Date().toISOString()
    };

    activities.unshift(newActivity);

    // Keep only the 10 most recent activities
    if (activities.length > 10) {
        activities = activities.slice(0, 10);
    }

    // Save to localStorage
    localStorage.setItem('recentActivity', JSON.stringify(activities));

    // Update dashboard display
    displayRecentActivity();
}

function updateDashboardStats() {
    if (!currentUser) return;

    // Update connections count
    connectionsCount.textContent = connections.length;

    // Calculate skills matched across all connections
    let matchedSkills = new Set();
    let matchedProjects = new Set();

    connections.forEach(student => {
        student.skills.forEach(skill => {
            if (currentUser.skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())) {
                matchedSkills.add(skill.toLowerCase());
            }
        });

        student.projects.forEach(project => {
            if (currentUser.projects.some(userProject => userProject.toLowerCase() === project.toLowerCase())) {
                matchedProjects.add(project.toLowerCase());
            }
        });
    });

    skillsMatched.textContent = matchedSkills.size;
    projectTags.textContent = matchedProjects.size;
}

// Helper Functions
function loadConnections() {
    const savedConnections = localStorage.getItem('connections');
    if (savedConnections) {
        connections = JSON.parse(savedConnections);
    }
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Add custom styles for matching tags
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .tag-match {
        background-color: var(--primary-light);
        color: white;
    }
    
    .match-info {
        color: var(--success-color);
        margin-top: 1rem;
        font-weight: 500;
    }
    
    .match-info i {
        margin-right: 5px;
    }
`;
document.head.appendChild(styleSheet);

// Initialize application
init();

// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to 'light-mode'
const currentTheme = localStorage.getItem('theme') || 'light-mode';

// Apply the saved theme on page load
body.className = currentTheme;
updateThemeToggleButton();

// Theme toggle event listener
themeToggleBtn.addEventListener('click', () => {
    // Toggle between light and dark modes
    if (body.classList.contains('light-mode')) {
        body.className = 'dark-mode';
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.className = 'light-mode';
        localStorage.setItem('theme', 'light-mode');
    }

    // Update button text and icon
    updateThemeToggleButton();

    // Apply theme to any existing chat boxes
    const existingChatBoxes = document.querySelectorAll('.chat-box');
    existingChatBoxes.forEach(chatBox => {
        applyChatBoxTheme(chatBox);
    });
});

// Observer to watch for theme changes and update chat boxes accordingly
const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            // Theme has changed, update all chat boxes
            const chatBoxes = document.querySelectorAll('.chat-box');
            chatBoxes.forEach(chatBox => {
                applyChatBoxTheme(chatBox);
            });
        }
    });
});

// Start observing theme changes on body element
themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});

// Function to update theme toggle button text and icon
function updateThemeToggleButton() {
    const themeText = themeToggleBtn.querySelector('span');
    const themeIcon = themeToggleBtn.querySelector('i');

    if (body.classList.contains('dark-mode')) {
        themeText.textContent = 'Light Mode';
        themeIcon.className = 'fas fa-sun';
    } else {
        themeText.textContent = 'Dark Mode';
        themeIcon.className = 'fas fa-moon';
    }
}

// Topbar Functionality
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const sidebar = document.getElementById('sidebar');
const searchInput = document.querySelector('.search-bar input');
const notificationBtn = document.querySelector('.icon-btn[aria-label="Notifications"]');


// Sidebar Toggle Functionality
toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');

    // Add overlay for mobile when sidebar is open
    if (sidebar.classList.contains('active')) {
        createOverlay();
    } else {
        removeOverlay();
    }
});

// Close sidebar button (visible on mobile)
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
        removeOverlay();
    });
}

// Create overlay for mobile sidebar
function createOverlay() {
    if (!document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 150;
            display: block;
        `;

        // Close sidebar when overlay is clicked
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            removeOverlay();
        });

        document.body.appendChild(overlay);
    }
}

// Remove overlay
function removeOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Close sidebar when clicking outside on desktop
document.addEventListener('click', (e) => {
    if (window.innerWidth > 1023) return; // Only for mobile/tablet

    if (!sidebar.contains(e.target) &&
        !toggleSidebarBtn.contains(e.target) &&
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        removeOverlay();
    }
});

// Global search functionality
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performGlobalSearch(searchInput.value.trim());
    }
});

// Add search button functionality (optional)
const searchIcon = document.querySelector('.search-bar i');
searchIcon.addEventListener('click', () => {
    performGlobalSearch(searchInput.value.trim());
});

function performGlobalSearch(query) {
    if (!query) return;

    // Switch to browse tab and perform search
    showTab('browse');

    // Set the browse search input
    const browseSearchInput = document.getElementById('student-search');
    if (browseSearchInput) {
        browseSearchInput.value = query;
        // Trigger the browse search
        applyFilters();
    }

    // Clear the global search
    searchInput.value = '';

    // Show toast notification
    showToast(`Searching for: ${query}`);
}

// Notifications functionality
notificationBtn.addEventListener('click', () => {
    // In a real app, this would open a notifications dropdown
    // For demo purposes, we'll show a toast
    showToast('Notifications feature coming soon!');

    // You could also create a dropdown here
    toggleNotificationsDropdown();
});

function toggleNotificationsDropdown() {
    // Remove existing dropdown if present
    const existingDropdown = document.querySelector('.notifications-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }

    // Create notifications dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'notifications-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        width: 300px;
        background: var(--background-white);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        box-shadow: var(--card-shadow);
        z-index: 1000;
        padding: var(--space-4);
        margin-top: var(--space-2);
    `;

    dropdown.innerHTML = `
        <h4 style="margin-bottom: var(--space-3); color: var(--text-dark);">Notifications</h4>
        <div class="notification-item" style="padding: var(--space-2) 0; border-bottom: 1px solid var(--border-color);">
            <p style="margin: 0; font-size: 0.9rem; color: var(--text-light);">
                <i class="fas fa-user-plus" style="color: var(--primary-color); margin-right: var(--space-2);"></i>
                You have 2 new connection requests
            </p>
            <small style="color: var(--text-lighter);">2 hours ago</small>
        </div>
        <div class="notification-item" style="padding: var(--space-2) 0;">
            <p style="margin: 0; font-size: 0.9rem; color: var(--text-light);">
                <i class="fas fa-message" style="color: var(--info-color); margin-right: var(--space-2);"></i>
                New message from Sarah Johnson
            </p>
            <small style="color: var(--text-lighter);">1 day ago</small>
        </div>
    `;

    // Position relative to the notification button
    notificationBtn.style.position = 'relative';
    notificationBtn.appendChild(dropdown);

    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!notificationBtn.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

// Update topbar profile picture when user profile changes
function updateTopbarProfilePicture() {
    if (currentUser && currentUser.profilePicture) {
        topbarProfilePicture.innerHTML = `<img src="${currentUser.profilePicture}" alt="${currentUser.name}" />`;
    } else {
        topbarProfilePicture.innerHTML = `<i class="fas fa-user"></i>`;
    }
}

// Profile picture click functionality (optional)
topbarProfilePicture.addEventListener('click', () => {
    // Navigate to profile page
    showTab('profile');
});

// Handle window resize to close sidebar on desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 1023) {
        sidebar.classList.remove('active');
        removeOverlay();
    }
});

// Badge update functionality (for notifications)
function updateNotificationBadge(count) {
    const badge = notificationBtn.querySelector('.badge');
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Function to display suggested connections on dashboard
function displaySuggestedConnections() {
    if (!currentUser) {
        suggestedConnectionsContainer.innerHTML = '<p class="empty-state"><i class="fas fa-user-friends"></i> Create your profile to see suggestions</p>';
        return;
    }

    // Get connections IDs for filtering
    const connectionIds = connections.map(conn => conn.id);
    const sentRequestIds = sentRequests;

    // Filter students who aren't already connected and match user interests
    const suggestedStudents = mockStudents
        .filter(student =>
            student.id !== currentUser.id &&
            !connectionIds.includes(student.id) &&
            !sentRequestIds.includes(student.id))
        .map(student => {
            // Calculate match score based on common skills and projects
            const commonSkills = student.skills.filter(skill =>
                currentUser.skills.some(userSkill =>
                    userSkill.toLowerCase() === skill.toLowerCase()
                )
            );

            const commonProjects = student.projects.filter(project =>
                currentUser.projects.some(userProject =>
                    userProject.toLowerCase() === project.toLowerCase()
                )
            );

            return {
                ...student,
                matchScore: commonSkills.length + commonProjects.length,
                commonSkills,
                commonProjects
            };
        })
        .filter(student => student.matchScore > 0) // Only suggest students with at least one match
        .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score (highest first)

    // Show suggestions
    if (suggestedStudents.length === 0) {
        suggestedConnectionsContainer.innerHTML = '<p class="empty-state"><i class="fas fa-search"></i> No matching connections found</p>';
        return;
    }

    suggestedConnectionsContainer.innerHTML = '';

    // Display up to 3 suggestions
    suggestedStudents.slice(0, 3).forEach(student => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';

        suggestionItem.innerHTML = `
            <div class="suggestion-profile">
                <div class="student-profile-pic">
                    ${student.profilePicture
                ? `<img src="${student.profilePicture}" alt="${student.name}" />`
                : `<i class="fas fa-user"></i>`}
                </div>
                <div class="suggestion-info">
                    <h4>${student.name}</h4>
                    <p>${student.year} - ${student.department}</p>
                    <p class="match-info"><i class="fas fa-check-circle"></i> ${student.matchScore} shared interests</p>
                </div>
            </div>
            <button class="btn btn-primary btn-sm connect-suggestion-btn" data-id="${student.id}">Connect</button>
        `;

        suggestedConnectionsContainer.appendChild(suggestionItem);
    });

    // Add event listeners to connect buttons
    const connectButtons = suggestedConnectionsContainer.querySelectorAll('.connect-suggestion-btn');
    connectButtons.forEach(button => {
        button.addEventListener('click', handleSuggestedConnect);
    });
}

// Handle connecting from suggestions
function handleSuggestedConnect(e) {
    const studentId = parseInt(e.target.dataset.id);

    // Find student in our mock data
    const student = mockStudents.find(s => s.id === studentId);

    if (!student) return;

    // Add to sent requests
    sentRequests.push(studentId);

    // Save to localStorage
    localStorage.setItem('sentRequests', JSON.stringify(sentRequests));

    // Show toast notification
    showToast(`Connection request sent to ${student.name}`);

    // Update suggested connections display
    displaySuggestedConnections();

    // Simulate response after 2 seconds
    setTimeout(() => {
        // Add to connections
        connections.push(student);

        // Remove from sent requests
        sentRequests = sentRequests.filter(id => id !== studentId);

        // Save to localStorage
        localStorage.setItem('connections', JSON.stringify(connections));
        localStorage.setItem('sentRequests', JSON.stringify(sentRequests));

        // Show toast notification
        showToast(`${student.name} accepted your connection request!`);

        // Update connections view
        updateConnectionsView();

        // Add activity
        addActivity('connection', `You connected with ${student.name}`);

        // Update dashboard stats
        updateDashboardStats();

        // Update suggested connections
        displaySuggestedConnections();
    }, 2000);
}

// Function to handle profile tab switching
function initProfileTabs() {
    profileTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the target tab content
            const targetTab = button.dataset.target;

            // Remove active class from all tabs and panes
            profileTabButtons.forEach(btn => btn.classList.remove('active'));
            profileTabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            button.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
}
// Initially hide the advanced filters (if not already hidden in CSS)
advancedFilters.style.display = 'none';

// Toggle filters visibility when the filter button is clicked
toggleFiltersBtn.addEventListener('click', () => {
    if (advancedFilters.style.display === 'none') {
        advancedFilters.style.display = 'flex';
        // toggleFiltersBtn.querySelector('span').textContent = 'Hide Filters';
    } else {
        advancedFilters.style.display = 'none';
        // toggleFiltersBtn.querySelector('span').textContent = 'Filters';
    }
});

// Clear filters functionality
clearFiltersBtn.addEventListener('click', () => {
    filterDepartment.value = '';
    filterYear.value = '';
    filterInterests.value = '';
    studentSearch.value = '';
    applyFilters();
});

// Initialize the browse section with proper filter and loader states
function initializeBrowseSection() {
    // Hide advanced filters initially
    advancedFilters.style.display = 'none';

    // Hide loader initially
    studentsLoader.style.display = 'none';

    // Set initial display for students grid
    displayStudents(filteredStudents);
}
initializeBrowseSection();

// Function to update the connection counts
function updateConnectionCounts() {
    totalConnectionsElement.textContent = connections.length;
    pendingRequestsElement.textContent = pendingRequests.length;
}

// Function to display pending connection requests
function displayPendingRequests() {
    if (pendingRequests.length === 0) {
        pendingConnectionsContainer.innerHTML = '<p class="empty-state"><i class="fas fa-paper-plane"></i>No pending connection requests</p>';
        pendingConnectionsContainer.style.gridTemplateColumns = '1fr';
        return;
    }

    pendingConnectionsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    pendingConnectionsContainer.innerHTML = '';

    pendingRequests.forEach(request => {
        // Calculate common interests
        let commonSkills = [];
        let commonProjects = [];

        if (currentUser) {
            commonSkills = request.skills.filter(skill =>
                currentUser.skills.some(userSkill =>
                    userSkill.toLowerCase() === skill.toLowerCase()
                )
            );

            commonProjects = request.projects.filter(project =>
                currentUser.projects.some(userProject =>
                    userProject.toLowerCase() === project.toLowerCase()
                )
            );
        }

        const requestCard = document.createElement('div');
        requestCard.className = 'student-card pending-request-card';
        requestCard.innerHTML = `
            <div class="student-card-header">
                <div class="student-profile-pic">
                    ${request.profilePicture
                ? `<img src="${request.profilePicture}" alt="${request.name}" />`
                : `<i class="fas fa-user"></i>`}
                </div>
                <div class="student-info">
                    <h3>${request.name}</h3>
                    <p>${request.year} - ${request.department}</p>
                </div>
            </div>
            <div class="student-card-body">
                <p>${request.bio}</p>
                <div class="student-interests">
                    <h4>Skills & Interests</h4>
                    <div class="tag-container">
                        ${request.skills.map(skill =>
                    `<span class="tag ${commonSkills.includes(skill) ? 'tag-match' : ''}">${skill}</span>`
                ).join('')}
                    </div>
                </div>
                <div class="student-projects">
                    <h4>Project Areas</h4>
                    <div class="tag-container">
                        ${request.projects.map(project =>
                    `<span class="tag ${commonProjects.includes(project) ? 'tag-match' : ''}">${project}</span>`
                ).join('')}
                    </div>
                </div>
                ${commonSkills.length > 0 || commonProjects.length > 0 ?
                `<p class="match-info"><i class="fas fa-check-circle"></i> You have ${commonSkills.length + commonProjects.length} shared interests!</p>`
                : ''}
            </div>
            <div class="student-card-footer request-actions">
                <button class="btn btn-primary accept-btn" data-id="${request.id}">Accept</button>
                <button class="btn btn-outline decline-btn" data-id="${request.id}">Decline</button>
            </div>
        `;

        pendingConnectionsContainer.appendChild(requestCard);
    });

    // Add event listeners to accept/decline buttons
    const acceptButtons = document.querySelectorAll('.accept-btn');
    const declineButtons = document.querySelectorAll('.decline-btn');

    acceptButtons.forEach(button => {
        button.addEventListener('click', handleAcceptRequest);
    });

    declineButtons.forEach(button => {
        button.addEventListener('click', handleDeclineRequest);
    });
}

// Handle accepting a connection request
function handleAcceptRequest(e) {
    const requestId = parseInt(e.target.dataset.id);
    const requestIndex = pendingRequests.findIndex(req => req.id === requestId);

    if (requestIndex === -1) return;

    // Get the request object
    const request = pendingRequests[requestIndex];

    // Remove from pending requests
    pendingRequests.splice(requestIndex, 1);

    // Add to connections
    connections.push(request);

    // Save to localStorage
    localStorage.setItem('connections', JSON.stringify(connections));

    // Show toast notification
    showToast(`You accepted ${request.name}'s connection request!`);

    // Update UI
    updateConnectionCounts();
    displayPendingRequests();
    updateConnectionsView();

    // Add activity
    addActivity('connection', `You connected with ${request.name}`);

    // Update dashboard stats
    updateDashboardStats();
}

// Handle declining a connection request
function handleDeclineRequest(e) {
    const requestId = parseInt(e.target.dataset.id);
    const requestIndex = pendingRequests.findIndex(req => req.id === requestId);

    if (requestIndex === -1) return;

    // Get the request name before removing
    const requestName = pendingRequests[requestIndex].name;

    // Remove from pending requests
    pendingRequests.splice(requestIndex, 1);

    // Show toast notification
    showToast(`You declined ${requestName}'s connection request`);

    // Update UI
    updateConnectionCounts();
    displayPendingRequests();

    // Add activity
    addActivity('connection', `You declined a connection request from ${requestName}`);
}

// Function to handle tab switching in connections page
function setupConnectionTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get the tab to show
            const tabToShow = button.dataset.tab;

            // Hide all tab panes
            connectionTabPanes.forEach(pane => pane.classList.remove('active'));

            // Show the selected tab pane
            document.getElementById(tabToShow).classList.add('active');
        });
    });
}

// Initialize connections page
function initializeConnectionsPage() {
    // Setup connection tabs
    setupConnectionTabs();

    // Load connections from localStorage or use empty array
    connections = JSON.parse(localStorage.getItem('connections')) || [];

    // Load pending requests (in a real app, you would get these from the server)
    // Here we're just using the mock data

    // Update connection counts
    updateConnectionCounts();

    // Display connections and pending requests
    updateConnectionsView();
    displayPendingRequests();
}
initializeConnectionsPage();

document.getElementById('index').addEventListener('click', () => {
    window.location.href = 'index.html';
});