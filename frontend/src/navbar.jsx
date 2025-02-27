import { FiHome } from "react-icons/fi";


export default function Navbar() {
  return (
    <nav className="navbar">
      <FiHome />
      <ul>
        <li>
          <a href="./task.jsx">Home</a>
        </li>
        <li>
          <a href="./task.jsx">About</a>
        </li>
        <li>
          <a href="./task.jsx">Contact</a>
        </li>
      </ul>
    </nav>
  );
}
