import { yupResolver } from '@hookform/resolvers/yup';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { ContactType, PermissionType } from '~/models/common';
import { addContactCompany, toggleSuccessModalVisibility } from '~/modules/adminContacts/actions';
import { addContactCandidate } from '~/modules/adminContacts/actions';
import {
  citiesAsSelectOptionsSelector,
  hiringManagerJobPositionsAsSelectOptionsSelector,
  hiringManagerProjectTypesAsSelectOptionsSelector,
  statesAsSelectOptionsSelector,
} from '~/modules/common/selectors';
import { getCompanies } from '~/modules/companies/actions';
import { companiesAsSelectOptionsSelector } from '~/modules/companies/selectors';
import { Admin } from '~/services/api/Admin';
import { useDispatch, useSelector } from '~/store';
import {
  CreateNewContactCandidateFormValues,
  CreateNewContactCompanyFormValues,
} from '~/types/formValues';
import { iterateOverErrorDetailsEachKey } from '~/utils/errors';
import { CommonRouter } from '~/utils/router';
import {
  NewContactCandidateFormValidation,
  NewContactCompanyFormValidation,
} from '~/utils/validations';
import { Button } from '~/view/components/button';
import { Input } from '~/view/components/input';
import { CenterModal } from '~/view/components/modals';
import { RadioButton } from '~/view/components/radio-button';
import { Select, SelectOption } from '~/view/components/select';
import { SuccessModal } from '~/view/components/success-modal';

