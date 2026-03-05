import { JaaSMeeting, JitsiMeeting } from '@jitsi/react-sdk';
import React, { useRef, useState } from 'react';

const App = () => {
    const apiRef = useRef();
    const [ logItems, updateLog ] = useState([]);
    const [ showNew, toggleShowNew ] = useState(false);
    const [ knockingParticipants, updateKnockingParticipants ] = useState([]);

    const printEventOutput = payload => {
        updateLog(items => [ ...items, JSON.stringify(payload) ]);
    };

    const handleAudioStatusChange = (payload, feature) => {
        if (payload.muted) {
            updateLog(items => [ ...items, `${feature} off` ])
        } else {
            updateLog(items => [ ...items, `${feature} on` ])
        }
    };

    const handleChatUpdates = payload => {
        if (payload.isOpen || !payload.unreadCount) {
            return;
        }
        apiRef.current.executeCommand('toggleChat');
        updateLog(items => [ ...items, `you have ${payload.unreadCount} unread messages` ])
    };

    const handleKnockingParticipant = payload => {
        updateLog(items => [ ...items, JSON.stringify(payload) ]);
        updateKnockingParticipants(participants => [ ...participants, payload?.participant ])
    };

    const resolveKnockingParticipants = condition => {
        knockingParticipants.forEach(participant => {
            apiRef.current.executeCommand('answerKnockingParticipant', participant?.id, condition(participant));
            updateKnockingParticipants(participants => participants.filter(item => item.id === participant.id));
        });
    };

    const handleJitsiIFrameRef1 = iframeRef => {
        iframeRef.style.border = '10px solid #3d3d3d';
        iframeRef.style.background = '#3d3d3d';
        iframeRef.style.height = '400px';
        iframeRef.style.marginBottom = '20px';
    };

    const handleJitsiIFrameRef2 = iframeRef => {
        iframeRef.style.marginTop = '10px';
        iframeRef.style.border = '10px dashed #df486f';
        iframeRef.style.padding = '5px';
        iframeRef.style.height = '400px';
    };

    const handleJaaSIFrameRef = iframeRef => {
        iframeRef.style.border = '10px solid #3d3d3d';
        iframeRef.style.background = '#3d3d3d';
        iframeRef.style.height = '400px';
        iframeRef.style.marginBottom = '20px';
    };

    const renderLog = () => logItems.map(
        (item, index) => (
            <div
                style={{
                    fontFamily: 'monospace',
                    padding: '5px'
                }}
                key={index}>
                {item}
            </div>
        )
    );

    return (
        <div style={{ background: '#2f2f2f', minHeight: '100vh', padding: '16px 0' }}>
            <div style={{ margin: '0 20%' }}>
                <div
                    style={{
                        width: '100%',
                        marginBottom: '16px',
                        background: '#111',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.25)'
                    }}>
                    <div
                        style={{
                            height: '440px',
                            background: 'linear-gradient(135deg, #1f2937, #0f172a)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}/>
                    <div
                        style={{
                            padding: '12px 14px',
                            background: '#18181b',
                            color: '#e4e4e7',
                            fontFamily: 'sans-serif'
                        }}>
                        <div
                            style={{
                                height: '6px',
                                borderRadius: '4px',
                                background: '#3f3f46',
                                marginBottom: '10px',
                                overflow: 'hidden'
                            }}>
                            <div
                                style={{
                                    width: '38%',
                                    height: '100%',
                                    background: '#ef4444'
                                }}/>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '13px'
                            }}>
                            <span>▶ 01:14 / 03:12</span>
                            <span>HD • 1x • ⛶</span>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        width: '100%'
                    }}>
                    <JaaSMeeting
                        appId="vpaas-magic-cookie-0dc7eb40b18c4b21a27f4e2c7df65794"
                        roomName="SampleAppEmbarrassedRunnersConsentCompletely"
                        getIFrameRef={handleJaaSIFrameRef}/>
                </div>
                {renderLog()}
            </div>
        </div>
    );
};

export default App;
