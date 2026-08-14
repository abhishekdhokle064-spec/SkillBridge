const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Fail-safe In-Memory & LocalStorage mock fallback database
const FALLBACK_DATA = {
  institutions: [
    { id: "inst_1", name: "Government Engineering College, Nashik", code: "GEC Nashik", city: "Nashik", state: "Maharashtra" },
    { id: "inst_2", name: "College of Engineering, Pune", code: "COEP Pune", city: "Pune", state: "Maharashtra" },
    { id: "inst_3", name: "Vishwakarma Institute of Technology", code: "VIT Pune", city: "Pune", state: "Maharashtra" },
    { id: "inst_4", name: "Veermata Jijabai Technological Institute", code: "VJTI Mumbai", city: "Mumbai", state: "Maharashtra" },
    { id: "inst_5", name: "Visvesvaraya National Institute of Technology", code: "VNIT Nagpur", city: "Nagpur", state: "Maharashtra" },
    { id: "inst_6", name: "Pune Institute of Computer Technology", code: "PICT Pune", city: "Pune", state: "Maharashtra" },
    { id: "inst_7", name: "Walchand College of Engineering", code: "WCE Sangli", city: "Sangli", state: "Maharashtra" }
  ],
  users: [
    {
      id: "user_student_1",
      name: "Rahul Sharma",
      email: "rahul.sharma@gecnashik.ac.in",
      role: "student",
      institutionId: "inst_1",
      institutionName: "Government Engineering College, Nashik",
      department: "Mechanical & Robotics",
      title: "Student Scholar | GEC Nashik",
      cgpa: 9.12,
      avatarImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "user_admin_1",
      name: "Dr. Mehra",
      email: "principal@gecnashik.ac.in",
      role: "institution",
      institutionId: "inst_1",
      institutionName: "Government Engineering College, Nashik",
      department: "Office of the Principal",
      title: "Institution Admin | GEC Nashik",
      avatarImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "user_student_2",
      name: "Anjali Patil",
      email: "anjali.p@coep.ac.in",
      role: "student",
      institutionId: "inst_2",
      institutionName: "College of Engineering, Pune",
      department: "Computer Engineering",
      title: "Student | COEP Pune",
      cgpa: 9.4,
      avatarImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "user_trainer_1",
      name: "Prof. Ananya Sen",
      email: "ananya.sen@vit.edu",
      role: "trainer",
      institutionId: "inst_3",
      institutionName: "Vishwakarma Institute of Technology",
      department: "Electronics & AI",
      title: "Expert Trainer | Teach Beyond Borders",
      avatarImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: "user_recruiter_1",
      name: "Pooja Verma",
      email: "pooja.v@tcs.com",
      role: "industry",
      institutionId: null,
      company: "Tata Consultancy Services",
      department: "University Talent Acquisition",
      title: "Industry Partner | Hire Skilled Talent",
      avatarImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80"
    }
  ],
  resources: [
    {
      id: "res_1",
      title: "Robotics Lab",
      institutionId: "inst_1",
      institutionName: "Government Engineering College, Nashik",
      location: "Nashik, Maharashtra",
      category: "Laboratories",
      specs: "ABB Industrial Robot Arm, Arduino & Raspberry Pi Kits, ROS (Robot Operating System), 3D Printer & CNC Setup",
      capacity: 30,
      seatsAvailable: 25,
      availableDates: "10 Aug 2025 - 25 Aug 2025",
      timeSlots: "10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM",
      status: "Available",
      description: "State-of-the-art Robotics Lab with latest industrial robotic arms, Arduino kits, ROS and simulation systems for hands-on learning.",
      keyFeatures: ["ABB Industrial Robot Arm", "Arduino & Raspberry Pi Kits", "ROS (Robot Operating System)", "3D Printer & CNC Setup"],
      equipment: ["6-DOF ABB Arm", "20x Arduino Mega Kits", "10x Jetson Nano", "Creality Ender 3D Printer"],
      trainerName: "Dr. K. R. Joshi (Robotics Specialist)",
      totalBookedHours: 320,
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "res_2",
      title: "AI & ML Lab",
      institutionId: "inst_5",
      institutionName: "Visvesvaraya National Institute of Technology",
      location: "Nagpur, Maharashtra",
      category: "Laboratories",
      specs: "NVIDIA RTX 4090 Workstations, PyTorch/TensorFlow Deep Learning Rig, High-speed NAS",
      capacity: 25,
      seatsAvailable: 18,
      availableDates: "09 Jun 2025 - 20 Jun 2025",
      timeSlots: "02:00 PM - 05:00 PM",
      status: "Available",
      description: "Equipped with high-performance computational clusters and neural network accelerators for deep learning computer vision and NLP model training.",
      keyFeatures: ["NVIDIA RTX 4090 Workstations", "Distributed PyTorch Clusters", "Computer Vision & NLP Datasets", "JupyterHub Multi-User Server"],
      equipment: ["8x GPU Nodes", "High Throughput Storage", "Dual Xeon Processors"],
      trainerName: "Prof. S. Verma",
      totalBookedHours: 280,
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "res_3",
      title: "IoT Lab",
      institutionId: "inst_4",
      institutionName: "Veermata Jijabai Technological Institute",
      location: "Mumbai, Maharashtra",
      category: "Laboratories",
      specs: "ESP32, ZigBee, LoRaWAN Gateways, Oscilloscopes, Spectrum Analyzers",
      capacity: 30,
      seatsAvailable: 20,
      availableDates: "10 Jun 2025 - 25 Jun 2025",
      timeSlots: "11:00 AM - 02:00 PM",
      status: "Available",
      description: "Dedicated smart sensor network testbed with industrial edge telemetry, wireless protocols, and cloud IoT dashboard integrations.",
      keyFeatures: ["LoRaWAN & ZigBee Mesh Networks", "Industrial Sensor Interfacing", "Cloud MQTT Broker Telemetry", "SMD Soldering & PCB Assembly Station"],
      equipment: ["25x ESP32 NodeMCU", "Digital Storage Oscilloscopes", "Signal Generators"],
      trainerName: "Dr. P. Deshmukh",
      totalBookedHours: 240,
      imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "res_4",
      title: "Advanced Robotics Lab",
      institutionId: "inst_2",
      institutionName: "College of Engineering, Pune",
      location: "Pune, Maharashtra",
      category: "Laboratories",
      specs: "Industrial KUKA Robots, Automated Guided Vehicles, Vision Guided Pick & Place",
      capacity: 40,
      seatsAvailable: 34,
      availableDates: "12 Aug 2025 - 30 Aug 2025",
      timeSlots: "10:00 AM - 01:00 PM, 02:00 PM - 05:00 PM",
      status: "Available",
      description: "Premier automation and manufacturing robotics facility with automated workcells, industrial safety light curtains, and PLC controllers.",
      keyFeatures: ["KUKA KR C4 Robot Cell", "Industrial AGV Test Track", "Cognex Vision Inspection", "Siemens S7-1500 PLC Suite"],
      equipment: ["KUKA 6-Axis Arm", "Omron PLC Stations", "Autonomous AGV"],
      trainerName: "Dr. N. Kulkarni",
      totalBookedHours: 390,
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "res_5",
      title: "AI & Robotics Research Lab",
      institutionId: "inst_3",
      institutionName: "Vishwakarma Institute of Technology",
      location: "Pune, Maharashtra",
      category: "Laboratories",
      specs: "Nvidia Jetson Orin AGX, LiDAR Scanners, Depth Cameras, Mobile Robots",
      capacity: 25,
      seatsAvailable: 20,
      availableDates: "08 Aug 2025 - 28 Aug 2025",
      timeSlots: "01:00 PM - 04:00 PM",
      status: "Limited Seats",
      description: "Interdisciplinary research environment dedicated to autonomous mobile robotics, SLAM navigation, and spatial AI.",
      keyFeatures: ["Velodyne 3D LiDAR", "Intel RealSense D435i Depth Sensors", "TurtleBot 4 ROS2 Platforms", "Nvidia Jetson AGX Orin 64GB"],
      equipment: ["TurtleBot 4", "Ouster 32-beam LiDAR", "RTK-GPS Unit"],
      trainerName: "Prof. Ananya Sen",
      totalBookedHours: 260,
      imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "res_6",
      title: "EV Powertrain & Battery Testing Cell",
      institutionId: "inst_6",
      institutionName: "Pune Institute of Computer Technology",
      location: "Pune, Maharashtra",
      category: "Equipment",
      specs: "Dyno Test Rig 120kW, Chroma Regenerative Battery Cycler, BMS Hardware-in-the-Loop",
      capacity: 20,
      seatsAvailable: 15,
      availableDates: "15 Aug 2025 - 05 Sep 2025",
      timeSlots: "09:30 AM - 01:30 PM",
      status: "Available",
      description: "Automotive-grade EV powertrain dynamometer test bench for motor torque mapping, battery cell degradation, and CAN-bus telemetry.",
      keyFeatures: ["120kW AC Dyno Bed", "Chroma 800V Battery Simulator", "CANalyzer Bus Diagnostic Rig", "Thermal Chamber (-40°C to 150°C)"],
      equipment: ["Regenerative Load Bank", "High Voltage Safety Gear", "dSPACE HIL Rack"],
      trainerName: "Dr. Vikramaditya Rao",
      totalBookedHours: 195,
      imageUrl: "https://images.unsplash.com/photo-1558441719-5b3ea946d499?w=600&auto=format&fit=crop&q=80"
    }
  ],
  resource_bookings: [
    {
      id: "bk_1",
      resourceId: "res_1",
      resourceTitle: "Robotics Lab",
      institutionName: "College of Engineering A",
      studentUserId: "user_student_1",
      studentName: "Rahul Sharma",
      studentInstitution: "GEC Nashik",
      date: "08 Jun 2025",
      timeSlot: "10:00 AM",
      purpose: "Hands-on learning for Mini Project",
      status: "Confirmed"
    },
    {
      id: "bk_2",
      resourceId: "res_2",
      resourceTitle: "Python & AI Training",
      institutionName: "Institute of Technology B",
      studentUserId: "user_student_1",
      studentName: "Rahul Sharma",
      studentInstitution: "GEC Nashik",
      date: "09 Jun 2025",
      timeSlot: "02:00 PM",
      purpose: "Deep Learning Foundation Workshop",
      status: "Pending"
    },
    {
      id: "bk_3",
      resourceId: "res_3",
      resourceTitle: "IoT Workshop",
      institutionName: "Engineering College C",
      studentUserId: "user_student_1",
      studentName: "Rahul Sharma",
      studentInstitution: "GEC Nashik",
      date: "10 Jun 2025",
      timeSlot: "11:00 AM",
      purpose: "Smart City Sensor Interfacing",
      status: "Confirmed"
    },
    {
      id: "bk_4",
      resourceId: "res_1",
      resourceTitle: "Robotics Lab",
      institutionName: "Government Engineering College, Nashik",
      studentUserId: "user_student_2",
      studentName: "Anjali Patil",
      studentInstitution: "COEP Pune",
      date: "11 Aug 2025",
      timeSlot: "10:00 AM",
      purpose: "ROS Path Planning Experiment",
      status: "Pending"
    }
  ],
  trainers: [
    {
      id: "trn_1",
      name: "Prof. Ananya Sen",
      institutionName: "Vishwakarma Institute of Technology",
      domain: "Artificial Intelligence & Robotics",
      specializations: ["ROS2 Navigation", "Jetson AI Inference", "Sensor Fusion"],
      yearsExp: 12,
      rating: 4.95,
      bio: "IEEE Senior Member specializing in edge robotics perception and autonomous systems.",
      avatar: "👩‍🔬"
    },
    {
      id: "trn_2",
      name: "Dr. Rajesh Murthy",
      institutionName: "College of Engineering, Pune",
      domain: "High-Performance Computing",
      specializations: ["CUDA C++", "Distributed PyTorch", "Slurm"],
      yearsExp: 16,
      rating: 4.98,
      bio: "Lead architect of national supercomputing nodes, published 40+ papers in parallel algorithms.",
      avatar: "👨‍🏫"
    }
  ],
  training_sessions: [
    {
      id: "sess_1",
      title: "Masterclass: Deploying ROS2 on Nvidia Jetson Orin",
      domain: "Robotics & AI",
      hostInstitutionName: "VIT Pune Center of Excellence",
      trainerName: "Prof. Ananya Sen",
      trainerAvatar: "👩‍🔬",
      scheduledDate: "2025-08-25",
      timeSlot: "02:00 PM - 05:00 PM",
      mode: "Hybrid (Physical + Live Stream)",
      venue: "VIT Pune Center of Excellence & WebRTC",
      registeredCount: 180,
      badgeTitle: "ROS2 Autonomous Developer"
    },
    {
      id: "sess_2",
      title: "CUDA Kernel Optimization & Multi-GPU LLM Scaling",
      domain: "High-Performance Computing",
      hostInstitutionName: "COEP Supercomputing Hub",
      trainerName: "Dr. Rajesh Murthy",
      trainerAvatar: "👨‍🏫",
      scheduledDate: "2025-08-29",
      timeSlot: "10:00 AM - 01:00 PM",
      mode: "Virtual Interactive Lab",
      venue: "COEP Param-Ganga Virtual Workstation",
      registeredCount: 224,
      badgeTitle: "GPU Parallel Architect"
    }
  ],
  internships: [
    {
      id: "int_1",
      companyName: "TCS",
      title: "Software Development Intern",
      location: "Pune, Maharashtra",
      type: "Technology",
      stipend: "₹25,000 / month",
      duration: "3 Months",
      deadline: "20 Aug 2025",
      skills: ["Python", "React", "Node.js"],
      openings: 15,
      description: "Join TCS Digital Labs to build cloud-native applications, microservices, and modern frontend dashboards.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
    },
    {
      id: "int_2",
      companyName: "Persistent",
      title: "AI/ML Intern",
      location: "Pune, Maharashtra",
      type: "Technology",
      stipend: "₹35,000 / month",
      duration: "6 Months",
      deadline: "25 Aug 2025",
      skills: ["Python", "Machine Learning", "PyTorch"],
      openings: 8,
      description: "Work with applied AI teams to develop LLM fine-tuning pipelines and production ML inference backends.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Persistent_Systems_Logo.svg"
    },
    {
      id: "int_3",
      companyName: "Bosch",
      title: "Embedded Systems Intern",
      location: "Bengaluru, Karnataka",
      type: "Manufacturing",
      stipend: "₹30,000 / month",
      duration: "3 Months",
      deadline: "10 Aug 2025",
      skills: ["C++", "Embedded Systems", "IoT"],
      openings: 12,
      description: "Hands-on firmware development, microcontroller sensor integration, and CAN protocol diagnostics for mobility platforms.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-Logo.svg"
    }
  ],
  certifications: [
    {
      id: "cert_1",
      certCode: "CLUSTER-CERT-8921-ROB",
      title: "Cluster Certified Robotics & Automation Specialist",
      issuerInstitutionName: "Government Engineering College, Nashik",
      recipientName: "Rahul Sharma",
      grade: "Distinction (Score: 94%)",
      issueDate: "2025-07-28",
      skills: ["ABB Robot Arm", "ROS2", "Microcontrollers", "3D Prototyping"],
      badgeIcon: "🏆"
    }
  ],
  placement_drives: [
    {
      id: "drive_1",
      companyName: "Tata Consultancy Services (TCS Digital)",
      role: "Digital Systems & Cloud Engineer",
      packageCtc: "₹12 - ₹18 LPA",
      driveDate: "2025-09-15",
      registrationDeadline: "2025-08-30",
      location: "Cluster Central Auditorium (GEC Nashik)",
      minCgpa: 7.5,
      eligibleBranches: ["CSE", "IT", "ECE", "Mechanical"],
      openings: 35,
      description: "Joint cluster pooled campus recruitment drive for all Western Maharashtra consortium colleges.",
      registeredCandidates: 342,
      logo: "🏢"
    },
    {
      id: "drive_2",
      companyName: "Bosch Mobility Solutions",
      role: "Autonomous Driving Embedded Systems Engineer",
      packageCtc: "₹16 - ₹24 LPA",
      driveDate: "2025-09-22",
      registrationDeadline: "2025-09-08",
      location: "COEP Main Auditorium (Pune)",
      minCgpa: 8.0,
      eligibleBranches: ["Robotics", "ECE", "Mechanical", "CSE"],
      openings: 20,
      description: "Hiring cross-discipline engineers for next-gen ADAS radar sensor fusion and EV brake-by-wire platforms.",
      registeredCandidates: 215,
      logo: "🚗"
    }
  ],
  placement_candidates: [
    {
      id: "cand_1",
      studentName: "Rahul Sharma",
      studentInstitutionName: "Government Engineering College, Nashik",
      companyName: "TCS Digital",
      role: "Digital Systems & Cloud Engineer",
      cgpa: 9.12,
      department: "Mechanical & Robotics",
      currentRound: "Live System Design & Hands-on Lab",
      status: "shortlisted"
    }
  ]
};

