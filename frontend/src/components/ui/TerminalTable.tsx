import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}
interface TerminalTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  filters?: React.ReactNode;
}
export function TerminalTable<
  T extends {
    id: string | number;
  }>(
{
  data,
  columns,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'search --filter',
  onRowClick,
  filters
}: TerminalTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredData = searchable ?
  data.filter((item) =>
  Object.values(item).some((value) =>
  String(value).toLowerCase().includes(searchQuery.toLowerCase())
  )
  ) :
  data;
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {searchable &&
        <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 px-4 py-2 rounded border border-terminal-green/30 bg-terminal-dark focus-within:border-terminal-green focus-within:neon-box-green transition-all">
              <span className="text-terminal-green font-bold">&gt;</span>
              <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-gray-300 placeholder-gray-600 outline-none text-sm" />

              <SearchIcon className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        }
        {filters}
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto rounded-lg border border-terminal-green/30 neon-box-green">
        <table className="w-full">
          <thead>
            <tr className="border-b border-terminal-green/30 bg-terminal-green/5">
              {columns.map((col) =>
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-xs font-semibold text-terminal-green uppercase tracking-wider"
                style={{
                  width: col.width
                }}>

                  [{col.header}]
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-terminal-green/10">
            <AnimatePresence mode="popLayout">
              {paginatedData.map((item, index) =>
              <motion.tr
                key={item.id}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: 20
                }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03
                }}
                onClick={() => onRowClick?.(item)}
                className={`bg-terminal-dark hover:bg-terminal-green/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}>

                  {columns.map((col) =>
                <td
                  key={String(col.key)}
                  className="px-4 py-3 text-sm text-gray-300">

                      {col.render ?
                  col.render(item) :
                  String(
                    (item as Record<string, unknown>)[
                    col.key as string] ??
                    ''
                  )}
                    </td>
                )}
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>

        {paginatedData.length === 0 &&
        <div className="px-4 py-12 text-center text-gray-500">
            <p className="text-sm">No results found</p>
            <p className="text-xs mt-1">Try adjusting your search query</p>
          </div>
        }
      </div>

      {/* Pagination */}
      {totalPages > 1 &&
      <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Showing {startIndex + 1}-
            {Math.min(startIndex + pageSize, filteredData.length)} of{' '}
            {filteredData.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded border border-terminal-green/30 text-gray-400 hover:text-terminal-green hover:border-terminal-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors">

              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-terminal-green px-3">
              [{currentPage}/{totalPages}]
            </span>
            <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded border border-terminal-green/30 text-gray-400 hover:text-terminal-green hover:border-terminal-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors">

              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
    </div>);

}