import styles from './styles.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const NewContactModal: React.FC<Props> = memo(function NewContactModal({
  visible,
  onClose,
}) {
  const [radioValue, setRadioValue] = useState('company');
  const companiesAsSelectOptions = useSelector(companiesAsSelectOptionsSelector);
  const creatingContactCompanyErrors = useSelector(
    state => state.adminContacts.addContactCompanyErrors,
  );
  const creatingContactCandidateErrors = useSelector(
    state => state.adminContacts.addContactCandidateErrors,
  );
  const { successModalVisibility, addingContactCompany, addingContactCandidates } = useSelector(
    state => state.adminContacts,
  );
  const citiesAsSelectOptions = useSelector(citiesAsSelectOptionsSelector);
  const statesAsSelectOptions = useSelector(statesAsSelectOptionsSelector);
  const positions = useSelector(hiringManagerJobPositionsAsSelectOptionsSelector);
  const projectTypes = useSelector(hiringManagerProjectTypesAsSelectOptionsSelector);
  const { companies } = useSelector(state => state.companies);

  const dispatch = useDispatch();
  const history = useHistory();

  const { control, handleSubmit, setValue, setError, reset, watch } =
    useForm<CreateNewContactCompanyFormValues>({
      defaultValues: {
        firstName: '',
        lastName: '',
        position: null,
        project: null,
        state: null,
        city: null,
        email: '',
        phone: '',
        company: null,
        permission: PermissionType.Both,
      },
      resolver: yupResolver(NewContactCompanyFormValidation),
    });

  const selectedCity = watch('city');
  const selectedPermissionType = watch('permission');

  useEffect(() => {
    if (selectedCity === null) {
      setValue('state', null);
    } else {
      const stateOfSelectedCity = statesAsSelectOptions.find(
        state => state.value === selectedCity.meta?.stateId,
      );

      setValue('state', stateOfSelectedCity || null, { shouldValidate: true });
    }
  }, [selectedCity, setValue, statesAsSelectOptions]);

  const {
    control: candidatesControl,
    handleSubmit: handleCandidatesSubmit,
    setError: setCandidatesError,
    reset: resetFields,
  } = useForm<CreateNewContactCandidateFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      admin: null,
    },
    resolver: yupResolver(NewContactCandidateFormValidation),
  });

  const loadAdmins = useCallback(async (value): Promise<SelectOption[]> => {
    const {
      data: { data },
    } = await Admin.getAllAdmins({
      offset: 0,
      limit: 10,
      search: value,
    });

    const admins = data.results.map(admin => ({
      value: admin.id,
      label: `${admin.firstName} ${admin.lastName}`,
    }));

    return admins;
  }, []);

  const handleContactTypeChange = useCallback(
    (contactType: ContactType) => {
      if (contactType !== radioValue) {
        setRadioValue(contactType);
      }
    },
    [radioValue],
  );

  useEffect(() => {
    if (companies.length === 0) {
      dispatch(getCompanies.request());
    }
  }, [dispatch, companies]);

  useEffect(() => {
    if (creatingContactCompanyErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateNewContactCompanyFormValues>>(
        creatingContactCompanyErrors,
        (key, value) => {
          setError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [creatingContactCompanyErrors, setError]);

  useEffect(() => {
    if (creatingContactCandidateErrors) {
      iterateOverErrorDetailsEachKey<FieldPath<CreateNewContactCandidateFormValues>>(
        creatingContactCandidateErrors,
        (key, value) => {
          setCandidatesError(key, { type: 'validate', message: value });
        },
      );
    }
  }, [creatingContactCandidateErrors, setCandidatesError]);

  const onCompaniesSubmit = useCallback(
    (values: CreateNewContactCompanyFormValues) => {
      setValue('company', values?.company.value, { shouldDirty: true });
      dispatch(
        addContactCompany.request({
          formValues: { ...values, company: values?.company.value },
          onSuccess: () => {
            onClose();
            reset();
            dispatch(toggleSuccessModalVisibility());
          },
        }),
      );
    },
    [dispatch, setValue, onClose, reset],
  );

  const onCandidateSubmit = useCallback(
    (values: CreateNewContactCandidateFormValues) => {
      dispatch(
        addContactCandidate.request({
          formValues: values,
          onSuccess: () => {
            onClose();
            resetFields();
            dispatch(toggleSuccessModalVisibility());
          },
        }),
      );
    },
    [dispatch, onClose, resetFields],
  );

  const navigateToCreateCompany = useCallback(() => {
    history.push(CommonRouter.createEmployer.createEmployerCompanyInfo);
  }, [history]);

  const handleRadioButtonChange = useCallback(
    (type: PermissionType, selectedItem: PermissionType) => {
      if (type !== selectedItem) {
        setValue('permission', type, { shouldDirty: true });
      }
    },
    [setValue],
  );

  return (
    <>
      <CenterModal
        title="New contact"
        className={styles['modal-contact']}
        visible={visible}
        onClose={onClose}
      >
        <div className={styles['modal-contact__body']}>
          <div className={styles['modal-contact__body-header']}>
            <p>
              Add your client contact details and choose a company or candidate they work for or
              create a new contact
            </p>
          </div>
          <p className={styles['modal-contact__body-type']}>Contact type</p>
          <div className={styles['modal-contact__body-radio']}>
            <div
              className={styles['modal-contact__body-radio--company']}
              onClick={() => handleContactTypeChange(ContactType.COMPANY)}
            >
              <RadioButton checked={radioValue === ContactType.COMPANY} />
              <p>Hiring manager</p>
            </div>
            <div
              className={styles['modal-contact__body-radio--candidate']}
              onClick={() => handleContactTypeChange(ContactType.CANDIDATE)}
            >
              <RadioButton checked={radioValue === ContactType.CANDIDATE} />
              <p>Candidate</p>
            </div>
          </div>
          <div className={styles['modal-contact__body-form']}>
            {radioValue === ContactType.COMPANY ? (
              <>
                <Select
                  searchable
                  name="company"
                  label="Company"
                  placeholder="Select"
                  options={companiesAsSelectOptions}
                  control={control}
                />
                <div
                  className={styles['modal-contact__body-form-link']}
                  onClick={navigateToCreateCompany}
                >
                  <p> Create a new company</p>{' '}
                  <span>if you don’t have added that company to the platform before</span>
                </div>
                <Input
                  name="firstName"
                  label="First name"
                  placeholder="First name"
                  control={control}
                  className={styles['modal-contact__body-form-input']}
                />
                <Input
                  name="lastName"
                  label="Last name"
                  placeholder="Last name"
                  control={control}
                  className={styles['modal-contact__body-form-input']}
                />
                <Select
                  options={positions}
                  placeholder="Select"
                  className={styles['modal-contact__body-form-input']}
                  control={control}
                  label="Business contact position (optional)"
                  name="position"
                />
                <Select
                  options={projectTypes}
                  placeholder="Select"
                  className={styles['modal-contact__body-form-input']}
                  control={control}
                  label="Business contact project type (optional)"
                  name="project"
                />
                <div className={styles['page__field']}>
                  <p className={styles['page__field-label']}>Position type</p>
                  <div className={styles['page__position-types-wrapper']}>
                    <div
                      className={styles['page__position-type']}
                      onClick={() =>
                        handleRadioButtonChange(PermissionType.Both, selectedPermissionType)
                      }
                    >
                      <RadioButton checked={selectedPermissionType === PermissionType.Both} />
                      <p className={styles['page__position-type-label']}>Both</p>
                    </div>
                    <div
                      className={styles['page__position-type']}
                      onClick={() =>
                        handleRadioButtonChange(PermissionType.Permanent, selectedPermissionType)
                      }
                    >
                      <RadioButton checked={selectedPermissionType === PermissionType.Permanent} />
                      <p className={styles['page__position-type-label']}>Permanent</p>
                    </div>
                    <div
                      className={styles['page__position-type']}
                      onClick={() =>
                        handleRadioButtonChange(PermissionType.Temporary, selectedPermissionType)
                      }
                    >
                      <RadioButton checked={selectedPermissionType === PermissionType.Temporary} />
                      <p className={styles['page__position-type-label']}>Temporary</p>
                    </div>
                  </div>
                </div>
                <div className={styles['modal-manager__body-form-input--flex']}>
                  <Select
                    searchable
                    name="city"
                    placeholder="Select"
                    label="City"
                    options={citiesAsSelectOptions}
                    control={control}
                  />
                  <Select
                    disabled
                    name="state"
                    placeholder="Select"
                    label="State/Territory"
                    options={statesAsSelectOptions}
                    control={control}
                  />
                </div>
                <div className={styles['modal-contact__body-form-last']}>
                  <Input
                    name="email"
                    label="Business contact email"
                    placeholder="Email"
                    className={styles['modal-contact__body-form-input']}
                    control={control}
                  />
                  <Input
                    type="tel"
                    name="phone"
                    label="Phone number (optional)"
                    placeholder="+"
                    mask="+"
                    className={styles['modal-contact__body-form-input']}
                    control={control}
                  />
                </div>
                <Button
                  variant="accent"
                  title="Add"
                  className={styles['modal-contact__body-form-button']}
                  onClick={handleSubmit(onCompaniesSubmit)}
                  loading={addingContactCompany}
                />
              </>
            ) : (
              <>
                <Input
                  name="firstName"
                  label="Candidate first name"
                  placeholder=""
                  control={candidatesControl}
                />
                <Input
                  name="lastName"
                  label="Candidate last name"
                  placeholder=""
                  control={candidatesControl}
                  className={styles['modal-contact__body-form-input']}
                />
                <div>
                  <Input
                    name="email"
                    label="Email"
                    placeholder=""
                    control={candidatesControl}
                    className={styles['modal-contact__body-form-input']}
                  />
                  <Select
                    searchable
                    label="Assign admin"
                    control={candidatesControl}
                    placeholder="Select"
                    name="admin"
                    options={[]}
                    loadOptions={value => loadAdmins(value)}
                    async
                    className={styles['modal-contact__body-form-input']}
                  />
                  <Input
                    type="tel"
                    name="phone"
                    label="Phone number (optional)"
                    placeholder="+"
                    mask="+"
                    className={styles['modal-contact__body-form-input']}
                    control={candidatesControl}
                  />
                </div>
                <Button
                  variant="accent"
                  title="Add"
                  className={styles['modal-contact__body-form-button']}
                  onClick={handleCandidatesSubmit(onCandidateSubmit)}
                  loading={addingContactCandidates}
                />
              </>
            )}
          </div>
        </div>
      </CenterModal>
      <SuccessModal
        visible={successModalVisibility}
        onClose={() => dispatch(toggleSuccessModalVisibility())}
        title="The contact successfully added"
      />
    </>
  );
});
