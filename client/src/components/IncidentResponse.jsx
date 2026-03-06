import React from 'react';

const IncidentResponse = () => {
    return (
        <section className="flex flex-col gap-6 mb-10" id="response">
            <div className="flex flex-col gap-2">
                <h2 className="text-text-primary text-3xl font-bold leading-tight tracking-tight">
                    Incident Response Protocol
                </h2>
                <p className="text-text-secondary text-base font-normal leading-normal">
                    If you suspect a breach, follow these immediate steps to minimize damage.
                </p>
            </div>
            <div className="grid gap-4">
                {[
                    { step: 1, title: 'Disconnect from Network', desc: 'Immediately unplug ethernet cables and disable Wi-Fi to prevent the spread of malware.', active: true },
                    { step: 2, title: 'Preserve Evidence', desc: 'Do not shut down the computer if possible (hibernate instead). Take photos of any ransom notes.' },
                    { step: 3, title: 'Report the Incident', desc: 'Use the CyberGuard dashboard to file an official report. Contact authorities depending on severity.' }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-primary/5 border border-border">
                        <div className={`${item.active ? 'bg-primary text-white' : 'bg-primary/5 text-text-primary border border-border'} rounded-lg size-10 flex items-center justify-center shrink-0 font-bold text-lg shadow-lg`}>
                            {item.step}
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-text-primary font-bold text-lg">{item.title}</h3>
                            <p className="text-text-secondary leading-relaxed text-sm">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default IncidentResponse;
