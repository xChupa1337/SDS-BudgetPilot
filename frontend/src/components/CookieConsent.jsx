import React from "react";
import CookieConsent from "react-cookie-consent";

const CookiePopup = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Прийняти"
      declineButtonText="Відхилити"
      enableDeclineButton
      cookieName="userConsent"
      expires={150}
      style={{ background: "#222", color: "#fff" }}
      buttonStyle={{ background: "#4CAF50", color: "#fff", fontSize: "14px" }}
      declineButtonStyle={{ background: "#f44336", color: "#fff", fontSize: "14px" }}
    >
      Ми використовуємо cookies для покращення вашого досвіду на сайті.  
      Натискаючи "Прийняти", ви погоджуєтесь з нашою Політикою конфіденційності.
    </CookieConsent>
  );
};

export default CookiePopup;