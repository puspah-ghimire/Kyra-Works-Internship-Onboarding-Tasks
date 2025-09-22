import React, { useState } from 'react';
import { Upload, Search, BarChart3, Download, FileText, Clock, Tag } from 'lucide-react';

const DataLakeApp = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const mockData = [
        { id: 1, title: 'Product Demo Video', duration: '02:45', format: 'MP4', tags: ['demo', 'product'] },
        { id: 2, title: 'Training Session', duration: '01:20:30', format: 'AVI', tags: ['training', 'education'] },
        { id: 3, title: 'Customer Testimonial', duration: '00:45', format: 'MOV', tags: ['testimonial', 'customer'] }
    ];

    const filteredData = mockData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (

        <div className="data-lake-container">
            {/* Header */}
            <div className="data-lake-header">
                <h1 className="data-lake-title">DataLake Pro</h1>
                <p className="data-lake-subtitle">Video Metadata Management Platform</p>
            </div>

            {/* Upload Area */}
            <div data-tutorial="upload-area" className="upload-section">
                <Upload size={48} className="upload-icon" />
                <h3 className="upload-title">Upload Video Metadata</h3>
                <p className="upload-description">Drop files here or click to browse</p>
                <button className="upload-button">
                    Choose Files
                </button>
                <div className="upload-formats">
                    Supported: JSON, CSV, XML
                </div>
            </div>

            {/* Search Area */}
            <div data-tutorial="search-area" className="search-section">
                <div className="search-input-container">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search videos, tags, or metadata..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <select className="filter-select">
                    <option>All Formats</option>
                    <option>MP4</option>
                    <option>AVI</option>
                    <option>MOV</option>
                </select>
            </div>

            {/* Data Grid */}
            <div data-tutorial="data-grid" className="data-grid-section">
                <div className="data-grid-header">
                    <div className="section-title-container">
                        <BarChart3 size={24} className="section-icon" />
                        <h2 className="section-title">Data Explorer</h2>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{filteredData.length}</div>
                        <div className="stat-label">Videos</div>
                    </div>
                </div>

                <div className="data-grid">
                    {filteredData.map(item => (
                        <div key={item.id} className="data-card">
                            <div className="card-main-content">
                                <h3 className="card-title">{item.title}</h3>
                                <div className="card-metadata">
                                    <div className="metadata-item">
                                        <Clock size={14} />
                                        {item.duration}
                                    </div>
                                    <div className="metadata-item">
                                        <FileText size={14} />
                                        {item.format}
                                    </div>
                                </div>
                                <div className="tags-container">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="tag">
                                            <Tag size={10} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button className="card-action-button">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Export Area */}
            <div data-tutorial="export-area" className="export-section">
                <div className="export-header">
                    <Download size={24} className="section-icon" />
                    <h2 className="section-title">Export Tools</h2>
                </div>
                <div className="export-buttons-container">
                    <button className="export-button">
                        <FileText size={16} />
                        Export as JSON
                    </button>
                    <button className="export-button">
                        <BarChart3 size={16} />
                        Export as CSV
                    </button>
                    <button className="export-button">
                        <Download size={16} />
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataLakeApp;