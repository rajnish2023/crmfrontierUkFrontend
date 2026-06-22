import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeClosed, cilLockLocked } from '@coreui/icons';
import { getUserProfile, userLogin } from '../../api/api';
import './userstyle.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;

    const validateToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        if (mounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        const response = await getUserProfile(token);
        if (response.status === 200 && mounted) {
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        if (mounted) {
          setIsCheckingSession(false);
        }
      }
    };

    validateToken();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setErrorMessage('');
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await userLogin({
        email: form.email.trim(),
        password: form.password,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard', { replace: true });
        return;
      }

      setErrorMessage('Login failed. Please try again.');
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.error || 'An error occurred. Please try again later.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="login-page">
        <div className="loading-overlay">
          <div className="loading-content">
            <CSpinner color="light" size="lg" />
            <p>Checking your session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-background-glow login-background-glow-left" />
      <div className="login-background-glow login-background-glow-right" />
      <CContainer>
        <CRow className="justify-content-center align-items-center min-vh-100 py-4">
          <CCol lg={10} xl={9}>
            <div className="login-shell">
              <div className="login-brand-panel">
                <p className="login-kicker">CRM Frontier UK</p>
                <h1>Welcome back</h1>
                 
              </div>

              <CCard className="login-card">
                <CCardBody className="p-4 p-lg-5">
                  <CForm onSubmit={handleSubmit}>
                    <div className="login-form-header">
                      <h2>Sign in</h2>
                      <p>Use your account credentials to continue.</p>
                    </div>

                    {errorMessage ? (
                      <CAlert color="danger" className="mb-4">
                        {errorMessage}
                      </CAlert>
                    ) : null}

                    <div className="mb-3">
                      <label className="login-label" htmlFor="login-email">
                        Email
                      </label>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <CFormInput
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="name@company.com"
                          autoComplete="email"
                          value={form.email}
                          onChange={handleInputChange}
                          invalid={Boolean(fieldErrors.email)}
                        />
                      </CInputGroup>
                      {fieldErrors.email ? (
                        <small className="text-danger d-block mt-2">{fieldErrors.email}</small>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <label className="login-label" htmlFor="login-password">
                        Password
                      </label>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          id="login-password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          value={form.password}
                          onChange={handleInputChange}
                          invalid={Boolean(fieldErrors.password)}
                        />
                      </CInputGroup>
                      {fieldErrors.password ? (
                        <small className="text-danger d-block mt-2">{fieldErrors.password}</small>
                      ) : null}
                    </div>

                    <div className="login-actions">
                      <CButton
                        color="dark"
                        type="submit"
                        className="login-submit-button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                      </CButton>
                      <Link to="/forgotpassword" className="login-forgot-link">
                        Forgot password?
                      </Link>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;

