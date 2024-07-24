import React, { useEffect, useRef } from 'react'

const DiscoverMenu = ({ setDiscoverMenu, discoverMenu }) => {
    const discoverRef = useRef();
    useEffect(() => {
        function checkOutSideClick(e) {
            if (discoverRef.current && !discoverRef.current.contains(e.target)) {
                setDiscoverMenu(false);
            }
        }
        document.addEventListener("click", checkOutSideClick);

        return () => {
            document.removeEventListener("click", checkOutSideClick);
        };
    }, [discoverMenu]);
    return (
        <div ref={discoverRef} className='absolute top-10 bg-slate-200  '>
            <ul className='flex flex-col border rounded text-center '>
                <li className='p-1 border-b border-black'>DropDown1</li>
                <li className='p-1 border-b border-black'>DropDown2</li>
                <li className='p-1 border-b border-black'>DropDown3</li>
            </ul>
        </div>
    )
}

export default DiscoverMenu