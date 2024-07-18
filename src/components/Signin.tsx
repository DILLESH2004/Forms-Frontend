import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HTTP_METHODS, REQUEST_FAILURE_MESSAGES, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES, REQUEST_URLS, ROUTE_PATHS, SESSION_STORAGE_KEYS, UserLogin, UserRegister } from "../utils/constants";
import { getCurrentDateTime, validateEmail } from "../utils/util";
import "./Signin.scss";
import useAxios from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "./contexts/auth-context";

const Signin = () => {

    const [isActive, setIsActive] = useState(false);
    let [isLogin, setIsLogin] = useState(false);
    let [register, setRegister] = useState<UserRegister>({});
    let [login, setLogin] = useState<UserLogin>({});

    const navigate = useNavigate();
    const { HttpRequestController, isRequestPending, handlePromiseRequest } = useAxios();
    const { handleLogin } = useAuth();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: ROUTE_PATHS.HOME } };
    
    const handleRegisterClick = () => {
      setIsActive(true);
    };
  
    const handleLoginClick = () => {
      setIsActive(false);
    };
    const sendLoginRequest = async () => {
      const res = await HttpRequestController(REQUEST_URLS.LOGIN, HTTP_METHODS.POST, login);
      if (res) {
        localStorage.setItem(SESSION_STORAGE_KEYS.TOKEN, res.token);
        localStorage.setItem(SESSION_STORAGE_KEYS.EMAIL, res.data.email);
        localStorage.setItem(SESSION_STORAGE_KEYS.USER_ID, res.data.userId);
        localStorage.setItem(SESSION_STORAGE_KEYS.USERNAME, res.data.username);
        localStorage.setItem(SESSION_STORAGE_KEYS.IS_AUTH, 'true');
        navigate(from, { replace: true });
        setLogin({});
        handleLogin(true);
      }
    }
  
    const sendRegisterRequest = async () => {
      let payload = { ...register }
      const res = await HttpRequestController(REQUEST_URLS.REGISTER, HTTP_METHODS.POST, payload);
      if (res) {
        setIsLogin(true);
        setRegister({});
      }
    }
  
    const handleLoginFunction = async () => {
      if (login.email && login.password && validateEmail(login.email)) {
        handlePromiseRequest(sendLoginRequest, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES.LOGGED_IN_SUCCESSFULLY, REQUEST_FAILURE_MESSAGES.LOGIN_FAILED);
      } else {
        toast.error(REQUEST_FAILURE_MESSAGES.PLEASE_ENTER_DETAILS);
      }
    };
  
    const handleRegister = async () => {
      if (register.username && register.username.trim().length != 0 && register.password && register.email
        && validateEmail(register.email) && register.phone && register.phone.length == 10) {
        handlePromiseRequest(sendRegisterRequest, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES.USER_REGISTERED_SUCCESSFULLY,
          REQUEST_FAILURE_MESSAGES.REGISTRATION_FAILED);
      } else {
        toast.error(REQUEST_FAILURE_MESSAGES.PLEASE_ENTER_DETAILS);
      }
    };
  
  return (
    <>
    <div className="contain">
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
            <div className="form-container sign-up">
                <form>
                    <h1>Create Account</h1>
                    <input type="text" placeholder="Name" onChange={(e) => setRegister({ ...register, username: e.target.value })}/>
                    <input type="email" placeholder="Email" onChange={(e) => setRegister({ ...register, email: e.target.value })} />
                    <input type="number" placeholder="phone"onChange={(e) => setRegister({ ...register, phone: e.target.value })} />
                    <input type="password" placeholder="Password"onChange={(e) => setRegister({ ...register, password: e.target.value })}/>
                    <button type="button" onClick={handleRegister} disabled={isRequestPending}>Sign Up</button>
                </form>
            </div>
            <div className="form-container sign-in">
                <form>
                    <h1>Sign In</h1>
                    <input type="email" placeholder="Email" onChange={(e) => setLogin({ ...login, email: e.target.value })}/>
                    <input type="password" placeholder="Password" onChange={(e) => setLogin({ ...login, password: e.target.value })}/>
                    <a href="#">Forget Your Password?</a>
                    <button onClick={handleLoginFunction} disabled={isRequestPending}>Sign In</button>
                </form>
            </div>
            <div className="toggle-container">
                <div className="toggle ">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button className="hidden" id="login" onClick={handleLoginClick}  >Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                        <button className="hidden" id="register" onClick={handleRegisterClick } >Sign Up</button>
                    </div>  
                </div>
            </div>
        </div>
    </div>
    </>
  );
}

export default Signin;
