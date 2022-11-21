import { format } from 'date-fns';
import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'typed-redux-saga';

import { UserType } from '~/models/common';
import { Admin } from '~/services/api/Admin';
import { Candidate } from '~/services/api/Candidate';
import { RootState } from '~/store/types';
import {
  CreateCandidateProfessionalDetailsRequestBody,
  CreateCandidateProfileRequestBody,
} from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { dateOrString } from '~/utils/helpers';
import { transformSalaryFromStringToNumber } from '~/utils/strings';

import {
  createCandidateProfessionalDetails,
  createCandidateProfile,
  deleteCandidatePhoto,
  deleteVideoInterview,
  getCandidateDataForEdit,
  getCandidateStatus,
  getInterviewQuestions,
  getPrefillData,
  setBrandedCvForEdit,
  setCvForEdit,
  setDetailsForEdit,
  setDocumentsForEdit,
  setLicensesForEdit,
  setPhotoForEdit,
  setProfileForEdit,
  setVideoInterviewForEdit,
  skipCvUpload,
  skipLicensesUpload,
  skipPhotoUpload,
  updateCandidateLookingForJobStatus,
  uploadCandidateBrandedCV,
  uploadCandidateCV,
  uploadCandidateDocuments,
  uploadCandidateLicenses,
  uploadCandidatePhoto,
  uploadVideoInterview,
} from './actions';

function* createCandidateProfileSaga({
  payload,
}: ActionType<typeof createCandidateProfile.request>): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const { formValue, onSuccess } = payload;

    const requestBody: CreateCandidateProfileRequestBody = {
      ...formValue,
      user: { email: formValue.user.email, password: formValue.user.password },
      city: formValue.city!.value,
      state: formValue.state!.value,
      linkedInResume: formValue.linkedInResume || '',
      admin: formValue.admin!.value,
    };

    if (!candidateId) {
      requestBody.user.password = 'itxYhR7ywh';
    }

    if (!formValue.linkedInResume) {
      delete requestBody.linkedInResume;
    }

    const { data } = candidateId
      ? yield* call(Candidate.updateProfile, { id: candidateId }, requestBody)
      : yield* call(Candidate.createProfile, requestBody);

    yield* put(createCandidateProfile.success(data));

    onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createCandidateProfile.fail(errorDetails));
  }
}

function* createCandidateProfessionalDetailsSaga({
  payload,
}: ActionType<typeof createCandidateProfessionalDetails.request>): SagaIterator {
  try {
    const registeredId = yield* select(
      (state: RootState) => state.createCandidate.registeredCandidateId,
    );

    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const editMode = yield* select((state: RootState) => state.createCandidate.editMode);

    const loggedInUserType = yield* select((state: RootState) => state.user.loggedInUserType);
    const isAdmin =
      loggedInUserType === UserType.ADMIN || loggedInUserType === UserType.SUPER_ADMIN;

    const id = registeredId || candidateId;

    const { formValue, onSuccess } = payload;

    const requestBody: CreateCandidateProfessionalDetailsRequestBody = {
      ...formValue,
      jobTitle: formValue.jobTitle!.value,
      jobPositions: formValue.jobPositions.map(jobPosition => jobPosition.value),
      projectTypes: formValue.projectTypes.map(projectType => projectType.value),
      projectValues: formValue.projectValues?.value ? formValue.projectValues.value : '',
      interestedCompanies: formValue.interestedCompanies.length
        ? formValue.interestedCompanies.map(interestedCompany => interestedCompany.value)
        : undefined,
      notInterestedCompanies: formValue.notInterestedCompanies.length
        ? formValue.notInterestedCompanies.map(notInterestedCompany => notInterestedCompany.value)
        : undefined,
      availability: formValue.availability.value,
      minSalary: transformSalaryFromStringToNumber(formValue.minSalary.replace(/,/g, '')),
      workExps: formValue.workExps.map(workExp => {
        const workLocation =
          typeof workExp.location === 'number' ? workExp.location : workExp.location?.value;

        const workCountry =
          typeof workExp.country === 'number' ? workExp.country : workExp.country?.value;

        return {
          ...workExp,
          location: workLocation!,
          workStart: dateOrString(workExp.workStart!),
          workEnd: dateOrString(workExp.workEnd!),
          country: workCountry!,
          logo: workExp.logo || '',
          id: undefined,
        };
      }),
      keyProjects: formValue.keyProjects.map(keyProject => {
        const projectLocation =
          typeof keyProject.location === 'number'
            ? keyProject.location
            : keyProject.location?.value;
        return {
          ...keyProject,
          location: projectLocation!,
          workStart: dateOrString(keyProject.workStart!),
          workEnd: dateOrString(keyProject.workEnd!),
          value: keyProject.value?.value,
          id: undefined,
        };
      }),
    };

    const { data } = yield* isAdmin && editMode
      ? call(Admin.updateCandidateProfessionalDetails, { id: id! }, requestBody)
      : call(Candidate.createProfessionalDetails, id!, requestBody);

    onSuccess();

    yield* put(createCandidateProfessionalDetails.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createCandidateProfessionalDetails.fail(errorDetails));
  }
}

