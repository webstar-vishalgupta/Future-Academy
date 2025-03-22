/**
 * API Test Script
 * Simple script to test the API endpoints
 * 
 * Run with: node test.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Test progress data
const testProgress = {
  subject: 'mathematics',
  lessonId: 'lesson-123',
  timeSpent: 600 // 10 minutes
};

// Test forum post data
const testPost = {
  title: 'Test Post',
  content: 'This is a test post content.',
  category: 'general',
  tags: ['test', 'example']
};

/**
 * Run all tests sequentially
 */
async function runTests() {
  try {
    console.log('🔍 Starting API tests...\n');

    // 1. Register user
    console.log('1️⃣ Testing user registration...');
    await testRegister();

    // 2. Login
    console.log('\n2️⃣ Testing user login...');
    await testLogin();

    // 3. Get user profile
    console.log('\n3️⃣ Testing get user profile...');
    await testGetProfile();

    // 4. Update progress
    console.log('\n4️⃣ Testing update lesson progress...');
    await testUpdateProgress();

    // 5. Create forum post
    console.log('\n5️⃣ Testing forum post creation...');
    const postId = await testCreatePost();

    // 6. Add comment to post
    console.log('\n6️⃣ Testing adding comment to post...');
    await testAddComment(postId);

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

/**
 * Test user registration
 */
async function testRegister() {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✅ Registration successful:', response.data.data.user);
    authToken = response.data.token;
    return true;
  } catch (error) {
    // If user already exists, try login instead
    if (error.response && error.response.status === 400 && error.response.data.message.includes('already registered')) {
      console.log('ℹ️ User already exists, skipping registration.');
      return true;
    }
    throw error;
  }
}

/**
 * Test user login
 */
async function testLogin() {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: testUser.email,
    password: testUser.password
  });
  
  console.log('✅ Login successful:', response.data.data.user);
  authToken = response.data.token;
  return true;
}

/**
 * Test getting user profile
 */
async function testGetProfile() {
  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  console.log('✅ Profile retrieved:', response.data.data.user);
  return true;
}

/**
 * Test updating progress
 */
async function testUpdateProgress() {
  const response = await axios.post(`${API_URL}/progress/lesson`, testProgress, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  console.log('✅ Progress updated:', response.data.data.subject);
  return true;
}

/**
 * Test creating a forum post
 */
async function testCreatePost() {
  const response = await axios.post(`${API_URL}/forum/posts`, testPost, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  
  console.log('✅ Post created:', response.data.data.title);
  return response.data.data._id;
}

/**
 * Test adding a comment to a post
 */
async function testAddComment(postId) {
  const response = await axios.post(
    `${API_URL}/forum/posts/${postId}/comments`, 
    { content: 'This is a test comment.' },
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  
  console.log('✅ Comment added:', response.data.data.content);
  return true;
}

// Run the tests
// Only run if this file is executed directly
if (require.main === module) {
  runTests();
} 