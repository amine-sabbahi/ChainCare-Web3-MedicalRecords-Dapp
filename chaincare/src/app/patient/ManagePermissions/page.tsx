"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, Container, Grid, Card, Typography, Box, List, ListItem, ListItemText, Switch } from '@mui/material';
import { Person, ExitToApp, History, MedicalServices, Security } from '@mui/icons-material';

export default function Dashboard() {
  const { logout } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    setDoctors([
      { id: 1, name: 'Dr. John Doe', specialty: 'Cardiologist' },
      { id: 2, name: 'Dr. Jane Smith', specialty: 'Neurologist' },
      { id: 3, name: 'Dr. Emily Johnson', specialty: 'Pediatrician' },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleTogglePermission = (doctorId: number) => {
    setPermissionStatus((prevStatus: any) => ({
      ...prevStatus,
      [doctorId]: !prevStatus[doctorId],
    }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '"Poppins", sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#FAF3F3',
          padding: '30px',
          borderRight: '1px solid #E0E0E0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          borderRadius: '10px',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 4, fontWeight: '600', color: '#89CFF0', letterSpacing: '1px' }}
        >
          Patient Dashboard
        </Typography>
        <List>
          {[
            { icon: <Person />, text: 'Dashboard' },
            { icon: <Security />, text: 'Manage Permissions' },
            { icon: <History />, text: 'History' },
            { icon: <MedicalServices />, text: 'Doctors' },
          ].map(({ icon, text }) => (
            <ListItem button key={text} sx={{ mb: 2, borderRadius: '8px', '&:hover': { backgroundColor: '#F0F8FF' } }}>
              <Box sx={{ color: '#89CFF0', mr: 2 }}>{icon}</Box>
              <ListItemText primary={text} sx={{ fontWeight: '500', color: '#555' }} />
            </ListItem>
          ))}
        </List>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#F9F9F9' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#89CFF0',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: '600', letterSpacing: '1px' }}>
            Patient Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={logout}
            sx={{
              borderRadius: '50px',
              padding: '6px 16px',
              borderColor: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: '#89CFF0',
              },
            }}
          >
            <ExitToApp sx={{ mr: 1 }} /> Logout
          </Button>
        </header>

        {/* Dashboard Content */}
        <Container sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{ mb: 4, fontWeight: '600', color: '#333', letterSpacing: '0.5px' }}
          >
            Doctors List & Permissions
          </Typography>
          <Card
            sx={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E0E0E0',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#89CFF0', fontWeight: '600' }}>
              Manage Doctor Permissions
            </Typography>

            {loading ? (
              <Typography variant="body1">Loading doctor data...</Typography>
            ) : (
              <Grid container spacing={4}>
                {doctors.map((doctor) => (
                  <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                    <Card
                      sx={{
                        padding: '20px',
                        backgroundColor: '#FDFDFD',
                        borderRadius: '12px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        '&:hover': { boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' },
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#89CFF0', fontWeight: '500' }}>
                        {doctor.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#555' }}>
                        {doctor.specialty}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '10px',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#888' }}>
                          Permission
                        </Typography>
                        <Switch
                          checked={permissionStatus[doctor.id] || false}
                          onChange={() => handleTogglePermission(doctor.id)}
                          inputProps={{ 'aria-label': 'controlled' }}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#89CFF0',
                            },
                            '& .MuiSwitch-track': {
                              backgroundColor: '#E0E0E0',
                            },
                          }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        </Container>
      </main>
    </div>
  );
}
