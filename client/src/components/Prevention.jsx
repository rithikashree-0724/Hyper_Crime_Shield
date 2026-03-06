import React from 'react';

const Prevention = () => {
    return (
        <section className="flex flex-col gap-6" id="prevention" style={{ '--checkbox-tick-svg': "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(255,255,255)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')" }}>
            <div className="flex flex-col gap-2">
                <h2 className="text-text-primary text-3xl font-bold leading-tight tracking-tight">
                    Prevention Checklist
                </h2>
                <p className="text-text-secondary text-base font-normal leading-normal">
                    Proactive measures you can take today to secure your digital footprint.
                </p>
            </div>
            <div className="rounded-xl border border-border bg-primary/5 p-6 border-border">
                {[
                    { title: 'Enable Two-Factor Authentication (2FA)', desc: 'Add an extra layer of security to all your accounts.' },
                    { title: 'Verify Sender Addresses', desc: 'Always check the actual email address, not just the display name.' },
                    { title: 'Keep Systems Updated', desc: 'Patches often contain critical security fixes.' },
                    { title: 'Use a Password Manager', desc: 'Generate and store complex, unique passwords for every site.' }
                ].map((item, idx) => (
                    <label key={idx} className="flex gap-x-4 py-3 items-start border-b border-border last:border-0 cursor-pointer group">
                        <input type="checkbox" className="mt-1 h-5 w-5 rounded border-border border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all font-bold" />
                        <div className="flex flex-col gap-1">
                            <p className="text-text-primary text-base font-medium leading-normal group-hover:text-primary transition-colors">{item.title}</p>
                            <p className="text-text-secondary text-sm">{item.desc}</p>
                        </div>
                    </label>
                ))}
            </div>
        </section>
    );
};

export default Prevention;
