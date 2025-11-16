import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="mt-16 pb-24 text-center text-gray-400 text-sm">
      <div className="flex justify-center gap-4 mb-2">
        <a
          href="https://www.linkedin.com/in/shivamkarn/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-indigo-400 transition"
        >
          <FaLinkedin size={20} />
        </a>

        <a
          href="https://github.com/skvalt/voice-shopping-assistant"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-indigo-400 transition"
        >
          <FaGithub size={20} />
        </a>

        <a
          href="https://www.instagram.com/sk.ok05/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-indigo-400 transition"
        >
          <FaInstagram size={20} />
        </a>
      </div>

      Made with ❤️ for smart shoppers  
      <br />
      <span className="text-gray-500">@shivam</span>
    </div>
  );
}
