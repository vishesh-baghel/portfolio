"use client";

import { FloatingSearchBar } from './floating-search-bar';
import { SearchModal } from './search-modal';
import { useSearch } from '../providers/search-provider';

export function PortfolioSearch() {
  const { isSearchOpen, openSearch, closeSearch } = useSearch();

  return (
    <>
      <FloatingSearchBar onClick={openSearch} />
      <SearchModal open={isSearchOpen} onClose={closeSearch} />
    </>
  );
}
