import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api/notes';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  data: Note[];
  total: number;
  page: number;
  perPage: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Note['tag'];
}

interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = '' } = params;

  const response = await axiosInstance.get<RawFetchNotesResponse>('/', {
    params: {
      page,
      perPage,
      ...(search !== '' && { search: search }),
    },
  });
  const raw = response.data;

  return {
    page,
    perPage,
    data: raw.notes,
    total: raw.totalPages,
  };
};

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  const response = await axiosInstance.post<Note>('/', noteData);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/${noteId}`);
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await axiosInstance.get<Note>(`/${id}`);
  return res.data;
};