// Local storage helper
function getStore() {
  try {
    const raw = localStorage.getItem('skillbridge_local_db');
    if (!raw) {
      localStorage.setItem('skillbridge_local_db', JSON.stringify(FALLBACK_DATA));
      return FALLBACK_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    return FALLBACK_DATA;
  }
}

function saveStore(data) {
  try {
    localStorage.setItem('skillbridge_local_db', JSON.stringify(data));
  } catch (e) {}
}

async function request(endpoint, options = {}) {
  const activeUserId = localStorage.getItem('skillbridge_active_user_id') || 'user_student_1';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': activeUserId,
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // Graceful offline mock handling
    const db = getStore();

    if (endpoint.startsWith('/auth/login') && options.method === 'POST') {
      const { email, role } = JSON.parse(options.body || '{}');
      const user = db.users.find(u => (email && u.email.toLowerCase() === email.toLowerCase()) || (role && u.role === role)) || db.users[0];
      return { success: true, token: `token_${user.id}`, user, message: `Welcome back, ${user.name}!` };
    }
    if (endpoint.startsWith('/auth/register') && options.method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const inst = db.institutions.find(i => i.id === body.institutionId);
      const newUser = {
        id: `user_${Date.now()}`,
        name: body.name,
        email: body.email,
        role: body.role || 'student',
        institutionId: body.institutionId || 'inst_1',
        institutionName: inst ? inst.name : 'Partner College',
        department: body.department || 'Engineering',
        title: `${(body.role || 'student').toUpperCase()} | ${inst ? inst.code : 'SkillBridge'}`,
        cgpa: body.role === 'student' ? 9.0 : undefined,
        avatarImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
      };
      db.users = [newUser, ...db.users];
      saveStore(db);
      return { success: true, token: `token_${newUser.id}`, user: newUser, message: `Account created for ${newUser.name}!` };
    }
    if (endpoint.startsWith('/auth/institutions')) {
      return { success: true, data: db.institutions };
    }
    if (endpoint.startsWith('/auth/users')) {
      return { success: true, data: db.users };
    }
    if (endpoint.startsWith('/resources/bookings/all')) {
      return { success: true, data: db.resource_bookings };
    }
    if (endpoint.startsWith('/resources') && options.method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const newRes = { id: `res_${Date.now()}`, ...body, status: 'Available' };
      db.resources = [newRes, ...db.resources];
      saveStore(db);
      return { success: true, data: newRes };
    }
    if (endpoint.includes('/book') && options.method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const newBk = { id: `bk_${Date.now()}`, resourceTitle: 'Reserved Lab', status: 'Confirmed', ...body };
      db.resource_bookings = [newBk, ...db.resource_bookings];
      saveStore(db);
      return { success: true, data: newBk };
    }
    if (endpoint.startsWith('/resources')) {
      return { success: true, data: db.resources };
    }
    if (endpoint.startsWith('/trainers/sessions')) {
      return { success: true, data: db.training_sessions };
    }
    if (endpoint.startsWith('/trainers')) {
      return { success: true, data: db.trainers };
    }
    if (endpoint.startsWith('/internships')) {
      return { success: true, data: db.internships };
    }
    if (endpoint.startsWith('/placements/drives')) {
      return { success: true, data: db.placement_drives };
    }
    if (endpoint.startsWith('/placements/candidates')) {
      return { success: true, data: db.placement_candidates };
    }
    if (endpoint.startsWith('/certifications')) {
      return { success: true, data: db.certifications };
    }
    if (endpoint.startsWith('/analytics/reset-seed')) {
      localStorage.removeItem('skillbridge_local_db');
      return { success: true, message: 'Reset done' };
    }

    return { success: true, data: [] };
  }
}

