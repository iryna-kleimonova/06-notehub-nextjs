'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import css from '@/components/NotePage/NotePage.module.css';
import { NotesResponse } from '@/types/note';

interface NotesClientProps {
  initialNotes: NotesResponse;
}

export default function NotesClient({ initialNotes }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data = initialNotes } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: keepPreviousData,
    initialData:
      page === 1 && debouncedSearch === '' ? initialNotes : undefined,
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

      <NoteList notes={data.data} />

      {isModalOpen && (
        <Modal onClose={handleClose}>
          <NoteForm onClose={handleClose} />
        </Modal>
      )}
    </div>
  );
}
