import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import "./global.css";
import "./guide.css";
import Abdo from "../../assets/images/abdo.png";
import Pro from "../../assets/icons/profile-add.png";
import Tex from "../../assets/icons/text.png";
import Arrow from "../../assets/icons/arrow-right.png";
import Ele from "../../assets/icons/elements.png";
import Set from "../../assets/icons/setting-2.png";
import Log from "../../assets/icons/logout.png";

const Profile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [name, setName] = useState(localStorage.getItem("userName") || "Abdo Zaki");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "Zeko@example.com");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatarUrl") || "");
  const [showNameInput, setShowNameInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (!showInputs) {
      setShowInputs(true);
      return;
    }

    setLoading(true);
    setMessage("");

    if (!oldPassword || !password || !passwordConfirmation) {
      setMessage("Please fill in all password fields.");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://app.elfar5a.com/api/profile/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          password: password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setMessage("Password updated successfully");
        setOldPassword("");
        setPassword("");
        setPasswordConfirmation("");
        setShowInputs(false);
      } else {
        setMessage(data.message || "Failed to update password. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://app.elfar5a.com/api/auth/deleteAccount", {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Delete Account Response:", data);

      if (response.ok && data.data === "Account deleted successfully") {
        setMessage("Account deleted successfully. Redirecting to login...");
        localStorage.removeItem("authToken");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setMessage(data.message || "Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    if (name) formData.append("name", name);
    if (email) formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://app.elfar5a.com/api/profile/update-profile", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Update Profile Response:", data);

      if (response.ok) {
        setMessage("Profile updated successfully!");
        localStorage.setItem("userName", data.data.name); // تحديث الـ localStorage
        localStorage.setItem("userEmail", data.data.email);
        localStorage.setItem("avatarUrl", data.data.avatar || ""); // تحديث الـ avatarUrl
        setName(data.data.name);
        setEmail(data.data.email);
        setAvatarUrl(data.data.avatar || "");
        setAvatar(null);
        setShowNameInput(false);
        setShowEmailInput(false);
        setShowAvatarInput(false);
      } else {
        setMessage(data.message || "Failed to update profile. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pro">
      <div className="settings">
        <div className="div">
          <div className="overlap">
            <img
              src={avatarUrl || Abdo}
              alt=""
              onClick={() => setShowAvatarInput(true)}
              style={{
                cursor: "pointer",
                width: "192px",
                height: "192px",
                borderRadius: "1000px",
                objectFit: "cover",
                position: "absolute",
                top: "0",
                left: "0",
              }}
            />
            {showAvatarInput && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                style={{ marginTop: "200px" }}
              />
            )}
          </div>
          <div className="frame-13">
            <div className="text-wrapper-6">Settings</div>
            <div className="frame-14">
              <div className="frame-15">
                <div className="frame-16">
                  <div className="frame-17">
                    <div className="frame-18">
                      <div className="text-wrapper-7">Name</div>
                      <div
                        className="text-wrapper-8"
                        onClick={() => setShowNameInput(true)}
                        style={{ cursor: "pointer" }}
                      >
                        Edit
                      </div>
                    </div>
                    <div className="frame-19">
                      {showNameInput ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          style={{ width: "100%", padding: "5px" }}
                        />
                      ) : (
                        <div className="text-wrapper-9">{name}</div>
                      )}
                      <div className="frame-20"></div>
                    </div>
                  </div>
                  <div className="frame-17">
                    <div className="frame-18">
                      <div className="text-wrapper-7">Email</div>
                      <div
                        className="text-wrapper-8"
                        onClick={() => setShowEmailInput(true)}
                        style={{ cursor: "pointer" }}
                      >
                        Edit
                      </div>
                    </div>
                    <div className="frame-19">
                      {showEmailInput ? (
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{ width: "100%", padding: "5px" }}
                        />
                      ) : (
                        <div className="text-wrapper-9">{email}</div>
                      )}
                      <div className="frame-20"></div>
                    </div>
                  </div>
                  <div className="frame-21" onClick={handleUpdateProfile}>
                    <img className="img-2" src={Pro} />
                    <div className="text-wrapper-10">
                      {loading ? "Saving..." : "Save changes"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="frame-22">
                <div className="frame-8">
                  <div className="frame-22">
                    <div className="frame-17">
                      <div className="frame-9">
                        <img className="img-2" src={Tex} />
                        <div className="frame-23">
                          <div className="text-wrapper-11">Translation Engine</div>
                        </div>
                      </div>
                      <div className="frame-24">
                        <div className="frame-25">
                          <div className="text-wrapper-12">Chat gpt</div>
                        </div>
                        <img className="img-2" src={Arrow} />
                      </div>
                    </div>
                  </div>
                  <div className="frame-17">
                    <div className="frame-9">
                      <img className="img-2" src={Tex} />
                      <div className="frame-23">
                        <div className="text-wrapper-11">Translation Language</div>
                      </div>
                    </div>
                    <div className="frame-24">
                      <div className="frame-25">
                        <div className="text-wrapper-12">Arabic</div>
                      </div>
                      <img className="img-2" src={Arrow} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="frame-22">
                <div className="frame-26">
                  <div className="frame-23">
                    <div className="password-security">Password & Security</div>
                  </div>
                </div>
                <div className="frame-17">
                  <div className="frame-9">
                    <img className="img-2" src={Ele} />
                    <div className="frame-23">
                      <div className="text-wrapper-11">Change Password</div>
                    </div>
                  </div>
                  <div className="frame-18">
                    <p className="text-wrapper-13">
                      Please enter your old and new password to update it.
                    </p>
                    {showInputs && (
                      <>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Old Password"
                          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                        />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="New Password"
                          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                        />
                        <input
                          type="password"
                          value={passwordConfirmation}
                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                          placeholder="Confirm Password"
                          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                        />
                      </>
                    )}
                    <div className="frame-21" onClick={handleChangePassword}>
                      <div className="text-wrapper-14">
                        {loading ? "Loading..." : "Change Password"}
                      </div>
                    </div>
                    {message && <p style={{ color: message.includes("successfully") ? "green" : "red", marginLeft: "20px" }}>{message}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="resources">
            <div className="resources-2">
              <div className="frame-27">
                <img className="img-2" src={Set} />
                <div className="text-wrapper-15">Settings</div>
              </div>
            </div>
            <div className="resources-3">
              <div className="frame-28" onClick={handleLogout}>
                <img className="img-2" src={Log} />
                <div className="text-wrapper-16">Logout</div>
              </div>
            </div>
            <div className="resources-3">
              <div className="frame-28" onClick={handleDeleteAccount}>
                <div className="text-wrapper-16">Delete Account</div>
              </div>
            </div>
            <div className="overlap-group-wrapper">
              <div className="overlap-group"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;