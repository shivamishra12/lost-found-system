import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { getItems, createItem, updateItem, deleteItem } from '../services/api';

const Dashboard = ({ user }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactInfo: ''
  });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getItems(searchQuery);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        itemName: item.itemName,
        description: item.description,
        type: item.type,
        location: item.location,
        date: new Date(item.date).toISOString().split('T')[0],
        contactInfo: item.contactInfo
      });
    } else {
      setEditingItem(null);
      setFormData({
        itemName: '',
        description: '',
        type: 'Lost',
        location: '',
        date: new Date().toISOString().split('T')[0],
        contactInfo: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateItem(editingItem._id, formData);
      } else {
        await createItem(formData);
      }
      closeModal();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      alert(error.response?.data?.message || 'Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lost & Found Items</h1>
            <p style={{ color: 'var(--text-muted)' }}>Help the community by reporting what you've lost or found.</p>
          </div>
          
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search items by name, location..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ borderRadius: '9999px', paddingRight: '5rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', borderRadius: '9999px', padding: '0 1rem' }}>
              Search
            </button>
          </form>
        </div>

        {user && (
          <div style={{ marginBottom: '2rem' }}>
            <button className="btn btn-primary" onClick={() => openModal()} style={{ display: 'flex', gap: '0.5rem' }}>
              <Plus size={20} /> Report New Item
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading items...</div>
        ) : items.length > 0 ? (
          <div className="items-grid">
            {items.map(item => (
              <ItemCard 
                key={item._id} 
                item={item} 
                currentUser={user} 
                onEdit={openModal} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No items found matching your criteria.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {editingItem ? 'Edit Item' : 'Report New Item'}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select name="type" className="form-input" value={formData.type} onChange={handleInputChange} required>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input type="text" name="itemName" className="form-input" value={formData.itemName} onChange={handleInputChange} required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">Location (Where it was lost/found)</label>
                <input type="text" name="location" className="form-input" value={formData.location} onChange={handleInputChange} required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" name="date" className="form-input" value={formData.date} onChange={handleInputChange} required />
              </div>
              
              <div className="form-group">
                <label className="form-label">Contact Information</label>
                <input type="text" name="contactInfo" className="form-input" placeholder="Phone or Email" value={formData.contactInfo} onChange={handleInputChange} required />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Changes' : 'Submit Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
