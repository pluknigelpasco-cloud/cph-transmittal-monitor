import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { BaseRecord, ModuleType, AppSettings, DeadlineStatus } from '@/lib/types';
import { calendarDaysDiff, computeDeadlineStatus, DEFAULT_SETTINGS, formatDate, isDateInRange } from '@/lib/calculations';

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ ok: false, error: 'SESSION_EXPIRED' }, { status: 401 });

    const body = await req.json();
    const module = (body.module || 'RTH').toUpperCase() as ModuleType;
    const search = String(body.search || '').trim().toLowerCase();
    const status = String(body.status || 'ALL').toUpperCase();
    const sortKey = String(body.sortKey || 'daysLeft');
    const sortDir = String(body.sortDir || 'asc').toLowerCase();
    const offset = Math.max(0, Number(body.offset) || 0);
    const limit = Math.min(200, Math.max(25, Number(body.limit) || 50));

    const supabase = getSupabaseAdmin();

    // Fetch settings
    const { data: settingsRows } = await supabase.from('app_settings').select('*');
    const settings: AppSettings = { ...DEFAULT_SETTINGS };
    settingsRows?.forEach(r => {
      if (r.key in settings) {
        (settings as any)[r.key] = isNaN(Number(r.value)) ? r.value : Number(r.value);
      }
    });

    const today = new Date();
    let records: BaseRecord[] = [];

    if (module === 'RTH') {
      const { data } = await supabase.from('rth_notices').select('*').order('created_at', { ascending: false });
      records = (data || []).map(r => {
        const expiry = r.expiry_date ? new Date(r.expiry_date) : null;
        const daysLeft = expiry ? calendarDaysDiff(today, expiry) : null;
        const s = computeDeadlineStatus(daysLeft, r.refiled, settings);
        return {
          id: r.id,
          module: 'RTH',
          reference: r.series_number,
          patientName: r.patient_name,
          memberCategory: r.member_category,
          admittedDate: formatDate(r.admitted_date),
          dischargedDate: formatDate(r.discharged_date),
          claimAmount: Number(r.claim_amount || 0),
          totalCharges: Number(r.total_charges || 0),
          deficiency: r.deficiency,
          claimReceivedDate: formatDate(r.claim_received_date),
          noticeDate: formatDate(r.notice_date),
          expiryDate: formatDate(r.expiry_date),
          baseDate: formatDate(r.claim_received_date),
          controlNumber: r.control_number,
          retrieved: r.retrieved,
          completed: r.refiled,
          refiledDate: formatDate(r.refiled_date),
          transmittedDate: formatDate(r.refiled_date),
          transmittedBy: r.transmitted_by,
          ownerUserId: r.owner_user_id,
          remarks: r.remarks,
          daysLeft,
          status: s,
        };
      });
    } else if (module === 'DENIED') {
      const { data } = await supabase.from('denied_notices').select('*').order('created_at', { ascending: false });
      records = (data || []).map(r => {
        const expiry = r.expiry_date ? new Date(r.expiry_date) : null;
        const daysLeft = expiry ? calendarDaysDiff(today, expiry) : null;
        const s = computeDeadlineStatus(daysLeft, r.retrieved, settings);
        return {
          id: r.id,
          module: 'DENIED',
          reference: r.series_number,
          patientName: r.patient_name,
          memberCategory: r.member_category,
          admittedDate: formatDate(r.admitted_date),
          dischargedDate: formatDate(r.discharged_date),
          claimAmount: Number(r.claim_amount || 0),
          totalCharges: Number(r.total_charges || 0),
          deficiency: r.deficiency,
          claimReceivedDate: formatDate(r.claim_received_date),
          noticeDate: formatDate(r.notice_date),
          expiryDate: formatDate(r.expiry_date),
          baseDate: formatDate(r.claim_received_date),
          controlNumber: r.control_number,
          retrieved: r.retrieved,
          completed: r.retrieved,
          refiledDate: formatDate(r.refiled_date),
          transmittedDate: formatDate(r.refiled_date),
          transmittedBy: r.transmitted_by,
          ownerUserId: r.owner_user_id,
          remarks: r.remarks,
          daysLeft,
          status: s,
        };
      });
    } else if (module === 'INPATIENT') {
      const { data } = await supabase.from('inpatient_trackers').select('*').order('discharge_date', { ascending: false });
      records = (data || []).map(r => {
        const expiry = r.expiry_date ? new Date(r.expiry_date) : null;
        const daysLeft = expiry ? calendarDaysDiff(today, expiry) : null;
        const s = computeDeadlineStatus(daysLeft, r.completed, settings);
        const catList = r.categories && r.categories.length ? r.categories.join(', ') : 'Inpatient';
        return {
          id: r.id,
          module: 'INPATIENT',
          reference: formatDate(r.discharge_date),
          patientName: '',
          memberCategory: catList,
          deficiency: catList,
          baseDate: formatDate(r.discharge_date),
          dischargeDate: formatDate(r.discharge_date),
          expiryDate: formatDate(r.expiry_date),
          completed: r.completed,
          transmittedDate: formatDate(r.transmitted_date),
          remarks: r.remarks,
          daysLeft,
          status: s,
        };
      });
    } else if (module === 'HD') {
      const { data } = await supabase.from('hd_trackers').select('*').order('encounter_date', { ascending: false });
      records = (data || []).map(r => {
        const expiry = r.expiry_date ? new Date(r.expiry_date) : null;
        const daysLeft = expiry ? calendarDaysDiff(today, expiry) : null;
        const s = computeDeadlineStatus(daysLeft, r.completed, settings);
        return {
          id: r.id,
          module: 'HD',
          reference: formatDate(r.encounter_date),
          patientName: '',
          memberCategory: r.is_hdu ? 'HDU' : 'Hemodialysis',
          deficiency: r.is_hdu ? 'HDU' : 'Hemodialysis',
          baseDate: formatDate(r.encounter_date),
          admittedDate: formatDate(r.encounter_date),
          expiryDate: formatDate(r.expiry_date),
          completed: r.completed,
          transmittedDate: formatDate(r.transmitted_date),
          remarks: r.remarks,
          daysLeft,
          status: s,
        };
      });
    }

    // Role-based filtering for staff on notice modules
    if (payload.role === 'STAFF' && (module === 'RTH' || module === 'DENIED')) {
      records = records.filter(r => {
        if (!r.ownerUserId && !r.transmittedBy) return true;
        return r.ownerUserId === payload.u || r.transmittedBy?.toLowerCase().includes(payload.name.toLowerCase());
      });
    }

    // Search filter
    if (search) {
      records = records.filter(r => {
        const haystack = [
          r.reference,
          r.patientName,
          r.memberCategory,
          r.deficiency,
          r.remarks,
          r.transmittedBy,
          r.admittedDate,
          r.dischargedDate,
          r.transmittedDate,
          r.baseDate,
          r.expiryDate,
          r.controlNumber
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(search);
      });
    }

    // Date range filters
    records = records.filter(r => {
      return (
        isDateInRange(r.admittedDate, body.admissionFrom, body.admissionTo) &&
        isDateInRange(r.dischargedDate, body.dischargeFrom, body.dischargeTo) &&
        isDateInRange(r.transmittedDate, body.transmittedFrom, body.transmittedTo) &&
        isDateInRange(r.expiryDate, body.expiryFrom, body.expiryTo)
      );
    });

    // Status filter
    if (status !== 'ALL') {
      records = records.filter(r => {
        if (status === 'PENDING') return r.status !== 'COMPLETED';
        return r.status === status;
      });
    }

    // Sorting
    const dir = sortDir === 'desc' ? -1 : 1;
    records.sort((a, b) => {
      let av: any = (a as any)[sortKey];
      let bv: any = (b as any)[sortKey];

      if (sortKey === 'daysLeft') {
        av = a.daysLeft ?? 99999;
        bv = b.daysLeft ?? 99999;
      }

      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });

    const total = records.length;
    const paginated = records.slice(offset, offset + limit);

    return NextResponse.json({
      ok: true,
      module,
      total,
      offset,
      limit,
      records: paginated,
      hasMore: offset + limit < total,
      generatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error fetching records' }, { status: 500 });
  }
}
