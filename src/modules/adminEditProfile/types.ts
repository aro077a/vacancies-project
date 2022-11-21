import { AdminProfileProps } from '~/models/admin';
import {
  ErrorResponse,
  GetAdminPaymentResponse,
  GetInterviewQuestionsResponse,
} from '~/types/responses';

export type AdminProfileState = {
  getAdminProfileLoading: boolean;
  profileEditingLoading: boolean;
  profileDetailsEditErrors: ErrorResponse['detail'] | null;
  paymentDetailsEditErrors: ErrorResponse['detail'] | null;
  termsAndConditionsEditErrors: ErrorResponse['detail'] | null;
  interviewQuestionsEditErrors: ErrorResponse['detail'] | null;
  editPasswordErrors: ErrorResponse['detail'] | null;
  adminId: number;
  user: AdminProfileProps | null;
  phone: string;
  paymentDetails: GetAdminPaymentResponse['data'] | null;
  gettingPaymentDetailsLoading: boolean;
  editingPaymentDetailsLoading: boolean;
  gettingTermsAndConditionsLoading: boolean;
  editingTermsAndConditionsLoading: boolean;
  gettingInterviewQuestionsLoading: boolean;
  editingInterviewQuestionsLoading: boolean;
  text: string;
  interviewQuestions: GetInterviewQuestionsResponse['data'] | null;
  editingPasswordLoading: boolean;
};
