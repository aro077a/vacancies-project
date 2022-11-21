import { WhiteboardNote, WhiteboardNoteType } from '~/models/admin';
import { GetAdminWhiteboardNotesResponse } from '~/types/responses';

export type AdminWhiteboardState = {
  loadingWhiteboardNotes: boolean;
  creatingNote: boolean;
  modalVisibility: boolean;
  selectedNote: WhiteboardNote | null;
  deletingNote: boolean;
  whiteboards: {
    [key: string]: {
      title: WhiteboardNoteType;
      items: GetAdminWhiteboardNotesResponse['data'];
    };
  };
  editMode: boolean;
  totalValue: number;
  loadingTotalValue: boolean;
};
