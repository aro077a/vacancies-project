import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import { CreateWhiteboardNoteRequestBody } from '~/types/requests';
import { transformSalaryFromStringToNumber } from '~/utils/strings';

import {
  createWhiteboardNote,
  deleteWhiteboardNote,
  getTotalValue,
  getWhiteboardNotes,
  toggleModalVisibility,
  updateWhiteboardNote,
} from './actions';

function* getWhiteboardNotesSaga(): SagaIterator {
  try {
    const { data } = yield* call(Admin.getWhiteboardNotes);

    yield* put(getWhiteboardNotes.success(data));
  } catch (error) {
    yield* put(getWhiteboardNotes.fail());
  }
}

function* createWhiteboardNoteSaga({
  payload,
}: ActionType<typeof createWhiteboardNote.request>): SagaIterator {
  try {
    const requestBody: CreateWhiteboardNoteRequestBody = {
      ...payload,
      value: transformSalaryFromStringToNumber(payload.value),
    };

    const { data } = yield* call(Admin.createWhiteboardNote, requestBody);

    yield* put(createWhiteboardNote.success(data));

    yield* put(toggleModalVisibility());
  } catch (error) {
    yield* put(createWhiteboardNote.fail());
  }
}

function* deleteWhiteboardNoteSaga(): SagaIterator {
  try {
    const { selectedNote } = yield* select((state: RootState) => state.adminWhiteboard);

    if (selectedNote) {
      yield* call(Admin.deleteWhiteboardNote, selectedNote.id);
    }

    yield* put(deleteWhiteboardNote.success());
  } catch (error) {
    yield* put(deleteWhiteboardNote.fail());
  }
}

function* updateWhiteboardNoteSaga({
  payload,
}: ActionType<typeof updateWhiteboardNote.request>): SagaIterator {
  try {
    const { selectedNote } = yield* select((state: RootState) => state.adminWhiteboard);

    if (selectedNote) {
      const requestBody: CreateWhiteboardNoteRequestBody = {
        ...payload,
        value: transformSalaryFromStringToNumber(payload.value),
        type: selectedNote.type,
      };

      const { data } = yield* call(Admin.updateWhiteboardNote, selectedNote.id, requestBody);

      yield* put(updateWhiteboardNote.success(data));

      yield* put(toggleModalVisibility());
    }
  } catch (error) {
    yield* put(updateWhiteboardNote.fail());
  }
}

function* getWhiteboardTotalValue(): SagaIterator {
  try {
    const { data } = yield* call(Admin.getWhiteboardTotalValue);

    yield* put(getTotalValue.success(data));
  } catch (error) {
    yield* put(getTotalValue.fail());
  }
}

export function* watchAdminWhiteboard(): SagaIterator {
  yield* takeLatest(getType(getWhiteboardNotes.request), getWhiteboardNotesSaga);
  yield* takeLatest(getType(createWhiteboardNote.request), createWhiteboardNoteSaga);
  yield* takeLatest(getType(deleteWhiteboardNote.request), deleteWhiteboardNoteSaga);
  yield* takeLatest(getType(updateWhiteboardNote.request), updateWhiteboardNoteSaga);
  yield* takeLatest(getType(getTotalValue.request), getWhiteboardTotalValue);
  yield* takeLatest(getType(deleteWhiteboardNote.success), getWhiteboardTotalValue);
  yield* takeLatest(getType(updateWhiteboardNote.success), getWhiteboardTotalValue);
  yield* takeLatest(getType(createWhiteboardNote.success), getWhiteboardTotalValue);
}
