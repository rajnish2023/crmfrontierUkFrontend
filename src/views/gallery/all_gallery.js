import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CCard,
  CCardBody,
  CCardImage,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormCheck,
  CSpinner,
  CAvatar,
} from '@coreui/react';
import { fetchGalleries, createGallery } from '../../api/api';
import CIcon from '@coreui/icons-react';
import { cilOptions, cilCloudDownload, cilCheckCircle, cilCloudUpload } from '@coreui/icons';
import './gallery.css';

const Gallery = ({ className }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const APP_URL = 'https://crmfoceplus-backend.onrender.com';

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const response = await fetchGalleries();
        setGalleries(response.data);
      } catch (error) {
        console.error('Error fetching galleries:', error);
        setError('Failed to load galleries');
      } finally {
        setLoading(false);
      }
    };
    loadGalleries();
  }, []);

  const handleCopyImageLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('Image link copied to clipboard');
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleUpload = async () => {
    if (selectedFiles) {
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => formData.append('files', file));
      try {
        await createGallery(formData);
        alert('Gallery uploaded successfully');
        setModalVisible(false);
        const response = await fetchGalleries();
        setGalleries(response.data);
        setImagePreviews([]);
      } catch (error) {
        alert('Error uploading gallery');
      }
    } else {
      alert('Please select images to upload.');
    }
  };

  const toggleImageSelection = (imageUrl) => {
    setSelectedImages((prev) =>
      prev.includes(imageUrl) ? prev.filter((img) => img !== imageUrl) : [...prev, imageUrl]
    );
  };

  const handleBulkDownload = async () => {
    if (selectedImages.length === 0) return;
    setDownloading(true);
    const zip = new JSZip();
    const folder = zip.folder("gallery_images");

    try {
      const downloadPromises = selectedImages.map(async (url, index) => {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        const fileName = url.split('/').pop() || `image_${index + 1}.jpg`;
        folder.file(fileName, blob);
      });

      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "crm_gallery_bulk_download.zip");
      setSelectedImages([]); // Clear selection after download
    } catch (error) {
      console.error("Error during bulk download:", error);
      alert("Error downloading images. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSelectAll = () => {
    const allImages = galleries.flatMap(g => g.images.map(img => `${APP_URL}/uploads/${img}`));
    if (selectedImages.length === allImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(allImages);
    }
  };

  return (
    <div className="gallery-container fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 sticky-top bg-light py-3 px-2 rounded shadow-sm">
        <div>
          <h4 className="fw-bold m-0 text-primary">Media Gallery</h4>
          <p className="text-muted small m-0">{galleries.length} folders loaded</p>
        </div>
        <div className="d-flex gap-2">
          <CButton color="info" variant="outline" onClick={handleSelectAll}>
            {selectedImages.length === galleries.flatMap(g => g.images).length ? 'Deselect All' : 'Select All'}
          </CButton>
          <CButton color="primary" onClick={() => setModalVisible(true)} className="d-flex align-items-center gap-2">
            <CIcon icon={cilCloudUpload} /> Upload Gallery
          </CButton>
          {selectedImages.length > 0 && (
            <CButton color="success" onClick={handleBulkDownload} disabled={downloading} className="d-flex align-items-center gap-2 text-white">
              {downloading ? <CSpinner size="sm" /> : <CIcon icon={cilCloudDownload} />}
              Download ({selectedImages.length})
            </CButton>
          )}
        </div>
      </div>

      <CRow xs={{ gutter: 4 }}>
        {loading ? (
          <div className="text-center py-5 w-100">
            <CSpinner color="primary" />
            <p className="mt-2 text-muted">Loading your media...</p>
          </div>
        ) : (
          galleries.map((gallery) => (
            gallery.images.map((image, index) => {
              const fullUrl = `${APP_URL}/uploads/${image}`;
              const isSelected = selectedImages.includes(fullUrl);
              return (
                <CCol sm={6} md={4} xl={3} key={gallery._id + '-' + index}>
                  <CCard className={`h-100 shadow-sm border-0 gallery-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleImageSelection(fullUrl)}>
                    <div className="position-relative overflow-hidden rounded-top">
                      <CCardImage
                        orientation="top"
                        src={fullUrl}
                        alt={`Image ${index + 1}`}
                        className="gallery-img"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="selection-overlay">
                         <CIcon icon={cilCheckCircle} size="xl" className={isSelected ? 'text-success' : 'text-white opacity-50'} />
                      </div>
                    </div>
                    <CCardBody className="p-2 d-flex justify-content-between align-items-center">
                       <span className="text-truncate small text-muted" style={{ maxWidth: '150px' }}>{image}</span>
                       <CDropdown onClick={(e) => e.stopPropagation()}>
                        <CDropdownToggle color="transparent" caret={false} className="p-0 border-0">
                          <CIcon icon={cilOptions} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => handleCopyImageLink(fullUrl)}>
                            Copy Link
                          </CDropdownItem>
                          <CDropdownItem onClick={() => window.open(fullUrl, '_blank')}>
                            Open in New Tab
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CCardBody>
                  </CCard>
                </CCol>
              );
            })
          ))
        )}
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>Add Media to Gallery</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div
              className={`file-upload-area ${dragging ? 'dragging' : ''} p-5 border-dashed rounded text-center`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const files = e.dataTransfer.files;
                setSelectedFiles(files);
                setImagePreviews(Array.from(files).map(f => URL.createObjectURL(f)));
              }}
            >
              <CFormInput type="file" multiple onChange={handleFileChange} className="mb-3" />
              <p className="text-muted">Drag images here or click to select</p>
              {imagePreviews.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
                  {imagePreviews.map((preview, idx) => (
                    <CAvatar src={preview} size="xl" key={idx} shape="rounded-3" className="shadow-sm" />
                  ))}
                </div>
              )}
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleUpload} disabled={!selectedFiles}>Start Upload</CButton>
        </CModalFooter>
      </CModal>

      <style>{`
        .gallery-card { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .gallery-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .gallery-card.selected { border: 2px solid #2eb85c !important; }
        .selection-overlay {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.2);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s;
        }
        .gallery-card:hover .selection-overlay, .gallery-card.selected .selection-overlay { opacity: 1; }
        .border-dashed { border: 2px dashed #dee2e6; }
        .file-upload-area.dragging { background: #f8f9fa; border-color: #3c4b64; }
      `}</style>
    </div>
  );
};

Gallery.propTypes = {
  className: PropTypes.string,
};

export default Gallery;
