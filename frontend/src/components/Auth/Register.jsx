import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function Register() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/api/users/register/", data);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "An error occurred during registration.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-sm">
              <div className="card-header text-center bg-primary text-white">
                <h3>User Registration</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(handleRegister)}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className={`form-control ${errors.username ? "is-invalid" : ""}`}
                      id="username"
                      placeholder="Enter your username"
                      {...register("username", { 
                        required: "Username is required", 
                        minLength: { value: 3, message: "Minimum length is 3" } 
                      })}
                      onBlur={() => trigger("username")}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      placeholder="Enter your password"
                      {...register("password", { 
                        required: "Password is required", 
                        minLength: { value: 4, message: "Minimum length is 4" } 
                      })}
                      onBlur={() => trigger("password")}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password2" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password2 ? "is-invalid" : ""}`}
                      id="password2"
                      placeholder="Confirm your password"
                      {...register("password2", { 
                        required: "Confirmation password is required", 
                        validate: value => value === getValues("password") || "Passwords do not match" 
                      })}
                      onBlur={() => trigger("password2")}
                    />
                    {errors.password2 && <div className="invalid-feedback">{errors.password2.message}</div>}
                  </div>

                  <div className="d-grid">
                    {!loading ? (
                      <button type="submit" className="btn btn-primary">
                        Register
                      </button>
                    ) : (
                      <button type="button" className="btn btn-primary disabled" disabled>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div className="card-footer text-center">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
