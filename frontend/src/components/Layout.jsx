import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={styles.wrapper}>

      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div style={styles.right}>

        {/* Navbar (FULL WIDTH TOP) */}
        <Navbar />

        {/* Page content */}
        <div style={styles.content}>
          {children}
        </div>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
  },

  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  content: {
    padding: "20px",
    background: "#f6f7fb",
    minHeight: "100vh",
  },
};