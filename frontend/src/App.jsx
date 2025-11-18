import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard.jsx';
import PropertyPage from './pages/PropertyPage.jsx';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#FFF9E9]">
                <Navbar />
                <main className="pt-24">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/property/:id" element={<PropertyPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;