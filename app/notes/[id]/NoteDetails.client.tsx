'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import css from '@/components/NoteDetails/NoteDetails.module.css';
import { useEffect, useState } from 'react';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        {isClient && (
          <p className={css.date}>
            {note.updatedAt
              ? `Updated at: ${new Date(note.updatedAt).toLocaleString()}`
              : `Created at: ${new Date(note.createdAt).toLocaleString()}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default NoteDetailsClient;
