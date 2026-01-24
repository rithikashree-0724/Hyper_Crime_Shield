import React, { useState, useEffect } from 'react';
import * as API from '../api';

const ReportsList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReports = async () => {
            try {
                const { data } = await API.fetchReports();
                setReports(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch reports:', err);
                setError('Failed to load incident reports.');
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    }, []);

    if (loading) return <div className="text-slate-500 animate-pulse">Scanning network for active investigations...</div>;
    if (error) return <div className="text-red-500 border border-red-500/20 bg-red-500/10 p-4 rounded-lg">{error}</div>;
    if (reports.length === 0) return <div className="text-slate-500 italic p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">No active incident reports found in the current sector.</div>;

    return (
        <div className="flex flex-col gap-4">
            {reports.map((report) => (
                <div key={report._id} className="flex items-start gap-4 p-5 rounded-xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-[#3b4754]">
                    <div className={`${report.severity === 'critical' || report.severity === 'high' ? 'bg-red-600' : 'bg-primary'} text-white rounded-lg size-10 flex items-center justify-center shrink-0 font-bold text-lg shadow-lg`}>
                        {report.severity[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">{report.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{report.description}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold tracking-wider border border-slate-200 dark:border-slate-700">{report.status}</span>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold tracking-wider border border-slate-200 dark:border-slate-700">{report.category}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReportsList;
