// import DanceTickets from "./components/DanceTickets";

// function App() {
//   return (
//     <div>
//       <DanceTickets />
//     </div>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ClassManagement from './components/ClassManagement';
import DanceTickets from "./components/DanceTickets";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
        <Route path="/" element={<DanceTickets />} />
          <Route path="/admin" element={<LoginForm />} />
          <Route path="/manage" element={<ClassManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

