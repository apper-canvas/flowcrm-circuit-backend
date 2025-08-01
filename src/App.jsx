import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Contacts from "@/components/pages/Contacts";
import ContactDetail from "@/components/pages/ContactDetail";
import Pipeline from "@/components/pages/Pipeline";
import Activities from "@/components/pages/Activities";
import Settings from "@/components/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactDetail />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="activities" element={<Activities />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;