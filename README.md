# CADETN NATIONAL DATABASE FORM
## Officers' Data Collection System

### Overview
This is the official web-based form for collecting and harmonizing officers' data across the Nigeria Cadet Network (CADETN). The form has been developed by the Directorate of Information and Communication Technology (ICT) to establish a unified digital record system.

---

## 📋 Form Sections

The form captures comprehensive officer information across six main sections:

### **Section A: Personal Information**
- Full name (Surname, First Name, Middle Name)
- Date of birth
- Gender
- Blood group
- State of origin and LGA
- Nationality
- Home address

### **Section B: Service Records**
- Officer number
- Current rank
- Date of enlistment
- Date of last promotion
- Command/Formation
- Unit
- Specialization/Trade
- Current posting details

### **Section C: Contact Information**
- Primary phone number
- Alternate phone number
- Email address
- Contact address

### **Section D: Educational Qualifications**
- Highest educational qualification
- Field of study/Discipline
- Institution
- Year of graduation
- Professional certifications

### **Section E: Next of Kin Information**
- Full name
- Relationship
- Phone number
- Address

### **Section F: Additional Information**
- Marital status
- Number of dependents
- National Identification Number (NIN)
- Special skills/competencies
- Remarks

---

## 🚀 Features

### ✅ **Form Validation**
- Real-time field validation
- Nigerian phone number format validation (080XXXXXXXX)
- Email validation
- Age verification (minimum 18 years)
- NIN validation (11 digits)
- Required field checking

### 💾 **Auto-Save**
- Automatic draft saving every 3 seconds
- Draft recovery on page reload
- Prevents data loss

### 📱 **Responsive Design**
- Mobile-friendly interface
- Works on all devices (desktop, tablet, mobile)
- Print-friendly format

### 🔒 **Data Security**
- Client-side validation
- Secure data handling
- Compliance with data protection standards

### 📊 **Data Management**
- JSON format submission
- LocalStorage backup (demo mode)
- Easy integration with backend systems

---

## 🛠️ Installation & Setup

### **Option 1: Simple Setup (No Server)**
1. Download all three files:
   - `index.html`
   - `styles.css`
   - `script.js`

2. Place them in the same folder

3. Open `index.html` in any modern web browser

### **Option 2: With Web Server**
1. Place files in your web server directory (e.g., Apache, Nginx, IIS)

2. Access via URL: `http://yourserver.com/cadetn-form/`

### **Option 3: Using Python Simple Server**
```bash
# Navigate to the folder
cd path/to/NATDB

# Start server (Python 3)
python -m http.server 8000

# Access at: http://localhost:8000
```

### **Option 4: Using Node.js**
```bash
# Install http-server globally
npm install -g http-server

# Navigate to folder and start
cd path/to/NATDB
http-server -p 8000

# Access at: http://localhost:8000
```

---

## 🔗 Backend Integration

### **Connecting to a Server**

To connect the form to your backend server, modify the `submitFormData()` function in `script.js`:

```javascript
// Uncomment and configure the fetch request
fetch('https://your-server.com/api/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY' // If needed
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
    showLoading(false);
    if (result.success) {
        showMessage('Form submitted successfully!', 'success');
        form.reset();
    } else {
        showMessage('Submission failed. Please try again.', 'error');
    }
})
.catch(error => {
    showLoading(false);
    showMessage('An error occurred. Please try again.', 'error');
    console.error('Error:', error);
});
```

### **Sample Backend Endpoints**

**PHP Example** (`submit.php`):
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents('php://input'), true);

