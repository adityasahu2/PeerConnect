// Mock Student Data
const mockStudents = [
    {
        id: 1,
        name: "Alex Johnson",
        collegeId: "CS2023001",
        year: "Junior",
        department: "Computer Science",
        profilePicture: null,
        bio: "Passionate about web development and AI. Looking to collaborate on innovative projects.",
        skills: ["Programming", "Web Development", "Machine Learning", "Data Science"],
        projects: ["AI Research", "Mobile App Development", "Cloud Computing"]
    },
    {
        id: 2,
        name: "Sophia Chen",
        collegeId: "ENG2022045",
        year: "Senior",
        department: "Engineering",
        profilePicture: null,
        bio: "Mechanical engineering student with interest in sustainable energy solutions.",
        skills: ["CAD Design", "Prototyping", "Research", "Project Management"],
        projects: ["Renewable Energy", "Robotics", "Sustainable Design"]
    },
    {
        id: 3,
        name: "Marcus Williams",
        collegeId: "BUS2024022",
        year: "Sophomore",
        department: "Business",
        profilePicture: null,
        bio: "Aspiring entrepreneur interested in startups and digital marketing.",
        skills: ["Marketing", "Business Analysis", "Leadership", "Public Speaking"],
        projects: ["Startup Development", "Market Research", "Digital Marketing"]
    },
    {
        id: 4,
        name: "Emma Rodriguez",
        collegeId: "ART2023078",
        year: "Junior",
        department: "Arts",
        profilePicture: null,
        bio: "Digital artist focusing on interactive media and UX/UI design.",
        skills: ["Digital Art", "UI/UX Design", "Animation", "Graphic Design"],
        projects: ["Interactive Design", "Digital Exhibitions", "Brand Identity"]
    },
    {
        id: 5,
        name: "David Kim",
        collegeId: "SCI2022031",
        year: "Senior",
        department: "Sciences",
        profilePicture: null,
        bio: "Physics major with interest in quantum computing and theoretical physics.",
        skills: ["Scientific Research", "Data Analysis", "Programming", "Mathematics"],
        projects: ["Quantum Computing", "Particle Physics", "Mathematical Modeling"]
    },
    {
        id: 6,
        name: "Olivia Patel",
        collegeId: "HUM2024056",
        year: "Freshman",
        department: "Humanities",
        profilePicture: null,
        bio: "English literature student passionate about creative writing and digital storytelling.",
        skills: ["Writing", "Content Creation", "Editing", "Research"],
        projects: ["Digital Storytelling", "Literary Analysis", "Creative Writing"]
    },
    {
        id: 7,
        name: "Jamal Thompson",
        collegeId: "CS2022089",
        year: "Senior",
        department: "Computer Science",
        profilePicture: null,
        bio: "Full-stack developer with experience in multiple programming languages and frameworks.",
        skills: ["Full-stack Development", "Mobile Development", "Cloud Services", "UI Design"],
        projects: ["Web Applications", "Mobile Apps", "API Development"]
    },
    {
        id: 8,
        name: "Aisha Khan",
        collegeId: "MED2023012",
        year: "Junior",
        department: "Medicine",
        profilePicture: null,
        bio: "Pre-med student interested in medical research and healthcare technology.",
        skills: ["Medical Research", "Biology", "Chemistry", "Data Analysis"],
        projects: ["Healthcare Technology", "Medical Research", "Bioinformatics"]
    },
    {
        id: 9,
        name: "Ryan Lee",
        collegeId: "ENG2024034",
        year: "Sophomore",
        department: "Engineering",
        profilePicture: null,
        bio: "Electrical engineering student focusing on renewable energy systems.",
        skills: ["Circuit Design", "Programming", "Renewable Energy", "Project Management"],
        projects: ["Solar Energy", "Smart Grids", "Electronics"]
    },
    {
        id: 10,
        name: "Isabella Martinez",
        collegeId: "BUS2023067",
        year: "Junior",
        department: "Business",
        profilePicture: null,
        bio: "Finance major interested in fintech and investment strategies.",
        skills: ["Financial Analysis", "Investment Research", "Data Visualization", "Business Strategy"],
        projects: ["Fintech Applications", "Investment Analysis", "Market Research"]
    },
    {
        id: 11,
        name: "Tyler Wilson",
        collegeId: "CS2024045",
        year: "Freshman",
        department: "Computer Science",
        profilePicture: null,
        bio: "Enthusiastic about game development and interactive media.",
        skills: ["Game Development", "3D Modeling", "Programming", "UI Design"],
        projects: ["Video Games", "AR/VR Applications", "Interactive Media"]
    },
    {
        id: 12,
        name: "Zoe Anderson",
        collegeId: "SCI2023023",
        year: "Junior",
        department: "Sciences",
        profilePicture: null,
        bio: "Environmental science student passionate about sustainability and conservation.",
        skills: ["Environmental Analysis", "Research", "GIS Mapping", "Data Collection"],
        projects: ["Environmental Conservation", "Climate Research", "Sustainability"]
    }
];

// Mock Recent Activity Data (for Dashboard)
const mockRecentActivity = [
    {
        id: 1,
        type: "connection",
        description: "You connected with Sophia Chen",
        timestamp: "2025-05-20T14:30:00"
    },
    {
        id: 2,
        type: "profile",
        description: "You updated your profile information",
        timestamp: "2025-05-19T09:15:00"
    },
    {
        id: 3,
        type: "connection",
        description: "You connected with Marcus Williams",
        timestamp: "2025-05-18T16:45:00"
    },
    {
        id: 4,
        type: "browse",
        description: "You browsed 5 student profiles",
        timestamp: "2025-05-17T11:20:00"
    },
    {
        id: 5,
        type: "connection",
        description: "You connected with Emma Rodriguez",
        timestamp: "2025-05-16T13:10:00"
    }
];