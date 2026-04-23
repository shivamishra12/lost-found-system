import React from 'react';
import { MapPin, Calendar, User as UserIcon, Phone, Edit2, Trash2 } from 'lucide-react';

const ItemCard = ({ item, currentUser, onEdit, onDelete }) => {
  const isOwner = currentUser && item.userId && (item.userId._id === currentUser._id || item.userId === currentUser._id);
  
  // Format date safely
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h3 className="item-card-title">{item.itemName}</h3>
        <span className={`item-badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}`}>
          {item.type}
        </span>
      </div>
      
      <div className="item-card-body">
        <p className="item-card-desc">{item.description}</p>
        
        <div className="item-meta">
          <MapPin size={16} />
          <span>{item.location}</span>
        </div>
        
        <div className="item-meta">
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>
        
        <div className="item-meta" style={{ marginTop: '1rem' }}>
          <UserIcon size={16} />
          <span>{item.userId?.name || 'Unknown User'}</span>
        </div>
        
        <div className="item-meta">
          <Phone size={16} />
          <span>{item.contactInfo}</span>
        </div>
      </div>
      
      {isOwner && (
        <div className="item-card-footer">
          <button className="btn btn-outline" onClick={() => onEdit(item)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
            <Edit2 size={14} style={{ marginRight: '0.25rem' }} /> Edit
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(item._id)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
            <Trash2 size={14} style={{ marginRight: '0.25rem' }} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
