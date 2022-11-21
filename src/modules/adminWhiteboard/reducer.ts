import { createReducer } from 'deox';
import produce from 'immer';

import { WhiteboardNoteType } from '~/models/admin';

import {
  createWhiteboardNote,
  deleteWhiteboardNote,
  getTotalValue,
  getWhiteboardNotes,
  resetToInitial,
  setEditMode,
  setSelectedNote,
  toggleModalVisibility,
  updateWhiteboardNote,
} from './actions';
import { AdminWhiteboardState } from './types';

const initialState: AdminWhiteboardState = {
  loadingWhiteboardNotes: false,
  whiteboards: {
    Talent: {
      title: WhiteboardNoteType.Talent,
      items: [],
    },
    Interviews: {
      title: WhiteboardNoteType.Interviews,
      items: [],
    },
    Placements: {
      title: WhiteboardNoteType.Placements,
      items: [],
    },
    'Urgent jobs': {
      title: WhiteboardNoteType.UrgentJobs,
      items: [],
    },
    'Key notes': {
      title: WhiteboardNoteType.KeyNotes,
      items: [],
    },
  },
  creatingNote: false,
  modalVisibility: false,
  selectedNote: null,
  deletingNote: false,
  editMode: false,
  totalValue: 0,
  loadingTotalValue: false,
};

export const adminWhiteboardReducer = createReducer(initialState, handle => [
  handle(getWhiteboardNotes.request, state =>
    produce(state, draft => {
      draft.loadingWhiteboardNotes = true;
    }),
  ),
  handle(getWhiteboardNotes.success, (state, { payload }) =>
    produce(state, draft => {
      payload.data.forEach(note => draft.whiteboards[note.type].items.push(note));
      draft.loadingWhiteboardNotes = false;
    }),
  ),
  handle(getWhiteboardNotes.fail, state =>
    produce(state, draft => {
      draft.loadingWhiteboardNotes = false;
    }),
  ),
  handle(createWhiteboardNote.request, state =>
    produce(state, draft => {
      draft.creatingNote = true;
    }),
  ),
  handle(createWhiteboardNote.success, (state, { payload: { data } }) =>
    produce(state, draft => {
      draft.whiteboards[data.type].items.unshift(data);
      draft.creatingNote = false;
    }),
  ),
  handle(createWhiteboardNote.fail, state =>
    produce(state, draft => {
      draft.creatingNote = false;
    }),
  ),
  handle(toggleModalVisibility, state =>
    produce(state, draft => {
      draft.modalVisibility = !draft.modalVisibility;
    }),
  ),
  handle(resetToInitial, state =>
    produce(state, draft => {
      Object.assign(draft, initialState);
    }),
  ),
  handle(setSelectedNote, (state, { payload }) =>
    produce(state, draft => {
      draft.selectedNote = payload;
    }),
  ),
  handle(deleteWhiteboardNote.request, state =>
    produce(state, draft => {
      draft.deletingNote = true;
    }),
  ),
  handle(deleteWhiteboardNote.success, state =>
    produce(state, draft => {
      const indexOfNote = draft.whiteboards[draft.selectedNote!.type].items.findIndex(
        note => note.id === draft.selectedNote?.id,
      );
      draft.whiteboards[draft.selectedNote!.type].items.splice(indexOfNote, 1);
      draft.deletingNote = false;
    }),
  ),
  handle(deleteWhiteboardNote.fail, state =>
    produce(state, draft => {
      draft.deletingNote = false;
    }),
  ),
  handle(setEditMode, (state, { payload }) =>
    produce(state, draft => {
      draft.editMode = payload;
    }),
  ),
  handle(updateWhiteboardNote.request, state =>
    produce(state, draft => {
      draft.creatingNote = true;
    }),
  ),
  handle(updateWhiteboardNote.success, (state, { payload: { data } }) =>
    produce(state, draft => {
      const indexOfNote = draft.whiteboards[data.type].items.findIndex(note => note.id === data.id);
      draft.whiteboards[data.type].items[indexOfNote] = {
        ...data,
      };
      draft.creatingNote = false;
    }),
  ),
  handle(updateWhiteboardNote.fail, state =>
    produce(state, draft => {
      draft.creatingNote = false;
    }),
  ),
  handle(getTotalValue.request, state =>
    produce(state, draft => {
      draft.loadingTotalValue = true;
    }),
  ),
  handle(getTotalValue.success, (state, { payload }) =>
    produce(state, draft => {
      draft.totalValue = payload.data.total;
      draft.loadingTotalValue = false;
    }),
  ),
  handle(getTotalValue.fail, state =>
    produce(state, draft => {
      draft.loadingTotalValue = false;
    }),
  ),
]);
