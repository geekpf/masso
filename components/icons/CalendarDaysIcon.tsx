import React from 'react';

const CalendarDaysIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-7.5 12h1.5v1.5h-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008zm0 3h.008v.008H12v-.008zm-3-3h.008v.008H9v-.008zm0 3h.008v.008H9v-.008zm-3-3h.008v.008H6v-.008zm0 3h.008v.008H6v-.008zm6-6h.008v.008H12v-.008zm-3 0h.008v.008H9v-.008zm-3 0h.008v.008H6v-.008zm9 3h.008v.008H15v-.008zm0-3h.008v.008H15v-.008z" clipRule="evenodd"/>
    </svg>
);

export default CalendarDaysIcon;
