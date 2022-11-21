import { createReducer } from 'deox';
import produce from 'immer';

import { assignToMe } from './actions';
import { AdminAssigned } from './types';

const initialState: AdminAssigned = {
  assigned: false,
};

export const adminAssignedReducer = createReducer(initialState, handle => [
  handle(assignToMe, (state, { payload }) =>
    produce(state, draft => {
      draft.assigned = payload;
    }),
  ),
]);