// Validate data
if (empty($data['officerNumber']) || empty($data['emailAddress'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Save to database
// $conn = new mysqli($host, $user, $pass, $db);
// $stmt = $conn->prepare("INSERT INTO officers (...) VALUES (...)");
// $stmt->execute();

// For now, save to file
file_put_contents('submissions.json', json_encode($data, JSON_PRETTY_PRINT) . "\n", FILE_APPEND);

echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
?>
```

**Node.js/Express Example**:
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/submit', (req, res) => {
    const data = req.body;
    
    // Validate and save to database
    // db.collection('officers').insertOne(data)
    
    res.json({ success: true, message: 'Data saved successfully' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 📊 Database Schema Recommendation

### **SQL Table Structure**
```sql
CREATE TABLE officers_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Personal Information
    surname VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    blood_group VARCHAR(5),
    state_of_origin VARCHAR(50) NOT NULL,
    lga VARCHAR(100) NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    home_address TEXT NOT NULL,
    
    -- Service Records
    officer_number VARCHAR(50) UNIQUE NOT NULL,
    current_rank VARCHAR(50) NOT NULL,
    date_of_enlistment DATE NOT NULL,
    date_of_last_promotion DATE,
    command_formation VARCHAR(100) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    current_posting VARCHAR(100) NOT NULL,
    date_of_current_posting DATE,
    
    -- Contact Information
    phone_number VARCHAR(15) NOT NULL,
    alternate_phone VARCHAR(15),
    email_address VARCHAR(100) NOT NULL,
    contact_address TEXT NOT NULL,
    
    -- Educational Qualifications
    highest_qualification VARCHAR(100) NOT NULL,
    discipline VARCHAR(100),
    institution VARCHAR(200),
    year_of_graduation INT,
    professional_certifications TEXT,
    
    -- Next of Kin
    nok_name VARCHAR(200) NOT NULL,
    nok_relationship VARCHAR(50) NOT NULL,
    nok_phone VARCHAR(15) NOT NULL,
    nok_address TEXT NOT NULL,
    
    -- Additional Information
    marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed') NOT NULL,
    number_of_dependents INT,
    nin VARCHAR(11),
    special_skills TEXT,
    remarks TEXT,
    
    -- Declaration
    officer_signature VARCHAR(200) NOT NULL,
    submission_date DATE NOT NULL,
    
    -- System Fields
    submission_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    form_version VARCHAR(10),
    
    INDEX idx_officer_number (officer_number),
    INDEX idx_email (email_address),
    INDEX idx_command (command_formation)
);
```

---

## 🔧 Customization

### **Changing Colors**
Edit `styles.css` to change the color scheme:
```css
/* Primary color scheme */
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);

/* Accent color */
border-bottom: 5px solid #FFD700;
```

### **Adding New Fields**
1. Add HTML input in `index.html`
2. Add validation in `script.js` if needed
3. Update backend to handle new field

### **Modifying Ranks**
Edit the rank dropdown in `index.html`:
```html
<option value="Your New Rank">Your New Rank</option>
```

---

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ⚠️ Internet Explorer 11 (limited support)

---

## 🔐 Security Recommendations

### **For Production Deployment:**

1. **Enable HTTPS**: Always use SSL/TLS certificates
2. **Input Sanitization**: Sanitize all inputs on the server side
3. **SQL Injection Prevention**: Use prepared statements
4. **Rate Limiting**: Prevent spam submissions
5. **CAPTCHA**: Add reCAPTCHA for bot protection
6. **Authentication**: Implement officer authentication
7. **Data Encryption**: Encrypt sensitive data at rest
8. **Regular Backups**: Implement automatic backup systems
9. **Access Control**: Restrict access to submitted data
10. **Audit Logs**: Maintain submission logs

---

## 📞 Support & Contact

**Directorate of ICT**  
Nigeria Cadet Network (CADETN)  
National Headquarters

**Director**: Aux. Igbinyemi Adeboye Amos  
**Email**: ict@cadetn.org (example)  
**Date**: November 17, 2025

---

## 📝 Usage Instructions for Officers

### **How to Fill the Form:**

1. **Open the form** in your web browser
2. **Fill all required fields** marked with red asterisk (*)
3. **Review your information** carefully
4. **Ensure all contact details** are current and accurate
5. **Read the declaration** before checking the box
6. **Click Submit** to send your data
7. **Wait for confirmation** message

### **Important Notes:**
- All fields marked with (*) are mandatory
- Phone numbers must be in Nigerian format (e.g., 08012345678)
- NIN must be exactly 11 digits
- Date of birth must indicate you are at least 18 years old
- Double-check your officer number before submitting
- Your form is auto-saved every 3 seconds
- You can recover unsaved drafts on page reload

### **Technical Requirements:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for submission)
- JavaScript enabled
- Cookies enabled (for auto-save feature)

---

## 🎯 Project Status

**Version**: 1.0  
**Status**: Ready for Deployment  
**Last Updated**: November 17, 2025  
**Author**: Directorate of ICT, CADETN

---

## 📄 License & Compliance

This form is developed for official use by the Nigeria Cadet Network. All data collected is protected under CADETN Data Protection Policy and relevant Nigerian data protection laws.

**Data Protection Compliance:**
- Nigeria Data Protection Regulation (NDPR) 2019
- CADETN Information Security Policy
- ICT Security Protocols

---

## 🎓 Future Enhancements

**Planned Features:**
- [ ] Digital signature capture
- [ ] Photo upload functionality
- [ ] Document attachment support
- [ ] Multi-language support
- [ ] Export to PDF
- [ ] Dashboard for data analytics
- [ ] Bulk upload functionality
- [ ] QR code generation for officers
- [ ] Mobile app version
- [ ] Integration with existing CADETN systems

---

## ✅ Testing Checklist

Before deployment, verify:
- [ ] All form fields are working
- [ ] Validation rules are functioning
- [ ] Mobile responsiveness is correct
- [ ] Form submits successfully
- [ ] Error messages display properly
- [ ] Success confirmation appears
- [ ] Auto-save is working
- [ ] Draft recovery functions
- [ ] Print format is clean
- [ ] All required fields are marked
- [ ] Backend integration is complete
- [ ] Security measures are in place
- [ ] Backup system is configured

---

## 🙏 Acknowledgments

Developed by the **Directorate of Information and Communication Technology (ICT)**  
Under the leadership of **Aux. Igbinyemi Adeboye Amos**, Director, DICT

For the advancement and digital transformation of the Nigeria Cadet Network.

---

**FOR OFFICIAL USE ONLY**  
© 2025 Nigeria Cadet Network - Directorate of ICT
