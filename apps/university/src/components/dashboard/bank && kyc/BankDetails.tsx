import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/select';
import { BankFormData, bankSchema } from '../../../lib/validation';
import { classNameInput } from './PancardForm';
import { TBank } from '../../../lib/types/entities';
import { useMutation } from '@tanstack/react-query';
import { upsertBankDetailsApi } from '../../../lib/apiClient';
import useAuthStore from '../../../store/useAuth';
import useAlert from '../../../hooks/useAlert';
import { useRef, useState } from 'react';
import AlertBanner from '../../AlertBanner';
import { useSRKFileUpload } from '@srk/shared/hooks';

const accountTypes = [
  { label: 'Savings Account', value: 'savings' },
  { label: 'Current Account', value: 'current' },
  { label: 'Salary Account', value: 'salary' },
];

// const documentTypes = [
//   { label: "Bank Statement", value: "statement" },
//   { label: "Cancelled Cheque", value: "cheque" },
//   { label: "Passbook", value: "passbook" },
// ];

const relationTypes = [
  { label: 'Self', value: 'self' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Parent', value: 'parent' },
  { label: 'Child', value: 'child' },
];

interface BankDetailsFormProps {
  bankDetails?: TBank;
  handleRefetch: () => void;
}
export default function BankDetailsForm({
  bankDetails,
  handleRefetch,
}: BankDetailsFormProps) {
  const { userDetails } = useAuthStore();
  const { uploadFile } = useSRKFileUpload('university');
  const { show } = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankFormData>({
    defaultValues: {
      accountNumber: bankDetails?.accountNumber || '',
      holderName: bankDetails?.accountHolderName || '',
      ifscCode: bankDetails?.ifscCode || '',
      accountType: bankDetails?.accountType || '',
      bankName: bankDetails?.bankName || '',
      branchName: bankDetails?.branchName || '',
      confirmAccountNumber: bankDetails?.accountNumber || '',
      relation: bankDetails?.relationWithAccount || '',
      qrUrl: bankDetails?.qrUrl || '',
    },
    resolver: zodResolver(bankSchema),
  });

  const userId = userDetails?._id;

  const { mutate: mutateBankDetails } = useMutation({
    mutationFn: async (data: BankFormData) => {
      if (!userId) return;
      await upsertBankDetailsApi(userId, {
        accountHolderName: data.holderName,
        accountNumber: data.accountNumber,
        accountType: data.accountType,
        bankName: data.bankName,
        branchName: data.branchName,
        ifscCode: data.ifscCode,
        relationWithAccount: data.relation,
        qrUrl: data.qrUrl || '',
      });
    },
    onSuccess: () => {
      handleRefetch();
      show('Bank details updated successfully', 'success');
    },
    onError: () => {
      handleRefetch();
      show('Failed to update bank details', 'error');
    },
  });

  const onSubmit = async (data: BankFormData) => {
    let qrUrl = bankDetails?.qrUrl;

    if (qrImage) {
      const { url } = await uploadFile(qrImage, 'image');
      qrUrl = url;
    }

    if (!qrUrl) {
      show('Please upload qr code', 'error');
      return;
    }

    mutateBankDetails({
      accountNumber: data.accountNumber,
      holderName: data.holderName,
      ifscCode: data.ifscCode,
      accountType: data.accountType,
      bankName: data.bankName,
      branchName: data.branchName,
      confirmAccountNumber: data.confirmAccountNumber,
      qrUrl,
      relation: data.relation,
    });
  };
  const frontInputRef = useRef<HTMLInputElement>(null);
  const [qrImage, setQrImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrImage(file);
    }
  };

  const shouldDisableInput = bankDetails?.status === 'approved';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {bankDetails?.status === 'rejected' ? (
        <AlertBanner
          type="danger"
          message={`Rejection Reason : ${bankDetails?.rejectionReason}`}
        />
      ) : null}
      {bankDetails?.status === 'pending' ? (
        <AlertBanner
          type="warning"
          message="Your bank details are under review"
        />
      ) : null}
      {bankDetails?.status === 'approved' ? (
        <AlertBanner type="success" message="Your bank details are approved" />
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            classNames={classNameInput}
            label="Account Holder Name"
            placeholder="Name"
            {...register('holderName')}
            errorMessage={errors.holderName?.message}
            isInvalid={!!errors.holderName}
            disabled={shouldDisableInput}
          />
        </div>

        <div>
          <Input
            classNames={classNameInput}
            label="Account Number"
            placeholder="Account Number"
            {...register('accountNumber')}
            errorMessage={errors.accountNumber?.message}
            isInvalid={!!errors.accountNumber}
            disabled={shouldDisableInput}
          />
        </div>

        <div>
          <Input
            classNames={classNameInput}
            label="Confirm Account Number"
            placeholder="Confirm account Number"
            {...register('confirmAccountNumber')}
            errorMessage={errors.confirmAccountNumber?.message}
            disabled={shouldDisableInput}
            isInvalid={!!errors.confirmAccountNumber}
          />
        </div>

        <div>
          <Input
            classNames={classNameInput}
            label="IFSC Code (Optional)"
            placeholder="Ifsc Code"
            {...register('ifscCode')}
            errorMessage={errors.ifscCode?.message}
            isInvalid={!!errors.ifscCode}
            disabled={shouldDisableInput}
          />
        </div>

        <div>
          <Input
            label="Full Bank Name"
            placeholder="Bank Name"
            {...register('bankName')}
            errorMessage={errors.bankName?.message}
            isInvalid={!!errors.bankName}
            classNames={classNameInput}
            disabled={shouldDisableInput}
          />
        </div>

        <div>
          <Input
            label="Bank Branch Name"
            placeholder="Branch Name"
            {...register('branchName')}
            errorMessage={errors.branchName?.message}
            isInvalid={!!errors.branchName}
            classNames={classNameInput}
            disabled={shouldDisableInput}
          />
        </div>

        <div>
          <Select
            label="Account Type"
            classNames={{
              label: 'text-white',
              trigger: 'bg-bgSecondary text-white border-gray-600',
              popoverContent: 'bg-bgSecondary text-white',
            }}
            placeholder="Select account type"
            {...register('accountType')}
            errorMessage={errors.accountType?.message}
            isInvalid={!!errors.accountType}
            aria-disabled={shouldDisableInput}
            disabled={shouldDisableInput}
          >
            {accountTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* <div>
          <Select
            label="Account KYC Document"
            placeholder="Select document type"
            {...register("kycDocument")}
            errorMessage={errors.kycDocument?.message}
            isInvalid={!!errors.kycDocument}
            classNames={{
              label: "text-white",
              trigger: "bg-bgSecondary text-white border-gray-600",
              popoverContent: "bg-bgSecondary text-white",
            }}
          >
            {documentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div> */}

        <div>
          <Select
            label="Relation With Account"
            placeholder="Relation with account"
            {...register('relation')}
            aria-disabled={shouldDisableInput}
            errorMessage={errors.relation?.message}
            disabled={shouldDisableInput}
            isInvalid={!!errors.relation}
            classNames={{
              label: 'text-white',
              trigger: 'bg-bgSecondary text-white border-gray-600',
              popoverContent: 'bg-bgSecondary text-white',
            }}
          >
            {relationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div
          className="aspect-video bg-default-100 border w-full md:w-1/2 lg:w-1/2 sm:w-1/2 h-full border-dashed border-white rounded-lg overflow-hidden cursor-pointer hover:bg-default-200 transition-colors"
          onClick={() => frontInputRef.current?.click()}
        >
          {qrImage || bankDetails?.qrUrl ? (
            <img
              src={qrImage ? URL.createObjectURL(qrImage) : bankDetails?.qrUrl}
              alt="Document Front Side"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-default-500 bg-bgSecondary">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="mt-2">Click to upload bank Qr </p>
            </div>
          )}
        </div>
        <p className="text-start font-medium text-textPrimary">Bank QR</p>
        <input
          ref={frontInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          name="front"
          className="hidden"
          disabled={shouldDisableInput}
        />
      </div>

      {!shouldDisableInput && (
        <div className="flex justify-start">
          <Button type="submit" color="primary" className="w-fit" size="lg">
            Save Details
          </Button>
        </div>
      )}
    </form>
  );
}
