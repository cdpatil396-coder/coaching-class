import { FaWhatsapp } from "react-icons/fa";

function WhatsAppButton() {

  return (

    <a
      href="https://wa.me/91xxxxxxxxx "
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-full shadow-lg text-3xl"
    >

      <FaWhatsapp />

    </a>

  );
}

export default WhatsAppButton;