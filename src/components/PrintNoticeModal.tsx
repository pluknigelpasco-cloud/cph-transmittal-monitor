'use client';
import React from 'react';
import { X, Printer } from 'lucide-react';
import { BaseRecord } from '@/lib/types';
import { HOSPITAL_NAME, SECTION_NAME } from '@/lib/assets';
import { formatCurrency } from '@/lib/calculations';

interface PrintNoticeModalProps {
  records: BaseRecord[];
  onClose: () => void;
}

export default function PrintNoticeModal({ records, onClose }: PrintNoticeModalProps) {
  function handlePrint() {
    window.print();
  }

  const totalAmount = records.reduce((sum, r) => sum + (r.claimAmount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Head (Hidden in Print) */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div>
            <h3 className="text-base font-black text-slate-900">Print Transmittal Checklist</h3>
            <p className="text-xs text-slate-500 font-medium">{records.length} selected record(s)</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-navy text-white text-xs font-bold shadow-md shadow-brand-blue/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Document
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 overflow-y-auto print:p-0">
          <div className="text-center pb-6 border-b-2 border-slate-900">
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Province of Cebu</p>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{HOSPITAL_NAME}</h2>
            <p className="text-xs font-bold text-slate-700">{SECTION_NAME}</p>
            <h3 className="text-sm font-black text-brand-blue mt-3 uppercase tracking-wider">
              PHILHEALTH NOTICE TRANSMITTAL & COMPLIANCE REPORT
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-[10px] uppercase font-black">
                  <th className="py-2 px-3">No.</th>
                  <th className="py-2 px-3">Series Number</th>
                  <th className="py-2 px-3">Patient Name</th>
                  <th className="py-2 px-3">Cat</th>
                  <th className="py-2 px-3">Confinement</th>
                  <th className="py-2 px-3 text-right">Claim Amount</th>
                  <th className="py-2 px-3">Deficiency</th>
                  <th className="py-2 px-3">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-xs">
                {records.map((r, i) => (
                  <tr key={r.id || i}>
                    <td className="py-2 px-3 font-bold text-slate-500">{i + 1}</td>
                    <td className="py-2 px-3 font-bold">{r.reference}</td>
                    <td className="py-2 px-3 font-semibold">{r.patientName}</td>
                    <td className="py-2 px-3">{r.memberCategory}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {r.admittedDate} – {r.dischargedDate}
                    </td>
                    <td className="py-2 px-3 text-right font-bold">₱{formatCurrency(r.claimAmount)}</td>
                    <td className="py-2 px-3 text-[11px] max-w-xs">{r.deficiency}</td>
                    <td className="py-2 px-3 font-bold whitespace-nowrap">{r.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-black text-xs">
                  <td colSpan={5} className="py-3 px-3 uppercase text-right">
                    Total Amount ({records.length} claims):
                  </td>
                  <td className="py-3 px-3 text-right">₱{formatCurrency(totalAmount)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-12 pt-8 border-t border-slate-200 text-xs">
            <div>
              <p className="font-bold text-slate-600 mb-8">Prepared / Transmitted By:</p>
              <div className="border-b border-slate-900 w-48" />
              <p className="text-[10px] text-slate-500 mt-1 font-medium">PhilHealth Billing Staff</p>
            </div>
            <div>
              <p className="font-bold text-slate-600 mb-8">Noted / Received By:</p>
              <div className="border-b border-slate-900 w-48" />
              <p className="text-[10px] text-slate-500 mt-1 font-medium">PhilHealth Section Head / Liaison</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