export const api = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getInstitutions: () => request('/auth/institutions'),
  getUsers: () => request('/auth/users'),
  getCurrentUser: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  getResources: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/resources${qs ? '?' + qs : ''}`);
  },
  getResourceById: (id) => request(`/resources/${id}`),
  createResource: (data) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  bookResource: (id, data) => request(`/resources/${id}/book`, { method: 'POST', body: JSON.stringify(data) }),
  getBookings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/resources/bookings/all${qs ? '?' + qs : ''}`);
  },
  updateBooking: (id, data) => request(`/resources/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getTrainers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/trainers${qs ? '?' + qs : ''}`);
  },
  getTrainingSessions: () => request('/trainers/sessions'),
  createTrainingSession: (data) => request('/trainers/sessions', { method: 'POST', body: JSON.stringify(data) }),
  registerTrainingSession: (id, data = {}) => request(`/trainers/sessions/${id}/register`, { method: 'POST', body: JSON.stringify(data) }),
  addTrainer: (data) => request('/trainers', { method: 'POST', body: JSON.stringify(data) }),

  getInternships: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/internships${qs ? '?' + qs : ''}`);
  },
  postInternship: (data) => request('/internships', { method: 'POST', body: JSON.stringify(data) }),
  applyInternship: (id, data) => request(`/internships/${id}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  getApplications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/internships/applications/all${qs ? '?' + qs : ''}`);
  },
  updateApplicationStatus: (id, data) => request(`/internships/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getCertifications: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/certifications${qs ? '?' + qs : ''}`);
  },
  verifyCertificate: (code) => request(`/certifications/verify/${code}`),
  issueCertificate: (data) => request('/certifications/issue', { method: 'POST', body: JSON.stringify(data) }),

  getPlacementDrives: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/placements/drives${qs ? '?' + qs : ''}`);
  },
  getPlacementDriveById: (id) => request(`/placements/drives/${id}`),
  createPlacementDrive: (data) => request('/placements/drives', { method: 'POST', body: JSON.stringify(data) }),
  registerForDrive: (id, data) => request(`/placements/drives/${id}/register`, { method: 'POST', body: JSON.stringify(data) }),
  getCandidates: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/placements/candidates/all${qs ? '?' + qs : ''}`);
  },
  advanceCandidate: (id, data) => request(`/placements/candidates/${id}/advance`, { method: 'PATCH', body: JSON.stringify(data) }),

  getAnalyticsOverview: () => request('/analytics/overview'),
  resetSeed: () => request('/analytics/reset-seed', { method: 'POST' }),
};
