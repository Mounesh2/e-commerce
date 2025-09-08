const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'Mounesh';
const MONGODB_URI = 'mongodb+srv://mouneshspattar:mou123456@cluster0.xsgp5pe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, default: 'User' },
  phone: { type: String, default: '+1 (555) 000-0000' },
  address: { type: String, default: 'Address not provided' },
  memberSince: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let items = [
  { 
    id: 1, 
    name: 'MacBook Pro', 
    price: 999, 
    originalPrice: 1299,
    discount: 23,
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Powerful MacBook Pro with M2 chip, perfect for professionals and creatives. Features stunning Retina display, all-day battery life, and lightning-fast performance for demanding tasks.',
    bestseller: true
  },
  { 
    id: 2, 
    name: 'iPhone 15 Pro', 
    price: 599, 
    originalPrice: 799,
    discount: 25,
    category: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Latest iPhone with advanced camera system, A17 Pro chip, and titanium design. Capture stunning photos and videos with professional-grade quality.',
    bestseller: true
  },
  { 
    id: 3, 
    name: 'Premium Cotton Shirt', 
    price: 29, 
    originalPrice: 49,
    discount: 41,
    category: 'Clothing', 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'High-quality cotton shirt with modern fit. Perfect for both casual and formal occasions. Made from 100% organic cotton with excellent breathability and comfort.'
  },
  { 
    id: 4, 
    name: 'Designer Jeans', 
    price: 79, 
    category: 'Clothing', 
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Premium denim jeans with perfect fit and durability. Crafted from high-quality materials with attention to detail. Available in multiple sizes and washes.',
    bestseller: true
  },
  { 
    id: 5, 
    name: 'Programming Guide', 
    price: 15, 
    category: 'Books', 
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Comprehensive programming guide covering modern development practices. Perfect for beginners and experienced developers looking to enhance their skills.'
  },
  {
    id: 6,
    name: 'Wireless Headphones',
    price: 199,
    originalPrice: 299,
    discount: 33,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Premium wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals.'
  },
  {
    id: 7,
    name: 'Smart Watch',
    price: 299,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life. Stay connected and track your fitness goals.'
  },
  {
    id: 8,
    name: 'Gaming Laptop',
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'High-performance gaming laptop with RTX graphics and fast processor. Perfect for gaming and professional work.'
  },
  {
    id: 9,
    name: 'Casual Sneakers',
    price: 89,
    originalPrice: 129,
    discount: 31,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Comfortable casual sneakers with modern design. Perfect for everyday wear and light activities.'
  },
  {
    id: 10,
    name: 'Business Suit',
    price: 299,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Professional business suit with tailored fit. Perfect for meetings, interviews, and formal events.'
  },
  {
    id: 11,
    name: 'Cookbook Collection',
    price: 25,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Complete cookbook collection with recipes from around the world. Perfect for cooking enthusiasts and beginners alike.'
  },
  {
    id: 12,
    name: 'Tablet Pro',
    price: 599,
    originalPrice: 799,
    discount: 25,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    description: 'Professional tablet with stylus support and high-resolution display. Perfect for digital art and productivity.'
  },
  {
    id: 13,
    name: 'Bluetooth Speaker',
    price: 79,
    originalPrice: 99,
    discount: 20,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Portable Bluetooth speaker with excellent sound quality and long battery life.'
  },
  {
    id: 14,
    name: 'Fitness Tracker',
    price: 149,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Advanced fitness tracker with heart rate monitoring and GPS.'
  },
  {
    id: 15,
    name: 'Wireless Mouse',
    price: 39,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Ergonomic wireless mouse with precision tracking.'
  },
  {
    id: 16,
    name: 'Mechanical Keyboard',
    price: 129,
    originalPrice: 159,
    discount: 19,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'RGB mechanical keyboard with tactile switches.'
  },
  {
    id: 17,
    name: 'Webcam HD',
    price: 89,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: '1080p HD webcam with auto-focus and noise reduction.'
  },
  {
    id: 18,
    name: 'Power Bank',
    price: 49,
    originalPrice: 69,
    discount: 29,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: '20000mAh portable power bank with fast charging.'
  },
  {
    id: 19,
    name: 'USB-C Hub',
    price: 59,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1625842268584-8f3296236761?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Multi-port USB-C hub with HDMI and SD card slots.'
  },
  {
    id: 20,
    name: 'Hoodie',
    price: 45,
    originalPrice: 65,
    discount: 31,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Comfortable cotton hoodie perfect for casual wear.'
  },
  {
    id: 21,
    name: 'Summer Dress',
    price: 69,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Elegant summer dress with floral pattern.'
  },
  {
    id: 22,
    name: 'Winter Jacket',
    price: 199,
    originalPrice: 249,
    discount: 20,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Warm winter jacket with waterproof material.'
  },
  {
    id: 23,
    name: 'Sports Shorts',
    price: 29,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Breathable sports shorts for active lifestyle.'
  },
  {
    id: 24,
    name: 'Polo Shirt',
    price: 39,
    originalPrice: 49,
    discount: 20,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Classic polo shirt suitable for casual and semi-formal occasions.'
  },
  {
    id: 25,
    name: 'Running Shoes',
    price: 119,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Professional running shoes with advanced cushioning.'
  },
  {
    id: 26,
    name: 'Baseball Cap',
    price: 19,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Adjustable baseball cap with embroidered logo.'
  },
  {
    id: 27,
    name: 'Fiction Novel',
    price: 12,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Bestselling fiction novel with captivating storyline.'
  },
  {
    id: 28,
    name: 'Science Textbook',
    price: 89,
    originalPrice: 109,
    discount: 18,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Comprehensive science textbook for students.'
  },
  {
    id: 29,
    name: 'Art Book',
    price: 35,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Beautiful art book featuring masterpieces from around the world.'
  },
  {
    id: 30,
    name: 'History Encyclopedia',
    price: 59,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Complete history encyclopedia covering world civilizations.'
  },
  {
    id: 31,
    name: 'Gaming Chair',
    price: 299,
    originalPrice: 399,
    discount: 25,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Ergonomic gaming chair with lumbar support and RGB lighting.'
  },
  {
    id: 32,
    name: 'Monitor 4K',
    price: 449,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: '27-inch 4K monitor with HDR support and USB-C connectivity.'
  },
  {
    id: 33,
    name: 'Desk Lamp',
    price: 69,
    originalPrice: 89,
    discount: 22,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'LED desk lamp with adjustable brightness and color temperature.'
  },
  {
    id: 34,
    name: 'Backpack',
    price: 79,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Durable backpack with laptop compartment and multiple pockets.'
  },
  {
    id: 35,
    name: 'Sunglasses',
    price: 89,
    originalPrice: 119,
    discount: 25,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Stylish sunglasses with UV protection and polarized lenses.'
  },
  {
    id: 36,
    name: 'Wallet',
    price: 49,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Genuine leather wallet with RFID blocking technology.'
  },
  {
    id: 37,
    name: 'Watch',
    price: 199,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Classic analog watch with stainless steel band.'
  },
  {
    id: 38,
    name: 'Travel Guide',
    price: 22,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Comprehensive travel guide with maps and local insights.'
  },
  {
    id: 39,
    name: 'Photography Book',
    price: 45,
    originalPrice: 59,
    discount: 24,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Stunning photography book showcasing nature and landscapes.'
  },
  {
    id: 40,
    name: 'Business Book',
    price: 29,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
    description: 'Essential business strategies and entrepreneurship guide.'
  }
];
let carts = {};

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, fullName, phone, address } = req.body;
    
    // Validate Gmail format
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ error: 'Email must be a Gmail address (@gmail.com)' });
    }
    
    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Check for existing password
    const users = await User.find({});
    for (let user of users) {
      if (await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ error: 'Password already used by another user' });
      }
    }
    
    // Check for existing full name
    const existingName = await User.findOne({ fullName });
    if (existingName) {
      return res.status(400).json({ error: 'Full name already exists' });
    }
    
    // Check for existing phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      fullName: fullName || 'User',
      phone: phone || '+1 (555) 000-0000',
      address: address || 'Address not provided'
    });
    
    await user.save();
    
    res.json({ success: true, message: 'User registered successfully. Please login.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Items routes
app.get('/api/items', (req, res) => {
  let filteredItems = [...items];
  
  if (req.query.category) {
    filteredItems = filteredItems.filter(item => 
      item.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  if (req.query.minPrice) {
    filteredItems = filteredItems.filter(item => item.price >= parseFloat(req.query.minPrice));
  }
  
  if (req.query.maxPrice) {
    filteredItems = filteredItems.filter(item => item.price <= parseFloat(req.query.maxPrice));
  }
  
  res.json(filteredItems);
});

// Cart routes
app.get('/api/cart', auth, (req, res) => {
  const userCart = carts[req.userId] || [];
  res.json(userCart);
});

app.post('/api/cart', auth, (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  const item = items.find(i => i.id === itemId);
  
  if (!item) return res.status(404).json({ error: 'Item not found' });
  
  if (!carts[req.userId]) carts[req.userId] = [];
  
  const existingItem = carts[req.userId].find(i => i.id === itemId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[req.userId].push({ ...item, quantity });
  }
  
  res.json(carts[req.userId]);
});

app.delete('/api/cart/:itemId', auth, (req, res) => {
  const itemId = parseInt(req.params.itemId);
  
  if (!carts[req.userId]) carts[req.userId] = [];
  
  carts[req.userId] = carts[req.userId].filter(item => item.id !== itemId);
  res.json(carts[req.userId]);
});

// Get single item
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// Get user profile
app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      memberSince: user.memberSince
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});