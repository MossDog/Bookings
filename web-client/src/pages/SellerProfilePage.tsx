import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import { Seller } from '../types/types';
import { getUser } from '../utils/authUtils';

export default function EditSellerProfile() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [editingField, setEditingField] = useState<keyof Seller | null>(null);
  const [fieldValue, setFieldValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeller = async () => {
      const user = await getUser();
  
      if (!user) {
        navigate('/login');
        return;
      }
  
      const { data, error } = await supabase
        .from('Seller')
        .select('*')
        .eq('user_id', user.id)
        .single();
  
      if (error) {
        setError('Failed to load seller profile.');
        console.error(error);
      } else {
        setSeller(data);
      }
  
      setLoading(false);
    };
  
    fetchSeller();
  }, [navigate]);

  const handleEditClick = (field: keyof Seller) => {
    if (!seller) return;
    setEditingField(field);
    setFieldValue(seller[field] as string);
  };

  const handleSave = async () => {
    if (!seller || !editingField) return;

    const updateData = { [editingField]: fieldValue };

    const { error } = await supabase
      .from('Seller')
      .update(updateData)
      .eq('user_id', seller.user_id);

    if (error) {
      setError('Update failed.');
      console.error(error);
    } else {
      setSeller({ ...seller, ...updateData });
      setSuccess(`${editingField} updated.`);
      setEditingField(null);
    }
  };

  const handleDeleteField = async (field: keyof Seller) => {
    if (!seller) return;

    const updateData = { [field]: null };

    const { error } = await supabase
      .from('Seller')
      .update(updateData)
      .eq('user_id', seller.user_id);

    if (error) {
      setError('Failed to clear field.');
      console.error(error);
    } else {
      setSeller({ ...seller, ...updateData });
      setSuccess(`${field} cleared.`);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edit Seller Profile Fields</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {seller ? (
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {(['description', 'name', 'category', 'email', 'address'] as (keyof Seller)[]).map(
            (field) => (
              <div key={field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ flex: 1 }}>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                {editingField === field ? (
                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    style={{ flex: 2, marginRight: '0.5rem' }}
                  />
                ) : (
                  <span style={{ flex: 2 }}>{seller[field]}</span>
                )}
                {editingField === field ? (
                  <button onClick={handleSave} style={{ marginRight: '0.5rem' }}>Save</button>
                ) : (
                  <button onClick={() => handleEditClick(field)} style={{ marginRight: '0.5rem' }}>Edit</button>
                )}
                <button onClick={() => handleDeleteField(field)} style={{ backgroundColor: '#dc3545', color: '#fff' }}>
                  Delete
                </button>
              </div>
            )
          )}
        </div>
      ) : (
        <p>No seller profile found.</p>
      )}
    </div>
  );
}