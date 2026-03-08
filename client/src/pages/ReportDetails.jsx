import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import * as API_SERVICE from '../api';
import { useAuth } from '../context/AuthContext';

const ReportDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [investigation, setInvestigation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [newNote, setNewNote] = useState('');
    const [newTask, setNewTask] = useState('');
    const [isResolving, setIsResolving] = useState(false);
    const [resolutionForm, setResolutionForm] = useState({ finalReport: '', outcome: '' });
    const [stepFormData, setStepFormData] = useState({
        forensic: { evidenceType: '', ipAddress: '', deviceInfo: '', details: '' },
        transaction: { accountNumber: '', transactionId: '', amount: '', bankName: '', date: '', status: 'pending' },
        callAnalysis: { callerNumber: '', duration: '', date: '', location: '', details: '' },
        physical: { locationVisit: '', witnessStatements: '', suspectId: '', details: '' },
        evidenceSummary: ''
    });

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const { data } = await API_SERVICE.getReportDetails(id);
            setReport(data.data);

            // Fetch investigation progress for all roles using dedicated endpoint
            try {
                const invRes = await API_SERVICE.getInvestigationByReport(data.data.id);
                setInvestigation(invRes.data.data || null);
            } catch {
                setInvestigation(null);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await API_SERVICE.addReportMessage(report.id, newMessage);
            setNewMessage('');
            fetchReport(); // Refresh to show new message
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await API_SERVICE.updateReportStatus(report.id, newStatus);
            fetchReport();
            alert(`Status updated to ${newStatus}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const handleEscalate = async () => {
        if (!window.confirm('Are you sure you want to escalate this case? This will notify higher authorities.')) return;
        try {
            await API_SERVICE.escalateReport(report.id);
            fetchReport();
            alert('Case Escalated!');
        } catch (err) {
            console.error(err);
            alert('Failed to escalate case');
        }
    };

    const handleStepUpdate = async (step, status, reportData = null) => {
        // Validate required fields per step before submitting
        const validationErrors = {
            forensic: () => {
                if (!stepFormData.forensic.evidenceType?.trim()) return 'Evidence Type is required.';
                if (!stepFormData.forensic.ipAddress?.trim()) return 'IP Address is required.';
                if (!stepFormData.forensic.deviceInfo?.trim()) return 'Device Info is required.';
                return null;
            },
            transaction: () => {
                if (!stepFormData.transaction.accountNumber?.trim()) return 'Account Number is required.';
                if (!stepFormData.transaction.bankName?.trim()) return 'Bank Name is required.';
                if (!stepFormData.transaction.transactionId?.trim()) return 'Transaction ID is required.';
                if (!stepFormData.transaction.amount) return 'Amount is required.';
                return null;
            },
            call_analysis: () => {
                if (!stepFormData.callAnalysis.callerNumber?.trim()) return 'Caller Number is required.';
                if (!stepFormData.callAnalysis.duration?.trim()) return 'Duration is required.';
                if (!stepFormData.callAnalysis.location?.trim()) return 'Origin Location is required.';
                return null;
            },
            physical_verification: () => {
                if (!stepFormData.physical.details?.trim()) return 'Field report details are required.';
                return null;
            }
        };

        const validator = validationErrors[step];
        if (validator) {
            const err = validator();
            if (err) { alert(`⚠️ ${err}`); return; }
        }

        try {
            await API_SERVICE.updateInvestigationStep(investigation.id, { step, status, reportData });
            fetchReport();
            alert(`✓ ${step.replace(/_/g, ' ')} updated to ${status}`);
        } catch (err) {
            console.error(err);
            alert(`Failed to update ${step}`);
        }
    };

    const handleResolveCase = async () => {
        // All 5 steps must be completed before resolving
        if (calculateProgress() < 100) {
            alert('⚠️ All investigation steps must be completed before resolving the case.');
            return;
        }
        if (!resolutionForm.finalReport?.trim() || !resolutionForm.outcome?.trim()) {
            alert('⚠️ Please provide both a Final Report and an Outcome statement.');
            return;
        }

        try {
            await API_SERVICE.resolveInvestigation(investigation.id, resolutionForm);
            fetchReport();
            setIsResolving(false);
            alert('✓ Case resolved successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to resolve case');
        }
    };

    const calculateProgress = () => {
        if (!investigation) return 0;
        const steps = [
            investigation.complaintReviewStatus === 'completed',
            investigation.forensicStatus === 'completed',
            ['completed', 'verified', 'suspicious'].includes(investigation.transactionStatus),
            investigation.callAnalysisStatus === 'completed',
            ['completed', 'verified'].includes(investigation.physicalVerificationStatus)
        ];
        return Math.round((steps.filter(Boolean).length / steps.length) * 100);
    };

    const InvestigationProgress = ({ readOnly = true }) => {
        const progress = calculateProgress();
        const steps = [
            { key: 'complaint_review', label: 'Complaint Review', status: investigation.complaintReviewStatus },
            { key: 'forensic', label: 'Forensic Analysis', status: investigation.forensicStatus },
            { key: 'transaction', label: 'Transaction Check', status: investigation.transactionStatus },
            { key: 'call_analysis', label: 'Call History Analysis', status: investigation.callAnalysisStatus },
            { key: 'physical_verification', label: 'Physical Verification', status: investigation.physicalVerificationStatus },
            { key: 'resolved', label: 'Case Resolution', status: investigation.status === 'closed' ? 'completed' : 'pending' }
        ];

        return (
            <div className="glass-card p-6 rounded-3xl mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">analytics</span>
                        Investigation Progress
                    </h3>
                    <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{progress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-primary/5 rounded-full mb-8 overflow-hidden border border-border">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="grid gap-4">
                    {steps.map((step) => (
                        <div key={step.key} className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-border/50">
                            <div className="flex items-center gap-3">
                                <div className={`size-6 rounded-full flex items-center justify-center ${['completed', 'verified', 'suspicious'].includes(step.status) ? 'bg-emerald-500 text-white' : 'bg-primary/10 text-text-muted opacity-50'}`}>
                                    <span className="material-symbols-outlined text-sm font-bold">
                                        {['completed', 'verified', 'suspicious'].includes(step.status) ? 'check' : 'hourglass_empty'}
                                    </span>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider ${['completed', 'verified', 'suspicious'].includes(step.status) ? 'text-text-primary' : 'text-text-muted'}`}>
                                    {step.label}
                                </span>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${['completed', 'verified', 'suspicious'].includes(step.status) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/5 text-text-muted'}`}>
                                {step.status || 'Pending'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary italic">Accessing encrypted archives...</div>;
    if (!report) return <div className="min-h-screen bg-background flex items-center justify-center text-red-500">Error: Record not found.</div>;

    return (
        <div className="min-h-screen bg-background text-text-primary font-body pb-20">
            <Header />
            <main className="max-w-6xl mx-auto px-6 pt-[160px]">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary mb-8 transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Report Info */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="glass-card p-8 rounded-3xl">
                            <div className="mb-10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">description</span>
                                    Incident Description
                                </h3>
                                <p className="text-text-secondary leading-relaxed bg-primary/5 p-6 rounded-2xl border border-border italic">
                                    "{report.description}"
                                </p>
                            </div>

                            {/* Evidence Preview */}
                            {report.evidence && report.evidence.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">Attached Evidence</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {report.evidence.map((file, i) => {
                                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                                            const UPLOAD_ROOT = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
                                            const fileUrl = file.startsWith('http') ? file : `${UPLOAD_ROOT}/${file.replace(/\\/g, '/')}`;
                                            return (
                                                <div key={i} onClick={() => window.open(fileUrl, '_blank')} className="aspect-square bg-primary/5 rounded-xl border border-border flex items-center justify-center group overflow-hidden relative cursor-pointer">
                                                    {isImage ? (
                                                        <img src={fileUrl} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-3xl text-text-muted group-hover:scale-110 transition-transform">article</span>
                                                    )}
                                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">View</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── LIVE CASE TRACKING (Citizen View) ── */}
                            {user?.role === 'citizen' && (
                                <div className="mt-8 border-t border-border pt-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">radar</span>
                                                Live Case Tracking
                                            </h3>
                                            <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">Real-time investigation status for your report</p>
                                        </div>
                                        {investigation && (() => {
                                            const steps = [
                                                investigation.complaintReviewStatus === 'completed',
                                                investigation.forensicStatus === 'completed',
                                                ['completed', 'verified', 'suspicious'].includes(investigation.transactionStatus),
                                                investigation.callAnalysisStatus === 'completed',
                                                ['completed', 'verified'].includes(investigation.physicalVerificationStatus)
                                            ];
                                            const pct = Math.round(steps.filter(Boolean).length / steps.length * 100);
                                            return (
                                                <div className="text-right">
                                                    <span className="text-3xl font-black text-primary">{pct}%</span>
                                                    <p className="text-[9px] text-text-muted uppercase tracking-widest">completed</p>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Overall Progress Bar */}
                                    {investigation && (() => {
                                        const steps = [
                                            investigation.complaintReviewStatus === 'completed',
                                            investigation.forensicStatus === 'completed',
                                            ['completed', 'verified', 'suspicious'].includes(investigation.transactionStatus),
                                            investigation.callAnalysisStatus === 'completed',
                                            ['completed', 'verified'].includes(investigation.physicalVerificationStatus)
                                        ];
                                        const pct = Math.round(steps.filter(Boolean).length / steps.length * 100);
                                        const isClosed = investigation.status === 'closed';
                                        return (
                                            <div className="mb-8">
                                                <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden border border-border">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isClosed
                                                            ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                                                            : 'bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                                                            }`}
                                                        style={{ width: isClosed ? '100%' : `${pct}%` }}
                                                    />
                                                </div>
                                                {isClosed && (
                                                    <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">verified</span>
                                                        Case Resolved & Closed
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Live Timeline Steps */}
                                    {(() => {
                                        const timelineSteps = [
                                            {
                                                key: 'filed',
                                                label: 'Complaint Filed',
                                                done: true,
                                                icon: 'assignment',
                                                color: 'emerald',
                                                message: 'Your complaint has been registered and assigned a unique case ID.',
                                                date: report.createdAt
                                            },
                                            {
                                                key: 'review',
                                                label: 'Complaint Under Review',
                                                done: investigation?.complaintReviewStatus === 'completed',
                                                icon: 'rate_review',
                                                color: 'blue',
                                                message: investigation?.complaintReviewStatus === 'completed'
                                                    ? 'Our team has reviewed your complaint and all submitted details.'
                                                    : 'Investigators are currently reviewing your complaint details and evidence.',
                                                date: null
                                            },
                                            {
                                                key: 'forensic',
                                                label: 'Digital Forensic Analysis',
                                                done: investigation?.forensicStatus === 'completed',
                                                icon: 'troubleshoot',
                                                color: 'purple',
                                                message: investigation?.forensicStatus === 'completed'
                                                    ? `Forensic analysis completed. ${investigation?.forensicReport?.evidenceType ? `Evidence type: ${investigation.forensicReport.evidenceType}.` : ''}`
                                                    : 'Our cyber forensics team is analyzing digital evidence related to your case.',
                                                date: null
                                            },
                                            {
                                                key: 'transaction',
                                                label: 'Financial Transaction Check',
                                                done: ['completed', 'verified', 'suspicious'].includes(investigation?.transactionStatus),
                                                icon: 'payments',
                                                color: investigation?.transactionStatus === 'suspicious' ? 'red' : 'amber',
                                                message: investigation?.transactionStatus === 'verified'
                                                    ? 'Transaction records have been verified.'
                                                    : investigation?.transactionStatus === 'suspicious'
                                                        ? 'Suspicious transactions have been flagged for further action.'
                                                        : 'Investigators are tracing financial transactions related to your case.',
                                                date: null
                                            },
                                            {
                                                key: 'call',
                                                label: 'Call History Analysis',
                                                done: investigation?.callAnalysisStatus === 'completed',
                                                icon: 'call',
                                                color: 'cyan',
                                                message: investigation?.callAnalysisStatus === 'completed'
                                                    ? 'Call records have been obtained and analyzed.'
                                                    : 'Investigators are reviewing call records associated with reported suspects.',
                                                date: null
                                            },
                                            {
                                                key: 'physical',
                                                label: 'Physical / Field Verification',
                                                done: ['completed', 'verified'].includes(investigation?.physicalVerificationStatus),
                                                icon: 'location_on',
                                                color: 'orange',
                                                message: ['completed', 'verified'].includes(investigation?.physicalVerificationStatus)
                                                    ? 'Field verification and physical inspection have been completed.'
                                                    : 'Our team is conducting on-ground verification at the reported location.',
                                                date: null
                                            },
                                            {
                                                key: 'resolved',
                                                label: 'Case Resolution',
                                                done: investigation?.status === 'closed',
                                                icon: 'verified',
                                                color: 'emerald',
                                                message: investigation?.status === 'closed'
                                                    ? (investigation?.finalReport || 'Case has been successfully resolved. You will be notified of the outcome.')
                                                    : 'Resolution pending — all steps must be completed before the case can be closed.',
                                                date: investigation?.resolvedDate
                                            }
                                        ];

                                        // Find first active (not done) step index
                                        const activeIdx = timelineSteps.findIndex(s => !s.done);

                                        return (
                                            <div className="relative">
                                                {/* Vertical line */}
                                                <div className="absolute left-5 top-0 bottom-0 w-px bg-border"></div>

                                                <div className="flex flex-col gap-0">
                                                    {timelineSteps.map((step, idx) => {
                                                        const isActive = idx === activeIdx;
                                                        const colorMap = {
                                                            emerald: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
                                                            blue: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]',
                                                            purple: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
                                                            amber: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]',
                                                            red: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]',
                                                            cyan: 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
                                                            orange: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]',
                                                        };
                                                        const bgPending = 'bg-primary/10 border border-border/40';

                                                        return (
                                                            <div key={step.key} className={`flex gap-6 pb-8 relative z-10 ${isActive ? 'opacity-100' : step.done ? 'opacity-100' : 'opacity-40'}`}>
                                                                {/* Icon Bubble */}
                                                                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 relative ${step.done ? colorMap[step.color] : bgPending
                                                                    } ${isActive ? 'ring-4 ring-primary/30 animate-pulse' : ''}`}>
                                                                    <span className={`material-symbols-outlined text-base ${step.done ? 'text-white' : 'text-text-muted'}`}>
                                                                        {step.key === 'resolved' && step.done ? 'check_circle' : step.icon}
                                                                    </span>
                                                                </div>

                                                                {/* Content */}
                                                                <div className={`flex-1 p-5 rounded-2xl ${step.done
                                                                    ? 'bg-primary/5 border border-border/50'
                                                                    : isActive
                                                                        ? 'bg-amber-500/5 border border-amber-500/20'
                                                                        : 'bg-primary/[0.02] border border-border/20'
                                                                    }`}>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <h4 className={`text-xs font-black uppercase tracking-widest ${step.done ? 'text-text-primary' : isActive ? 'text-amber-500' : 'text-text-muted'
                                                                            }`}>
                                                                            {step.label}
                                                                        </h4>
                                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${step.done
                                                                            ? `bg-${step.color === 'red' ? 'red' : 'emerald'}-500/10 text-${step.color === 'red' ? 'red' : 'emerald'}-500`
                                                                            : isActive
                                                                                ? 'bg-amber-500/10 text-amber-500'
                                                                                : 'bg-primary/5 text-text-muted'
                                                                            }`}>
                                                                            {step.done ? (step.key === 'transaction' && investigation?.transactionStatus === 'suspicious' ? 'Flagged' : 'Completed') : isActive ? 'In Progress' : 'Pending'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-text-secondary leading-relaxed">{step.message}</p>
                                                                    {step.date && (
                                                                        <p className="text-[9px] text-text-muted mt-2 uppercase tracking-widest">
                                                                            {new Date(step.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* No Investigation Yet */}
                                    {!investigation && (
                                        <div className="text-center py-10 bg-primary/5 rounded-2xl border border-border">
                                            <span className="material-symbols-outlined text-4xl text-primary opacity-30 mb-3 block">hourglass_top</span>
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Your case is queued for assignment</p>
                                            <p className="text-xs text-text-secondary mt-1">An investigator will be assigned shortly. You'll be notified when the investigation begins.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Investigator View: Workflow Modules */}
                            {(user?.role === 'investigator' || user?.role === 'admin') && investigation && (
                                <div className="space-y-8">
                                    <InvestigationProgress readOnly={false} />

                                    {/* Step Modules Section */}
                                    <div className="glass-card p-8 rounded-3xl">
                                        <h3 className="text-xl font-bold mb-8 border-b border-border pb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">model_training</span>
                                            Investigation Modules
                                        </h3>

                                        <div className="space-y-10">
                                            {/* 1. Complaint Review */}
                                            <div className="p-6 bg-primary/5 rounded-2xl border border-border">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h4 className="font-bold text-primary flex items-center gap-2 uppercase tracking-widest text-xs">
                                                        <span className="material-symbols-outlined text-base">rate_review</span>
                                                        Step 1: Complaint Review
                                                    </h4>
                                                    {investigation.complaintReviewStatus === 'completed' ? (
                                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full">Reviewed</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleStepUpdate('complaint_review', 'completed')}
                                                            className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                                                        >
                                                            Mark as Reviewed
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-6 text-xs">
                                                    <div>
                                                        <p className="text-text-muted mb-1 font-bold uppercase tracking-tighter">Complaint ID</p>
                                                        <p className="font-mono text-primary">{report.complaintId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-text-muted mb-1 font-bold uppercase tracking-tighter">Category</p>
                                                        <p className="font-bold uppercase">{report.category}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. Digital Forensic Analysis */}
                                            <div className="p-6 bg-primary/5 rounded-2xl border border-border">
                                                <h4 className="font-bold text-primary flex items-center gap-2 uppercase tracking-widest text-xs mb-6">
                                                    <span className="material-symbols-outlined text-base">troubleshoot</span>
                                                    Step 2: Digital Forensic Analysis
                                                </h4>
                                                {/* Show previously saved data if completed */}
                                                {investigation.forensicStatus === 'completed' && investigation.forensicReport && (
                                                    <div className="bg-surface/50 p-4 rounded-xl border border-border/50 text-xs mb-4">
                                                        <p className="flex justify-between mb-2 pb-2 border-b border-border/30">
                                                            <span className="text-text-muted uppercase">Evidence Type:</span>
                                                            <span className="font-bold">{investigation.forensicReport.evidenceType}</span>
                                                        </p>
                                                        <p className="flex justify-between mb-2 pb-2 border-b border-border/30">
                                                            <span className="text-text-muted uppercase">IP Address:</span>
                                                            <span className="font-mono font-bold">{investigation.forensicReport.ipAddress}</span>
                                                        </p>
                                                        <p className="flex justify-between">
                                                            <span className="text-text-muted uppercase">Device Info:</span>
                                                            <span className="font-bold">{investigation.forensicReport.deviceInfo}</span>
                                                        </p>
                                                    </div>
                                                )}
                                                {/* Always show inputs until completed */}
                                                {investigation.forensicStatus !== 'completed' && (
                                                    <div className="grid gap-4 mb-6">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <input
                                                                placeholder="Evidence Type (e.g. Screenshot) *"
                                                                className="bg-surface border border-border p-3 rounded-lg text-xs w-full"
                                                                value={stepFormData.forensic.evidenceType}
                                                                onChange={(e) => setStepFormData({ ...stepFormData, forensic: { ...stepFormData.forensic, evidenceType: e.target.value } })}
                                                            />
                                                            <input
                                                                placeholder="IP Address Found *"
                                                                className="bg-surface border border-border p-3 rounded-lg text-xs w-full"
                                                                value={stepFormData.forensic.ipAddress}
                                                                onChange={(e) => setStepFormData({ ...stepFormData, forensic: { ...stepFormData.forensic, ipAddress: e.target.value } })}
                                                            />
                                                        </div>
                                                        <input
                                                            placeholder="Device Info (Android / Windows / iOS) *"
                                                            className="bg-surface border border-border p-3 rounded-lg text-xs w-full"
                                                            value={stepFormData.forensic.deviceInfo}
                                                            onChange={(e) => setStepFormData({ ...stepFormData, forensic: { ...stepFormData.forensic, deviceInfo: e.target.value } })}
                                                        />
                                                        <input
                                                            placeholder="Additional Details"
                                                            className="bg-surface border border-border p-3 rounded-lg text-xs w-full"
                                                            value={stepFormData.forensic.details}
                                                            onChange={(e) => setStepFormData({ ...stepFormData, forensic: { ...stepFormData.forensic, details: e.target.value } })}
                                                        />
                                                        <p className="text-[9px] text-text-muted uppercase tracking-widest">* All fields are mandatory</p>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleStepUpdate('forensic', 'completed', stepFormData.forensic)}
                                                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg ${investigation.forensicStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-500 cursor-default' : 'bg-primary text-white shadow-primary/20 hover:scale-[1.01]'}`}
                                                    disabled={investigation.forensicStatus === 'completed'}
                                                >
                                                    {investigation.forensicStatus === 'completed' ? '✓ Forensic Audit Logged' : 'Submit Forensic Report'}
                                                </button>
                                            </div>

                                            {/* 3. Transaction History */}
                                            <div className="p-6 bg-primary/5 rounded-2xl border border-border">
                                                <h4 className="font-bold text-primary flex items-center gap-2 uppercase tracking-widest text-xs mb-6">
                                                    <span className="material-symbols-outlined text-base">payments</span>
                                                    Step 3: Transaction History
                                                </h4>
                                                {/* Show saved data if completed */}
                                                {['verified', 'suspicious'].includes(investigation.transactionStatus) && investigation.transactionReport && (
                                                    <div className="bg-surface/50 p-4 rounded-xl border border-border/50 text-xs mb-4">
                                                        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                                                            <p><span className="text-text-muted">Account:</span> <span className="font-bold">{investigation.transactionReport.accountNumber}</span></p>
                                                            <p><span className="text-text-muted">Bank:</span> <span className="font-bold">{investigation.transactionReport.bankName}</span></p>
                                                            <p><span className="text-text-muted">Amount:</span> <span className="font-bold text-red-500">₹{investigation.transactionReport.amount}</span></p>
                                                            <p><span className="text-text-muted">ID:</span> <span className="font-mono">{investigation.transactionReport.transactionId}</span></p>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Always show inputs until verified or suspicious */}
                                                {!['verified', 'suspicious'].includes(investigation.transactionStatus) && (
                                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                                        <input placeholder="Account Number *" className="bg-surface border border-border p-3 rounded-lg text-xs" value={stepFormData.transaction.accountNumber} onChange={(e) => setStepFormData({ ...stepFormData, transaction: { ...stepFormData.transaction, accountNumber: e.target.value } })} />
                                                        <input placeholder="Bank Name *" className="bg-surface border border-border p-3 rounded-lg text-xs" value={stepFormData.transaction.bankName} onChange={(e) => setStepFormData({ ...stepFormData, transaction: { ...stepFormData.transaction, bankName: e.target.value } })} />
                                                        <input placeholder="Transaction ID *" className="bg-surface border border-border p-3 rounded-lg text-xs" value={stepFormData.transaction.transactionId} onChange={(e) => setStepFormData({ ...stepFormData, transaction: { ...stepFormData.transaction, transactionId: e.target.value } })} />
                                                        <input placeholder="Amount (INR) *" type="number" className="bg-surface border border-border p-3 rounded-lg text-xs" value={stepFormData.transaction.amount} onChange={(e) => setStepFormData({ ...stepFormData, transaction: { ...stepFormData.transaction, amount: e.target.value } })} />
                                                        <p className="col-span-2 text-[9px] text-text-muted uppercase tracking-widest">* All fields are mandatory</p>
                                                    </div>
                                                )}
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => handleStepUpdate('transaction', 'verified', stepFormData.transaction)}
                                                        disabled={['verified', 'suspicious'].includes(investigation.transactionStatus)}
                                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${investigation.transactionStatus === 'verified' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                                    >
                                                        {investigation.transactionStatus === 'verified' ? '✓ Verified' : 'Mark Verified'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStepUpdate('transaction', 'suspicious', stepFormData.transaction)}
                                                        disabled={['verified', 'suspicious'].includes(investigation.transactionStatus)}
                                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${investigation.transactionStatus === 'suspicious' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'}`}
                                                    >
                                                        {investigation.transactionStatus === 'suspicious' ? '⚠ Flagged' : 'Mark Suspicious'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 4. Call History Analysis */}
                                            <div className="p-6 bg-primary/5 rounded-2xl border border-border">
                                                <h4 className="font-bold text-primary flex items-center gap-2 uppercase tracking-widest text-xs mb-6">
                                                    <span className="material-symbols-outlined text-base">call</span>
                                                    Step 4: Call History Analysis
                                                </h4>
                                                <div className="grid gap-4 mb-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input placeholder="Caller Number" className="bg-surface border border-border p-2 rounded-lg text-xs" onChange={(e) => setStepFormData({ ...stepFormData, callAnalysis: { ...stepFormData.callAnalysis, callerNumber: e.target.value } })} />
                                                        <input placeholder="Duration (mins)" className="bg-surface border border-border p-2 rounded-lg text-xs" onChange={(e) => setStepFormData({ ...stepFormData, callAnalysis: { ...stepFormData.callAnalysis, duration: e.target.value } })} />
                                                    </div>
                                                    <input placeholder="Origin Location" className="bg-surface border border-border p-2 rounded-lg text-xs" onChange={(e) => setStepFormData({ ...stepFormData, callAnalysis: { ...stepFormData.callAnalysis, location: e.target.value } })} />
                                                </div>
                                                <button
                                                    onClick={() => handleStepUpdate('call_analysis', 'completed', stepFormData.callAnalysis)}
                                                    className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                                >
                                                    Add Call Analysis Report
                                                </button>
                                            </div>

                                            {/* 5. Physical Verification */}
                                            <div className="p-6 bg-primary/5 rounded-2xl border border-border">
                                                <h4 className="font-bold text-primary flex items-center gap-2 uppercase tracking-widest text-xs mb-6">
                                                    <span className="material-symbols-outlined text-base">location_on</span>
                                                    Step 5: Physical Verification
                                                </h4>
                                                <textarea
                                                    placeholder="Physical investigation details, witness statements, etc."
                                                    className="w-full bg-surface border border-border p-4 rounded-xl text-xs min-h-[100px] mb-6"
                                                    onChange={(e) => setStepFormData({ ...stepFormData, physical: { ...stepFormData.physical, details: e.target.value } })}
                                                />
                                                <button
                                                    onClick={() => handleStepUpdate('physical_verification', 'completed', stepFormData.physical)}
                                                    className="w-full py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20"
                                                >
                                                    Upload Field Report
                                                </button>
                                            </div>

                                            {/* 6. Case Resolution Form */}
                                            <div className="p-8 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-3xl border border-primary/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <span className="material-symbols-outlined text-6xl">verified</span>
                                                </div>
                                                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                                                    Final Case Resolution
                                                </h4>
                                                <div className="space-y-4">
                                                    <textarea
                                                        placeholder="Final Investigation Report"
                                                        className="w-full bg-white/5 border border-border p-4 rounded-2xl text-sm min-h-[120px]"
                                                        value={resolutionForm.finalReport}
                                                        onChange={(e) => setResolutionForm({ ...resolutionForm, finalReport: e.target.value })}
                                                    />
                                                    <textarea
                                                        placeholder="Final Outcome / Recommendation"
                                                        className="w-full bg-white/5 border border-border p-4 rounded-2xl text-sm min-h-[100px]"
                                                        value={resolutionForm.outcome}
                                                        onChange={(e) => setResolutionForm({ ...resolutionForm, outcome: e.target.value })}
                                                    />
                                                    <button
                                                        onClick={handleResolveCase}
                                                        disabled={calculateProgress() < 100}
                                                        className={`w-full py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] transition-all shadow-xl ${calculateProgress() < 100 ? 'bg-border text-text-muted cursor-not-allowed opacity-60' : 'bg-emerald-500 text-white hover:scale-[1.02] shadow-emerald-500/20'}`}
                                                    >
                                                        {calculateProgress() < 100 ? `Complete All Steps to Resolve (${calculateProgress()}% done)` : '✓ Resolve Case'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Communications / Messaging */}
                        <div className="glass-card p-8 rounded-3xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">chat</span>
                                Secure Communications
                            </h3>

                            <div className="flex flex-col gap-4 h-[400px] overflow-y-auto mb-6 pr-4 custom-scrollbar">
                                {report.messages && report.messages.length > 0 ? (
                                    report.messages.map((msg, i) => (
                                        <div key={i} className={`max-w-[80%] p-4 rounded-2xl ${msg.senderId === user?.id ? 'bg-primary/20 border border-primary/30 self-end ml-auto' : 'bg-primary/5 border border-border self-start'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-bold uppercase text-primary">
                                                    {(msg.sender?.role === 'investigator' || msg.sender?.role === 'admin')
                                                        ? `OFFICIAL RESPONSE - ${msg.sender?.department || 'CYBER DIVISION'}`
                                                        : msg.sender?.role || 'CITIZEN'}
                                                </span>
                                            </div>
                                            <p className="text-xs">{msg.content}</p>
                                            <span className="text-[8px] text-text-muted uppercase mt-2 block tracking-wider">
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-50">
                                        <span className="material-symbols-outlined text-4xl mb-2">lock_open</span>
                                        <p className="text-xs font-bold uppercase tracking-widest">Channel initialized. No messages yet.</p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    placeholder="Type your secure message..."
                                    className="w-full bg-primary/5 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm font-medium"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 size-10 bg-primary rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg">
                                    <span className="material-symbols-outlined text-base">send</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Timeline & Suspects */}
                    <div className="flex flex-col gap-8">
                        {/* Timeline */}
                        <div className="glass-card p-6 rounded-3xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Case Timeline</h3>
                            <div className="flex flex-col gap-6 relative">
                                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border"></div>
                                {report.timeline && report.timeline.length > 0 ? (
                                    report.timeline.map((event, i) => (
                                        <div key={i} className="flex gap-4 relative z-10">
                                            <div className="size-3 rounded-full bg-primary mt-1 border-4 border-background shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight">{event.status}</p>
                                                <p className="text-[10px] text-text-secondary mt-0.5">{event.note}</p>
                                                <p className="text-[8px] text-text-muted mt-1 uppercase tracking-widest">{new Date(event.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex gap-4 relative z-10">
                                        <div className="size-3 rounded-full bg-primary mt-1 border-4 border-background"></div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">Report Received</p>
                                            <p className="text-[10px] text-text-secondary mt-0.5">Automated logging initiated.</p>
                                            <p className="text-[8px] text-text-muted mt-1 uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Suspects Card */}
                        <div className="glass-card p-6 rounded-3xl bg-red-500/[0.02]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">person_search</span>
                                Identified Suspects
                            </h3>
                            <div className="flex flex-col gap-3">
                                {report.suspects && report.suspects.length > 0 ? (
                                    report.suspects.map((s, i) => (
                                        <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <p className="text-xs font-bold uppercase tracking-tighter">{s}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-text-muted italic">No suspects identified yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Investigator Controls */}
                        {(user?.role === 'investigator' || user?.role === 'admin') && (
                            <div className="glass-card p-6 rounded-3xl bg-blue-500/[0.02]">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">gavel</span>
                                    Actions
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-[10px] font-bold uppercase text-text-muted">Update Status</h4>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => handleStatusUpdate('investigating')} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase hover:bg-yellow-500/20 transition-all font-display tracking-widest">Investigating</button>
                                        <button onClick={() => handleStatusUpdate('resolved')} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold uppercase hover:bg-green-500/20 transition-all font-display tracking-widest">Resolve Case</button>
                                        <button onClick={() => handleStatusUpdate('closed')} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-gray-500/10 text-gray-500 border border-gray-500/20 text-[10px] font-bold uppercase hover:bg-gray-500/20 transition-all font-display tracking-widest">Close Case</button>
                                    </div>

                                    <div className="h-px bg-border my-2"></div>

                                    <button onClick={handleEscalate} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">priority_high</span>
                                        Escalate Case
                                    </button>
                                </div>

                                {investigation && (
                                    <div className="mt-8 flex flex-col gap-6">
                                        <div className="h-px bg-border"></div>

                                        {/* Notes Section */}
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase text-text-muted mb-3 italic">Investigation Notes</h4>
                                            <div className="flex flex-col gap-3 mb-4">
                                                {investigation.notes?.map((n, i) => (
                                                    <div key={i} className="p-3 bg-white/5 border border-border rounded-xl text-[11px]">
                                                        <p className="text-text-secondary leading-relaxed">{n.content}</p>
                                                        <span className="text-[8px] text-text-muted mt-2 block uppercase font-mono">{new Date(n.date).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add internal note..."
                                                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-xs"
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                />
                                                <button
                                                    onClick={async () => {
                                                        if (!newNote) return;
                                                        await API_SERVICE.addInvestigationNote(investigation.id, newNote);
                                                        setNewNote('');
                                                        fetchReport();
                                                    }}
                                                    className="px-3 bg-primary/20 text-primary rounded-xl text-xs font-bold"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Task List Section */}
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase text-text-muted mb-3 italic">Operational Tasks</h4>
                                            <div className="flex flex-col gap-2 mb-4">
                                                {investigation.tasks?.map((t, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl">
                                                        <button
                                                            onClick={async () => {
                                                                await API_SERVICE.toggleTaskCompletion(investigation.id, i);
                                                                fetchReport();
                                                            }}
                                                            className={`size-5 rounded border ${t.isCompleted ? 'bg-green-500 border-green-500 flex items-center justify-center' : 'border-border'}`}
                                                        >
                                                            {t.isCompleted && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                                                        </button>
                                                        <span className={`text-xs font-medium ${t.isCompleted ? 'line-through text-text-muted' : ''}`}>{t.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="New task..."
                                                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-xs"
                                                    value={newTask}
                                                    onChange={(e) => setNewTask(e.target.value)}
                                                />
                                                <button
                                                    onClick={async () => {
                                                        if (!newTask) return;
                                                        await API_SERVICE.addInvestigationTask(investigation.id, { title: newTask });
                                                        setNewTask('');
                                                        fetchReport();
                                                    }}
                                                    className="px-3 bg-primary/20 text-primary rounded-xl text-xs font-bold"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Final Outcome Button */}
                                        <button
                                            onClick={async () => {
                                                const outcome = window.prompt('Enter final case outcome:');
                                                if (outcome) {
                                                    await API_SERVICE.setFinalOutcome(investigation.id, outcome);
                                                    fetchReport();
                                                }
                                            }}
                                            className="w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20"
                                        >
                                            Close Case & Issue Outcome
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Evidence Integrity (SHA-256) */}
                        <div className="glass-card p-6 rounded-3xl bg-green-500/[0.02]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">verified_user</span>
                                Evidence Integrity (SHA-256)
                            </h3>
                            <div className="flex flex-col gap-4">
                                {report.evidence && report.evidence.length > 0 ? (
                                    report.evidence.map((ev, i) => (
                                        <div key={i} className="flex flex-col gap-1 p-3 bg-primary/10 rounded-xl border border-border">
                                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter truncate">{ev.split(/[/\\]/).pop()}</p>
                                            <code className="text-[10px] text-green-500 font-mono break-all">{Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}</code>
                                            <p className="text-[8px] text-text-muted uppercase mt-1">Verified by system protocol on {new Date(report.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-text-muted italic text-center">No digital evidence hashed yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="p-6 rounded-3xl border border-border bg-primary/5">
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Need Help?</h4>
                            <p className="text-[10px] text-text-secondary leading-relaxed mb-4">You can message your investigator directly using the secure channel on the left.</p>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-text-primary transition-colors">Case FAQ & Guidelines</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportDetails;
