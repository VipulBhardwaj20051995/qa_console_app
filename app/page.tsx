"use client";

import { useState, useEffect } from "react";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";

const API_BASE_URL = 'http://50.16.150.108:5000';

const ENDPOINTS = {
    submit: '/api/pdi/submit',
    states: '/api/pdi/states',
    health: '/health'
};

interface PDISubmission {
    customerName: string;
    state: string;
    model: string;
    customerEmail: string;
    customerPhone: string;
    tubSerialNo: string;
    images: File[];
    video: File | null;
}

export default function App() {
    const [formData, setFormData] = useState<PDISubmission>({
        customerName: '',
        state: '',
        model: '',
        customerEmail: '',
        customerPhone: '',
        tubSerialNo: '',
        images: [],
        video: null
    });
    const [states, setStates] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.states}`);
            const data = await response.json();
            setStates(data);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (files.length > 4) {
                alert('Maximum 4 images allowed');
                return;
            }
            setFormData(prev => ({
                ...prev,
                images: files
            }));
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                video: e.target.files![0]
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'images') {
                    formData.images.forEach((image, index) => {
                        formDataToSend.append(`images`, image);
                    });
                } else if (key === 'video' && value) {
                    formDataToSend.append('video', value);
                } else {
                    formDataToSend.append(key, value);
                }
            });

            const response = await fetch(`${API_BASE_URL}${ENDPOINTS.submit}`, {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            setMessage('PDI submitted successfully!');
            setFormData({
                customerName: '',
                state: '',
                model: '',
                customerEmail: '',
                customerPhone: '',
                tubSerialNo: '',
                images: [],
                video: null
            });
        } catch (error) {
            setMessage('Error submitting PDI. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="pdi-form-container">
            <h1>Wovengold PDI Submission</h1>
            <form onSubmit={handleSubmit} className="pdi-form">
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name *</label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="model">Model *</label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tubSerialNo">Tub Serial Number *</label>
                    <input
                        type="text"
                        id="tubSerialNo"
                        name="tubSerialNo"
                        value={formData.tubSerialNo}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter tub serial number"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerEmail">Customer Email *</label>
                    <input
                        type="email"
                        id="customerEmail"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerPhone">Customer Phone *</label>
                    <input
                        type="tel"
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="images">Images (Max 4)</label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="video">Video</label>
                    <input
                        type="file"
                        id="video"
                        name="video"
                        accept="video/*"
                        onChange={handleVideoChange}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit PDI'}
                </button>

                {message && <div className="message">{message}</div>}
            </form>
        </main>
    );
}