function* uploadCandidateCVSaga({
  payload,
}: ActionType<typeof uploadCandidateCV.request>): SagaIterator {
  try {
    const registeredId = yield* select(
      (state: RootState) => state.createCandidate.registeredCandidateId,
    );

    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const id = registeredId || candidateId;

    const { formValue, onSuccess } = payload;

    const { data } = yield* call(Candidate.uploadCV, id!, formValue);
    onSuccess();

    yield* put(uploadCandidateCV.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(uploadCandidateCV.fail(errorDetails));
  }
}

function* uploadCandidateBrandedCVSaga({
  payload,
}: ActionType<typeof uploadCandidateBrandedCV.request>): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const { formValue, onSuccess } = payload;

    const { data } = yield* call(Admin.uploadCandidateBrandedCV, candidateId!, {
      brandedCv: formValue.file,
    });

    onSuccess();

    yield* put(uploadCandidateBrandedCV.success(data));
  } catch (error) {
    yield* put(uploadCandidateBrandedCV.fail());
  }
}

function* uploadCandidateDocumentsSaga({
  payload,
}: ActionType<typeof uploadCandidateDocuments.request>): SagaIterator {
  try {
    const { formValues, onSuccess } = payload;

    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const convertedArray = formValues.files.map(file => ({
      file,
    }));

    const { data } = convertedArray.length
      ? yield* call(Admin.uploadCandidateDocuments, candidateId!, {
          files: convertedArray,
        })
      : yield* call(Admin.clearCandidateDocuments, candidateId!, { files: convertedArray });

    yield* put(uploadCandidateDocuments.success(data));

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    const errorResponse = getErrorDetailsFromResponse(error);
    yield* put(uploadCandidateDocuments.fail(errorResponse));
  }
}

function* uploadCandidateLicensesSaga({
  payload,
}: ActionType<typeof uploadCandidateLicenses.request>): SagaIterator {
  try {
    const registeredId = yield* select(
      (state: RootState) => state.createCandidate.registeredCandidateId,
    );

    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );
    const id = registeredId || candidateId;

    const { formValues, onSuccess } = payload;
    const formattedArray = formValues?.map(item => ({
      ...item,
      expirationDate:
        (typeof item.expirationDate !== 'string' &&
          item.expirationDate &&
          format(item.expirationDate, 'yyyy-MM-dd')) ||
        format(new Date(), 'yyyy-MM-dd'),
    }));
    const { data } = formValues.length
      ? yield* call(Candidate.uploadLicenses, id!, { files: formattedArray })
      : yield* call(Candidate.clearLicenses, id!, { files: formattedArray });
    if (onSuccess) {
      onSuccess();
    }

    yield* put(uploadCandidateLicenses.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(uploadCandidateLicenses.fail(errorDetails));
  }
}

