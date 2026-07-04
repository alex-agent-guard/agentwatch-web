export interface AuditEvent {
  id: string
  install_id: string
  event_id: string
  tool_name: string
  final_decision: 'ALLOW' | 'WARN' | 'BLOCK'
  timestamp_ms: number
  hmac: string
  created_at: string
  action?: string
  risk_score?: number
}

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'evt-78432',
    install_id: 'inst-001',
    event_id: 'EVT-78432',
    tool_name: 'filesystem.read',
    final_decision: 'ALLOW',
    timestamp_ms: Date.now() - 1000 * 60 * 5,
    hmac: '0x7f3a9c2d8e1b4f506a3c7d2e1f8b9c0a3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    created_at: '2025-01-15T14:23:08.000Z',
    action: "readFile('/data/config.json')",
    risk_score: 12,
  },
  {
    id: 'evt-78431',
    install_id: 'inst-001',
    event_id: 'EVT-78431',
    tool_name: 'database.query',
    final_decision: 'ALLOW',
    timestamp_ms: Date.now() - 1000 * 60 * 6,
    hmac: '0x9c2d5a7e4f1b8c3d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6',
    created_at: '2025-01-15T14:22:55.000Z',
    action: 'SELECT * FROM users',
    risk_score: 8,
  },
  {
    id: 'evt-78430',
    install_id: 'inst-001',
    event_id: 'EVT-78430',
    tool_name: 'api.fetch',
    final_decision: 'WARN',
    timestamp_ms: Date.now() - 1000 * 60 * 7,
    hmac: '0x3e8b1f4c7d2a5e8b0c3f6a9d2e5b8c1f4a7d0e3b6c9f2a5d8e1b4c7f0a3d6e9b2',
    created_at: '2025-01-15T14:22:41.000Z',
    action: 'POST /external/webhook',
    risk_score: 65,
  },
  {
    id: 'evt-78429',
    install_id: 'inst-001',
    event_id: 'EVT-78429',
    tool_name: 'filesystem.write',
    final_decision: 'BLOCK',
    timestamp_ms: Date.now() - 1000 * 60 * 8,
    hmac: '0x1f4c8b2d5e7a0c3f6b9d2e5a8c1f4b7d0e3a6c9f2b5d8e1a4c7f0b3d6e9a2c5f8',
    created_at: '2025-01-15T14:22:30.000Z',
    action: "writeFile('/tmp/shell.sh')",
    risk_score: 92,
  },
  {
    id: 'evt-78428',
    install_id: 'inst-001',
    event_id: 'EVT-78428',
    tool_name: 'database.query',
    final_decision: 'BLOCK',
    timestamp_ms: Date.now() - 1000 * 60 * 9,
    hmac: '0x5a7e3c1f8b5d2e9a6c3f0b7d4e1a8c5f2b9d6e3a0c7f4b1d8e5a2c9f6b3d0e7a4c1',
    created_at: '2025-01-15T14:22:15.000Z',
    action: 'DROP TABLE logs',
    risk_score: 98,
  },
  {
    id: 'evt-78427',
    install_id: 'inst-001',
    event_id: 'EVT-78427',
    tool_name: 'api.fetch',
    final_decision: 'ALLOW',
    timestamp_ms: Date.now() - 1000 * 60 * 10,
    hmac: '0x8b3f6c1e9d4a7b2c5f8e1d4a7b0c3f6e9d2a5b8c1f4e7d0a3b6c9f2e5d8a1b4c7f0a3',
    created_at: '2025-01-15T14:21:58.000Z',
    action: 'GET /status',
    risk_score: 5,
  },
  {
    id: 'evt-78426',
    install_id: 'inst-001',
    event_id: 'EVT-78426',
    tool_name: 'tool.execute',
    final_decision: 'BLOCK',
    timestamp_ms: Date.now() - 1000 * 60 * 11,
    hmac: '0x2d9a5e3c8f1b6d4a9e2c7f0b5d8a3e6c1f4b9d2a7e0c5f8b3d6a1e4c9f2b5d8a3e6c1f9',
    created_at: '2025-01-15T14:21:42.000Z',
    action: "exec('curl bad.actor')",
    risk_score: 95,
  },
  {
    id: 'evt-78425',
    install_id: 'inst-001',
    event_id: 'EVT-78425',
    tool_name: 'filesystem.read',
    final_decision: 'ALLOW',
    timestamp_ms: Date.now() - 1000 * 60 * 12,
    hmac: '0x4c1e8a3f7d2b6c0e5a9d3f8b2c6e1a5d9f3b8c2e6a1d5f9b3c7e2a6d0f4b8c3e7a2d6f0b4',
    created_at: '2025-01-15T14:21:30.000Z',
    action: "readFile('/logs/app.log')",
    risk_score: 10,
  },
]

