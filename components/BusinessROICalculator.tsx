
import React, { useState, useEffect } from 'react';

interface BusinessROICalculatorProps {
    totalInvestment: number;
    isOpen: boolean;
    onClose: () => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const BusinessROICalculator: React.FC<BusinessROICalculatorProps> = ({ totalInvestment, isOpen, onClose }) => {
    const [monthlyFee, setMonthlyFee] = useState(120000);
    const [expectedMembers, setExpectedMembers] = useState(50);
    const [monthlyCosts, setMonthlyCosts] = useState(2000000);

    const monthlyRevenue = monthlyFee * expectedMembers;
    const monthlyNetProfit = monthlyRevenue - monthlyCosts;
    const monthsToROI = monthlyNetProfit > 0 ? totalInvestment / monthlyNetProfit : Infinity;

    if (!isOpen) return null;

    return (
        <div className="bg-neutral-100 dark:bg-white/5 rounded-3xl p-6 border border-neutral-200 dark:border-white/10 mt-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-600 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic">Simulador de Rentabilidad (ROI)</h3>
                </div>
                <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic">Mensualidad Promedio</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400">$</span>
                        <input
                            type="number"
                            value={monthlyFee}
                            onChange={(e) => setMonthlyFee(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl text-xs font-black"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic">Número de Afiliados</label>
                    <input
                        type="number"
                        value={expectedMembers}
                        onChange={(e) => setExpectedMembers(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl text-xs font-black"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic">Gastos Operativos (Arriendo, Luz, Staff)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400">$</span>
                        <input
                            type="number"
                            value={monthlyCosts}
                            onChange={(e) => setMonthlyCosts(Number(e.target.value))}
                            className="w-full pl-7 pr-3 py-2 bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/10 rounded-xl text-xs font-black"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-neutral-900 dark:bg-white rounded-2xl shadow-xl">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest italic">Inversión Total</span>
                    <span className="text-lg font-black text-white dark:text-neutral-900 italic tracking-tighter leading-none">{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest italic">Utilidad Neta Mensual</span>
                    <span className={`text-lg font-black italic tracking-tighter leading-none ${monthlyNetProfit > 0 ? 'text-primary-500' : 'text-red-500'}`}>
                        {formatCurrency(monthlyNetProfit)}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest italic">Retorno de Inversión (Punto de Equilibrio)</span>
                    <span className="text-lg font-black text-white dark:text-neutral-900 italic tracking-tighter leading-none uppercase">
                        {monthsToROI === Infinity ? 'N/A' : `${monthsToROI.toFixed(1)} Meses`}
                    </span>
                </div>
                <div className="flex flex-col justify-center">
                    <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase text-center ${monthlyNetProfit > 2000000 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {monthlyNetProfit > 2000000 ? 'Alta Rentabilidad' : 'Proyecto Viable'}
                    </div>
                </div>
            </div>

            <p className="mt-4 text-[8px] text-neutral-400 text-center uppercase tracking-[0.2em] italic font-bold">
                * Cálculos aproximados para fines ilustrativos de negocio.
            </p>
        </div>
    );
};

export default BusinessROICalculator;
