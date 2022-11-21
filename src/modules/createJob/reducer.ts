import { createReducer } from 'deox';
import produce from 'immer';

import { transformSalaryFromStringToNumber } from '~/utils/strings';

import {
  addHiringManager,
  createDescription,
  createJobInfo,
  deleteJob,
  getHiringManagers,
  getJobDataForEdit,
  getRepresentativeManager,
  resetEditing,
  resetErrors,
  saveJobInfo,
  setDescriptionForEdit,
  setHiringManagerForEdit,
  setHiringManagerForJob,
  setInfoForEdit,
  toggleDeleteJobModalVisibility,
  updateHiringManager,
  updateJobInfo,
} from './actions';
import { CreateJobState } from './types';

const initialState: CreateJobState = {
  creatingJobInfo: false,
  creatingJobInfoErrors: null,
  createdJobInfo: null,
  creatingHiringManager: false,
  creatingHiringManagerErrors: null,
  createdHiringManager: null,
  creatingDescription: false,
  createdDescription: null,
  loadingJobDataForEdit: false,
  editMode: false,
  deleteModalVisible: false,
  deletingJob: false,
  loadingHiringManagers: false,
  jobHiringManagers: [],
  addedHiringManager: null,
  addingHiringManager: false,
  settingHiringManager: false,
  saveCreatedJobInfo: null,
  savedCompanyId: 0,
  updatingJobInfo: false,
  representativeManager: null,
  loadingRepresentativeManager: false,
};

export const createJobReducer = createReducer(initialState, handle => [
  handle(createJobInfo.request, state =>
    produce(state, draft => {
      draft.creatingJobInfo = true;
    }),
  ),
  handle(createJobInfo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingJobInfo = false;
      draft.createdJobInfo = payload.data;
    }),
  ),
  handle(createJobInfo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingJobInfo = false;
      draft.creatingJobInfoErrors = payload;
    }),
  ),
  handle(updateJobInfo.request, state =>
    produce(state, draft => {
      draft.updatingJobInfo = true;
    }),
  ),
  handle(updateJobInfo.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingJobInfo = false;
      draft.createdJobInfo = payload.data;
    }),
  ),
  handle(updateJobInfo.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingJobInfo = false;
      draft.creatingJobInfoErrors = payload;
    }),
  ),

  handle(createDescription.request, state =>
    produce(state, draft => {
      draft.creatingDescription = true;
    }),
  ),
  handle(createDescription.success, (state, { payload }) =>
    produce(state, draft => {
      if (draft.editMode) {
        draft.creatingDescription = false;
        draft.createdDescription = payload.data;
      } else {
        Object.assign(draft, initialState);
      }
    }),
  ),
  handle(createDescription.fail, state =>
    produce(state, draft => {
      draft.creatingDescription = false;
    }),
  ),
  handle(getJobDataForEdit.request, state =>
    produce(state, draft => {
      draft.editMode = true;
      draft.loadingJobDataForEdit = true;
    }),
  ),
  handle(getJobDataForEdit.success, state =>
    produce(state, draft => {
      draft.loadingJobDataForEdit = false;
    }),
  ),
  handle(getJobDataForEdit.fail, state =>
    produce(state, draft => {
      draft.loadingJobDataForEdit = false;
    }),
  ),
  handle(setInfoForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.createdJobInfo = payload.data;
      draft.savedCompanyId = payload.data.company;
    }),
  ),
  handle(setHiringManagerForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.jobHiringManagers = draft.jobHiringManagers.concat(payload.data);
    }),
  ),
  handle(setDescriptionForEdit, (state, { payload }) =>
    produce(state, draft => {
      draft.createdDescription = payload.data;
    }),
  ),
  handle(toggleDeleteJobModalVisibility, state =>
    produce(state, draft => {
      draft.deleteModalVisible = !draft.deleteModalVisible;
    }),
  ),
  handle(deleteJob.request, state =>
    produce(state, draft => {
      draft.deletingJob = true;
    }),
  ),
  handle(deleteJob.success, state =>
    produce(state, draft => {
      draft.deletingJob = false;
    }),
  ),
  handle(deleteJob.fail, state =>
    produce(state, draft => {
      draft.deletingJob = false;
    }),
  ),
  handle(resetEditing, state =>
    produce(state, draft => {
      Object.assign(draft, initialState);
    }),
  ),
  handle(resetErrors, state =>
    produce(state, draft => {
      draft.creatingJobInfoErrors = null;
      draft.creatingHiringManagerErrors = null;
    }),
  ),
  handle(getHiringManagers.request, state =>
    produce(state, draft => {
      draft.loadingHiringManagers = true;
    }),
  ),
  handle(getHiringManagers.success, (state, { payload }) =>
    produce(state, draft => {
      draft.jobHiringManagers = payload.data;
      draft.loadingHiringManagers = false;
    }),
  ),
  handle(getHiringManagers.fail, state =>
    produce(state, draft => {
      draft.loadingHiringManagers = false;
    }),
  ),
  handle(addHiringManager.request, state =>
    produce(state, draft => {
      draft.addingHiringManager = true;
    }),
  ),
  handle(addHiringManager.success, (state, { payload }) =>
    produce(state, draft => {
      draft.addedHiringManager = payload.data;
      draft.jobHiringManagers = [...draft.jobHiringManagers, payload.data];
      draft.addingHiringManager = false;
    }),
  ),
  handle(addHiringManager.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.creatingHiringManagerErrors = payload;
      draft.addingHiringManager = false;
    }),
  ),
  handle(setHiringManagerForJob.request, state =>
    produce(state, draft => {
      draft.settingHiringManager = true;
    }),
  ),
  handle(setHiringManagerForJob.success, state =>
    produce(state, draft => {
      draft.settingHiringManager = false;
    }),
  ),
  handle(setHiringManagerForJob.fail, state =>
    produce(state, draft => {
      draft.settingHiringManager = false;
    }),
  ),
  handle(saveJobInfo, (state, { payload }) =>
    produce(state, draft => {
      draft.saveCreatedJobInfo = {
        ...payload,
        salary: transformSalaryFromStringToNumber(payload.formValues?.salary),
      };
      draft.savedCompanyId = payload.formValues.company?.value;
    }),
  ),
  handle(updateHiringManager.request, state =>
    produce(state, draft => {
      draft.updatingJobInfo = true;
    }),
  ),
  handle(updateHiringManager.success, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingJobInfo = false;
      draft.createdJobInfo = payload.data;
    }),
  ),
  handle(updateHiringManager.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.updatingJobInfo = false;
      draft.creatingJobInfoErrors = payload;
    }),
  ),
  handle(getRepresentativeManager.request, state =>
    produce(state, draft => {
      draft.loadingRepresentativeManager = true;
    }),
  ),
  handle(getRepresentativeManager.success, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingRepresentativeManager = false;
      draft.representativeManager = payload.data;
    }),
  ),
  handle(getRepresentativeManager.fail, (state, { payload }) =>
    produce(state, draft => {
      draft.loadingRepresentativeManager = false;
      draft.creatingJobInfoErrors = payload;
    }),
  ),
]);
