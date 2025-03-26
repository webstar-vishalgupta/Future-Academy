// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Helper functions to encode/decode config
function decodeConfig(encoded) {
    return JSON.parse(atob(encoded));
}

// Your web app's Firebase configuration - encoded
const encodedConfig = "eyJhcGlLZXkiOiJBSXphU3lEOThlNnhkVHZLYlA5TmNDRldCNGR6dUlCb1d5RmNrQ2ciLCJhdXRoRG9tYWluIjoiZnV0dXJlLWFjYWRlbXktZGU3NDAuZmlyZWJhc2VhcHAuY29tIiwicHJvamVjdElkIjoiZnV0dXJlLWFjYWRlbXktZGU3NDAiLCJzdG9yYWdlQnVja2V0IjoiZnV0dXJlLWFjYWRlbXktZGU3NDAuZmlyZWJhc2VzdG9yYWdlLmFwcCIsIm1lc3NhZ2luZ1NlbmRlcklkIjoiNzQ3MzY3NDYwNDQ3IiwiYXBwSWQiOiIxOjc0NzM2NzQ2MDQ0Nzp3ZWI6NjM0OThhNzM1M2Q3MDUyNWI4ZjVlYSIsIm1lYXN1cmVtZW50SWQiOiJHLTBTNDI5NVQxTjcifQ==";

// Decode the Firebase configuration
const firebaseConfig = decodeConfig(encodedConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Handle form submission
document.getElementById('studentRegistrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    try {
        // Get form data
        const formData = new FormData(this);
        const photoFile = formData.get('photo');

        // Upload photo to Firebase Storage
        const storageRef = ref(storage, 'student-photos/' + photoFile.name);
        await uploadBytes(storageRef, photoFile);
        const photoUrl = await getDownloadURL(storageRef);

        // Create student data object
        const studentData = {
            fullName: formData.get('fullName'),
            dateOfBirth: formData.get('dateOfBirth'),
            gender: formData.get('gender'),
            fatherName: formData.get('fatherName'),
            motherName: formData.get('motherName'),
            studentMobile: formData.get('studentMobile'),
            studentWhatsapp: formData.get('studentWhatsapp'),
            aadharNumber: formData.get('aadharNumber'),
            parentMobile: formData.get('parentMobile'),
            category: formData.get('category'),
            email: formData.get('email'),
            village: formData.get('village'),
            pinCode: formData.get('pinCode'),
            classApplying: formData.get('classApplying'),
            board: formData.get('board'),
            photoUrl: photoUrl,
            submissionDate: new Date().toISOString()
        };

        // Save to Firestore
        await addDoc(collection(db, 'students'), studentData);

        // Show success modal
        document.getElementById('successModal').style.display = 'flex';

        // Reset form
        this.reset();
        document.getElementById('photoPreview').src = 'images/placeholder-avatar.png';

    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting the form. Please try again.');
    } finally {
        // Reset button state
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Registration';
        submitBtn.disabled = false;
    }
});

// Photo preview functionality
document.getElementById('photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photoPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}); 