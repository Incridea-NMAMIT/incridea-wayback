import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { submitFeedback } from '@/api/feedback';
import LiquidGlassCard from '@/components/liquidglass/LiquidGlassCard';
import NavActionButton from '@/components/NavActionButton';
import { isAxiosError } from 'axios';

const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => {
  return (
    <div className="flex flex-col space-y-3">
      <label className="text-gray-200 font-semibold text-lg">{label}</label>
      <div className="flex space-x-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-4xl transition-colors duration-200 ${
              star <= value ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'
            }`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

export default function FeedbackPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    overallExperience: 0,
    eventAndActivities: 0,
    managementCoordination: 0,
    infrastructureFacilities: 0,
    suggestions: '',
    futureEngagement: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        // @ts-ignore
        name: user.name || '',
        // @ts-ignore
        email: user.email || '',
        // @ts-ignore
        contactNo: user.phoneNumber || user.contactNo || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const setRating = (field: string) => (value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.overallExperience === 0 || 
        formData.managementCoordination === 0 || formData.infrastructureFacilities === 0) {
      alert("Please provide ratings for all mandatory areas (Overall Experience, Management, and Infrastructure).");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFeedback(formData);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      if (isAxiosError(error) && error.response?.status === 400 && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to submit feedback. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen text-white flex items-center justify-center text-2xl font-semibold">Loading...</div>;

  if (submitted) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 mt-20">
        <LiquidGlassCard className="w-[92%] md:w-[87%] max-w-7xl mx-auto p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Thank You!
          </h2>
          <p className="text-xl md:text-2xl text-gray-200">Your feedback has been submitted successfully.</p>
        </LiquidGlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-4 py-12 mt-20">
      <LiquidGlassCard className="w-[92%] md:w-[87%] max-w-7xl mx-auto p-8 md:p-14">
        <h1 className="text-4xl md:text-5xl font-black mb-6 text-white">
          We value your Feedback
        </h1>
        <p className="text-xl text-gray-300 mb-12">Let us know how we can improve.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
          {!isAuthenticated && (
            <div className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
              <div>
                <label className="block text-gray-200 font-semibold text-lg mb-3">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-md"
                />
              </div>
              <div>
                <label className="block text-gray-200 font-semibold text-lg mb-3">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-md"
                />
              </div>
              <div>
                <label className="block text-gray-200 font-semibold text-lg mb-3">Contact No</label>
                <input
                  type="text"
                  name="contactNo"
                  required
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-md"
                />
              </div>
            </div>
          )}

          <div className="space-y-8">
            <h3 className="text-3xl font-bold border-b border-white/20 pb-4 text-white">Ratings</h3>
            
            <StarRating 
              label="Overall Experience" 
              value={formData.overallExperience} 
              onChange={setRating('overallExperience')} 
            />
            <StarRating 
              label="Events and Activities (Optional)" 
              value={formData.eventAndActivities} 
              onChange={setRating('eventAndActivities')} 
            />
            <StarRating 
              label="Management and Coordination" 
              value={formData.managementCoordination} 
              onChange={setRating('managementCoordination')} 
            />
            <StarRating 
              label="Infrastructure and Facilities" 
              value={formData.infrastructureFacilities} 
              onChange={setRating('infrastructureFacilities')} 
            />
          </div>

          <div className="space-y-8 border-t border-white/20 pt-10">
            <div>
              <label className="block text-gray-200 font-semibold text-lg mb-4">
                Suggestions and Improvements <span className="text-gray-400 text-base font-normal ml-2">(max 300 characters)</span>
              </label>
              <textarea
                name="suggestions"
                required
                maxLength={300}
                value={formData.suggestions}
                onChange={handleChange}
                rows={5}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-lg text-white focus:outline-none focus:border-blue-500 transition-colors backdrop-blur-md"
              />
              <div className="text-right text-base text-gray-400 mt-2 font-medium">
                {formData.suggestions.length}/300
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="futureEngagement"
                name="futureEngagement"
                checked={formData.futureEngagement}
                onChange={handleChange}
                className="w-6 h-6 accent-blue-500 bg-black/50 border-white/30 rounded cursor-pointer"
              />
              <label htmlFor="futureEngagement" className="text-lg text-gray-200 cursor-pointer select-none font-medium">
                I'm interested in future engagements & events
              </label>
            </div>
          </div>

          <div className="mt-10 flex justify-center w-full">
            <NavActionButton
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
            </NavActionButton>
          </div>
        </form>
      </LiquidGlassCard>
    </div>
  );
}
