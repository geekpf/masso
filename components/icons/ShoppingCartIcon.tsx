import React from 'react';

const ShoppingCartIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.491a1.125 1.125 0 00-.44-1.329l-3.263-2.002V3.75a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75v.634L6.22 8.25M6.22 8.25L5.14 12.035a1.125 1.125 0 001.087.835h.008l.008 0h.008l.008 0H19.5m-12.75-3.75h11.218" />
    </svg>
);

export default ShoppingCartIcon;
