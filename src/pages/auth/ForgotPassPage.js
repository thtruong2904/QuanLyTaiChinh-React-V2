import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import axiosApiInstance from "../../context/interceptor";

const ForgotPassPage = () => {

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            emailRequest : event.target.elements.email.value,
        }
        console.log(payload)
        const result = await axios.post(axiosApiInstance.defaults.baseURL + `/api/auth/forgot-password`, payload);
        if(result?.data?.status === 101)
        {
            toast.error(result?.data?.message);
        }
        else
        {
            toast.success("Mã xác thực đã được gửi qua Email của bạn");
            navigate("/verify-code", { state: { email: event.target.elements.email.value } });
        }
    }

    useEffect(() => {

    }, []);

    return (
        <>
            <div>
                <nav className="nav-login">
                    <h1 className="nav-login-icon">
                        <i className='fa fa-coins'></i>
                        FINANCIAL MANAGEMENT
                    </h1>
                </nav>
                <div className="bg">
                    <div className="form">
                        <div className="form-toggle"></div>
                        <div className="form-panel one">
                            <div className="form-header">
                                <h1>Quên mật khẩu?</h1>
                            </div>
                            <div className="form-content">
                                <form
                                  onSubmit={handleSubmit}
                                >
                                    <div className="form-group">
                                        <label htmlFor="email">Email:</label>
                                        <input type="email" id="email" required />
                                    </div>
                                    <div className="form-group">
                                        <button variant="primary" type="submit" className="btn-submit">
                                            Gửi mã
                                        </button>
                                    </div>
                                    <p className="form-group text">
                                        Bạn muốn đăng nhập?
                                        <Link className="form-recovery link-item" to="/login">
                                            {" "}
                                            Đăng nhập
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ForgotPassPage;