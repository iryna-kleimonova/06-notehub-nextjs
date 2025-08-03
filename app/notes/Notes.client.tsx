'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/NoteModal/NoteModal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import css from '@/components/NotePage/NotePage.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', page, debouncedSearch, 12],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {data && data.total > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.total}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={handleOpen}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}

      {data?.data && <NoteList notes={data.data} />}

      {isModalOpen && (
        <Modal onClose={handleClose}>
          <NoteForm onClose={handleClose} />
        </Modal>
      )}
    </div>
  );
}
