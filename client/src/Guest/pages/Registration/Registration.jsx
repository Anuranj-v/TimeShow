import styles from "./Registration.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Registration = () => {

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userContact, setUserContact] = useState("");

  const [cityText, setCityText] = useState("");
  const [city_Id, setCity] = useState("");
  const [cityList, setCityList] = useState([]);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const cityBoxRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [errorAnim, setErrorAnim] = useState(false);
  const [errors, setErrors] = useState({});

  const nameRegex = /^[A-Za-z ]{3,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$!%*?&]{6,}$/;

  // Close dropdown when clicking outside
  useEffect(() => {

    const handleClickOutside = (e) => {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target)) {
        setShowCityDrop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  // City search
  useEffect(() => {

    if (!cityText.trim()) {
      setCityList([]);
      setCity("");
      return;
    }

    setCityLoading(true);

    const timer = setTimeout(() => {

      axios
        .get(`http://127.0.0.1:8000/CitySearch/?q=${encodeURIComponent(cityText)}`)
        .then((res) => {
          setCityList(res.data.data || []);
          setShowCityDrop(true);
          setCityLoading(false);
        })
        .catch(() => {
          setCityList([]);
          setCityLoading(false);
        });

    }, 350);

    return () => clearTimeout(timer);

  }, [cityText]);

  const pickCity = (city) => {
    setCityText(city.city_name);
    setCity(city.id);
    setShowCityDrop(false);
  };

  const handleSave = () => {

    let newErrors = {};

    if (!nameRegex.test(userName)) {
      newErrors.userName = "Enter valid name (letters only)";
    }

    if (!emailRegex.test(userEmail)) {
      newErrors.userEmail = "Enter valid email";
    }

    if (!phoneRegex.test(userContact)) {
      newErrors.userContact = "Enter valid phone number";
    }

    if (!passwordRegex.test(userPassword)) {
      newErrors.userPassword = "Password must contain letter + number (min 6)";
    }

    if (!city_Id) {
      newErrors.city = "Please select a city";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setErrorAnim(true);
      setTimeout(() => setErrorAnim(false), 400);
      return;
    }

    setLoading(true);

    const Fdata = new FormData();

    Fdata.append("user_name", userName);
    Fdata.append("user_email", userEmail);
    Fdata.append("user_password", userPassword);
    Fdata.append("user_contact", userContact);
    Fdata.append("city_id", city_Id);

    axios
      .post("http://127.0.0.1:8000/User/", Fdata)
      .then(() => {

        setLoading(false);

        setUserName("");
        setUserEmail("");
        setUserPassword("");
        setUserContact("");
        setCityText("");
        setCity("");

        alert("Registration successful!");

        navigate("/guest/login");

      })
      .catch(() => {

        setLoading(false);
        setErrorAnim(true);

        setTimeout(() => setErrorAnim(false), 400);

      });
  };

  return (

    <div className={styles.overlay}>

      <div className={`${styles.signupCard} ${errorAnim ? styles.shake : ""}`}>

        <button className={styles.closeBtn}>×</button>

        <h2 className={styles.title}>Create your account</h2>

        <p className={styles.subtitle}>
          Welcome! Please fill in the details to get started.
        </p>

        {/* Username */}
        <label className={styles.label}>User Name</label>

        <input
          type="text"
          placeholder="Enter your name"
          className={styles.input}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        {errors.userName && <p className={styles.error}>{errors.userName}</p>}

        {/* Email */}
        <label className={styles.label}>Email address</label>

        <input
          type="email"
          placeholder="Enter your email"
          className={styles.input}
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />

        {errors.userEmail && <p className={styles.error}>{errors.userEmail}</p>}

        {/* City */}
        <label className={styles.label}>City</label>

        <div className={styles.autoWrap} ref={cityBoxRef}>

          <input
            type="text"
            placeholder="Search your city..."
            className={styles.input}
            value={cityText}
            onChange={(e) => {
              setCityText(e.target.value);
              setCity("");
            }}
            onFocus={() => cityList.length > 0 && setShowCityDrop(true)}
          />

          {errors.city && <p className={styles.error}>{errors.city}</p>}

          {showCityDrop && (

            <div className={styles.autoDrop}>

              {cityLoading ? (

                <div className={styles.autoItemMuted}>
                  Searching city...
                </div>

              ) : cityList.length === 0 ? (

                <div className={styles.autoItemMuted}>
                  No city found
                </div>

              ) : (

                cityList.map((c) => (

                  <div
                    key={c.id}
                    className={styles.cityItem}
                    onClick={() => pickCity(c)}
                  >
                    {c.city_name}
                  </div>

                ))

              )}

            </div>

          )}

        </div>

        {/* Phone */}
        <label className={styles.label}>Phone number</label>

        <div className={styles.phoneInput}>

          <select className={styles.select}>
            <option>IN</option>
          </select>

          <span className={styles.code}>+91</span>

          <input
            type="tel"
            placeholder="Enter your phone number"
            className={styles.input}
            value={userContact}
            onChange={(e) =>
              setUserContact(e.target.value.replace(/\D/g, ""))
            }
          />

        </div>

        {errors.userContact && <p className={styles.error}>{errors.userContact}</p>}

        {/* Password */}
        <label className={styles.label}>Password</label>

        <input
          type="password"
          placeholder="Enter your password"
          className={styles.input}
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />

        {errors.userPassword && <p className={styles.error}>{errors.userPassword}</p>}

        {/* Submit */}
        <button
          onClick={handleSave}
          className={styles.continueBtn}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Continue ▶"}
        </button>

        <p className={styles.signinText}>
          Already have an account? <Link to={"/guest/login"}>Sign in</Link>
        </p>

      </div>

    </div>

  );
};

export default Registration;