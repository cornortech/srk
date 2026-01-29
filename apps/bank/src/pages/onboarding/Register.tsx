'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Link as NextLink,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuth';
import { bankApi } from '../../utils/api/bank/bank.api';
import { useSRKFileUpload } from '@srk/shared/hooks';

export default function BankRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    childrenNames: [''],
    permanentCountry: 'Nepal',
    permanentProvince: '',
    permanentDistrict: '',
    permanentMunicipality: '',
    permanentWardNo: '',
    permanentStreet: '',
    sameAsPermanent: false,
    currentCountry: 'Nepal',
    currentProvince: '',
    currentDistrict: '',
    currentMunicipality: '',
    currentWardNo: '',
    currentStreet: '',
    idType: '',
    idNumber: '',
    issuedDate: '',
    issuedFrom: '',
    placeOfBirth: '',
    ppSizePhoto: null as File | null,
    nationalIdCard: null as File | null,
    existingPpSizePhoto: '',
    existingNationalIdCard: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { uploadFile } = useSRKFileUpload('bank');
  const { userDetails, srkBank } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        fullName: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email || '',
        phoneNumber: userDetails.phoneNumber || '',
      }));

      // Fetch existing bank details if they might exist
      const fetchExistingDetails = async () => {
        try {
          const response = await bankApi.getBankDetailsByUserId(
            userDetails._id,
          );
          if (response.status === 200 && response.data) {
            const data = response.data;
            setFormData((prev) => ({
              ...prev,
              fatherName: data.familyDetails?.fatherName || '',
              motherName: data.familyDetails?.motherName || '',
              spouseName: data.familyDetails?.spouseName || '',
              childrenNames: data.familyDetails?.childrenNames || [''],
              permanentCountry: data.permanentAddress?.country || 'Nepal',
              permanentProvince: data.permanentAddress?.province || '',
              permanentDistrict: data.permanentAddress?.district || '',
              permanentMunicipality: data.permanentAddress?.municipality || '',
              permanentWardNo: data.permanentAddress?.wardNo || '',
              permanentStreet: data.permanentAddress?.street || '',
              currentCountry: data.currentAddress?.country || 'Nepal',
              currentProvince: data.currentAddress?.province || '',
              currentDistrict: data.currentAddress?.district || '',
              currentMunicipality: data.currentAddress?.municipality || '',
              currentWardNo: data.currentAddress?.wardNo || '',
              currentStreet: data.currentAddress?.street || '',
              idType: data.identificationDetails?.idType || '',
              idNumber: data.identificationDetails?.idNumber || '',
              issuedDate: data.identificationDetails?.issuedDate
                ? new Date(data.identificationDetails.issuedDate)
                    .toISOString()
                    .split('T')[0]
                : '',
              issuedFrom: data.identificationDetails?.issuedFrom || '',
              placeOfBirth: data.identificationDetails?.placeOfBirth || '',
              existingPpSizePhoto: data.documents?.ppSizePhoto || '',
              existingNationalIdCard: data.documents?.nationalIdCard || '',
            }));
          }
        } catch (err) {
          console.log('No existing bank details found or error fetching:', err);
        }
      };

      fetchExistingDetails();
    }
  }, [userDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === 'sameAsPermanent' && checked
          ? {
              currentCountry: prev.permanentCountry,
              currentProvince: prev.permanentProvince,
              currentDistrict: prev.permanentDistrict,
              currentMunicipality: prev.permanentMunicipality,
              currentWardNo: prev.permanentWardNo,
              currentStreet: prev.permanentStreet,
            }
          : {}),
      }));
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.fullName &&
          formData.email &&
          formData.phoneNumber &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword
        );
      case 2:
        return formData.fatherName && formData.motherName;
      case 3:
        return (
          formData.permanentCountry &&
          formData.permanentProvince &&
          formData.permanentDistrict &&
          formData.permanentMunicipality &&
          formData.permanentWardNo &&
          formData.permanentStreet
        );
      case 4:
        if (formData.sameAsPermanent) {
          return true;
        }
        return (
          formData.currentCountry &&
          formData.currentProvince &&
          formData.currentDistrict &&
          formData.currentMunicipality &&
          formData.currentWardNo &&
          formData.currentStreet
        );
      case 5:
        return (
          formData.idType &&
          formData.idNumber &&
          formData.issuedDate &&
          formData.issuedFrom &&
          formData.placeOfBirth
        );
      case 6:
        return (
          (formData.ppSizePhoto || formData.existingPpSizePhoto) &&
          (formData.nationalIdCard || formData.existingNationalIdCard)
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      setError('');
    } else {
      setError('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    let nationIdCardUrl = '';
    let ppSizePhotoUrl = '';

    if (!userDetails) {
      setError('Please login first !');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validateStep(6)) {
      setError('Please complete all required fields');
      return;
    }

    setIsLoading(true);

    try {
      if (formData.ppSizePhoto instanceof File) {
        ppSizePhotoUrl = await (
          await uploadFile(formData.ppSizePhoto, 'image')
        ).url;
      }

      if (formData.nationalIdCard instanceof File) {
        nationIdCardUrl = await (
          await uploadFile(formData.nationalIdCard, 'image')
        ).url;
      }

      const payload = {
        currentAddress: {
          country: formData.currentCountry,
          district: formData.currentDistrict,
          municipality: formData.currentMunicipality,
          province: formData.currentProvince,
          street: formData.currentStreet,
          wardNo: formData.currentWardNo,
        },
        documents: {
          nationalIdCard:
            nationIdCardUrl || formData.existingNationalIdCard || '',
          ppSizePhoto: ppSizePhotoUrl || formData.existingPpSizePhoto || '',
        },
        familyDetails: {
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          childrenNames: formData.childrenNames,
          spouseName: formData.spouseName,
        },
        identificationDetails: {
          idType: formData.idType,
          idNumber: formData.idNumber,
          issuedDate: formData.issuedDate,
          issuedFrom: formData.issuedFrom,
          placeOfBirth: formData.placeOfBirth,
        },
        permanentAddress: {
          country: formData.permanentCountry,
          district: formData.permanentDistrict,
          municipality: formData.permanentMunicipality,
          province: formData.permanentProvince,
          street: formData.permanentStreet,
          wardNo: formData.permanentWardNo,
        },
        password: formData.password,
      };

      if (userDetails.bankDetailsId || srkBank?.bankDetailsId) {
        await bankApi.updateBankDetailsApi(userDetails._id, payload);
      } else {
        await bankApi.createBankDetailsApi(userDetails._id, payload);
      }

      navigate('/onboarding/otp-verification');
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-5">
            <h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#b68938' }}
            >
              Basic Information
            </h3>
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              isRequired
              disabled
              isReadOnly
              classNames={{
                inputWrapper: 'bg-[#2a2520] border-[#b68938]/40',
                label: 'text-[#b68938]',
              }}
            />
            <Input
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isRequired
              disabled
              isReadOnly
              classNames={{
                inputWrapper: 'bg-[#2a2520] border-[#b68938]/40',
                label: 'text-[#b68938]',
              }}
            />
            <Input
              type="tel"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              isRequired
              disabled
              readOnly
              classNames={{
                inputWrapper: 'bg-[#2a2520] border-[#b68938]/40',
                label: 'text-[#b68938]',
              }}
            />
            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 sm:space-y-5">
            <h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#b68938' }}
            >
              Family Details
            </h3>
            <Input
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Mother's Name"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Spouse's Name"
              name="spouseName"
              value={formData.spouseName}
              onChange={handleChange}
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Textarea
              label="Children Names (comma separated)"
              name="childrenNames"
              value={formData.childrenNames.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  childrenNames: e.target.value.split(','),
                })
              }
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 sm:space-y-5">
            <h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#b68938' }}
            >
              Permanent Address
            </h3>
            <Input
              label="Country"
              name="permanentCountry"
              value={formData.permanentCountry}
              onChange={handleChange}
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Province"
              name="permanentProvince"
              value={formData.permanentProvince}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="District"
              name="permanentDistrict"
              value={formData.permanentDistrict}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Municipality"
              name="permanentMunicipality"
              value={formData.permanentMunicipality}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Ward No"
              name="permanentWardNo"
              value={formData.permanentWardNo}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Textarea
              label="Street"
              name="permanentStreet"
              value={formData.permanentStreet}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 sm:space-y-5">
            <h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#b68938' }}
            >
              Current Address
            </h3>
            <label className="flex items-center gap-3 text-white cursor-pointer">
              <input
                type="checkbox"
                name="sameAsPermanent"
                checked={formData.sameAsPermanent}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-[#b68938]"
              />
              <span className="text-sm sm:text-base">
                Same as permanent address
              </span>
            </label>
            <Input
              label="Country"
              name="currentCountry"
              value={formData.currentCountry}
              onChange={handleChange}
              disabled={formData.sameAsPermanent}
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Province"
              name="currentProvince"
              value={formData.currentProvince}
              onChange={handleChange}
              disabled={formData.sameAsPermanent}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="District"
              name="currentDistrict"
              value={formData.currentDistrict}
              onChange={handleChange}
              disabled={formData.sameAsPermanent}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Municipality"
              name="currentMunicipality"
              value={formData.currentMunicipality}
              onChange={handleChange}
              disabled={formData.sameAsPermanent}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Ward No"
              name="currentWardNo"
              value={formData.currentWardNo}
              onChange={handleChange}
              disabled={formData.sameAsPermanent}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Textarea
              label="Street"
              name="currentStreet"
              value={formData.currentStreet}
              onChange={handleChange}
              disabled={formData.sameAsPermanent}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 sm:space-y-5">
            <h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#b68938' }}
            >
              Identification Details
            </h3>
            <Select
              label="ID Type"
              selectedKeys={formData.idType ? [formData.idType] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFormData((prev) => ({
                  ...prev,
                  idType: selected as string,
                }));
              }}
              classNames={{
                trigger:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
              }}
            >
              <SelectItem key="citizenship">Citizenship</SelectItem>
              <SelectItem key="passport">Passport</SelectItem>
              <SelectItem key="license">Driving License</SelectItem>
            </Select>
            <Input
              label="ID Number"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              type="date"
              label="Issued Date"
              name="issuedDate"
              value={formData.issuedDate}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Issued From"
              name="issuedFrom"
              value={formData.issuedFrom}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              label="Place of Birth"
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4 sm:space-y-5">
            <h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#b68938' }}
            >
              Upload Documents
            </h3>
            <Input
              type="file"
              label="Passport Size Photo"
              name="ppSizePhoto"
              onChange={handleChange}
              accept="image/*"
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
            <Input
              type="file"
              label="National ID Card"
              name="nationalIdCard"
              onChange={handleChange}
              accept="image/*,.pdf"
              isRequired
              classNames={{
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938]',
                label: 'text-[#b68938]',
                input: 'text-white',
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-6 sm:py-8 mt-4">
      <Card className="w-full max-w-2xl bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center gap-3 sm:gap-4 pt-4 sm:pt-6 pb-4 sm:pb-6">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl mb-2 sm:mb-3"
            style={{ background: 'linear-gradient(125deg, #e1ba73, #b68938)' }}
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: '#b68938' }}
          >
            Create Account
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Join SRK Bank today - Step {currentStep} of 6
          </p>

          <div className="flex gap-2 mt-3 sm:mt-4 flex-wrap justify-center">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <span
                key={step}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${step <= currentStep ? 'bg-[#b68938]' : 'bg-gray-600'}`}
              />
            ))}
          </div>
        </CardHeader>

        <CardBody className="px-4 sm:px-6 pb-4 sm:pb-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-950/30 border border-red-800/50 text-red-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base backdrop-blur-sm flex items-start gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {renderStep()}

            <div
              className="mt-6 sm:mt-8 h-px w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, #b68938, transparent)',
                opacity: 0.3,
              }}
            ></div>

            <div className="flex justify-between gap-3 pt-2">
              {currentStep > 1 && (
                <Button
                  variant="bordered"
                  onPress={prevStep}
                  className="h-11 sm:h-12 text-sm sm:text-base font-semibold"
                  style={{ borderColor: '#b68938', color: '#b68938' }}
                >
                  Previous
                </Button>
              )}
              {currentStep < 6 ? (
                <Button
                  onPress={nextStep}
                  className="h-11 sm:h-12 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ml-auto"
                  style={{
                    background: 'linear-gradient(125deg, #e1ba73, #b68938)',
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="h-11 sm:h-12 text-sm sm:text-base text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ml-auto"
                  style={{
                    background: 'linear-gradient(125deg, #e1ba73, #b68938)',
                  }}
                  isLoading={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            <p className="text-gray-400">
              Already have an account?{' '}
              <NextLink
                href="/login"
                className="font-medium transition-colors hover:opacity-80"
                style={{ color: '#b68938' }}
              >
                Sign in
              </NextLink>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
