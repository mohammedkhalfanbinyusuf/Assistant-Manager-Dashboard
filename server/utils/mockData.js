module.exports = {
  tasks: [
    { _id: '1', title: 'Finalize Q2 Marketing Plan', assignedTo: 'Midlaj', deadline: '2024-05-01', priority: 'High', status: 'On-going' },
    { _id: '2', title: 'Client Presentation for Brandnest', assignedTo: 'Nancy', deadline: '2024-04-25', priority: 'Urgent', status: 'Pending' },
    { _id: '3', title: 'Update Financial Records', assignedTo: 'Shuhib', deadline: '2024-04-28', priority: 'Medium', status: 'Finished' },
  ],
  meetings: [
    { _id: '1', date: '2024-04-20', title: 'Quarterly Strategy Sync', department: 'Operations', host: 'Jobin', agenda: ['Reviewing Q1 performance'] },
    { _id: '2', date: '2024-04-22', title: 'IT Infrastructure Audit', department: 'IT', host: 'Shuhib', agenda: ['Server health check'] },
  ],
  schedules: [
    { _id: '1', time: '06:00 AM', title: 'Morning Workout', type: 'Personal', outcome: 'Done' },
    { _id: '2', time: '09:30 AM', title: 'Office Arrival', type: 'Office', outcome: '' },
  ],
  revenue: [
    { _id: '1', brand: 'Team N', adv: 120000, receivable: 45000, target: 150000, achievement: 80, month: 'April 2026' },
    { _id: '2', brand: 'Brandnest', adv: 85000, receivable: 12000, target: 100000, achievement: 85, month: 'April 2026' },
  ],
  implementations: [
    { _id: '1', decision: 'Migrate to Cloud Infrastructure', department: 'IT', responsibility: 'Shuhib', status: 'Finished', rate: 100, decisionDate: '2024-04-01', completionDate: '2024-04-15', basis: 'Scalability requirements', outcomes: 'Reduced latency by 40%' },
    { _id: '2', decision: 'New Marketing Campaign', department: 'Marketing', responsibility: 'Nancy', status: 'On-going', rate: 65, decisionDate: '2024-04-10', completionDate: '', basis: 'Q2 Growth targets', outcomes: 'Initial engagement up by 15%' },
  ]
};

