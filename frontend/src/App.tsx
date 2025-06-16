import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import SpecialtyList from './components/Specialty/SpecialtyList';
import DoctorList from './components/Doctor/DoctorList';
import PatientList from './components/Patient/PatientList';
import DepartmentList from './components/Department/DepartmentList';
import WardList from './components/Ward/WardList';
import AppointmentList from './components/Appointment/Appointment';
import NotFoundPage from './pages/NotFoundPage';
import ReportsPage from './reports/ReportsPage';
import ComplaintsReport from './reports/complaints/ComplaintsReport';
import TopPatientsReport from './reports/top-patients/TopPatientsReport';
import WardsStayReport from './reports/wards-stay/WardsStayReport';
// import ReportList from './components/Reports/ReportList';
// import PatientsListPage from './pages/PatientsListPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />    
          <Route path="/specialties" element={<SpecialtyList />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/departments" element={<DepartmentList />} />
          <Route path="/wards" element={<WardList />} />
          <Route path="/appointments" element={<AppointmentList />} />  
          
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/complaints" element={<ComplaintsReport />} />
          <Route path="/reports/top-patients" element={<TopPatientsReport />} />
          <Route path="/reports/wards-stay" element={<WardsStayReport />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;