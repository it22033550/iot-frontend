import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState('');
  const [commandText, setCommandText] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = () => {
    axios
      .get('https://rounded-dazzling-warbler.glitch.me//devices')
      .then((res) => setDevices(res.data))
      .catch((err) => console.error('Failed to fetch devices:', err));
  };

  const registerDevice = () => {
    if (!newDevice.trim()) return;
    axios
      .post('https://rounded-dazzling-warbler.glitch.me//register', { deviceId: newDevice })
      .then(() => {
        fetchDevices();
        setStatusMessage('✅ Device registered!');
        setTimeout(() => setStatusMessage(''), 2000);
      })
      .catch((err) => {
        console.error('Registration error:', err);
        setStatusMessage('❌ Failed to register device');
        setTimeout(() => setStatusMessage(''), 2000);
      });
    setNewDevice('');
  };

  const sendCommand = () => {
    if (!selectedDevice || !commandText.trim()) {
      setStatusMessage('❌ Missing device or command');
      setTimeout(() => setStatusMessage(''), 2000);
      return;
    }

    axios
      .post('https://rounded-dazzling-warbler.glitch.me//send-command', {
        deviceId: selectedDevice,
        command: commandText,
      })
      .then(() => {
        setStatusMessage('✅ Command sent!');
        setTimeout(() => setStatusMessage(''), 2000);
      })
      .catch((err) => {
        console.error('Command error:', err);
        setStatusMessage('❌ Failed to send command');
        setTimeout(() => setStatusMessage(''), 2000);
      });

    setCommandText('');
  };

  return (
    <div className="container">
      <h2 className="mb-4">📡 IoT Device Dashboard</h2>

      {statusMessage && (
        <div className="alert alert-info" role="alert">
          {statusMessage}
        </div>
      )}

      <div className="mb-4">
        <input
          className="form-control"
          placeholder="Enter new device ID"
          value={newDevice}
          onChange={(e) => setNewDevice(e.target.value)}
        />
        <button className="btn btn-success mt-2" onClick={registerDevice}>
          Register Device
        </button>
      </div>

      <div className="mb-4">
        <select
          className="form-select"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          <option value="">Select a device</option>
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.id}
            </option>
          ))}
        </select>
        <input
          className="form-control mt-2"
          placeholder="Enter command"
          value={commandText}
          onChange={(e) => setCommandText(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={sendCommand}>
          Send Command
        </button>
      </div>

      <h4>📋 Device Status</h4>
      <ul className="list-group">
        {devices.map((d) => (
          <li key={d.id} className="list-group-item d-flex justify-content-between">
            <span>{d.id}</span>
            <span className="status">{d.status || 'unknown'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
