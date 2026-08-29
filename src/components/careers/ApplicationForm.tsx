"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";


const experienceLevels = [
  { value: "beginner", label: "Beginner (0-1 years)", desc: "Currently learning core concepts and building foundational skills through coursework, personal projects, or internships." },
  { value: "developing", label: "Developing (1-2 years)", desc: "Able to work on simple tasks independently while continuing to expand technical knowledge and practical experience." },
  { value: "proficient", label: "Proficient (2-4 years)", desc: "Comfortable handling most day-to-day responsibilities with minimal supervision and contributing effectively to team projects." },
  { value: "advanced", label: "Advanced (4-7 years)", desc: "Demonstrates strong technical expertise, mentors others, solves complex problems, and contributes to architectural decisions." },
  { value: "expert", label: "Expert (7+ years)", desc: "Recognized specialist with deep domain knowledge, leadership capabilities, strategic thinking, and extensive industry experience." }
];

const positions = [
  "Frontend Developer",
  "Backend Developer",
  "QA Engineer",
  "DevOps Engineer",
  "UI/UX Designer"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    github: "",
    linkedin: "",
    yearsExperience: "",
    experienceLevel: ""
  });

  const [file, setFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverLetterFileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "phone":
        if (!value.trim()) error = "Phone number is required";
        break;
      case "position":
        if (!value) error = "Position is required";
        break;
      case "github":
        if (value && !/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+/.test(value)) {
          error = "Must be a valid GitHub URL";
        }
        break;
      case "linkedin":
        if (value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/.test(value)) {
          error = "Must be a valid LinkedIn URL";
        }
        break;
      /*case "yearsExperience":
        if (!value) error = "Years of experience is required";
        else if (isNaN(Number(value)) || Number(value) < 0) error = "Must be a valid number";
        break;*/
      case "experienceLevel":
        if (!value) error = "Experience level is required";
        break;
    }
    return error;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, file: "Must be a PDF, DOC, or DOCX file" }));
        setFile(null);
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, file: "File size must be less than 5MB" }));
        setFile(null);
        return;
      }

      setErrors(prev => ({ ...prev, file: "" }));
      setFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCoverLetterChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, coverLetterFile: "Must be a PDF, DOC, or DOCX file" }));
        setCoverLetterFile(null);
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, coverLetterFile: "File size must be less than 5MB" }));
        setCoverLetterFile(null);
        return;
      }

      setErrors(prev => ({ ...prev, coverLetterFile: "" }));
      setCoverLetterFile(selectedFile);
    }
  };

  const clearCoverLetter = () => {
    setCoverLetterFile(null);
    if (coverLetterFileInputRef.current) coverLetterFileInputRef.current.value = "";
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    if (!file) {
      newErrors.file = "Resume is required";
      isValid = false;
    }

    if (!coverLetterFile) {
      newErrors.coverLetterFile = "Cover letter is required";
      isValid = false;
    }

    setErrors(newErrors);

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateAll()) return;

    setStatus("submitting");

    try {
      // Create FormData object to handle file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      if (file) submitData.append("resume", file);
      if (coverLetterFile) submitData.append("coverLetter", coverLetterFile);

      // Simulate API call for now (mock API route will be implemented)
      const res = await fetch("/api/apply", {
        method: "POST",
        body: submitData
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setServerMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerMessage("A network error occurred. Please try again later.");
    }
  };

  const inputClass = (name: string) => `w-full bg-surface border rounded-xl p-3 text-sm text-on-surface focus:outline-none transition-colors ${touched[name] && errors[name]
    ? 'border-error focus:border-error'
    : 'border-outline-variant/30 focus:border-primary'
    }`;

  const selectedLevel = experienceLevels.find(l => l.value === formData.experienceLevel);

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface dark:bg-surface-container-high rounded-3xl p-10 md:p-16 border border-outline-variant/20 shadow-xl text-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl" aria-hidden="true">check_circle</span>
        </div>
        <h3 className="font-display text-3xl font-bold text-on-surface mb-4">Application Submitted!</h3>
        <p className="text-on-surface-variant text-lg mb-8">
          Thank you for applying to Gileara Technologies. We have received your application and will review it shortly. A confirmation email has been sent to {formData.email}.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData({
              name: "", email: "", phone: "", position: "", github: "", linkedin: "", yearsExperience: "", experienceLevel: ""
            });
            setFile(null);
            setCoverLetterFile(null);
            setTouched({});
          }}
          className="btn-outline"
        >
          Submit Another Application
        </button>
      </motion.div>
    );
  }

  return (
    <section id="apply" className="bg-surface-container-lowest py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <div className="font-mono text-label uppercase tracking-[0.2em] text-accent-bright mb-6">
            04 / Ready to Build?
          </div>
          <h2 className="font-serif text-display-md md:text-display-lg text-on-background leading-tight tracking-[-0.02em]">
            Submit your{" "}
            <span className="italic text-accent-cyan">application.</span>
          </h2>
        </div>

        <div className="bg-surface-container p-6 md:p-10 rounded-xl border border-on-background/10">

          <AnimatePresence>
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8 p-4 bg-error-container border border-error/30 rounded-xl flex items-start gap-3"
              >
                <span className="material-symbols-outlined text-lg text-on-error-container mt-0.5 shrink-0" aria-hidden="true">error</span>
                <p className="text-on-error-container text-sm font-medium">{serverMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>

            {/* Personal Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-2">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={inputClass("name")} placeholder="Kofi Joe" />
                  {touched.name && errors.name && <p className="text-error text-xs mt-1 font-medium">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={inputClass("email")} placeholder="name@example.com" />
                  {touched.email && errors.email && <p className="text-error text-xs mt-1 font-medium">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={inputClass("phone")} placeholder="(+233) 54 321 0000" />
                  {touched.phone && errors.phone && <p className="text-error text-xs mt-1 font-medium">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Position Applying For *</label>
                  <select name="position" value={formData.position} onChange={handleChange} onBlur={handleBlur} className={`${inputClass("position")} appearance-none`}>
                    <option value="" disabled>Select a position</option>
                    {positions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {touched.position && errors.position && <p className="text-error text-xs mt-1 font-medium">{errors.position}</p>}
                </div>
              </div>
            </div>

            {/* Profiles */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-2">Links & Profiles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">GitHub Profile URL</label>
                  <input type="url" name="github" value={formData.github} onChange={handleChange} onBlur={handleBlur} className={inputClass("github")} placeholder="https://github.com/username" />
                  {touched.github && errors.github && <p className="text-error text-xs mt-1 font-medium">{errors.github}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">LinkedIn Profile URL</label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} onBlur={handleBlur} className={inputClass("linkedin")} placeholder="https://linkedin.com/in/username" />
                  {touched.linkedin && errors.linkedin && <p className="text-error text-xs mt-1 font-medium">{errors.linkedin}</p>}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-2">Experience</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Years of Experience *</label>
                  <input type="number" min="0" step="0.5" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} onBlur={handleBlur} className={inputClass("yearsExperience")} placeholder="e.g. 3.5" />
                  {touched.yearsExperience && errors.yearsExperience && <p className="text-error text-xs mt-1 font-medium">{errors.yearsExperience}</p>}
                </div> */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Experience Level *</label>
                  <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} onBlur={handleBlur} className={`${inputClass("experienceLevel")} appearance-none`}>
                    <option value="" disabled>Select your level</option>
                    {experienceLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                  {touched.experienceLevel && errors.experienceLevel && <p className="text-error text-xs mt-1 font-medium">{errors.experienceLevel}</p>}
                </div>
              </div>

              <AnimatePresence>
                {selectedLevel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-primary/5 border border-primary/20 rounded-xl p-4 overflow-hidden"
                  >
                    <p className="text-sm text-on-surface-variant"><strong className="text-primary">{selectedLevel.label}:</strong> {selectedLevel.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Document Upload */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-2">Documents</h3>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Resume Upload (PDF, DOC, DOCX) *</label>

                {!file ? (
                  <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${errors.file ? 'border-error bg-error/5' : 'border-outline-variant/30 hover:border-primary bg-surface/50 hover:bg-surface'}`}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className={`material-symbols-outlined text-5xl mx-auto mb-3 ${errors.file ? 'text-error' : 'text-on-surface-variant'}`} aria-hidden="true">cloud_upload</span>
                    <p className="text-sm text-on-surface font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-on-surface-variant">Max file size: 5MB</p>
                  </div>
                ) : (
                  <div className="bg-surface border border-primary/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="material-symbols-outlined text-lg text-primary shrink-0" aria-hidden="true">check_circle</span>
                      <span className="text-sm font-medium text-on-surface truncate">{file.name}</span>
                      <span className="text-xs text-on-surface-variant shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button type="button" onClick={clearFile} className="p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-lg transition-colors" aria-label="Remove file">
                      <span className="material-symbols-outlined" aria-hidden="true">close</span>
                    </button>
                  </div>
                )}
                {errors.file && <p className="text-error text-xs mt-2 font-medium">{errors.file}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Cover Letter Upload (PDF, DOC, DOCX) *</label>

                {!coverLetterFile ? (
                  <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${errors.coverLetterFile ? 'border-error bg-error/5' : 'border-outline-variant/30 hover:border-primary bg-surface/50 hover:bg-surface'}`}>
                    <input
                      type="file"
                      ref={coverLetterFileInputRef}
                      onChange={handleCoverLetterChange}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className={`material-symbols-outlined text-5xl mx-auto mb-3 ${errors.coverLetterFile ? 'text-error' : 'text-on-surface-variant'}`} aria-hidden="true">cloud_upload</span>
                    <p className="text-sm text-on-surface font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-on-surface-variant">Max file size: 5MB</p>
                  </div>
                ) : (
                  <div className="bg-surface border border-primary/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="material-symbols-outlined text-lg text-primary shrink-0" aria-hidden="true">check_circle</span>
                      <span className="text-sm font-medium text-on-surface truncate">{coverLetterFile.name}</span>
                      <span className="text-xs text-on-surface-variant shrink-0">({(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button type="button" onClick={clearCoverLetter} className="p-2 hover:bg-error/10 text-on-surface-variant hover:text-error rounded-lg transition-colors" aria-label="Remove cover letter">
                      <span className="material-symbols-outlined" aria-hidden="true">close</span>
                    </button>
                  </div>
                )}
                {errors.coverLetterFile && <p className="text-error text-xs mt-2 font-medium">{errors.coverLetterFile}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className={`w-full pl-8 pr-14 py-4 rounded-pill text-lg font-medium flex items-center justify-center gap-3 transition-colors duration-300 ${status === "submitting" ? "bg-surface-container text-on-surface-variant cursor-not-allowed" : "bg-accent-bright text-background hover:bg-accent-cyan"
                }`}
            >
              {status === "submitting" ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-surface-variant/30 border-t-on-surface-variant rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <span className="material-symbols-outlined text-base" aria-hidden="true">send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
