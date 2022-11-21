import { format } from 'date-fns';
import { ActionType, getType } from 'deox';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'typed-redux-saga';

import { Candidate } from '~/services/api/Candidate';
import { RootState } from '~/store/types';
import { CreateCandidateProfileRequestBody } from '~/types/requests';
import { getErrorDetailsFromResponse } from '~/utils/errors';
import { dateOrString } from '~/utils/helpers';
import { transformSalaryFromStringToNumber } from '~/utils/strings';
import { SelectOption } from '~/view/components/select';

import {
  createProfessionalDetails,
  createProfile,
  uploadCV,
  uploadLicenses,
  uploadPhoto,
} from './actions';

function* createProfileSaga({ payload }: ActionType<typeof createProfile.request>): SagaIterator {
  try {
    const requestBody: CreateCandidateProfileRequestBody = {
      ...payload,
      user: { email: payload.user.email, password: payload.user.password },
      city: payload.city!.value,
      state: payload.state!.value,
      linkedInResume: payload.linkedInResume || '',
      admin: payload.admin?.value,
    };

    if (!payload.linkedInResume) {
      delete requestBody.linkedInResume;
    }

    const { data } = yield* call(Candidate.createProfile, requestBody);

    yield* put(createProfile.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createProfile.fail(errorDetails));
  }
}

function* createProfessionalDetailsSaga({
  payload,
}: ActionType<typeof createProfessionalDetails.request>): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.candidateRegistration.registeredUserId,
    );
    const { formValues } = payload;

    const { data } = yield* call(Candidate.createProfessionalDetails, candidateId!, {
      ...formValues,
      jobTitle: formValues.jobTitle!.value,
      jobPositions: formValues.jobPositions.map(jobPosition => jobPosition.value),
      projectTypes: formValues.projectTypes.map(projectType => projectType.value),
      projectValues: formValues?.projectValues?.value,
      interestedCompanies: formValues.interestedCompanies.length
        ? formValues.interestedCompanies.map(interestedCompany => interestedCompany.value)
        : undefined,
      notInterestedCompanies: formValues.notInterestedCompanies.length
        ? formValues.notInterestedCompanies.map(notInterestedCompany => notInterestedCompany.value)
        : undefined,
      availability: formValues?.availability?.value,
      minSalary: transformSalaryFromStringToNumber(formValues.minSalary),
      workExps: formValues.workExps.map(workExp => ({
        ...workExp,
        location: (workExp.location! as SelectOption)?.value,
        country: (workExp.country as SelectOption)?.value,
        workStart: dateOrString(workExp.workStart!),
        workEnd: dateOrString(workExp.workEnd!),
        logo: workExp.logo || '',
        id: undefined,
      })),
      keyProjects: formValues.keyProjects.map(keyProject => ({
        ...keyProject,
        location: (keyProject.location! as SelectOption)?.value,
        workStart: dateOrString(keyProject.workStart!),
        workEnd: dateOrString(keyProject.workEnd!),
        value: (keyProject.value as SelectOption)?.value,
        id: undefined,
      })),
    });
    yield* put(createProfessionalDetails.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(createProfessionalDetails.fail(errorDetails));
  }
}

function* uploadCVSaga({ payload }: ActionType<typeof uploadCV.request>): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.candidateRegistration.registeredUserId,
    );

    const { data } = yield* call(Candidate.uploadCV, candidateId!, payload);

    yield* put(uploadCV.success(data));
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(uploadCV.fail(errorDetails));
  }
}

function* uploadLicensesSaga({ payload }: ActionType<typeof uploadLicenses.request>): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.candidateRegistration.registeredUserId,
    );

    const { formValues } = payload;
    const formattedArray = formValues?.map(item => ({
      ...item,
      expirationDate:
        (typeof item.expirationDate !== 'string' &&
          item.expirationDate &&
          format(item.expirationDate, 'yyyy-MM-dd')) ||
        format(new Date(), 'yyyy-MM-dd'),
    }));

    yield* call(Candidate.uploadLicenses, candidateId!, { files: formattedArray });

    yield* put(uploadLicenses.success());
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(uploadLicenses.fail(errorDetails));
  }
}

function* uploadPhotoSaga({ payload }: ActionType<typeof uploadPhoto.request>): SagaIterator {
  try {
    const candidateId = yield* select(
      (state: RootState) => state.candidateRegistration.registeredUserId,
    );

    const { data } = yield* call(Candidate.uploadPhoto, candidateId!, payload.formValues);

    yield* put(uploadPhoto.success(data));

    payload.onSuccess();
  } catch (error) {
    const errorDetails = getErrorDetailsFromResponse(error);

    yield* put(uploadPhoto.fail(errorDetails));
  }
}

export function* watchCandidateRegistration(): SagaIterator {
  yield* takeLatest(getType(createProfile.request), createProfileSaga);
  yield* takeLatest(getType(createProfessionalDetails.request), createProfessionalDetailsSaga);
  yield* takeLatest(getType(uploadCV.request), uploadCVSaga);
  yield* takeLatest(getType(uploadLicenses.request), uploadLicensesSaga);
  yield* takeLatest(getType(uploadPhoto.request), uploadPhotoSaga);
}
