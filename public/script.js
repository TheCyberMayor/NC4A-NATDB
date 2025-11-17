// CADETN National Database Form - JavaScript
// Form Validation and Submission Handler

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('officerDataForm');
    const submissionDate = document.getElementById('submissionDate');
    
    // Set today's date as default for submission date
    const today = new Date().toISOString().split('T')[0];
    submissionDate.value = today;
    submissionDate.setAttribute('max', today);

    // Phone number validation pattern (Nigerian format)
    const phonePattern = /^0[789][01]\d{8}$/;
    
    // NIN validation pattern (11 digits)
    const ninPattern = /^\d{11}$/;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Real-time validation for phone numbers
    const phoneInputs = ['phoneNumber', 'alternatePhone', 'nokPhone'];
    phoneInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('blur', function() {
                validatePhoneNumber(this);
            });
        }
    });

    // Real-time validation for NIN
    const ninInput = document.getElementById('nin');
    if (ninInput) {
        ninInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 11);
        });
        ninInput.addEventListener('blur', function() {
            validateNIN(this);
        });
    }

    // Email validation
    const emailInput = document.getElementById('emailAddress');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
    }

    // State → LGA dynamic dropdown
    const stateSelect = document.getElementById('stateOfOrigin');
    const lgaSelect = document.getElementById('lga');

    // Nigerian States and LGAs
    const lgasByState = {
        "Abia": ["Aba North","Aba South","Arochukwu","Bende","Ikwuano","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Obi Ngwa","Ohafia","Osisioma","Ugwunagbo","Ukwa East","Ukwa West","Umuahia North","Umuahia South","Umu Nneochi"],
        "Adamawa": ["Demsa","Fufore","Ganye","Girei","Gombi","Guyuk","Hong","Jada","Lamurde","Madagali","Maiha","Mayo Belwa","Michika","Mubi North","Mubi South","Numan","Shelleng","Song","Toungo","Yola North","Yola South"],
        "Akwa Ibom": ["Abak","Eastern Obolo","Eket","Esit Eket","Essien Udim","Etim Ekpo","Etinan","Ibeno","Ibesikpo Asutan","Ibiono Ibom","Ika","Ikono","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat Enin","Nsit Atai","Nsit Ibom","Nsit Ubium","Obot Akara","Okobo","Onna","Oron","Oruk Anam","Udung Uko","Ukanafun","Uruan","Urue-Offong/Oruko","Uyo"],
        "Anambra": ["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],
        "Bauchi": ["Alkaleri","Bauchi","Bogoro","Damban","Darazo","Dass","Gamawa","Ganjuwa","Giade","Itas/Gadau","Jama'are","Katagum","Kirfi","Misau","Ningi","Shira","Tafawa Balewa","Toro","Warji","Zaki"],
        "Bayelsa": ["Brass","Ekeremor","Kolokuma/Opokuma","Nembe","Ogbia","Sagbama","Southern Ijaw","Yenagoa"],
        "Benue": ["Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West","Katsina-Ala","Konshisha","Kwande","Logo","Makurdi","Obi","Ogbadibo","Ohimini","Oju","Okpokwu","Otukpo","Tarka","Ukum","Ushongo","Vandeikya"],
        "Borno": ["Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala/Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"],
        "Cross River": ["Abi","Akamkpa","Akpabuyo","Bakassi","Bekwarra","Biase","Boki","Calabar Municipal","Calabar South","Etung","Ikom","Obanliku","Obubra","Obudu","Odukpani","Ogoja","Yakuur","Yala"],
        "Delta": ["Aniocha North","Aniocha South","Bomadi","Burutu","Ethiope East","Ethiope West","Ika North East","Ika South","Isoko North","Isoko South","Ndokwa East","Ndokwa West","Okpe","Oshimili North","Oshimili South","Patani","Sapele","Udu","Ughelli North","Ughelli South","Ukwuani","Uvwie","Warri North","Warri South","Warri South West"],
        "Ebonyi": ["Abakaliki","Afikpo North","Afikpo South","Ebonyi","Ezza North","Ezza South","Ikwo","Ishielu","Ivo","Izzi","Ohaozara","Ohaukwu","Onicha"],
        "Edo": ["Akoko-Edo","Egor","Esan Central","Esan North-East","Esan South-East","Esan West","Etsako Central","Etsako East","Etsako West","Igueben","Ikpoba-Okha","Oredo","Orhionmwon","Ovia North-East","Ovia South-West","Owan East","Owan West","Uhunmwonde"],
        "Ekiti": ["Ado Ekiti","Efon","Ekiti East","Ekiti South-West","Ekiti West","Emure","Gbonyin","Ido Osi","Ijero","Ikere","Ikole","Ilejemeje","Irepodun/Ifelodun","Ise/Orun","Moba","Oye"],
        "Enugu": ["Aninri","Awgu","Enugu East","Enugu North","Enugu South","Ezeagu","Igbo Etiti","Igbo Eze North","Igbo Eze South","Isi Uzo","Nkanu East","Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo Uwani"],
        "FCT": ["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"],
        "Gombe": ["Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo","Kwami","Nafada","Shongom","Yamaltu/Deba"],
        "Imo": ["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte","Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano","Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele","Obowo","Oguta","Ohaji/Egbema","Okigwe","Onuimo","Orlu","Orsu","Oru East","Oru West","Owerri Municipal","Owerri North","Owerri West"],
        "Jigawa": ["Auyo","Babura","Biriniwa","Birnin Kudu","Buji","Dutse","Gagarawa","Garki","Gumel","Guri","Gwaram","Gwiwa","Hadejia","Jahun","Kafin Hausa","Kazaure","Kiri Kasama","Kiyawa","Kaugama","Maigatari","Malam Madori","Miga","Ringim","Roni","Sule Tankarkar","Taura","Yankwashi"],
        "Kaduna": ["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kaduna North","Kaduna South","Kagarko","Kajuru","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
        "Kano": ["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"],
        "Katsina": ["Bakori","Batagarawa","Batsari","Baure","Bindawa","Charanchi","Dandume","Danja","Dan Musa","Daura","Dutsi","Dutsin-Ma","Faskari","Funtua","Ingawa","Jibia","Kafur","Kaita","Kankara","Kankia","Katsina","Kurfi","Kusada","Mai'Adua","Malumfashi","Mani","Mashi","Matazu","Musawa","Rimi","Sabuwa","Safana","Sandamu","Zango"],
        "Kebbi": ["Aleiro","Arewa Dandi","Argungu","Augie","Bagudo","Birnin Kebbi","Bunza","Dandi","Fakai","Gwandu","Jega","Kalgo","Koko/Besse","Maiyama","Ngaski","Sakaba","Shanga","Suru","Wasagu/Danko","Yauri","Zuru"],
        "Kogi": ["Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah","Igalamela-Odolu","Ijumu","Kabba/Bunu","Kogi","Lokoja","Mopa-Muro","Ofu","Ogori/Magongo","Okehi","Okene","Olamaboro","Omala","Yagba East","Yagba West"],
        "Kwara": ["Asa","Baruten","Edu","Ekiti","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"],
        "Lagos": ["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Epe","Eti-Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"],
        "Nasarawa": ["Akwanga","Awe","Doma","Karu","Keana","Keffi","Kokona","Lafia","Nasarawa","Nasarawa Egon","Obi","Toto","Wamba"],
        "Niger": ["Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edati","Gbako","Gurara","Katcha","Kontagora","Lapai","Lavun","Magama","Mariga","Mashegu","Mokwa","Muya","Paikoro","Rafi","Rijau","Shiroro","Suleja","Tafa","Wushishi"],
        "Ogun": ["Abeokuta North","Abeokuta South","Ado-Odo/Ota","Egbado North","Egbado South","Ewekoro","Ifo","Ijebu East","Ijebu North","Ijebu North East","Ijebu Ode","Ikenne","Imeko Afon","Ipokia","Obafemi Owode","Odeda","Odogbolu","Ogun Waterside","Remo North","Sagamu"],
        "Ondo": ["Akoko North-East","Akoko North-West","Akoko South-West","Akoko South-East","Akure North","Akure South","Ese Odo","Idanre","Ifedore","Ilaje","Ile Oluji/Okeigbo","Irele","Odigbo","Okitipupa","Ondo East","Ondo West","Ose","Owo"],
        "Osun": ["Atakunmosa East","Atakunmosa West","Aiyedaade","Aiyedire","Boluwaduro","Boripe","Ede North","Ede South","Egbedore","Ejigbo","Ife Central","Ife East","Ife North","Ife South","Ifedayo","Ifelodun","Ila","Ilesa East","Ilesa West","Irepodun","Irewole","Isokan","Iwo","Obokun","Odo Otin","Ola Oluwa","Olorunda","Oriade","Orolu","Osogbo"],
        "Oyo": ["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Ifedayo","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West","Saki East","Saki West","Surulere"],
        "Plateau": ["Barkin Ladi","Bassa","Bokkos","Jos East","Jos North","Jos South","Kanam","Kanke","Langtang North","Langtang South","Mangu","Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase"],
        "Rivers": ["Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Andoni","Asari-Toru","Bonny","Degema","Eleme","Emuoha","Etche","Gokana","Ikwerre","Khana","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo","Okrika","Omuma","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai"],
        "Sokoto": ["Binji","Bodinga","Dange Shuni","Gada","Goronyo","Gudu","Gwadabawa","Illela","Isa","Kebbe","Kware","Rabah","Sabon Birni","Shagari","Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza","Tureta","Wamakko","Wurno","Yabo"],
        "Taraba": ["Ardo Kola","Bali","Donga","Gashaka","Gassol","Ibi","Jalingo","Karim Lamido","Kumi","Lau","Sardauna","Takum","Ussa","Wukari","Yorro","Zing"],
        "Yobe": ["Bade","Bursari","Damaturu","Fika","Fune","Geidam","Gujba","Gulani","Jakusko","Karasuwa","Machina","Nangere","Nguru","Potiskum","Tarmuwa","Yunusari","Yusufari"],
        "Zamfara": ["Anka","Bakura","Birnin Magaji/Kiyaw","Bukkuyum","Bungudu","Gummi","Gusau","Kaura Namoda","Maradun","Maru","Shinkafi","Talata Mafara","Chafe","Zurmi"]
    };

    function resetLgaSelect(placeholder = '-- Select State First --') {
        if (!lgaSelect) return;
        lgaSelect.innerHTML = `<option value="">${placeholder}</option>`;
        lgaSelect.disabled = true;
    }

    function populateLgas(state) {
        if (!lgaSelect) return;
        const lgas = lgasByState[state] || [];
        if (!state || lgas.length === 0) {
            resetLgaSelect();
            return;
        }
        lgaSelect.disabled = false;
        lgaSelect.innerHTML = '<option value="">-- Select --</option>' +
            lgas.map(l => `<option value="${l}">${l}</option>`).join('');
    }

    if (stateSelect && lgaSelect) {
        // Initialize on load
        populateLgas(stateSelect.value);
        // Update on change
        stateSelect.addEventListener('change', function() {
            const prev = lgaSelect.value;
            populateLgas(this.value);
            // try to keep previous selection if still valid
            if ([...lgaSelect.options].some(o => o.value === prev)) {
                lgaSelect.value = prev;
            }
        });
    }

    // Validate date of birth (must be at least 18 years old)
    const dobInput = document.getElementById('dateOfBirth');
    if (dobInput) {
        dobInput.addEventListener('blur', function() {
            validateDateOfBirth(this);
        });
    }

    // Validate enlistment date
    const enlistmentInput = document.getElementById('dateOfEnlistment');
    if (enlistmentInput) {
        enlistmentInput.addEventListener('blur', function() {
            validateEnlistmentDate(this);
        });
    }

    // Phone number validation function
    function validatePhoneNumber(input) {
        const value = input.value.trim();
        
        if (value && !phonePattern.test(value)) {
            showError(input, 'Please enter a valid Nigerian phone number (e.g., 08012345678)');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // NIN validation function
    function validateNIN(input) {
        const value = input.value.trim();
        
        if (value && !ninPattern.test(value)) {
            showError(input, 'NIN must be exactly 11 digits');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // Email validation function
    function validateEmail(input) {
        const value = input.value.trim();
        
        if (value && !emailPattern.test(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // Date of birth validation (minimum age 18)
    function validateDateOfBirth(input) {
        const value = input.value;
        if (!value) return true;

        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 18) {
            showError(input, 'Officer must be at least 18 years old');
            return false;
        } else if (age > 100) {
            showError(input, 'Please enter a valid date of birth');
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    // Enlistment date validation
    function validateEnlistmentDate(input) {
        const value = input.value;
        if (!value) return true;

        const enlistmentDate = new Date(value);
        const today = new Date();
        
        if (enlistmentDate > today) {
            showError(input, 'Enlistment date cannot be in the future');
            return false;
        }

        const dobInput = document.getElementById('dateOfBirth');
        if (dobInput.value) {
            const dob = new Date(dobInput.value);
            if (enlistmentDate < dob) {
                showError(input, 'Enlistment date must be after date of birth');
                return false;
            }
        }

        clearError(input);
        return true;
    }

    // Show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('has-error');
        input.classList.add('error');
        
        let errorText = formGroup.querySelector('.error-text');
        if (!errorText) {
            errorText = document.createElement('span');
            errorText.className = 'error-text';
            formGroup.appendChild(errorText);
        }
        errorText.textContent = message;
    }

    // Clear error message
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('has-error');
        input.classList.remove('error');
        
        const errorText = formGroup.querySelector('.error-text');
        if (errorText) {
            errorText.remove();
        }
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear all previous errors
        document.querySelectorAll('.error').forEach(el => {
            clearError(el);
        });

        // Validate all fields
        let isValid = true;
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });

        // Validate phone numbers
        phoneInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input && input.value.trim()) {
                if (!validatePhoneNumber(input)) {
                    isValid = false;
                }
            }
        });

        // Validate NIN
        if (ninInput && ninInput.value.trim()) {
            if (!validateNIN(ninInput)) {
                isValid = false;
            }
        }

        // Validate email
        if (emailInput) {
            if (!validateEmail(emailInput)) {
                isValid = false;
            }
        }

        // Validate dates
        if (!validateDateOfBirth(dobInput)) {
            isValid = false;
        }

        if (!validateEnlistmentDate(enlistmentInput)) {
            isValid = false;
        }

        // Check declaration checkbox
        const declarationCheckbox = document.getElementById('declaration');
        if (!declarationCheckbox.checked) {
            showError(declarationCheckbox, 'You must agree to the declaration');
            isValid = false;
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            showMessage('Please correct the errors in the form before submitting', 'error');
            return;
        }

        // If validation passes, collect and submit data
        submitFormData();
    });

    // Submit form data
    function submitFormData() {
        // Show loading spinner
        showLoading(true);

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Add timestamp
        data.submissionTimestamp = new Date().toISOString();
        data.formVersion = '1.0';

        console.log('Form Data:', data);

        // Submit to server
        fetch('/api/officers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            showLoading(false);
            
            if (result.success) {
                showMessage('Form submitted successfully! Your data has been recorded.', 'success');
                
                // Clear draft
                localStorage.removeItem('cadetFormDraft');
                
                // Optionally reset form after successful submission
                setTimeout(() => {
                    if (confirm('Data submitted successfully. Would you like to submit another form?')) {
                        form.reset();
                        submissionDate.value = today;
                        hideMessage();
                    }
                }, 2000);
            } else {
                showMessage(result.message || 'Submission failed. Please try again.', 'error');
            }
        })
        .catch(error => {
            showLoading(false);
            showMessage('An error occurred. Please check your connection and try again.', 'error');
            console.error('Error:', error);
        });
    }

    // Note: Data is now submitted to the server database
    // LocalStorage is only used for draft saving

    // Show loading spinner
    function showLoading(show) {
        let loadingDiv = document.querySelector('.loading-spinner');
        
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-spinner';
            loadingDiv.innerHTML = '<div class="spinner"></div><p>Submitting your data...</p>';
            form.appendChild(loadingDiv);
        }
        
        if (show) {
            loadingDiv.classList.add('show');
            // Disable submit button
            document.querySelector('.btn-primary').disabled = true;
        } else {
            loadingDiv.classList.remove('show');
            // Enable submit button
            document.querySelector('.btn-primary').disabled = false;
        }
    }

    // Show success/error message
    function showMessage(message, type) {
        hideMessage(); // Clear any existing messages
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message show`;
        messageDiv.innerHTML = `<strong>${type === 'success' ? 'Success!' : 'Error!'}</strong> ${message}`;
        
        form.insertBefore(messageDiv, form.firstChild);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Hide messages
    function hideMessage() {
        const messages = document.querySelectorAll('.success-message, .error-message');
        messages.forEach(msg => msg.remove());
    }

    // Auto-save functionality (optional)
    let autoSaveTimeout;
    form.addEventListener('input', function() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveFormDraft();
        }, 3000); // Auto-save after 3 seconds of inactivity
    });

    // Save form as draft
    function saveFormDraft() {
        const formData = new FormData(form);
        const draft = {};
        
        formData.forEach((value, key) => {
            if (value) draft[key] = value;
        });

        if (Object.keys(draft).length > 0) {
            localStorage.setItem('cadetFormDraft', JSON.stringify(draft));
            console.log('Draft saved automatically');
        }
    }

    // Load draft on page load
    function loadFormDraft() {
        const draft = localStorage.getItem('cadetFormDraft');
        
        if (draft) {
            const shouldLoad = confirm('A saved draft was found. Would you like to load it?');
            
            if (shouldLoad) {
                const data = JSON.parse(draft);
                
                Object.keys(data).forEach(key => {
                    const field = form.elements[key];
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === 'on';
                        } else {
                            field.value = data[key];
                        }
                    }
                });

                // After restoring draft, ensure LGA list matches the restored state
                if (data.stateOfOrigin && typeof populateLgas === 'function') {
                    populateLgas(data.stateOfOrigin);
                    if (data.lga) {
                        const lgaField = document.getElementById('lga');
                        if (lgaField) lgaField.value = data.lga;
                    }
                }
                
                showMessage('Draft loaded successfully', 'success');
                setTimeout(hideMessage, 3000);
            } else {
                localStorage.removeItem('cadetFormDraft');
            }
        }
    }

    // Load draft when page loads
    loadFormDraft();

    // Clear draft when form is successfully submitted
    form.addEventListener('submit', function() {
        localStorage.removeItem('cadetFormDraft');
    });

    // Print functionality
    window.printForm = function() {
        window.print();
    };

    // Export functionality removed - use admin dashboard to export data from database

    console.log('CADETN National Database Form initialized');
});
