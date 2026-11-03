import React, { useState } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Database,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const ImportExport = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [csvFile, setCsvFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');
  const [error, setError] = useState('');

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'Date,Title,Type,Amount,Category,Subcategory,Account,PaymentMethod,Merchant,Place,Notes\n' +
      '2026-10-18,Supermarket Groceries,expense,2500,Groceries,Vegetables,HDFC Salary Bank,Credit Card,Nature Basket,City Mall,Weekly family groceries\n' +
      '2026-10-18,Monthly Tech Salary,income,85000,Salary,Monthly Salary,HDFC Salary Bank,Bank Transfer,Google Cloud,,Monthly salary deposit\n' +
      '2026-10-18,Coffee and Snacks,expense,40,Food & Dining,Coffee,Cash Wallet,Cash,Cafe Point,Office,Evening coffee\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'finset_transactions_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV text into array of row objects
  const parseCSV = (text) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV comma splitting with quote handling
      const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (currentline.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let val = currentline[j] ? currentline[j].trim() : '';
          val = val.replace(/^"|"$/g, '').trim();
          obj[headers[j]] = val;
        }
        rows.push(obj);
      }
    }
    return rows;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFile(file);
    setError('');
    setImportSuccess('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setLoading(true);
        const text = event.target.result;
        const rows = parseCSV(text);

        if (rows.length === 0) {
          setError('Could not parse any transaction rows from the selected file. Please use the CSV template format.');
          setLoading(false);
          return;
        }

        // Run server-side dryRun validation & duplicate detection
        const res = await api.post('/reports/import-csv', { rows, dryRun: true });
        setPreviewData({
          rows,
          ...res.data,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to inspect CSV file');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  // Confirm and Execute Import
  const handleConfirmImport = async () => {
    if (!previewData || !previewData.rows) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/reports/import-csv', {
        rows: previewData.rows,
        dryRun: false,
      });

      setImportSuccess(`Successfully imported ${res.data.importedCount} transactions!`);
      setPreviewData(null);
      setCsvFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save imported records');
    } finally {
      setLoading(false);
    }
  };

  // Download Full JSON Backup
  const handleDownloadBackup = async () => {
    try {
      const res = await api.get('/auth/export-data');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `finset_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Failed to download backup: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Data Import & Backup
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Import transactions from CSV, preview before saving, and download complete personal data backups
        </p>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{importSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CSV Importer Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Import Transactions via CSV
              </h2>
              <p className="text-xs text-slate-400">
                Bulk upload bank statements or historical expense entries
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Template</span>
          </button>
        </div>

        {/* Upload Dropzone */}
        {!previewData && (
          <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center block cursor-pointer hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50/20 dark:hover:bg-brand-950/10 transition-all">
            <Upload className="w-10 h-10 text-brand-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Click to browse or drag and drop your CSV file here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports UTF-8 CSV with Title, Amount, Type, Date, Category, and Account columns
            </p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        )}

        {/* CSV Preview & Validation Before Confirmation */}
        {previewData && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold">
              <div className="flex items-center gap-4">
                <span>Total Rows: <strong>{previewData.totalRows}</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Valid: <strong>{previewData.validCount}</strong>
                </span>
                {previewData.duplicatesDetected > 0 && (
                  <span className="text-amber-500">
                    Potential Duplicates Detected: <strong>{previewData.duplicatesDetected}</strong>
                  </span>
                )}
                {previewData.errorCount > 0 && (
                  <span className="text-rose-500">
                    Errors: <strong>{previewData.errorCount}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewData(null)}
                  className="px-4 py-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={loading || previewData.validCount === 0}
                  className="px-5 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {loading ? 'Importing...' : `Confirm & Import ${previewData.validCount} Entries`}
                </button>
              </div>
            </div>

            {/* Error list if any */}
            {previewData.errors?.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs space-y-1">
                <p className="font-bold">Validation Issues Found:</p>
                {previewData.errors.slice(0, 5).map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            {/* Preview Records Table */}
            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Account</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-center">Duplicate?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {previewData.preview?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 whitespace-nowrap">{formatDate(row.date)}</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{row.title}</td>
                      <td className="p-3 capitalize">{row.type}</td>
                      <td className="p-3">{row.categoryName}</td>
                      <td className="p-3">{row.accountName}</td>
                      <td className="p-3 text-right font-extrabold">
                        {formatCurrency(row.amount, currency)}
                      </td>
                      <td className="p-3 text-center">
                        {row.isPotentialDuplicate ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                            Possible Dup
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-bold">✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Full Account Data Backup (JSON) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Download Personal Data Backup
            </h2>
            <p className="text-xs text-slate-400">
              Export all your transactions, accounts, budgets, trips, bills, goals, and debts in JSON format
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadBackup}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          <span>Export Complete Backup</span>
        </button>
      </div>
    </div>
  );
};

export default ImportExport;
