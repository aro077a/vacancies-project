import { createReducer } from 'deox';
import produce from 'immer';

import { toggleSuccessModalVisibility } from './actions';
import { PopupsState } from './types';

export const initialState: PopupsState = {
  successModalVisibility: false,
};

export const successPopupReducer = createReducer(initialState, handle => [
  handle(toggleSuccessModalVisibility, state =>
    produce(state, draft => {
      draft.successModalVisibility = !draft.successModalVisibility;
    }),
  ),
]);