function* uploadCandidatePhotoSaga({
  payload,
}: ActionType<typeof uploadCandidatePhoto.request>): SagaIterator {
  try {
    const registeredId = yield* select(
      (state: RootState) => state.createCandidate.registeredCandidateId,
    );

    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const id = registeredId || candidateId;

    const { data } = yield* call(Candidate.uploadPhoto, id!, payload.formValues);

    payload.onSuccess();

    yield* put(uploadCandidatePhoto.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(uploadCandidatePhoto.fail(errorDetails));
  }
}

function* deleteCandidatePhotoSaga(): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    yield* call(Candidate.deletePhoto, candidateId!);

    yield* put(deleteCandidatePhoto.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(deleteCandidatePhoto.fail(errorDetails));
  }
}

function* getUpdateCandidateLookingForJobStatusSaga({
  payload,
}: ActionType<typeof updateCandidateLookingForJobStatus.request>): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    const { data } = yield* call(
      Candidate.updateLookingForJobStatus,
      { id: candidateId! },
      { status: payload.status },
    );

    yield* put(updateCandidateLookingForJobStatus.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(updateCandidateLookingForJobStatus.fail(errorDetails));
  }
}

function* getProfileForEditSaga(candidateId: number): SagaIterator {
  try {
    const { data } = yield* call(Candidate.getProfile, { id: candidateId });

    yield* put(setProfileForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getDetailsForEditSaga(candidateId: number): SagaIterator {
  try {
    const loggedInUserType = yield* select((state: RootState) => state.user.loggedInUserType);
    const isAdmin = loggedInUserType === (UserType.ADMIN || UserType.SUPER_ADMIN);

    const { data } = yield* isAdmin
      ? call(Admin.getCandidateProfessionalDetails, { id: candidateId })
      : call(Candidate.getProfessionalDetails, { id: candidateId });

    yield* put(setDetailsForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getCvForEditSaga(candidateId: number): SagaIterator {
  try {
    const { data } = yield* call(Candidate.getCV, { id: candidateId });

    yield* put(setCvForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getLicensesForEditSaga(candidateId: number): SagaIterator {
  try {
    const { data } = yield* call(Candidate.getLicenses, { id: candidateId });

    yield* put(setLicensesForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getDocumentsForEditSaga(candidateId: number): SagaIterator {
  try {
    const { data } = yield* call(Admin.getCandidateDocuments, candidateId);

    yield* put(setDocumentsForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getPhotoForEditSaga(candidateId: number): SagaIterator {
  try {
    const { data } = yield* call(Candidate.getPhoto, { id: candidateId });

    yield* put(setPhotoForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getVideoInterviewEditSaga(candidateId: number): SagaIterator {
  try {
    const { data } = yield* call(Candidate.getInterview, { id: candidateId });

    yield* put(setVideoInterviewForEdit.success(data));
    // eslint-disable-next-line no-empty
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);
    const notFoundError = 'Not found.';
    if (errorDetails === notFoundError) {
      yield* put(setVideoInterviewForEdit.failVideoNotUploaded());
    } else {
      yield* put(setVideoInterviewForEdit.fail());
    }
  }
}

function* getBrandedCvEditSaga(candidateId: number): SagaIterator {
  try {
    const { data } = yield* call(Admin.getCandidateOverview, { id: candidateId });

    yield* put(setBrandedCvForEdit(data));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* getCandidateDataForEditSaga({
  payload,
}: ActionType<typeof getCandidateDataForEdit.request>): SagaIterator {
  yield* all<any>([
    call(getProfileForEditSaga, payload.candidateId),
    call(getDetailsForEditSaga, payload.candidateId),
    call(getCvForEditSaga, payload.candidateId),
    call(getLicensesForEditSaga, payload.candidateId),
    call(getPhotoForEditSaga, payload.candidateId),
    call(getVideoInterviewEditSaga, payload.candidateId),
    call(getBrandedCvEditSaga, payload.candidateId),
    call(getDocumentsForEditSaga, payload.candidateId),
  ]);

  yield* put(getCandidateDataForEdit.success());
}

// eslint-disable-next-line require-yield
function* skipLicensesUploadSaga({ payload }: ActionType<typeof skipLicensesUpload>): SagaIterator {
  try {
    payload.onSkip();
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

// eslint-disable-next-line require-yield
function* skipCvUploadSaga({ payload }: ActionType<typeof skipCvUpload>): SagaIterator {
  try {
    payload.onSkip();
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

function* skipPhotoUploadSaga({ payload }: ActionType<typeof skipPhotoUpload>): SagaIterator {
  try {
    payload.onSkip();

    yield* put(uploadCandidatePhoto.success(null));
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

function* getPrefillDataSaga({ payload }: ActionType<typeof getPrefillData.request>): SagaIterator {
  try {
    if (payload) {
      const { data } = yield* call(Candidate.getPrefillDataFromResume, { linkedInResume: payload });

      yield* put(getPrefillData.success(data));
    }
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getPrefillData.fail(errorDetails));
  }
}

function* getInterviewQuestionsSaga(): SagaIterator {
  try {
    const { data } = yield* call(Candidate.getInterviewQuestions);

    yield* put(getInterviewQuestions.success(data));
  } catch (error) {
    yield* put(getInterviewQuestions.fail());
  }
}

function* uploadVideoInterviewSaga(): SagaIterator {
  try {
    const { videoInterviewNotLoadedYet, candidateVideoInterviewBlob } = yield* select(
      (state: RootState) => state.createCandidate,
    );

    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    if (videoInterviewNotLoadedYet) {
      yield* call(
        Candidate.createInterview,
        { id: candidateId! },
        { video: candidateVideoInterviewBlob! },
      );
    } else {
      yield* call(
        Candidate.updateInterview,
        { id: candidateId! },
        { video: candidateVideoInterviewBlob! },
      );
    }

    yield* put(uploadVideoInterview.success());
  } catch (error) {
    yield* put(uploadVideoInterview.fail());
  }
}

function* deleteVideoInterviewSaga(): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.createCandidate.candidateProfileCreated?.id,
    );

    yield* call(Candidate.deleteInterview, { id: candidateId! });

    yield* put(deleteVideoInterview.success());
  } catch (error) {
    yield* put(deleteVideoInterview.fail());
  }
}

function* getCandidateStatusSaga(): SagaIterator {
  try {
    const candidateId = yield* select((state: RootState) => state.candidateUser.typeId);

    const { data } = yield* call(Candidate.getProfessionalDetails, { id: candidateId });

    yield* put(getCandidateStatus.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(getCandidateStatus.fail(errorDetails));
  }
}

export function* watchCreateCandidate(): SagaIterator {
  yield* takeLatest(getType(createCandidateProfile.request), createCandidateProfileSaga);
  yield* takeLatest(
    getType(createCandidateProfessionalDetails.request),
    createCandidateProfessionalDetailsSaga,
  );
  yield* takeLatest(getType(uploadCandidateCV.request), uploadCandidateCVSaga);
  yield* takeLatest(getType(uploadCandidateLicenses.request), uploadCandidateLicensesSaga);
  yield* takeLatest(getType(uploadCandidatePhoto.request), uploadCandidatePhotoSaga);
  yield* takeLatest(getType(getCandidateDataForEdit.request), getCandidateDataForEditSaga);
  yield* takeLatest(
    getType(updateCandidateLookingForJobStatus.request),
    getUpdateCandidateLookingForJobStatusSaga,
  );
  yield* takeLatest(getType(skipLicensesUpload), skipLicensesUploadSaga);
  yield* takeLatest(getType(skipPhotoUpload), skipPhotoUploadSaga);
  yield* takeLatest(getType(skipCvUpload), skipCvUploadSaga);
  yield* takeLatest(getType(deleteCandidatePhoto.request), deleteCandidatePhotoSaga);
  yield* takeLatest(getType(getPrefillData.request), getPrefillDataSaga);
  yield* takeLatest(getType(getInterviewQuestions.request), getInterviewQuestionsSaga);
  yield* takeLatest(getType(uploadVideoInterview.request), uploadVideoInterviewSaga);
  yield* takeLatest(getType(deleteVideoInterview.request), deleteVideoInterviewSaga);
  yield* takeLatest(getType(getCandidateStatus.request), getCandidateStatusSaga);
  yield* takeLatest(getType(uploadCandidateBrandedCV.request), uploadCandidateBrandedCVSaga);
  yield* takeLatest(getType(uploadCandidateDocuments.request), uploadCandidateDocumentsSaga);
}
