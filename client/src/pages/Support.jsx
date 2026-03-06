import React, { useContext } from 'react';
import Header from '../components/Header';
import SupportForm from '../components/SupportForm';
import SystemStatus from '../components/SystemStatus';
import { AuthContext } from '../context/AuthContext';

const Support = () => {
    // Component logic here

    return (
        <div className="min-h-screen bg-background text-text-primary font-body pb-24">
            <Header />

            <main className="max-w-7xl mx-auto px-6 pt-[160px] pb-16">
                <div className="flex flex-col gap-12">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Support Center</h1>
                        <p className="text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
                            Need technical assistance or have questions about the reporting process?
                            Our team is here to help you navigate the system and ensure your data remains secure.
                        </p>
                    </div>

                    {/* Interactive Forms */}
                    <div className="grid lg:grid-cols-3 gap-12 mt-4 animate-fade-in">
                        <div className="lg:col-span-2">
                            <SupportForm />
                        </div>
                        <div className="lg:col-span-1">
                            <SystemStatus />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Support;
