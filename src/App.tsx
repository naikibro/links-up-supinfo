import "./App.css";
import FileUpload from "./components/file-management/FileUpload";
import logo from "/images/identity/logos/1.png";

function App() {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 100,
      }}
    >
      <img src={logo} alt="Logo" width={200} height={200} />
      <h2>The app to manage your social media files</h2>

      <hr />
      <FileUpload />
    </div>
  );
}

export default App;
