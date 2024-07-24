import React, { useEffect, useRef } from 'react'

const CompanyMenu = ({ setCompanyMenu, companyMenu }) => {
    const companyRef = useRef();
    useEffect(() => {
        function checkOutSideClick(e) {
            if (companyRef.current && !companyRef.current.contains(e.target)) {
                setCompanyMenu(false);
            }
        }
        document.addEventListener("click", checkOutSideClick);

        return () => {
            document.removeEventListener("click", checkOutSideClick);
        };
    }, [companyMenu]);
    return (
        <div ref={companyRef} className='absolute top-10  bg-slate-200'>
            <ul className='flex flex-col border rounded text-center '>
                <li className='px-3 py-1 border-b border-black'>company1</li>
                <li className='px-3 py-1 border-b border-black'>company2</li>
                <li className='px-3 py-1 border-b border-black'>company3</li>
            </ul>
        </div>
    )
}

export default CompanyMenu