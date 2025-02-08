import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, X } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import SignupIllustration from "../components/SignupIllustration"

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const { signup, isSigningUp, verifyOTP } = useAuthStore()

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = validateForm();
    if (success) {
      try {
        await signup(formData);
        setShowOtpModal(true);
      } catch (error) {
        console.log(error)
        setShowOtpModal(false);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector<HTMLInputElement>(`#otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }
  
    setIsVerifying(true);
    try {
      await verifyOTP(formData.email, otpString);
      setShowOtpModal(false);
    } catch (error) {
      console.log(error)
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await signup(formData);
      toast.success("New verification code sent!");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <div className="min-h-screen grid lg:grid-cols-3">
        <div className="col-span-2 flex flex-col justify-center items-center p-6 md:p-12 bg-gradient-to-bl from-primary/15 to-secondary/15">
          <div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-2xl shadow-xl">
            
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-16 rounded-2xl bg-primary flex items-center justify-center group-hover:bg-secondary transition-colors duration-300 ease-in-out">
                  <MessageSquare className="size-8 text-primary-content animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold mt-4 text-primary">Create Account</h1>
                <p className="text-base-content/70">Get started with your free account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-primary/60" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 bg-base-200 focus:bg-base-100 transition-colors duration-200"
                    placeholder="Your Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-primary/60" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10 bg-base-200 focus:bg-base-100 transition-colors duration-200"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-primary/60" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10 bg-base-200 focus:bg-base-100 transition-colors duration-200"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-primary/60" />
                    ) : (
                      <Eye className="size-5 text-primary/60" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full hover:btn-secondary transition-colors duration-300"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base-content/70">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary hover:link-secondary transition-colors duration-300">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <SignupIllustration
          title="Join our community"
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
        />
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOtpModal(false)}
          />
          
          <div className="relative bg-base-100 w-full max-w-md mx-4 rounded-2xl shadow-xl p-6 space-y-6 animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-base-200 transition-colors duration-200"
            >
              <X className="size-5" />
            </button>

            <div>
              <h2 className="text-2xl font-bold">Enter Verification Code</h2>
              <p className="text-base-content/70 mt-2">
                We've sent a 6-digit verification code to {formData.email}
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl rounded-lg border border-base-300 
                    bg-base-200 focus:bg-base-100 focus:border-primary focus:ring-2 
                    focus:ring-primary/20 transition-all duration-200 outline-none"
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                className="text-sm text-primary hover:text-secondary transition-colors duration-300"
                onClick={handleResendOtp}
              >
                Resend Code
              </button>
              <button
                type="button"
                className="btn btn-primary hover:btn-secondary transition-colors duration-300"
                onClick={handleVerifyOtp}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SignUpPage