'use client';

import { ChangeEvent } from 'react';

import { BsSearch } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useRecoilState } from 'recoil';

import useFocus from '@/hooks/use-focus';
import useHover from '@/hooks/use-hover';
import { queryState } from '@/states/query';

export default function SearchBar() {
  const [query, setQuery] = useRecoilState(queryState);
  const { ref: hoverRef, isHovering } = useHover<HTMLDivElement>();
  const { ref: focusRef, isFocusing } = useFocus<HTMLInputElement>();

  const handleInputClear = () => {
    setQuery('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const isActive = isHovering || isFocusing;

  return (
    <div ref={hoverRef} className="relative w-full">
      <BsSearch
        className={`absolute left-6 flex h-full items-center text-xl transition-colors duration-300 ${
          isActive ? 'text-red-500' : 'text-gray-400'
        }`}
      />
      {query && isActive && (
        <IoMdClose
          onClick={handleInputClear}
          className="absolute right-6 flex h-full cursor-pointer items-center text-xl text-gray-400 transition-colors duration-300 hover:text-red-500"
        />
      )}
      <input
        ref={focusRef}
        type="text"
        placeholder="Search posts"
        onChange={handleInputChange}
        value={query}
        className={`w-full rounded-full border-[2px] border-gray-300 bg-white py-4 pl-14 pr-12 text-xl font-medium shadow-sm outline-none transition-all duration-300 focus:bg-customGray-base focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)] dark:border-gray-500 dark:bg-customGray-dark dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] dark:focus:bg-customGray-light ${
          isActive
            ? 'border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)] dark:border-red-500'
            : ''
        }`}
      />
    </div>
  );
}
