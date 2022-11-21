import { createAction } from 'deox';

import { WhiteboardNote, WhiteboardNoteType } from '~/models/admin';
import { WhiteboardNoteFormValues } from '~/types/formValues';
import {
  GetAdminWhiteboardNotesResponse,
  GetWhiteboardNoteCreatedResponse,
  GetWhiteboardTotalValueResponse,
} from '~/types/responses';

export const getWhiteboardNotes = {
  request: createAction('adminWhiteboard/GET_WHITEBOARD_NOTES'),
  success: createAction(
    'adminWhiteboard/GET_WHITEBOARD_NOTES_SUCCESS',
    resolve => (payload: GetAdminWhiteboardNotesResponse) => resolve(payload),
  ),
  fail: createAction('adminWhiteboard/GET_WHITEBOARD_FAIL'),
};

export const createWhiteboardNote = {
  request: createAction(
    'adminWhiteboard/CREATE_WHITEBOARD_NOTE',
    resolve => (payload: WhiteboardNoteFormValues & { type: WhiteboardNoteType }) =>
      resolve(payload),
  ),
  success: createAction(
    'adminWhiteboard/CREATE_WHITEBOARD_NOTE_SUCCESS',
    resolve => (payload: GetWhiteboardNoteCreatedResponse) => resolve(payload),
  ),
  fail: createAction('adminWhiteboard/CREATE_WHITEBOARD_FAIL'),
};

export const deleteWhiteboardNote = {
  request: createAction('adminWhiteboard/DELETE_WHITEBOARD_NOTE'),
  success: createAction('adminWhiteboard/DELETE_WHITEBOARD_NOTE_SUCCESS'),
  fail: createAction('adminWhiteboard/DELETE_WHITEBOARD_FAIL'),
};

export const toggleModalVisibility = createAction('adminWhiteboard/TOGGLE_MODAL_VISIBILITY');

export const resetToInitial = createAction('adminWhiteboard/RESET_TO_INITIAL');

export const setSelectedNote = createAction(
  'adminWhiteboard/SET_SELECTED_NOTE',
  resolve => (payload: WhiteboardNote | null) => resolve(payload),
);

export const setEditMode = createAction(
  'adminWhiteboard/SET_EDIT_MODE',
  resolve => (payload: boolean) => resolve(payload),
);

export const updateWhiteboardNote = {
  request: createAction(
    'adminWhiteboard/UPDATE_WHITEBOARD_NOTE',
    resolve => (payload: WhiteboardNoteFormValues) => resolve(payload),
  ),
  success: createAction(
    'adminWhiteboard/UPDATE_WHITEBOARD_NOTE_SUCCESS',
    resolve => (payload: GetWhiteboardNoteCreatedResponse) => resolve(payload),
  ),
  fail: createAction('adminWhiteboard/UPDATE_WHITEBOARD_FAIL'),
};

export const getTotalValue = {
  request: createAction('adminWhiteboard/GET_TOTAL_VALUE'),
  success: createAction(
    'adminWhiteboard/GET_TOTAL_VALUE_SUCCESS',
    resolve => (payload: GetWhiteboardTotalValueResponse) => resolve(payload),
  ),
  fail: createAction('adminWhiteboard/GET_TOTAL_VALUE_FAIL'),
};
