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
} from '@nextui-org/react';
import { Trash2, Image as ImageIcon } from 'lucide-react';
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

  // Handle type select change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      type: e.target.value as PaymentQRType,
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">QR Code Management</h2>
          <p className="text-gray-400 text-sm">Manage payment QR codes for student enrollment</p>
        </div>
        <Button
          onPress={handleAddNew}
          className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Add New QR
        </Button>
      </div>

      {/* QR Codes List */}
      <div className="bg-bgSecondary rounded-xl p-6 border border-gray-700 shadow-lg">
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
          <Table aria-label="QR Codes Table" className="bg-bgSecondary">
            <TableHeader>
              <TableColumn className="bg-gray-800 text-white font-semibold">NAME</TableColumn>
              <TableColumn className="bg-gray-800 text-white font-semibold">QR CODE</TableColumn>
              <TableColumn className="bg-gray-800 text-white font-semibold">TYPE</TableColumn>
              <TableColumn className="bg-gray-800 text-white font-semibold">AVAILABLE</TableColumn>
              <TableColumn className="bg-gray-800 text-white font-semibold">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {qrCodes.map((qr) => (
                <TableRow key={qr._id} className="border-b border-gray-700 hover:bg-gray-800/50">
                  <TableCell className="text-white font-medium py-4">{qr.name}</TableCell>
                  <TableCell className="py-4">
                    {qr.qr && (
                      <div className="w-16 h-16 rounded-lg border border-gray-600 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img
                          src={qr.qr}
                          alt={qr.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm font-medium py-4">{qr.type || 'N/A'}</TableCell>
                  <TableCell className="py-4">
                    <Switch
                      isSelected={qr.isAvailable}
                      onChange={() => handleToggleAvailability(qr._id)}
                      color="success"
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        className="bg-primary text-white hover:opacity-90 transition-opacity"
                        onPress={() => handleEdit(qr)}
                      >
                        Edit
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        onPress={() => handleDelete(qr._id)}
                      >
                        <Trash2 size={16} />
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
      <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl" backdrop="blur" className="bg-bgSecondary">
        <ModalContent className="bg-bgSecondary">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white border-b border-gray-700 py-4">
                <h3 className="text-xl font-bold">
                  {editingId ? '✏️ Edit QR Code' : '➕ Add New QR Code'}
                </h3>
              </ModalHeader>
              <ModalBody className="gap-6 py-6">
                {/* QR Name Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">QR Code Name *</label>
                  <Input
                    placeholder="e.g., Main Office, Branch 1"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    classNames={{
                      input: "text-white bg-gray-800",
                      label: "text-white",
                    }}
                    className="bg-gray-800 rounded-lg"
                  />
                </div>

                {/* File Upload Area */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white">QR Code Image *</label>
                  <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <ImageIcon className="w-12 h-12 mx-auto text-primary opacity-70" />
                      <p className="text-sm text-gray-300 font-medium">Click or drag QR code image</p>
                      <p className="text-xs text-gray-500">Support: JPG, PNG, WebP</p>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {previewImage && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">Preview</label>
                    <div className="w-48 h-48 rounded-lg border border-gray-600 overflow-hidden shadow-lg">
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
                  <div className="space-y-2 bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white font-medium">Uploading to Firebase...</span>
                      <span className="text-sm text-primary font-bold">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" color="primary" />
                  </div>
                )}

                {/* Payment QR Type Select */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">Payment QR Type *</label>
                  <select
                    value={formData.type}
                    onChange={handleTypeChange}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  >
                    <option value="" disabled>Select payment QR type</option>
                    {Object.values(PaymentQRType).map((paymentType) => (
                      <option key={paymentType} value={paymentType}>
                        {paymentType}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Is Available Toggle */}
                <div className="flex items-center justify-between py-4 px-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-white font-semibold">Available for Signup</span>
                  <Switch
                    isSelected={formData.isAvailable}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData(prev => ({
                        ...prev,
                        isAvailable: e.target.checked,
                      }))
                    }
                    color="success"
                    size="lg"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-700">
                  <Button
                    onPress={handleModalClose}
                    className="flex-1 bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors"
                    isDisabled={loading || isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={handleSubmit}
                    className="flex-1 bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
                    isLoading={loading || isUploading}
                    isDisabled={loading || isUploading}
                  >
                    {isUploading ? '⬆️ Uploading...' : editingId ? '💾 Update QR Code' : '✨ Add QR Code'}
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} size="sm" backdrop="blur">
        <ModalContent className="bg-bgSecondary">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white border-b border-gray-700 py-4">
                <h3 className="text-lg font-bold">🗑️ Confirm Delete</h3>
              </ModalHeader>
              <ModalBody className="py-6">
                <p className="text-gray-300 font-medium">
                  Are you sure you want to delete this QR code? This action cannot be undone.
                </p>
              </ModalBody>
              <div className="flex gap-3 p-6 pt-0 border-t border-gray-700">
                <Button
                  onPress={onDeleteModalClose}
                  className="flex-1 bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={confirmDelete}
                  className="flex-1 font-semibold"
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
