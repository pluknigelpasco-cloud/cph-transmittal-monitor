export type UserRole = 'ADMIN' | 'STAFF' | 'VIEWER';

export interface AppUser {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  mustChangePassword?: boolean;
  profilePhoto?: string | null;
  failedAttempts?: number;
  lockedUntil?: string | null;
  createdAt?: string;
  lastLogin?: string | null;
}

export type DeadlineStatus = 'SAFE' | 'WARNING' | 'CRITICAL' | 'EXPIRED' | 'COMPLETED' | 'NO_DATE' | 'PENDING';

export type ModuleType = 'RTH' | 'DENIED' | 'INPATIENT' | 'HD';

export interface BaseRecord {
  id: string;
  module: ModuleType;
  reference: string;
  patientName?: string;
  memberCategory?: string;
  admittedDate?: string | null;
  dischargedDate?: string | null;
  claimAmount?: number;
  totalCharges?: number;
  deficiency?: string;
  claimReceivedDate?: string | null;
  noticeDate?: string | null;
  expiryDate?: string | null;
  baseDate?: string | null;
  controlNumber?: string;
  retrieved?: boolean;
  completed?: boolean;
  refiledDate?: string | null;
  transmittedDate?: string | null;
  transmittedBy?: string;
  ownerUserId?: string | null;
  remarks?: string;
  daysLeft?: number | null;
  status: DeadlineStatus;
}

export interface DashboardMetrics {
  rthPending: number;
  rthUrgent: number;
  deniedPending: number;
  inpatientPending: number;
  hdPending: number;
  totalUrgent: number;
  urgentRows: BaseRecord[];
}

export interface NoticePdfRow {
  index?: number;
  noticeRowNo: number;
  seriesNumber: string;
  memberCategory: string;
  patientName: string;
  admitted: string;
  discharged: string;
  claimAmount: number;
  totalCharges: number;
  deficiency: string;
  claimReceived: string;
  controlNumber: string;
  noticeDate: string;
  deadline: string;
  page: number;
  duplicate?: boolean;
  selected?: boolean;
}

export interface NoticePdfMeta {
  page: number;
  expectedCount: number | null;
  controlNumber: string;
  noticeDate: string;
  deadline: string;
}

export interface NoticePdfPreviewResult {
  importToken: string;
  type: 'RTH' | 'DENIED';
  filename: string;
  notices: NoticePdfMeta[];
  warnings: string[];
  rows: NoticePdfRow[];
  duplicateCount: number;
}

export interface AppSettings {
  CRITICAL_DAYS: number;
  WARNING_DAYS: number;
  RTH_DEADLINE_DAYS: number;
  INPATIENT_DEADLINE_DAYS: number;
  HD_DEADLINE_DAYS: number;
  EXPIRED_QUEUE_DAYS: number;
  SESSION_HOURS: number;
  ALERT_RECIPIENTS: string;
  WEB_APP_URL: string;
  DAILY_ALERT_HOUR: number;
}

export interface AuditLogItem {
  id: number;
  timestamp: string;
  username: string;
  action: string;
  module?: string;
  source_ref?: string;
  details?: Record<string, any>;
}
