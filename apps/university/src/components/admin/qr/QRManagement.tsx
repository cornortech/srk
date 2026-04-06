import { useState, useEffect } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Button,
  Input,
  Card,
  CardBody,
  Progress,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { PrimaryButton } from '../../ReusableComponents';
import { useSRKFileUpload } from '@srk/shared/hooks';
import { PaymentQRType } from '@srk/shared/contracts';
import {
  getAllQRCodesApi,
  createQRCodeApi,
  updateQRCodeApi,
  deleteQRCodeApi,
  TQRCode,
} from '../../../lib/apiClient';

export const QRManagement = () => {
  const { isOpen, onOpen, onClose: onDisclosureClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { uploadFile, isUploading } = useSRKFileUpload('university');
  const [qrCodes, setQrCodes] = useState<TQRCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<TQRCode>({
    name: '',
    qr: '',
    isAvailable: true,
    type: PaymentQRType.SRK_INDUSTRIES,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle modal close
  const handleModalClose = () => {
    resetForm();
    onDisclosureClose();
  };

  // Fetch QR codes on component mount
  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      setFetching(true);
      const response = await getAllQRCodesApi();
      if (response.success && response.data) {
        setQrCodes(response.data);
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      alert('Failed to load QR codes');
    } finally {
      setFetching(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload file to Firebase and get URL
  const uploadQRImageToFirebase = async (file: File): Promise<string> => {
    try {
      const result = await uploadFile(file, 'image', (progress) => {
        setUploadProgress(progress);
      });
      return result.url;
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Please enter QR code name');
      return;
    }

    // Check if we need to upload a new image
    if (!currentFile && !formData.qr) {
      alert('Please select a QR code image');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      let qrUrl = formData.qr; // Use existing URL if updating without changing image

      // Upload to Firebase only if there's a new file
      if (currentFile) {
        qrUrl = await uploadQRImageToFirebase(currentFile);
      }

      if (editingId) {
        // Update existing QR code
        const response = await updateQRCodeApi(editingId, {
          name: formData.name,
          qr: qrUrl,
          isAvailable: formData.isAvailable,
          type: formData.type,
        });
        if (response.success) {
          setQrCodes(prev =>
            prev.map(item =>
              item._id === editingId ? response.data : item
            )
          );
          resetForm();
          onDisclosureClose();
          alert('QR code updated successfully');
        }
      } else {
        // Create new QR code
        const response = await createQRCodeApi({
          name: formData.name,
          qr: qrUrl,
          type: formData.type,
        });
        if (response.success) {
          setQrCodes(prev => [response.data, ...prev]);
          resetForm();
          onDisclosureClose();
          alert('QR code created successfully');
        }
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert('Failed to save QR code');
    } finally {
      setLoading(false);
      setUploadProgress(0);
      setCurrentFile(null);
    }
  };

  // Handle delete
  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    setDeletingId(id);
    onDeleteModalOpen();
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const response = await deleteQRCodeApi(deletingId);
      if (response.success) {
        setQrCodes(prev => prev.filter(item => item._id !== deletingId));
        alert('QR code deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      alert('Failed to delete QR code');
    } finally {
      setDeletingId(null);
      onDeleteModalClose();
    }
  };

  // Handle toggle availability
  const handleToggleAvailability = async (id: string | undefined) => {
    if (!id) return;
    try {
      const qrCode = qrCodes.find(item => item._id === id);
      if (!qrCode) return;

      const response = await updateQRCodeApi(id, {
        isAvailable: !qrCode.isAvailable,
        name: qrCode.name,
        qr: qrCode.qr,
        type: qrCode.type,
      });
      if (response.success) {
        setQrCodes(prev =>
          prev.map(item =>
            item._id === id ? response.data : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating QR code availability:', error);
      alert('Failed to update QR code');
    }
  };

  // Handle edit
  const handleEdit = (qr: TQRCode) => {
    setEditingId(qr._id || null);
    setFormData(qr);
    setPreviewImage(qr.qr);
    setCurrentFile(null); // Clear file since we're editing existing image
    onOpen();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      qr: '',
      isAvailable: true,
      type: PaymentQRType.SRK_INDUSTRIES,
    });
    setPreviewImage(null);
    setCurrentFile(null);
    setUploadProgress(0);
    setEditingId(null);
  };

  // Handle add new
  const handleAddNew = () => {
    resetForm();
    onOpen();
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">QR Code Management</h2>
          <p className="text-gray-400">Manage signup QR codes displayed on the frontend</p>
        </div>
        <PrimaryButton onclick={handleAddNew} label="Add New QR" />
      </div>

      {/* QR Codes List */}
      <div className="bg-bgSecondary rounded-lg p-6">
        {fetching ? (
          <Card className="bg-bgSecondary border border-gray-700">
            <CardBody className="flex items-center justify-center py-12">
              <p className="text-gray-400">Loading QR codes...</p>
            </CardBody>
          </Card>
        ) : qrCodes.length === 0 ? (
          <Card className="bg-bgSecondary border border-gray-700">
            <CardBody className="flex items-center justify-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400 text-center">
                No QR codes yet. Add your first QR code to get started.
              </p>
            </CardBody>
          </Card>
        ) : (
          <Table aria-label="QR Codes Table">
            <TableHeader>
              <TableColumn className="bg-gray-800">NAME</TableColumn>
              <TableColumn className="bg-gray-800">QR CODE</TableColumn>
              <TableColumn className="bg-gray-800">AVAILABLE</TableColumn>
              <TableColumn className="bg-gray-800">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {qrCodes.map((qr) => (
                <TableRow key={qr._id} className="bg-bgPrimary hover:bg-gray-800">
                  <TableCell className="text-white font-medium">{qr.name}</TableCell>
                  <TableCell>
                    {qr.qr && (
                      <div className="w-16 h-16 rounded border border-gray-600">
                        <img
                          src={qr.qr}
                          alt={qr.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      isSelected={qr.isAvailable}
                      onChange={() => handleToggleAvailability(qr._id)}
                      color="success"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        className="bg-blue-600 hover:bg-blue-700"
                        onPress={() => handleEdit(qr)}
                      >
                        Edit
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        onPress={() => handleDelete(qr._id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingId ? 'Edit QR Code' : 'Add New QR Code'}
              </ModalHeader>
              <ModalBody className="gap-4 pb-6">
                {/* QR Name Input */}
                <Input
                  label="QR Name"
                  placeholder="e.g., Main Office, Branch 1"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-white"
                  endContent={<span className="text-xs text-gray-400">Required</span>}
                />

                {/* File Upload Area */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white">
                    QR Code Image
                  </label>
                  <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <ImageIcon className="w-10 h-10 mx-auto text-gray-500" />
                      <p className="text-sm text-gray-400">
                        Click or drag QR code image here
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {previewImage && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">Preview</label>
                    <div className="w-40 h-40 rounded border border-gray-600 overflow-hidden">
                      <img
                        src={previewImage}
                        alt="QR Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white font-medium">Uploading...</span>
                      <span className="text-sm text-gray-400">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {/* Payment QR Type Select */}
                <Select
                  label="Payment QR Type"
                  placeholder="Select payment QR type"
                  selectedKeys={formData.type ? [formData.type] : []}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      type: e.target.value as PaymentQRType,
                    }))
                  }
                  className="text-white"
                >
                  {Object.values(PaymentQRType).map((paymentType) => (
                    <SelectItem key={paymentType} value={paymentType}>
                      {paymentType}
                    </SelectItem>
                  ))}
                </Select>

                {/* Is Available Toggle */}
                <div className="flex items-center justify-between py-3 px-3 bg-gray-800 rounded">
                  <span className="text-white font-medium">Available for Signup</span>
                  <Switch
                    isSelected={formData.isAvailable}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData(prev => ({
                        ...prev,
                        isAvailable: e.target.checked,
                      }))
                    }
                    color="success"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleModalClose}
                    className="flex-1"
                    isDisabled={loading || isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-white font-medium"
                    onPress={handleSubmit}
                    isLoading={loading || isUploading}
                    isDisabled={loading || isUploading}
                  >
                    {isUploading ? 'Uploading...' : editingId ? 'Update QR Code' : 'Add QR Code'}
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} size="sm">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Delete
              </ModalHeader>
              <ModalBody className="py-6">
                <p className="text-white">
                  Are you sure you want to delete this QR code? This action cannot be undone.
                </p>
              </ModalBody>
              <div className="flex gap-3 p-6 pt-0">
                <Button
                  color="default"
                  variant="light"
                  onPress={onDeleteModalClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="flex-1"
                  onPress={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