export const riskTrendData = [
  { day: 'Mon', date: 'Jan 9', score: 23 },
  { day: 'Tue', date: 'Jan 10', score: 28 },
  { day: 'Wed', date: 'Jan 11', score: 45 },
  { day: 'Thu', date: 'Jan 12', score: 38 },
  { day: 'Fri', date: 'Jan 13', score: 52 },
  { day: 'Sat', date: 'Jan 14', score: 41 },
  { day: 'Sun', date: 'Jan 15', score: 35 },
]

export const riskDistributionData = [
  { name: 'Low', value: 45, range: '0-30', color: '#00D4AA' },
  { name: 'Medium', value: 12, range: '31-70', color: '#F5A623' },
  { name: 'High', value: 3, range: '71-100', color: '#FF4D4F' },
]

export interface RadarDimension {
  dimension: string
  current: number
  baseline: number
  fullMark: number
}

export const radarData: RadarDimension[] = [
  { dimension: 'Call Frequency', current: 72, baseline: 70, fullMark: 100 },
  { dimension: 'Time Distribution', current: 85, baseline: 80, fullMark: 100 },
  { dimension: 'Parameter Changes', current: 45, baseline: 50, fullMark: 100 },
  { dimension: 'Tool Diversity', current: 68, baseline: 65, fullMark: 100 },
  { dimension: 'Chain Interactions', current: 55, baseline: 60, fullMark: 100 },
  { dimension: 'Response Time', current: 90, baseline: 88, fullMark: 100 },
]

export const sparklineData = {
  total: [42, 48, 55, 52, 60, 65, 72, 68, 75, 82, 78, 85],
  allowed: [38, 44, 50, 48, 56, 60, 66, 63, 70, 76, 72, 79],
  warned: [3, 3, 4, 3, 3, 4, 5, 4, 4, 5, 5, 5],
  blocked: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
}

export interface HmacBlock {
  blockNumber: number
  hash: string
  shortHash: string
  timestamp: string
  eventId: string
  verified: boolean
}

export const hmacBlocks: HmacBlock[] = [
  {
    blockNumber: 78432,
    hash: '0x7f3a9c2d8e1b4f506a3c7d2e1f8b9c0a3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    shortHash: '0x7f3a...b2e1',
    timestamp: '14:23:08',
    eventId: 'EVT-78432',
    verified: true,
  },
  {
    blockNumber: 78431,
    hash: '0x9c2d5a7e4f1b8c3d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6',
    shortHash: '0x9c2d...a4f7',
    timestamp: '14:22:55',
    eventId: 'EVT-78431',
    verified: true,
  },
  {
    blockNumber: 78430,
    hash: '0x3e8b1f4c7d2a5e8b0c3f6a9d2e5b8c1f4a7d0e3b6c9f2a5d8e1b4c7f0a3d6e9b2',
    shortHash: '0x3e8b...c1d5',
    timestamp: '14:22:41',
    eventId: 'EVT-78430',
    verified: true,
  },
  {
    blockNumber: 78429,
    hash: '0x1f4c8b2d5e7a0c3f6b9d2e5a8c1f4b7d0e3a6c9f2b5d8e1a4c7f0b3d6e9a2c5f8',
    shortHash: '0x1f4c...e8a3',
    timestamp: '14:22:30',
    eventId: 'EVT-78429',
    verified: true,
  },
  {
    blockNumber: 78428,
    hash: '0x5a7e3c1f8b5d2e9a6c3f0b7d4e1a8c5f2b9d6e3a0c7f4b1d8e5a2c9f6b3d0e7a4c1',
    shortHash: '0x5a7e...d2b9',
    timestamp: '14:22:15',
    eventId: 'EVT-78428',
    verified: true,
  },
]

export const statsData = {
  totalCalls: 12847,
  allowed: 11932,
  warned: 683,
  blocked: 232,
  changes: {
    total: '+12.5%',
    allowed: '+8.2%',
    warned: '+24.1%',
    blocked: '-5.3%',
  },
  percentages: {
    allowed: '92.9%',
    warned: '5.3%',
    blocked: '1.8%',
  },
}
