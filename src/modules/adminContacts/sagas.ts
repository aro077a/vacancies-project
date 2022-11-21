import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Admin } from '~/services/api/Admin';
import { RootState } from '~/store/types';
import {
  AddContactCandidateRequestBody,
  AddContactCompanyRequestBody,
  GetAdminContactRequestParams,
  GetAdminMessagesRequestParams,
  GetAdminSentResumesRequestParams,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';

import {
  addContactCandidate,
  addContactCompany,
  addManagerNote,
  deleteContactCandidate,
  deleteContactCompany,
  deleteManagerNote,
  getContactCandidates,
  getContactCompanies,
  getContactMessages,
  getManagerNotes,
  getSentResumes,
  setContactCandidateSearchWithFilters,
  setContactCompanySearchWithFilters,
  updateManagerNote,
} from './actions';

function* getContactCompaniesSaga({
  payload,
}: ActionType<typeof getContactCompanies.init>): SagaIterator {
  try {
    const {
      companies,
      companySearchValue,
      searchManagerByPosition,
      searchManagerCityFilter,
      searchManagerByProjectType,
      searchManagerByCompany,
      searchManagerByPositionType,
    } = yield* select((state: RootState) => state.adminContacts);
    if (payload.initialFetch || companies.count > companies.results.length) {
      yield* put(getContactCompanies.request());

      const requestParams: GetAdminContactRequestParams = {
        offset: companies.results.length,
        limit: 12,
      };

      if (searchManagerByPositionType.value) {
        requestParams.permission = searchManagerByPositionType.value;
      }

      if (searchManagerByCompany.value) {
        requestParams.company = searchManagerByCompany.value;
      }

      if (searchManagerByPosition.value) {
        requestParams.position = searchManagerByPosition.value;
      }

      if (searchManagerByProjectType.value) {
        requestParams.project = searchManagerByProjectType.value;
      }

      if (searchManagerCityFilter.value) {
        requestParams.office = searchManagerCityFilter.value;
      }

      if (companySearchValue) {
        requestParams.search = companySearchValue;
      }

      const { data } = yield* call(Admin.getContactCompanies, requestParams);

      yield* put(getContactCompanies.success(data));
    }
  } catch (error) {
    yield* put(getContactCompanies.fail());
  }
}

function* getContactCandidatesSaga({
  payload,
}: ActionType<typeof getContactCandidates.init>): SagaIterator {
  try {
    const { candidates, candidateSearchValue } = yield* select(
      (state: RootState) => state.adminContacts,
    );
    if (payload.initialFetch || candidates.count > candidates.results.length) {
      yield* put(getContactCandidates.request());

      const requestParams: GetAdminContactRequestParams = {
        offset: candidates.results.length,
        limit: 12,
      };

      if (candidateSearchValue) {
        requestParams.search = candidateSearchValue;
      }

      const { data } = yield* call(Admin.getContactCandidates, requestParams);

      yield* put(getContactCandidates.success(data));
    }
  } catch (error) {
    yield* put(getContactCandidates.fail());
  }
}

function* getContactCompaniesWithFiltersSaga(): SagaIterator {
  yield* put(getContactCompanies.init({ initialFetch: true }));
}

function* getContactCandidatesWithFiltersSaga(): SagaIterator {
  yield* put(getContactCandidates.init({ initialFetch: true }));
}

function* addContactCompanySaga({
  payload,
}: ActionType<typeof addContactCompany.request>): SagaIterator {
  try {
    const {
      formValues: {
        firstName,
        lastName,
        email,
        city,
        company,
        position,
        project,
        phone,
        permission,
      },
      onSuccess,
    } = payload;

    const requestBody: AddContactCompanyRequestBody = {
      firstName,
      lastName,
      email,
      office: city!.value,
      company,
    };

    if (permission) {
      requestBody.permission = permission;
    }

    if (phone) {
      requestBody.phone = phone;
    }

    if (position?.value) {
      requestBody.position = position.value;
    }

    if (project?.value) {
      requestBody.project = project.value;
    }

    const { data } = yield* call(Admin.createContactCompany, requestBody);

    yield* put(addContactCompany.success(data));
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(addContactCompany.fail(errorDetails));
  }
}

function* addContactCandidateSaga({
  payload: { formValues, onSuccess },
}: ActionType<typeof addContactCandidate.request>): SagaIterator {
  try {
    const requestBody: AddContactCandidateRequestBody = {
      ...formValues,
      admin: formValues.admin!.value,
    };

    const { data } = yield* call(Admin.createContactCandidate, requestBody);

    yield* put(addContactCandidate.success(data));
    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    yield* put(addContactCandidate.fail(errorDetails));
  }
}

function* getContactMessagesSaga({
  payload,
}: ActionType<typeof getContactMessages.init>): SagaIterator {
  try {
    const { messages, selectedCompanyContact } = yield* select(
      (state: RootState) => state.adminContacts,
    );

    const { nextPageToken } = messages;

    if ((payload.initialFetch || nextPageToken) && selectedCompanyContact) {
      yield* put(getContactMessages.request());

      const requestParams: GetAdminMessagesRequestParams = {
        maxResults: 4,
        pageToken: nextPageToken,
      };

      if (!nextPageToken) {
        delete requestParams.pageToken;
      }

      const { data } = yield* call(
        Admin.getContactMessages,
        selectedCompanyContact.id,
        requestParams,
      );

      yield* put(getContactMessages.success(data));
    }
  } catch (error) {
    yield* put(getContactMessages.fail());
  }
}

function* getSentResumesSaga({ payload }: ActionType<typeof getSentResumes.init>): SagaIterator {
  try {
    const { sentResumes, selectedCompanyContact } = yield* select(
      (state: RootState) => state.adminContacts,
    );
    if (
      (payload.initialFetch || sentResumes.count > sentResumes.results.length) &&
      selectedCompanyContact
    ) {
      yield* put(getSentResumes.request());

      const requestParams: GetAdminSentResumesRequestParams = {
        offset: sentResumes.results.length,
        limit: 12,
      };

      const { data } = yield* call(Admin.getSentResumes, selectedCompanyContact.id, requestParams);

      yield* put(getSentResumes.success(data));
    }
  } catch (error) {
    yield* put(getSentResumes.fail());
  }
}

function* getManagerNotesSaga(): SagaIterator {
  try {
    const { selectedCompanyContact } = yield* select((state: RootState) => state.adminContacts);
    if (selectedCompanyContact?.id) {
      const { data } = yield* call(Admin.getManagerNotesRequest, selectedCompanyContact?.id);

      yield* put(getManagerNotes.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getManagerNotes.fail(errorDetails));
  }
}

function* addManagerNoteSaga({ payload }: ActionType<typeof addManagerNote.request>): SagaIterator {
  try {
    const { selectedCompanyContact } = yield* select((state: RootState) => state.adminContacts);

    const { data } = yield* call(
      Admin.addManagerNotesRequest,
      { id: selectedCompanyContact?.id },
      payload,
    );
    yield* put(addManagerNote.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(addManagerNote.fail(errorDetails));
  }
}

function* updateManagerNoteSaga({
  payload,
}: ActionType<typeof updateManagerNote.request>): SagaIterator {
  try {
    const { selectedCompanyContact, selectedNoteId } = yield* select(
      (state: RootState) => state.adminContacts,
    );

    if (selectedCompanyContact?.id) {
      const { data } = yield* call(
        Admin.updateManagerNote,
        selectedCompanyContact?.id,
        selectedNoteId,
        payload,
      );

      yield* put(updateManagerNote.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateManagerNote.fail(errorDetails));
  }
}

function* deleteManagerNoteSaga({
  payload,
}: ActionType<typeof deleteManagerNote.request>): SagaIterator {
  try {
    const { selectedCompanyContact } = yield* select((state: RootState) => state.adminContacts);
    const { noteId } = payload;
    if (selectedCompanyContact?.id) {
      yield* call(Admin.deleteManagerNote, selectedCompanyContact?.id, noteId);

      yield* put(deleteManagerNote.success());
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteManagerNote.fail(errorDetails));
  }
}

function* deleteContactCandidateSaga({
  payload,
}: ActionType<typeof deleteContactCandidate.request>): SagaIterator {
  const { contactCandidateId } = payload;
  try {
    yield* call(Admin.deleteCandidateRequest, contactCandidateId);

    yield* put(deleteContactCandidate.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteContactCandidate.fail(errorDetails));
  }
}

function* deleteContactCompanySaga({
  payload,
}: ActionType<typeof deleteContactCompany.request>): SagaIterator {
  try {
    if (payload?.contactCompanyId) {
      yield* call(Admin.deleteContactCompanyRequest, payload?.contactCompanyId);

      yield* put(deleteContactCompany.success());
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteContactCompany.fail(errorDetails));
  }
}

export function* watchAdminContacts(): SagaIterator {
  yield* takeLatest(getType(getContactCompanies.init), getContactCompaniesSaga);
  yield* takeLatest(getType(getContactCandidates.init), getContactCandidatesSaga);
  yield* takeLatest(getType(addContactCompany.request), addContactCompanySaga);
  yield* takeLatest(getType(addContactCandidate.request), addContactCandidateSaga);
  yield* takeLatest(
    getType(setContactCompanySearchWithFilters),
    getContactCompaniesWithFiltersSaga,
  );
  yield* takeLatest(
    getType(setContactCandidateSearchWithFilters),
    getContactCandidatesWithFiltersSaga,
  );
  yield* takeLatest(getType(getContactMessages.init), getContactMessagesSaga);
  yield* takeLatest(getType(getSentResumes.init), getSentResumesSaga);
  yield* takeLatest(getType(getManagerNotes.request), getManagerNotesSaga);
  yield* takeLatest(getType(addManagerNote.request), addManagerNoteSaga);
  yield* takeLatest(getType(updateManagerNote.request), updateManagerNoteSaga);
  yield* takeLatest(getType(deleteManagerNote.request), deleteManagerNoteSaga);
  yield* takeLatest(getType(deleteContactCandidate.request), deleteContactCandidateSaga);
  yield* takeLatest(getType(deleteContactCompany.request), deleteContactCompanySaga);
}
