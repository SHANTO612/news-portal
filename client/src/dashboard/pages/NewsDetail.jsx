import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import storeContext from '../../context/storeContext';
import { base_url } from '../../config/config';
import toast from 'react-hot-toast';

const NewsDetail = () => {
    const { newsId } = useParams();
    const { store } = useContext(storeContext);
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${base_url}/api/news/${newsId}`, {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                });
                setNews(data.news);
            } catch (error) {
                console.error("Error fetching news detail:", error);
                toast.error("Failed to load news detail");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (newsId) {
            fetchNewsDetail();
        }
    }, [newsId, store.token, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this news?')) {
            try {
                await axios.delete(`${base_url}/api/news/delete/${newsId}`, {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                });
                toast.success('News deleted successfully');
                navigate('/dashboard/news');
            } catch (error) {
                console.error("Error deleting news:", error);
                toast.error("Failed to delete news");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-500">News not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/dashboard/news" 
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                            <FaArrowLeft />
                            Back to News
                        </Link>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link 
                            to={`/dashboard/news/edit/${newsId}`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            <FaEdit />
                            Edit
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            <FaTrash />
                            Delete
                        </button>
                    </div>
                </div>

                {/* News Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Image */}
                    {news.image && (
                        <div className="w-full h-96 overflow-hidden">
                            <img 
                                src={news.image} 
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-8">
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {news.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Category:</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                    {news.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Status:</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                    news.status === 'active' ? 'bg-green-100 text-green-800' :
                                    news.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {news.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Date:</span>
                                <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                            </div>
                            {news.author && (
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Author:</span>
                                    <span>{news.author}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {news.description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {news.description}
                                </p>
                            </div>
                        )}

                        {/* Content */}
                        {news.content && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Content</h3>
                                <div 
                                    className="text-gray-700 leading-relaxed prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: news.content }}
                                />
                            </div>
                        )}

                        {/* Tags */}
                        {news.tags && news.tags.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {news.tags.map((tag, index) => (
                                        <span 
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail; 