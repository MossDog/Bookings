import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import { Seller } from '../types/types';

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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('seller')
        .select('*')
        .eq('user_id', session.user.id)
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
      .from('seller')
      .update(updateData)
      .eq('user_id', seller.id);

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
      .from('seller')
      .update(updateData)
      .eq('user_id', seller.id);

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
          className="border border-base-300 rounded-lg p-4 max-w-[500px] mx-auto flex flex-col gap-4 bg-base-100 text-base-content"
        >
          {(['description', 'name', 'category', 'email', 'address'] as (keyof Seller)[]).map(
            (field) => (
              <div key={field} className="flex justify-between items-center gap-2">
                <strong className="flex-1">{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                {editingField === field ? (
                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    className="flex-2 mr-2 input input-bordered"
                    placeholder={`Edit ${field}`}
                    title={`Edit ${field}`}
                  />
                ) : (
                  <span className="flex-2">{seller[field]}</span>
                )}
                {editingField === field ? (
                  <button onClick={handleSave} className="mr-2 bg-primary text-primary-foreground px-2 py-1 rounded">Save</button>
                ) : (
                  <button onClick={() => handleEditClick(field)} className="mr-2 bg-primary text-primary-foreground px-2 py-1 rounded">Edit</button>
                )}
                <button onClick={() => handleDeleteField(field)} className="bg-error text-error-content px-2 py-1 rounded">
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